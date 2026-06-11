<script>
  import { stats } from '../stores/notifications.js'
  import { categories } from '../stores/todos.js'

  let completionRate = $derived(
    $stats.total > 0 ? Math.round(($stats.completed / $stats.total) * 100) : 0
  )

  let categoryData = $derived(
    Object.entries($stats.byCategory).map(([id, count]) => ({
      name: $categories.find(c => c.id === id)?.name || 'Unknown',
      color: $categories.find(c => c.id === id)?.color || '#6b7280',
      count
    }))
  )
</script>

<div class="stats-dashboard">
  <h3 class="stats-title">Statistics</h3>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">{completionRate}%</div>
      <div class="stat-label">Completion Rate</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{completed}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{pending}</div>
      <div class="stat-label">Pending</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{overdue}</div>
      <div class="stat-label">Overdue</div>
    </div>
  </div>

  <div class="priority-breakdown">
    <h4>Priority Distribution</h4>
    <div class="priority-bars">
      <div class="bar-row">
        <span class="bar-label">High</span>
        <div class="bar-track">
          <div class="bar-fill high" style="width: {$stats.total > 0 ? ($stats.byPriority.high / $stats.total) * 100 : 0}%"></div>
        </div>
        <span class="bar-value">{$stats.byPriority.high}</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">Med</span>
        <div class="bar-track">
          <div class="bar-fill medium" style="width: {$stats.total > 0 ? ($stats.byPriority.medium / $stats.total) * 100 : 0}%"></div>
        </div>
        <span class="bar-value">{$stats.byPriority.medium}</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">Low</span>
        <div class="bar-track">
          <div class="bar-fill low" style="width: {$stats.total > 0 ? ($stats.byPriority.low / $stats.total) * 100 : 0}%"></div>
        </div>
        <span class="bar-value">{$stats.byPriority.low}</span>
      </div>
    </div>
  </div>

  {#if categoryData.length > 0}
    <div class="category-breakdown">
      <h4>By Category</h4>
      {#each categoryData as cat}
        <div class="category-row">
          <span class="category-dot" style="--dot-color: {cat.color}"></span>
          <span class="category-name">{cat.name}</span>
          <span class="category-count">{cat.count}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .stats-dashboard {
    padding: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .stats-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    background: var(--input-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    text-align: center;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .priority-breakdown, .category-breakdown {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .priority-breakdown h4, .category-breakdown h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0;
  }

  .priority-bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bar-label {
    font-size: 12px;
    color: var(--text-muted);
    width: 30px;
  }

  .bar-track {
    flex: 1;
    height: 6px;
    background: var(--input-bg);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .bar-fill.high { background: #f87171; }
  .bar-fill.medium { background: #fbbf24; }
  .bar-fill.low { background: #34d399; }

  .bar-value {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 600;
    width: 20px;
    text-align: right;
  }

  .category-breakdown {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .category-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .category-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--dot-color);
  }

  .category-name {
    flex: 1;
    font-size: 14px;
    color: var(--text-primary);
  }

  .category-count {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  @media (max-width: 480px) {
    .stats-dashboard {
      padding: 16px;
      gap: 16px;
    }

    .stat-value {
      font-size: 22px;
    }

    .stat-card {
      padding: 12px;
    }

    .stats-title {
      font-size: 16px;
    }
  }
</style>
