<script>
  import { theme, todos } from './lib/stores/todos.js'
  import AddTodoForm from './lib/components/AddTodoForm.svelte'
  import TodoList from './lib/components/TodoList.svelte'
  import FilterBar from './lib/components/FilterBar.svelte'
  import Header from './lib/components/Header.svelte'
  import Confetti from './lib/components/Confetti.svelte'
  import PomodoroTimer from './lib/components/PomodoroTimer.svelte'
  import StatsDashboard from './lib/components/StatsDashboard.svelte'
  import ExportImport from './lib/components/ExportImport.svelte'
  import Notifications from './lib/components/Notifications.svelte'

  let confettiRef = $state(null)
  let showPomodoro = $state(false)
  let showStats = $state(false)
  let showExportImport = $state(false)
  let todoInputRef = $state(null)

  function handleConfetti() {
    if (confettiRef) confettiRef.trigger()
  }

  // Keyboard shortcuts
  $effect(() => {
    function handleKeydown(e) {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        // Focus the add todo input
        const input = document.querySelector('.todo-input')
        if (input) input.focus()
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        showPomodoro = !showPomodoro
      }
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        showStats = !showStats
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
</script>

<div class="app" class:light={$theme === 'light'}>
  <div class="bg-gradient"></div>
  <div class="bg-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>

  <div class="content">
    <Header />
    <main class="container">
      <AddTodoForm />
      <FilterBar />

      <div class="toolbar">
        <button class="tool-btn" class:active={showPomodoro} onclick={() => showPomodoro = !showPomodoro} title="Pomodoro Timer (P)">
          <span class="material-icons">timer</span>
        </button>
        <button class="tool-btn" class:active={showStats} onclick={() => showStats = !showStats} title="Statistics (S)">
          <span class="material-icons">bar_chart</span>
        </button>
        <button class="tool-btn" class:active={showExportImport} onclick={() => showExportImport = !showExportImport} title="Export/Import">
          <span class="material-icons">sync_alt</span>
        </button>
      </div>

      {#if showPomodoro}
        <PomodoroTimer />
      {/if}

      {#if showStats}
        <StatsDashboard />
      {/if}

      {#if showExportImport}
        <ExportImport />
      {/if}

      <TodoList onConfetti={handleConfetti} />
    </main>

    <footer class="footer">
      <span class="shortcut-hint">Press <kbd>N</kbd> to add task · <kbd>P</kbd> pomodoro · <kbd>S</kbd> stats</span>
    </footer>
  </div>
</div>

<Confetti bind:this={confettiRef} />
<Notifications />

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Roboto', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    position: relative;
    --glass-bg: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.15);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-muted: rgba(255, 255, 255, 0.4);
    --accent: #f43f5e;
    --accent-glow: rgba(244, 63, 94, 0.3);
    --danger: #f87171;
    --success: #34d399;
    --warning: #fbbf24;
    --bg-start: #0a0a0f;
    --bg-mid: #1a1020;
    --bg-end: #100a14;
    --input-bg: rgba(255, 255, 255, 0.06);
    --hover-bg: rgba(255, 255, 255, 0.1);
  }

  .app.light {
    --glass-bg: rgba(255, 255, 255, 0.6);
    --glass-border: rgba(255, 255, 255, 0.8);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    --text-primary: #1c1917;
    --text-secondary: #44403c;
    --text-muted: #6b7280;
    --accent: #e11d48;
    --accent-glow: rgba(225, 29, 72, 0.15);
    --bg-start: #fff1f2;
    --bg-mid: #fce7f3;
    --bg-end: #fef2f2;
    --input-bg: rgba(255, 255, 255, 0.5);
    --hover-bg: rgba(225, 29, 72, 0.06);
  }

  .bg-gradient {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, var(--bg-start), var(--bg-mid), var(--bg-end));
    z-index: -2;
    transition: background 0.5s ease;
  }

  .bg-orbs {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    animation: float 20s ease-in-out infinite;
  }

  .orb-1 {
    width: 400px;
    height: 400px;
    background: #e11d48;
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 300px;
    height: 300px;
    background: #06b6d4;
    bottom: -50px;
    left: -50px;
    animation-delay: -7s;
  }

  .orb-3 {
    width: 250px;
    height: 250px;
    background: #fb7185;
    top: 50%;
    left: 50%;
    animation-delay: -14s;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(20px, 10px) scale(1.02); }
  }

  .content {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container {
    max-width: 680px;
    width: 100%;
    margin: 0 auto;
    padding: 24px 16px 48px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    padding: 8px 0;
  }

  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--glass-border);
    background: var(--glass-bg);
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }

  .tool-btn:hover {
    background: var(--hover-bg);
  }

  .tool-btn.active {
    background: var(--accent-glow);
    border-color: var(--accent);
  }

  .tool-btn .material-icons {
    font-size: 18px;
    color: var(--text-secondary);
  }

  .tool-btn.active .material-icons {
    color: var(--accent);
  }

  .footer {
    text-align: center;
    padding: 16px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .shortcut-hint kbd {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
    margin: 0 2px;
  }

  @media (max-width: 480px) {
    .container {
      padding: 16px 12px 32px;
    }
    .footer {
      font-size: 11px;
    }
  }
</style>
