import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";
import { backlinkSubmissions } from "./schema.js";
import { eq, desc } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(express.json());

// Serve built Vue frontend
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

// ============================================================
// Backlink Builder API
// ============================================================

const BACKLINK_URLS = [
  // Whois & Domain lookup
  "https://www.who.is/whois/DOMAIN",
  "https://whois.domaintools.com/DOMAIN",
  "https://www.whois.com/whois/DOMAIN",
  "https://lookup.icann.org/whois/en/lookup?name=DOMAIN",
  "https://www.namecheap.com/domains/whois/result?domain=DOMAIN",
  // Website analysis & stats
  "https://www.similarweb.com/website/DOMAIN",
  "https://builtwith.com/DOMAIN",
  "https://www.semrush.com/analytics/overview/?q=DOMAIN",
  "https://www.spyfu.com/overview/domain?query=DOMAIN",
  "https://sitereport.netcraft.com/?url=DOMAIN",
  "https://toolbar.netcraft.com/site_report?url=http://DOMAIN",
  "https://website.informer.com/DOMAIN",
  "https://www.worthofweb.com/website-value/DOMAIN",
  "https://www.siteworthtraffic.com/report/DOMAIN",
  "https://www.siteprice.org/website-worth/DOMAIN",
  "https://www.isitdownrightnow.com/DOMAIN.html",
  "https://downforeveryoneorjustme.com/DOMAIN",
  // SEO & DNS tools
  "https://www.robtex.com/dns-lookup/DOMAIN",
  "https://mxtoolbox.com/SuperTool.aspx?action=dns%3aDOMAIN",
  "https://dnschecker.org/all-dns-records-of-domain.php?query=DOMAIN",
  "https://securityheaders.com/?q=DOMAIN",
  "https://www.ssllabs.com/ssltest/analyze.html?d=DOMAIN",
  "https://pagespeed.web.dev/analysis?url=https%3A%2F%2FDOMAIN",
  "https://www.websiteplanet.com/webtools/sitechecker/?url=DOMAIN",
  // Web archive & search engines
  "https://web.archive.org/web/*/DOMAIN",
  "https://www.google.com/search?q=site:DOMAIN",
  "https://search.yahoo.com/search?p=site:DOMAIN",
  "https://www.bing.com/search?q=site:DOMAIN",
  // Business directories
  "https://www.dnb.com/business-directory/company-search.html?term=DOMAIN",
  "https://www.crunchbase.com/textsearch?q=DOMAIN",
  // Tech lookups
  "https://www.wappalyzer.com/lookup/DOMAIN",
  "https://w3techs.com/sites/info/DOMAIN",
  "https://hostadvice.com/tools/whois/?domain=DOMAIN",
  "https://www.whatsmydns.net/#A/DOMAIN",
  "https://dnsmap.io/#A/DOMAIN",
  "https://www.nslookup.io/dns-records/DOMAIN",
  "https://viewdns.info/whois/?domain=DOMAIN",
  "https://viewdns.info/iphistory/?domain=DOMAIN",
  "https://viewdns.info/httpheaders/?domain=DOMAIN",
  // More whois/domain tools
  "https://whois.net/whois/DOMAIN",
  "https://www.tamos.com/products/nettools/?tool=whois&host=DOMAIN",
  "https://centralops.net/co/DomainDossier.aspx?addr=DOMAIN",
  "https://www.ultratools.com/tools/dnsLookupResult?domain=DOMAIN",
  "https://dnslytics.com/domain/DOMAIN",
  "https://domainbigdata.com/DOMAIN",
  "https://host.io/DOMAIN",
  "https://ipinfo.io/domains/DOMAIN",
];

/**
 * GET /api/backlink-urls — URL database for backlink building
 */
app.get("/api/backlink-urls", (_req: Request, res: Response) => {
  res.json(BACKLINK_URLS.map((url) => ({ url })));
});

/**
 * POST /api/backlink-submit — Server-side proxy for URL submission
 */
app.post("/api/backlink-submit", async (req: Request, res: Response) => {
  const { url, timeout: timeoutSec, domain: submittedDomain, dryRun } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, error: "url is required" });
  }

  if (dryRun) {
    return res.json({ success: true, statusCode: 200, error: null, saved: false });
  }

  const timeoutMs = Math.min(timeoutSec || 10, 30) * 1000;
  let statusCode: number | null = null;
  let success = false;
  let error: string | null = null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BacklinkBot/1.0)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    statusCode = resp.status;
    success = statusCode >= 200 && statusCode < 400;
    if (!success) error = `HTTP ${statusCode}`;
  } catch (err: any) {
    error =
      err.name === "AbortError"
        ? "Timeout"
        : (err.cause?.code || err.message || "Network Error").substring(0, 80);
  }

  // Save to DB if available
  let saved = false;
  if (db && submittedDomain) {
    try {
      const targetDomain = url.match(/https?:\/\/([^/?#]+)/)?.[1] || url.substring(0, 60);
      await db.insert(backlinkSubmissions).values({
        domain: submittedDomain,
        url,
        targetDomain,
        statusCode,
        success,
        error,
      });
      saved = true;
    } catch (dbErr: any) {
      console.warn("[Backlink] DB save failed:", dbErr.message);
    }
  }

  res.json({ success, statusCode, error, saved });
});

/**
 * GET /api/backlink-history/:domain — Previously submitted URLs
 */
app.get("/api/backlink-history/:domain", async (req: Request, res: Response) => {
  const { domain: targetDomain } = req.params;
  if (!targetDomain) return res.status(400).json({ error: "domain is required" });
  if (!db) return res.json({ submissions: [], total: 0 });

  try {
    const rows = await db
      .select()
      .from(backlinkSubmissions)
      .where(eq(backlinkSubmissions.domain, targetDomain))
      .orderBy(desc(backlinkSubmissions.submittedAt));
    res.json({ submissions: rows, total: rows.length });
  } catch (err: any) {
    console.error("[Backlink] History query failed:", err.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// SPA fallback — serve index.html for all non-API routes
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Backlink Builder] Server running on http://0.0.0.0:${PORT}`);
});
