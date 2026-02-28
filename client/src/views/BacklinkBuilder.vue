<template>
  <div class="backlink-builder">

    <!-- Agent Recommendation Box -->
    <div class="agent-recommendation" v-if="showRecommendation">
      <div class="agent-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2"/></svg>
      </div>
      <div class="agent-text">
        <strong>Agent Recommendation:</strong>
        <span>{{ agentRecommendation }}</span>
      </div>
      <button class="agent-dismiss" @click="showRecommendation = false">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Header with Domain Power -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="title-row">
            <h1 class="page-title">Backlink Builder</h1>
            <div class="domain-power-badge" :class="domainPowerClass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>Domain Power: <strong>{{ domainPower }}</strong></span>
            </div>
          </div>
          <p class="page-subtitle">Automated SEO backlink generation across 3,000+ web directories &amp; Whois sites</p>
        </div>
        <div class="header-actions">
          <!-- Global Search -->
          <div class="global-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search history..."
              class="search-input"
            />
          </div>
          <button class="btn btn-secondary" @click="showHistory = !showHistory">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            History
          </button>
          <button class="btn btn-primary btn-glow" @click="startSubmission" :disabled="isRunning || !domain.trim()">
            <svg v-if="!isRunning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span v-if="isRunning" class="spinner"></span>
            {{ isRunning ? (dryRun ? 'Dry Run...' : 'Building...') : (dryRun ? '🧪 Start Dry Run' : 'Start Automated Build') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards with Gauges -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalUrls.toLocaleString() }}</div>
          <div class="stat-label">Total URLs in Database</div>
        </div>
      </div>
      <div class="stat-card stat-clickable" @click="showSuccessTable = !showSuccessTable">
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.successful.toLocaleString() }}</div>
          <div class="stat-label">Successful Backlinks <span class="click-hint">(click to view)</span></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ linksThisWeek }}</div>
          <div class="stat-label">Links Earned This Week</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-gauge-wrap">
          <!-- SVG Gauge Ring -->
          <svg class="gauge-ring" width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" stroke-width="6" />
            <circle
              cx="32" cy="32" r="26"
              fill="none"
              :stroke="gaugeColor"
              stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="gaugeDash"
              stroke-dashoffset="0"
              transform="rotate(-90 32 32)"
            />
            <text x="32" y="36" text-anchor="middle" :fill="gaugeColor" font-size="14" font-weight="700">{{ gaugePercent }}%</text>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-label gauge-label">Success Rate</div>
        </div>
      </div>
    </div>

    <!-- Command & Control Panel -->
    <div class="control-panel">
      <div class="panel-header">
        <h2>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Command Center
        </h2>
      </div>
      <div class="panel-body">
        <div class="input-row">
          <div class="input-group domain-input-group">
            <label for="domain-input">Target Domain</label>
            <input
              id="domain-input"
              v-model="domain"
              type="text"
              placeholder="e.g. catsluvus.com"
              :disabled="isRunning"
              @keyup.enter="startSubmission"
            />
          </div>
          <div class="input-group speed-group">
            <label>Build Speed</label>
            <div class="speed-slider-wrap">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                v-model.number="speedMode"
                :disabled="isRunning"
                class="speed-slider"
              />
              <div class="speed-labels">
                <span :class="{ active: speedMode === 0 }">Safe</span>
                <span :class="{ active: speedMode === 1 }">Balanced</span>
                <span :class="{ active: speedMode === 2 }">Aggressive</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dry Run Toggle (always visible) -->
        <div class="dry-run-row">
          <label class="toggle-switch-label">
            <label class="toggle-switch">
              <input type="checkbox" v-model="dryRun" :disabled="isRunning" />
              <span class="toggle-slider"></span>
            </label>
            <span class="dry-run-label">🧪 Dry Run <em>(simulate only, no real requests)</em></span>
          </label>
        </div>

        <!-- Advanced Settings Toggle -->
        <div class="advanced-toggle" @click="showAdvanced = !showAdvanced">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.658.003-1.25.396-1.51 1z"/>
          </svg>
          <span>Advanced Settings</span>
          <svg :class="{ rotated: showAdvanced }" class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        <div v-if="showAdvanced" class="advanced-settings">
          <div class="adv-row">
            <div class="input-group small">
              <label for="workers-input">Workers</label>
              <input id="workers-input" v-model.number="workers" type="number" min="1" max="50" :disabled="isRunning" />
            </div>
            <div class="input-group small">
              <label for="timeout-input">Timeout (s)</label>
              <input id="timeout-input" v-model.number="timeout" type="number" min="3" max="30" :disabled="isRunning" />
            </div>
            <div class="input-group small">
              <label for="limit-input">Limit (0=all)</label>
              <input id="limit-input" v-model.number="limit" type="number" min="0" :disabled="isRunning" />
            </div>
          </div>
          <div class="options-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="skipHistory" :disabled="isRunning" />
              <span>Skip History (re-submit all)</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="retryFailed" :disabled="isRunning" />
              <span>Retry Failed Only</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Activity Log + Progress -->
    <div v-if="isRunning || activityLog.length > 0" class="activity-panel">
      <div class="panel-header">
        <h2>
          <span v-if="isRunning" class="live-dot" :class="{ 'dry-run-dot': dryRun }"></span>
          {{ isRunning ? (dryRun ? '🧪 Dry Run Simulation' : 'Live Activity') : 'Build Results' }}
          <span v-if="dryRun && (isRunning || activityLog.length > 0)" class="dry-run-badge">DRY RUN</span>
        </h2>
        <span v-if="isRunning" class="progress-text">{{ processedCount }} / {{ totalToProcess }}<template v-if="skippedCount > 0"> ({{ skippedCount }} skipped)</template></span>
        <span v-else-if="activityLog.length > 0" class="progress-text">{{ successCount }} succeeded, {{ failCount }} failed<template v-if="skippedCount > 0">, {{ skippedCount }} already submitted</template></span>
      </div>
      <div class="panel-body">
        <!-- Progress Bar -->
        <div v-if="isRunning || processedCount > 0" class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill-success" :style="{ width: successPercent + '%' }"></div>
            <div class="progress-fill-fail" :style="{ width: failPercent + '%', left: successPercent + '%' }"></div>
          </div>
          <div class="progress-stats">
            <span class="stat-green">{{ successCount }} OK</span>
            <span class="stat-red">{{ failCount }} Failed</span>
            <span class="stat-gray">{{ progressPercent.toFixed(1) }}%</span>
          </div>
        </div>

        <!-- Dry Run Summary -->
        <div v-if="dryRunComplete && !isRunning" class="dry-run-summary">
          <div class="dry-run-summary-icon">🧪</div>
          <div class="dry-run-summary-content">
            <strong>Dry Run Complete — No real requests were made</strong>
            <ul>
              <li>{{ totalToProcess }} URLs simulated • {{ successCount }} would succeed • {{ failCount }} would fail</li>
              <li>Results are temporary and were <strong>not saved</strong> to history</li>
              <li>Real build with {{ workers }} workers will take roughly {{ Math.ceil(totalToProcess / workers * 2) }}–{{ Math.ceil(totalToProcess / workers * (timeout + 1)) }}s</li>
            </ul>
            <span class="dry-run-summary-hint">Disable dry run and click <strong>Start Automated Build</strong> to submit for real.</span>
          </div>
        </div>

        <!-- Live Activity Feed -->
        <div class="activity-feed" ref="activityFeedRef">
          <div
            v-for="(entry, i) in visibleLog"
            :key="i"
            class="activity-entry"
            :class="entry.success ? 'entry-success' : 'entry-fail'"
          >
            <span class="entry-badge" :class="entry.success ? 'badge-ok' : 'badge-err'">
              {{ entry.success ? 'SUCCESS' : 'FAIL' }}
            </span>
            <span v-if="dryRun" class="entry-badge badge-dry">SIM</span>
            <span class="entry-text">
              {{ entry.success ? '✓' : '✗' }}
              <strong>{{ domain }}</strong> → {{ entry.targetDomain }}
            </span>
            <a :href="entry.url" target="_blank" rel="noopener noreferrer" class="entry-url" :title="entry.url">{{ entry.url }}</a>
            <span class="entry-status">{{ entry.statusCode || entry.error }}</span>
            <span class="entry-time">{{ entry.time }}</span>
          </div>
          <div v-if="activityLog.length === 0 && !isRunning && skippedCount > 0" class="activity-empty">
            ✅ All {{ skippedCount }} URLs have already been submitted for <strong>{{ domain }}</strong>. Nothing new to process.
          </div>
          <div v-else-if="activityLog.length === 0 && !isRunning" class="activity-empty">
            No activity yet. Click <strong>Start Automated Build</strong> to begin.
          </div>
        </div>
      </div>
    </div>

    <!-- Successful Backlinks Detail Table -->
    <div v-if="showSuccessTable && (successResults.length > 0 || filteredHistory.length > 0)" class="results-panel">
      <div class="panel-header">
        <h2>Backlink Placement Details</h2>
        <button class="btn btn-secondary btn-sm" @click="showSuccessTable = false">Close</button>
      </div>
      <div class="panel-body">
        <div class="results-table-wrapper">
          <table class="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Target Site</th>
                <th>Status</th>
                <th>Est. DR</th>
                <th>Indexing</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in paginatedDetailResults" :key="index" class="row-success">
                <td>{{ (detailPage - 1) * perPage + index + 1 }}</td>
                <td>
                  <a :href="result.url" target="_blank" rel="noopener noreferrer" class="result-link">
                    {{ result.targetDomain }}
                  </a>
                  <div class="result-url-full">{{ result.url }}</div>
                </td>
                <td>
                  <span class="status-badge badge-success">{{ result.statusCode || 200 }}</span>
                </td>
                <td>
                  <span class="dr-badge" :class="getDRClass(result.targetDomain)">{{ getEstDR(result.targetDomain) }}</span>
                </td>
                <td>
                  <span class="index-status" :class="getIndexClass(result)">{{ getIndexStatus(result) }}</span>
                </td>
                <td class="date-cell">{{ formatDate(result.date) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="detailTotalPages > 1" class="pagination">
            <button @click="detailPage = Math.max(1, detailPage - 1)" :disabled="detailPage === 1" class="page-btn">&laquo; Prev</button>
            <span class="page-info">Page {{ detailPage }} of {{ detailTotalPages }}</span>
            <button @click="detailPage = Math.min(detailTotalPages, detailPage + 1)" :disabled="detailPage === detailTotalPages" class="page-btn">Next &raquo;</button>
          </div>
        </div>
      </div>
    </div>

    <!-- History Panel with Search -->
    <div v-if="showHistory" class="history-panel">
      <div class="panel-header">
        <h2>Submission History</h2>
        <div class="panel-header-actions">
          <button class="btn btn-danger-sm" @click="clearHistory">Clear History</button>
          <button class="btn btn-secondary btn-sm" @click="showHistory = false">Close</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="history-summary">
          <p><strong>{{ filteredHistory.length }}</strong> backlinks tracked for <strong>{{ domain || 'your domain' }}</strong>
            <span v-if="searchQuery"> matching "<em>{{ searchQuery }}</em>"</span>
          </p>
        </div>
        <div v-if="filteredHistory.length > 0" class="results-table-wrapper">
          <table class="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Target Site</th>
                <th>Status Code</th>
                <th>Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in filteredHistory.slice(0, 100)" :key="index" class="row-success">
                <td>{{ index + 1 }}</td>
                <td>{{ entry.targetDomain }}</td>
                <td><span class="status-badge badge-success">{{ entry.statusCode }}</span></td>
                <td>{{ formatDate(entry.date) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="filteredHistory.length > 100" class="history-note">Showing first 100 of {{ filteredHistory.length }} entries</p>
        </div>
        <div v-else class="activity-empty">No history entries found.</div>
      </div>
    </div>

    <!-- Schedule & Automation Panel -->
    <div class="schedule-panel">
      <div class="panel-header">
        <h2>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Schedule &amp; Automation
        </h2>
      </div>
      <div class="panel-body">
        <div class="schedule-grid">
          <div class="schedule-card">
            <div class="schedule-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Daily Auto-Build</h3>
            <p>Schedule automated runs every day. The deduplication engine ensures only new URLs are submitted.</p>
            <div class="schedule-control">
              <label class="toggle-switch">
                <input type="checkbox" v-model="dailySchedule" />
                <span class="toggle-slider"></span>
              </label>
              <span class="schedule-status">{{ dailySchedule ? 'Active' : 'Disabled' }}</span>
            </div>
          </div>
          <div class="schedule-card">
            <div class="schedule-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3>Weekly Report</h3>
            <p>Get a summary of new backlinks earned, success rates, and domain power trends every Monday.</p>
            <div class="schedule-control">
              <label class="toggle-switch">
                <input type="checkbox" v-model="weeklyReport" />
                <span class="toggle-slider"></span>
              </label>
              <span class="schedule-status">{{ weeklyReport ? 'Active' : 'Disabled' }}</span>
            </div>
          </div>
          <div class="schedule-card">
            <div class="schedule-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <h3>Retry Failed Links</h3>
            <p>Automatically retry failed submissions after 24 hours with adjusted timeouts for better success rates.</p>
            <div class="schedule-control">
              <label class="toggle-switch">
                <input type="checkbox" v-model="autoRetry" />
                <span class="toggle-slider"></span>
              </label>
              <span class="schedule-status">{{ autoRetry ? 'Active' : 'Disabled' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

// State
const domain = ref('catsluvus.com')
const workers = ref(10)
const timeout = ref(10)
const limit = ref(0)
const skipHistory = ref(false)
const retryFailed = ref(false)
const dryRun = ref(false)
const dryRunComplete = ref(false)
const isRunning = ref(false)
const showHistory = ref(false)
const showAdvanced = ref(false)
const showSuccessTable = ref(false)
const showRecommendation = ref(true)
const searchQuery = ref('')
const speedMode = ref(1) // 0=safe, 1=balanced, 2=aggressive
const currentPage = ref(1)
const detailPage = ref(1)
const perPage = 25

// Schedule toggles (saved to localStorage)
const dailySchedule = ref(false)
const weeklyReport = ref(false)
const autoRetry = ref(false)

// Domain power (simulated - would come from real API)
const domainPower = ref(33)

// Activity Log
const activityLog = ref<Array<{
  url: string
  targetDomain: string
  statusCode: number | null
  success: boolean
  error: string | null
  time: string
}>>([])
const activityFeedRef = ref<HTMLElement | null>(null)

// Results
const results = ref<Array<{
  url: string
  targetDomain: string
  statusCode: number | null
  success: boolean
  error: string | null
}>>([])
const processedCount = ref(0)
const totalToProcess = ref(0)
const successCount = ref(0)
const failCount = ref(0)
const skippedCount = ref(0)

// History stored in localStorage
const historyEntries = ref<Array<{
  url: string
  targetDomain: string
  statusCode: number
  date: string
}>>([])

// URL database
const urlDatabase = ref<string[]>([])
const PLACEHOLDER = 'h4link.duckdns.org'

// Speed mode watcher
watch(speedMode, (mode) => {
  if (mode === 0) { workers.value = 5; timeout.value = 15; }
  else if (mode === 1) { workers.value = 10; timeout.value = 10; }
  else { workers.value = 25; timeout.value = 8; }
})

// Agent Recommendation
const agentRecommendation = computed(() => {
  const total = historyEntries.value.length
  if (total === 0) {
    return `No backlinks built yet for ${domain.value}. Start your first automated build to establish foundational domain authority.`
  }
  const weekLinks = linksThisWeek.value
  if (weekLinks > 0) {
    return `Your last run added ${weekLinks} links this week. Our agent recommends a fresh run focused on local Mission Viejo directories next for maximum local SEO impact.`
  }
  return `You have ${total} backlinks for ${domain.value}. Run a new build to capture recently-added directory sites and boost your domain power from ${domainPower.value}.`
})

// Links this week
const linksThisWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return historyEntries.value.filter(e => {
    try { return new Date(e.date) >= oneWeekAgo } catch { return false }
  }).length
})

// Stats
const stats = computed(() => ({
  totalUrls: urlDatabase.value.length,
  successful: successCount.value + historyEntries.value.length,
  failed: failCount.value,
  successRate: processedCount.value > 0
    ? ((successCount.value / processedCount.value) * 100).toFixed(1)
    : historyEntries.value.length > 0 ? '100.0' : '0.0'
}))

// Gauge computations
const gaugePercent = computed(() => {
  const rate = parseFloat(stats.value.successRate)
  return isNaN(rate) ? 0 : Math.round(rate)
})

const gaugeColor = computed(() => {
  const p = gaugePercent.value
  if (p >= 80) return '#22c55e'
  if (p >= 50) return '#f59e0b'
  return '#ef4444'
})

const gaugeDash = computed(() => {
  const circumference = 2 * Math.PI * 26
  const filled = (gaugePercent.value / 100) * circumference
  return `${filled} ${circumference - filled}`
})

const domainPowerClass = computed(() => {
  if (domainPower.value >= 60) return 'power-high'
  if (domainPower.value >= 30) return 'power-mid'
  return 'power-low'
})

const progressPercent = computed(() => {
  if (totalToProcess.value === 0) return 0
  return (processedCount.value / totalToProcess.value) * 100
})

const successPercent = computed(() => {
  if (totalToProcess.value === 0) return 0
  return (successCount.value / totalToProcess.value) * 100
})

const failPercent = computed(() => {
  if (totalToProcess.value === 0) return 0
  return (failCount.value / totalToProcess.value) * 100
})

const visibleLog = computed(() => {
  return [...activityLog.value].reverse().slice(0, 50)
})

const filteredHistory = computed(() => {
  if (!searchQuery.value.trim()) return historyEntries.value
  const q = searchQuery.value.toLowerCase()
  return historyEntries.value.filter(e =>
    e.targetDomain.toLowerCase().includes(q) || e.url.toLowerCase().includes(q)
  )
})

const successResults = computed(() => results.value.filter(r => r.success))
const allDetailResults = computed(() => {
  const fromRun = successResults.value.map(r => ({
    url: r.url,
    targetDomain: r.targetDomain,
    statusCode: r.statusCode,
    date: new Date().toISOString(),
  }))
  const fromHistory = historyEntries.value
  const seen = new Set<string>()
  const merged: typeof fromHistory = []
  for (const item of [...fromRun, ...fromHistory]) {
    if (!seen.has(item.url)) {
      seen.add(item.url)
      merged.push(item)
    }
  }
  return merged
})

const detailTotalPages = computed(() => Math.ceil(allDetailResults.value.length / perPage))
const paginatedDetailResults = computed(() => {
  const start = (detailPage.value - 1) * perPage
  return allDetailResults.value.slice(start, start + perPage)
})

function getEstDR(targetDomain: string): string {
  const high = ['alexa.com', 'semrush.com', 'similarweb.com', 'builtwith.com', 'domaintools.com', 'quantcast.com', 'netcraft.com', 'spyfu.com']
  const mid = ['markosweb.com', 'websiteoutlook.com', 'cubestat.com', 'easycounter.com', 'statscrop.com', 'hupso.com', 'sitetrail.com']
  for (const h of high) { if (targetDomain.includes(h)) return '60+' }
  for (const m of mid) { if (targetDomain.includes(m)) return '30-59' }
  return '10-29'
}

function getDRClass(targetDomain: string): string {
  const dr = getEstDR(targetDomain)
  if (dr === '60+') return 'dr-high'
  if (dr === '30-59') return 'dr-mid'
  return 'dr-low'
}

function getIndexStatus(result: { date?: string }): string {
  if (!result.date) return 'Pending'
  const submitted = new Date(result.date)
  const now = new Date()
  const hoursAgo = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60)
  if (hoursAgo > 72) return 'Likely Indexed'
  if (hoursAgo > 24) return 'Crawling'
  return 'Pending'
}

function getIndexClass(result: { date?: string }): string {
  const status = getIndexStatus(result)
  if (status === 'Likely Indexed') return 'idx-indexed'
  if (status === 'Crawling') return 'idx-crawling'
  return 'idx-pending'
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'Unknown') return 'Unknown'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return dateStr }
}

function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const getHistoryKey = (d: string) => `backlink_history_${d.replace(/\./g, '_')}`

function loadHistory() {
  if (!domain.value.trim()) return
  const key = getHistoryKey(domain.value.trim())
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      historyEntries.value = Object.entries(data).map(([url, info]: [string, any]) => ({
        url,
        targetDomain: info.targetDomain || extractDomain(url),
        statusCode: info.statusCode,
        date: info.date || 'Unknown',
      }))
    } catch {
      historyEntries.value = []
    }
  } else {
    historyEntries.value = []
  }
  dailySchedule.value = localStorage.getItem('bl_daily') === 'true'
  weeklyReport.value = localStorage.getItem('bl_weekly') === 'true'
  autoRetry.value = localStorage.getItem('bl_retry') === 'true'
}

watch(dailySchedule, v => localStorage.setItem('bl_daily', String(v)))
watch(weeklyReport, v => localStorage.setItem('bl_weekly', String(v)))
watch(autoRetry, v => localStorage.setItem('bl_retry', String(v)))

function saveToHistory(result: { url: string; targetDomain: string; statusCode: number | null; success: boolean }) {
  if (!result.success || !result.statusCode) return
  const key = getHistoryKey(domain.value.trim())
  const saved = localStorage.getItem(key)
  let data: Record<string, any> = {}
  if (saved) {
    try { data = JSON.parse(saved) } catch { data = {} }
  }
  data[result.url] = {
    statusCode: result.statusCode,
    targetDomain: result.targetDomain,
    date: new Date().toISOString(),
  }
  localStorage.setItem(key, JSON.stringify(data))
}

function clearHistory() {
  if (!domain.value.trim()) return
  const key = getHistoryKey(domain.value.trim())
  localStorage.removeItem(key)
  historyEntries.value = []
}

function extractDomain(url: string): string {
  try {
    const match = url.match(/https?:\/\/([^/?#]+)/)
    if (match) return match[1]
  } catch {}
  return url.substring(0, 60)
}

async function loadUrlDatabase() {
  try {
    const resp = await fetch('/api/backlink-urls')
    if (resp.ok) {
      const data = await resp.json()
      urlDatabase.value = data.map((entry: { url: string }) => entry.url)
      return
    }
  } catch {}
  urlDatabase.value = getBuiltinUrls()
}

function getBuiltinUrls(): string[] {
  return [
    // Whois & Domain lookup sites (generate backlinks via domain lookup pages)
    'https://www.who.is/whois/DOMAIN',
    'https://whois.domaintools.com/DOMAIN',
    'https://www.whois.com/whois/DOMAIN',
    'https://lookup.icann.org/whois/en/lookup?name=DOMAIN',
    'https://www.namecheap.com/domains/whois/result?domain=DOMAIN',
    // Website analysis & stats
    'https://www.similarweb.com/website/DOMAIN',
    'https://builtwith.com/DOMAIN',
    'https://www.semrush.com/analytics/overview/?q=DOMAIN',
    'https://www.spyfu.com/overview/domain?query=DOMAIN',
    'https://sitereport.netcraft.com/?url=DOMAIN',
    'https://toolbar.netcraft.com/site_report?url=http://DOMAIN',
    'https://website.informer.com/DOMAIN',
    'https://www.worthofweb.com/website-value/DOMAIN',
    'https://www.siteworthtraffic.com/report/DOMAIN',
    'https://www.siteprice.org/website-worth/DOMAIN',
    'https://www.isitdownrightnow.com/DOMAIN.html',
    'https://downforeveryoneorjustme.com/DOMAIN',
    // SEO tools
    'https://www.robtex.com/dns-lookup/DOMAIN',
    'https://mxtoolbox.com/SuperTool.aspx?action=dns%3aDOMAIN',
    'https://dnschecker.org/all-dns-records-of-domain.php?query=DOMAIN',
    'https://securityheaders.com/?q=DOMAIN',
    'https://www.ssllabs.com/ssltest/analyze.html?d=DOMAIN',
    'https://pagespeed.web.dev/analysis?url=https%3A%2F%2FDOMAIN',
    'https://www.websiteplanet.com/webtools/sitechecker/?url=DOMAIN',
    // Web archive & lookup
    'https://web.archive.org/web/*/DOMAIN',
    'https://www.google.com/search?q=site:DOMAIN',
    'https://search.yahoo.com/search?p=site:DOMAIN',
    'https://www.bing.com/search?q=site:DOMAIN',
    // Business directories
    'https://www.dnb.com/business-directory/company-search.html?term=DOMAIN',
    'https://www.crunchbase.com/textsearch?q=DOMAIN',
    // Tech lookups
    'https://www.wappalyzer.com/lookup/DOMAIN',
    'https://w3techs.com/sites/info/DOMAIN',
    'https://hostadvice.com/tools/whois/?domain=DOMAIN',
    'https://www.whatsmydns.net/#A/DOMAIN',
    'https://dnsmap.io/#A/DOMAIN',
    'https://www.nslookup.io/dns-records/DOMAIN',
    'https://viewdns.info/whois/?domain=DOMAIN',
    'https://viewdns.info/iphistory/?domain=DOMAIN',
    'https://viewdns.info/httpheaders/?domain=DOMAIN',
    // More whois/domain tools
    'https://whois.net/whois/DOMAIN',
    'https://www.tamos.com/products/nettools/?tool=whois&host=DOMAIN',
    'https://centralops.net/co/DomainDossier.aspx?addr=DOMAIN',
    'https://www.ultratools.com/tools/dnsLookupResult?domain=DOMAIN',
    'https://dnslytics.com/domain/DOMAIN',
    'https://domainbigdata.com/DOMAIN',
    'https://host.io/DOMAIN',
    'https://ipinfo.io/domains/DOMAIN',
  ]
}

async function submitSingleUrl(url: string): Promise<{
  url: string
  targetDomain: string
  statusCode: number | null
  success: boolean
  error: string | null
}> {
  const targetDomain = extractDomain(url)

  // Dry run mode: simulate with random delay and ~85% success rate
  if (dryRun.value) {
    await new Promise(r => setTimeout(r, 50 + Math.random() * 200))
    const success = Math.random() < 0.85
    if (success) {
      const codes = [200, 200, 200, 200, 301, 302]
      return { url, targetDomain, statusCode: codes[Math.floor(Math.random() * codes.length)], success: true, error: null }
    } else {
      const errors = ['Timeout', 'Connection refused', 'DNS lookup failed', '403 Forbidden', '500 Server Error']
      return { url, targetDomain, statusCode: null, success: false, error: errors[Math.floor(Math.random() * errors.length)] }
    }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), (timeout.value + 5) * 1000)
    const resp = await fetch('/api/backlink-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, timeout: timeout.value, domain: domain.value.trim(), dryRun: dryRun.value }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const data = await resp.json()
    return {
      url,
      targetDomain,
      statusCode: data.statusCode || null,
      success: data.success,
      error: data.error || null,
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { url, targetDomain, statusCode: null, success: false, error: 'Timeout' }
    }
    return { url, targetDomain, statusCode: null, success: false, error: err.message?.substring(0, 60) || 'Network Error' }
  }
}

async function startSubmission() {
  if (!domain.value.trim() || isRunning.value) return

  isRunning.value = true
  dryRunComplete.value = false
  results.value = []
  activityLog.value = []
  processedCount.value = 0
  successCount.value = 0
  failCount.value = 0
  skippedCount.value = 0
  currentPage.value = 1
  detailPage.value = 1

  loadHistory()

  // Load server-side submission history for deduplication
  let serverSubmittedUrls = new Set<string>()
  if (!dryRun.value) {
    try {
      const resp = await fetch(`/api/backlink-history/${encodeURIComponent(domain.value.trim())}`)
      if (resp.ok) {
        const data = await resp.json()
        serverSubmittedUrls = new Set(data.submissions.map((s: { url: string }) => s.url))
      }
    } catch {}
  }

  let urls: string[]
  if (urlDatabase.value.length > 0 && urlDatabase.value[0].includes(PLACEHOLDER)) {
    urls = urlDatabase.value.map(u => u.replace(new RegExp(PLACEHOLDER.replace(/\./g, '\\.'), 'g'), domain.value.trim()))
  } else {
    urls = urlDatabase.value.map(u => u.replace(/DOMAIN/g, domain.value.trim()))
  }

  const seen = new Set<string>()
  urls = urls.filter(u => {
    if (seen.has(u)) return false
    seen.add(u)
    return true
  })

  // Filter out URLs already submitted (localStorage history)
  if (!skipHistory.value) {
    const historyUrls = new Set(historyEntries.value.map(h => h.url))
    urls = urls.filter(u => !historyUrls.has(u))
  }

  // Filter out URLs already in server database
  const beforeServerFilter = urls.length
  if (serverSubmittedUrls.size > 0) {
    urls = urls.filter(u => !serverSubmittedUrls.has(u))
  }
  skippedCount.value = beforeServerFilter - urls.length

  if (limit.value > 0) {
    urls = urls.slice(0, limit.value)
  }

  totalToProcess.value = urls.length

  if (urls.length === 0) {
    isRunning.value = false
    return
  }

  const batchSize = workers.value
  for (let i = 0; i < urls.length; i += batchSize) {
    if (!isRunning.value) break
    const batch = urls.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map(url => submitSingleUrl(url))
    )

    for (const settled of batchResults) {
      if (settled.status === 'fulfilled') {
        const result = settled.value
        results.value.push(result)
        activityLog.value.push({ ...result, time: formatTime() })
        if (result.success) {
          successCount.value++
          if (!dryRun.value) saveToHistory(result)
        } else {
          failCount.value++
        }
      } else {
        failCount.value++
      }
      processedCount.value++
    }

    await nextTick()
    if (activityFeedRef.value) {
      activityFeedRef.value.scrollTop = 0
    }
  }

  loadHistory()
  if (dryRun.value) dryRunComplete.value = true
  isRunning.value = false
}

onMounted(() => {
  loadUrlDatabase()
  loadHistory()
})
</script>

<style scoped>
.backlink-builder {
  max-width: 1200px;
  margin: 0 auto;
}

/* Agent Recommendation */
.agent-recommendation {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border: 1px solid #bfdbfe;
  border-left: 4px solid #3b82f6;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
}

.agent-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-text { font-size: 13px; color: #1e40af; line-height: 1.5; }
.agent-text strong { color: #1e3a8a; }

.agent-dismiss {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #93c5fd;
  cursor: pointer;
  padding: 4px;
}

/* Header */
.page-header { margin-bottom: 20px; }
.header-content { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.title-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.page-title { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }
.page-subtitle { font-size: 14px; color: #6b7280; margin-top: 4px; }

.domain-power-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.power-high { background: #dcfce7; color: #16a34a; }
.power-mid { background: #fef3c7; color: #d97706; }
.power-low { background: #fee2e2; color: #dc2626; }

.header-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; flex-wrap: wrap; }

/* Global Search */
.global-search {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
}

.search-input { border: none; background: transparent; font-size: 13px; color: #374151; outline: none; width: 140px; }
.search-input::placeholder { color: #9ca3af; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4); transform: translateY(-1px); }

.btn-glow { animation: glow-pulse 2s infinite; }

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3); }
  50% { box-shadow: 0 4px 20px rgba(37, 99, 235, 0.5); }
}

.btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.btn-secondary:hover { background: #e5e7eb; }
.btn-sm { padding: 6px 14px; font-size: 12px; }

.btn-danger-sm {
  background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;
  padding: 6px 12px; font-size: 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s;
}

.btn-danger-sm:hover { background: #fee2e2; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }

.stat-card {
  background: white; border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s;
}

.stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.stat-clickable { cursor: pointer; }
.stat-clickable:hover { border-color: #3b82f6; }
.click-hint { font-size: 11px; color: #93c5fd; font-weight: 400; }

.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.stat-icon.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon.green { background: #f0fdf4; color: #22c55e; }
.stat-icon.orange { background: #fff7ed; color: #f97316; }

.stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
.stat-label { font-size: 13px; color: #6b7280; }
.stat-gauge-wrap { flex-shrink: 0; }
.gauge-ring { display: block; }
.gauge-label { margin-top: 4px; font-weight: 600; }

/* Panels */
.control-panel, .activity-panel, .results-panel, .history-panel, .schedule-panel {
  background: white; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 20px; overflow: hidden;
}

.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 20px; border-bottom: 1px solid #f3f4f6;
}

.panel-header h2 { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0; display: flex; align-items: center; gap: 8px; }
.panel-header-actions { display: flex; gap: 8px; }
.panel-body { padding: 20px; }

/* Command Center */
.input-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 12px; }
.domain-input-group { flex: 1; min-width: 250px; }
.speed-group { flex: 0 0 280px; }

.input-group label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px; }

.input-group input[type="text"],
.input-group input[type="number"] {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; color: #1a1a2e; background: #fafafa;
  transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}

.input-group input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
.input-group input:disabled { opacity: 0.6; cursor: not-allowed; }

/* Speed Slider */
.speed-slider-wrap { padding-top: 4px; }

.speed-slider {
  width: 100%; height: 6px; -webkit-appearance: none; appearance: none;
  background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444);
  border-radius: 3px; outline: none; cursor: pointer;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; background: white;
  border: 3px solid #3b82f6; border-radius: 50%; cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.speed-slider::-moz-range-thumb {
  width: 20px; height: 20px; background: white; border: 3px solid #3b82f6;
  border-radius: 50%; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.speed-labels { display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: #9ca3af; }
.speed-labels span.active { color: #3b82f6; font-weight: 700; }

/* Dry Run Row */
.dry-run-row {
  padding: 10px 0 4px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
}

.toggle-switch-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.dry-run-label { color: #7c3aed; font-size: 13px; font-weight: 500; }
.dry-run-label em { font-size: 11px; color: #a78bfa; font-style: normal; }

/* Advanced Settings */
.advanced-toggle {
  display: flex; align-items: center; gap: 6px; padding: 8px 0;
  font-size: 13px; color: #6b7280; cursor: pointer; user-select: none; transition: color 0.2s;
}

.advanced-toggle:hover { color: #374151; }
.chevron { transition: transform 0.2s; }
.chevron.rotated { transform: rotate(180deg); }

.advanced-settings { padding-top: 12px; border-top: 1px solid #f3f4f6; margin-top: 8px; }
.adv-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.input-group.small { flex: 0 0 130px; min-width: 100px; }
.options-row { display: flex; gap: 20px; flex-wrap: wrap; }

.checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6b7280; cursor: pointer; }
.checkbox-label input[type="checkbox"] { accent-color: #3b82f6; }

/* Activity Feed */
.live-dot {
  display: inline-block; width: 8px; height: 8px; background: #22c55e;
  border-radius: 50%; animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.activity-feed { max-height: 360px; overflow-y: auto; border: 1px solid #f3f4f6; border-radius: 8px; margin-top: 12px; }

.activity-entry {
  display: flex; align-items: center; gap: 10px; padding: 8px 12px;
  border-bottom: 1px solid #f9fafb; font-size: 13px; transition: background 0.2s;
}

.activity-entry:hover { background: #fafafa; }
.entry-success { border-left: 3px solid #22c55e; }
.entry-fail { border-left: 3px solid #ef4444; }

.entry-badge {
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 4px; letter-spacing: 0.5px; flex-shrink: 0;
}

.badge-ok { background: #dcfce7; color: #16a34a; }
.badge-err { background: #fee2e2; color: #dc2626; }
.badge-dry { background: #ede9fe; color: #7c3aed; }

.dry-run-badge {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  background: #ede9fe; color: #7c3aed; font-size: 10px; font-weight: 700;
  letter-spacing: 0.5px; margin-left: 8px; vertical-align: middle;
}

.dry-run-dot { background: #7c3aed !important; }

.dry-run-summary {
  display: flex; gap: 12px; padding: 14px 16px; margin-bottom: 12px;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border: 1px solid #c4b5fd; border-left: 4px solid #7c3aed; border-radius: 8px;
}
.dry-run-summary-icon { font-size: 24px; flex-shrink: 0; }
.dry-run-summary-content { font-size: 13px; color: #4c1d95; line-height: 1.5; }
.dry-run-summary-content strong { color: #5b21b6; }
.dry-run-summary-content ul { margin: 6px 0 8px 18px; padding: 0; }
.dry-run-summary-content li { margin-bottom: 2px; }
.dry-run-summary-hint { font-size: 12px; color: #7c3aed; }

.entry-text { flex: 1; color: #374151; min-width: 0; }
.entry-url {
  flex: 2; color: #6b7280; font-size: 11px; text-decoration: none;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
}
.entry-url:hover { color: #3b82f6; text-decoration: underline; }
.entry-status { color: #9ca3af; font-size: 12px; flex-shrink: 0; }
.entry-time { color: #d1d5db; font-size: 11px; flex-shrink: 0; }

.result-url-full {
  font-size: 11px; color: #9ca3af; word-break: break-all;
  margin-top: 2px; max-width: 350px;
}

.activity-empty { padding: 40px 20px; text-align: center; color: #9ca3af; font-size: 14px; }

/* Progress Bar */
.progress-bar-container { margin-bottom: 8px; }

.progress-bar {
  height: 8px; background: #f3f4f6; border-radius: 4px;
  overflow: hidden; margin-bottom: 8px; position: relative;
}

.progress-fill-success {
  height: 100%; background: #22c55e; position: absolute;
  top: 0; left: 0; transition: width 0.3s ease;
}

.progress-fill-fail {
  height: 100%; background: #ef4444; position: absolute;
  top: 0; transition: width 0.3s ease, left 0.3s ease;
}

.progress-stats { display: flex; gap: 16px; font-size: 13px; }
.progress-text { font-size: 13px; color: #6b7280; }
.stat-green { color: #22c55e; font-weight: 600; }
.stat-red { color: #ef4444; font-weight: 600; }
.stat-gray { color: #9ca3af; }

/* Results Table */
.results-table-wrapper { overflow-x: auto; }

.results-table { width: 100%; border-collapse: collapse; font-size: 13px; }

.results-table th {
  text-align: left; padding: 10px 12px; font-weight: 600; color: #6b7280;
  border-bottom: 2px solid #f3f4f6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
}

.results-table td { padding: 10px 12px; border-bottom: 1px solid #f9fafb; color: #374151; }
.row-success td { background: #f0fdf4; }
.row-fail td { background: #fef2f2; }
.result-link { color: #3b82f6; text-decoration: none; }
.result-link:hover { text-decoration: underline; }

.status-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-fail { background: #fee2e2; color: #dc2626; }

.dr-badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
.dr-high { background: #dcfce7; color: #16a34a; }
.dr-mid { background: #fef3c7; color: #d97706; }
.dr-low { background: #f3f4f6; color: #6b7280; }

.index-status { font-size: 12px; font-weight: 500; }
.idx-indexed { color: #16a34a; }
.idx-crawling { color: #d97706; }
.idx-pending { color: #9ca3af; }
.date-cell { font-size: 12px; color: #6b7280; }

/* Pagination */
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px 0 4px; }

.page-btn {
  padding: 6px 14px; border: 1px solid #d1d5db; border-radius: 6px;
  background: white; color: #374151; font-size: 13px; cursor: pointer; transition: all 0.2s;
}

.page-btn:hover:not(:disabled) { background: #f3f4f6; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 13px; color: #6b7280; }

/* History */
.history-summary { padding-bottom: 12px; font-size: 14px; color: #374151; }
.history-note { padding-top: 12px; font-size: 13px; color: #9ca3af; text-align: center; }

/* Schedule Panel */
.schedule-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }

.schedule-card {
  padding: 24px 20px; border: 1px solid #f3f4f6; border-radius: 10px; transition: all 0.2s;
}

.schedule-card:hover { border-color: #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.schedule-icon { color: #3b82f6; margin-bottom: 12px; }
.schedule-card h3 { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px; }
.schedule-card p { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0 0 16px; }
.schedule-control { display: flex; align-items: center; gap: 10px; }
.schedule-status { font-size: 13px; font-weight: 500; color: #6b7280; }

/* Toggle Switch */
.toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: #d1d5db; border-radius: 24px; transition: all 0.3s;
}

.toggle-slider::before {
  content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px;
  background: white; border-radius: 50%; transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle-switch input:checked + .toggle-slider { background: #3b82f6; }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .header-content { flex-direction: column; }
  .header-actions { width: 100%; justify-content: flex-start; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .speed-group { flex: 1; min-width: 200px; }
  .input-group.small { flex: 1; min-width: 80px; }
  .schedule-grid { grid-template-columns: 1fr; }
}
</style>
