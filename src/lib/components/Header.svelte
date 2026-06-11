<script>
  import { theme, todos } from '../stores/todos.js'

  let totalCount = $derived($todos.length)
  let completedCount = $derived($todos.filter(t => t.completed).length)
  let now = $state(new Date())

  $effect(() => {
    const interval = setInterval(() => { now = new Date() }, 60000)
    return () => clearInterval(interval)
  })

  let greeting = $derived(() => {
    const hour = now.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  })

  let dateString = $derived(
    now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  )
</script>

<header class="header">
  <div class="header-content">
    <div class="header-left">
      <div class="greeting">{greeting()}</div>
      <h1 class="title"><span class="logo-icon">🔥</span> Ember</h1>
      <p class="date">{dateString}</p>
    </div>
    <div class="header-right">
      <div class="stats-badge">
        <span class="stats-number">{completedCount}</span>
        <span class="stats-label">/ {totalCount}</span>
      </div>
      <button class="theme-toggle" onclick={() => theme.toggle()} title="Toggle theme">
        <span class="material-icons">
          {$theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  </div>
</header>

<style>
  .header {
    padding: 24px 16px 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: var(--glass-bg);
    border-bottom: 1px solid var(--glass-border);
  }

  .header-content {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .greeting {
    font-size: 13px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 500;
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
  }

  .date {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stats-badge {
    display: flex;
    align-items: baseline;
    gap: 2px;
    padding: 8px 14px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .stats-number {
    font-size: 20px;
    font-weight: 700;
    color: var(--accent);
  }

  .stats-label {
    font-size: 14px;
    color: var(--text-muted);
  }

  .theme-toggle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--glass-border);
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .theme-toggle:hover {
    background: var(--hover-bg);
    transform: rotate(180deg);
  }

  .theme-toggle .material-icons {
    color: var(--text-primary);
    font-size: 20px;
  }

  @media (max-width: 480px) {
    .title {
      font-size: 24px;
    }
    .stats-badge {
      padding: 6px 10px;
    }
  }
</style>
