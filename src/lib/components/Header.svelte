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
      <div class="greeting">{greeting()}, <span class="user-name">Yoga</span></div>
      <h1 class="title">
        <svg class="logo-flame" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lg-outer" x1="32" y1="58" x2="32" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#fbbf24"/>
              <stop offset="40%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#e11d48"/>
            </linearGradient>
            <linearGradient id="lg-inner" x1="32" y1="50" x2="32" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#fde68a"/>
              <stop offset="100%" stop-color="#fb923c"/>
            </linearGradient>
          </defs>
          <path d="M32 6C32 6 18 22 18 36c0 7.7 6.3 14 14 14s14-6.3 14-14C46 22 32 6 32 6z" fill="url(#lg-outer)"/>
          <path d="M32 28c0 0-7 8-7 15c0 3.9 3.1 7 7 7s7-3.1 7-7C39 36 32 28 32 28z" fill="url(#lg-inner)"/>
        </svg>
        <span class="logo-text">Ember</span>
      </h1>
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
    padding-top: calc(24px + env(safe-area-inset-top, 0px));
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

  .user-name {
    color: var(--accent);
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.3px;
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-flame {
    width: 30px;
    height: 30px;
    filter: drop-shadow(0 2px 8px rgba(244, 63, 94, 0.4));
    animation: flamePulse 3s ease-in-out infinite;
  }

  @keyframes flamePulse {
    0%, 100% { filter: drop-shadow(0 2px 8px rgba(244, 63, 94, 0.4)); transform: scale(1); }
    50% { filter: drop-shadow(0 2px 14px rgba(244, 63, 94, 0.6)); transform: scale(1.05); }
  }

  .logo-text {
    background: linear-gradient(135deg, #fbbf24 0%, #f43f5e 50%, #e11d48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    letter-spacing: -1px;
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
    .header {
      padding: 16px 12px 12px;
      padding-top: calc(16px + env(safe-area-inset-top, 0px));
    }

    .title {
      font-size: 22px;
      gap: 6px;
    }

    .logo-flame {
      width: 24px;
      height: 24px;
    }

    .greeting {
      font-size: 11px;
      letter-spacing: 1px;
    }

    .date {
      font-size: 12px;
    }

    .header-right {
      gap: 8px;
    }

    .stats-badge {
      padding: 6px 10px;
    }

    .stats-number {
      font-size: 16px;
    }

    .stats-label {
      font-size: 12px;
    }

    .theme-toggle {
      width: 36px;
      height: 36px;
    }

    .theme-toggle .material-icons {
      font-size: 18px;
    }
  }
</style>
