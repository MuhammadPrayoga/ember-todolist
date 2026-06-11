<script>
  import { addNotification } from '../stores/notifications.js'

  let duration = $state(25 * 60) // 25 minutes
  let timeLeft = $state(duration)
  let isRunning = $state(false)
  let intervalId = $state(null)

  let minutes = $derived(Math.floor(timeLeft / 60))
  let seconds = $derived(timeLeft % 60)
  let progress = $derived(((duration - timeLeft) / duration) * 100)

  function start() {
    if (!isRunning) {
      isRunning = true
      intervalId = setInterval(() => {
        timeLeft -= 1
        if (timeLeft <= 0) {
          stop()
          addNotification('Pomodoro complete! Take a break.')
          playSound()
        }
      }, 1000)
    }
  }

  function pause() {
    if (isRunning) {
      isRunning = false
      clearInterval(intervalId)
    }
  }

  function stop() {
    isRunning = false
    clearInterval(intervalId)
    timeLeft = duration
  }

  function setDuration(mins) {
    stop()
    duration = mins * 60
    timeLeft = duration
  }

  function playSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRigBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQBAA')
    audio.play().catch(() => {})
  }

  // Cleanup on unmount
  $effect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  })
</script>

<div class="pomodoro">
  <div class="timer-display">
    <div class="progress-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
        <circle
          class="ring-fill"
          cx="50"
          cy="50"
          r="45"
          style="stroke-dasharray: {282.74}; stroke-dashoffset: {282.74 * (1 - progress / 100)}"
        ></circle>
      </svg>
      <div class="time">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  </div>

  <div class="controls">
    {#if !isRunning}
      <button class="control-btn start" onclick={start}>
        <span class="material-icons">play_arrow</span>
      </button>
    {:else}
      <button class="control-btn pause" onclick={pause}>
        <span class="material-icons">pause</span>
      </button>
    {/if}
    <button class="control-btn stop" onclick={stop}>
      <span class="material-icons">stop</span>
    </button>
  </div>

  <div class="duration-selector">
    <button class="duration-btn" class:active={duration === 15 * 60} onclick={() => setDuration(15)}>15m</button>
    <button class="duration-btn" class:active={duration === 25 * 60} onclick={() => setDuration(25)}>25m</button>
    <button class="duration-btn" class:active={duration === 50 * 60} onclick={() => setDuration(50)}>50m</button>
  </div>
</div>

<style>
  .pomodoro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .timer-display {
    position: relative;
  }

  .progress-ring {
    position: relative;
    width: 140px;
    height: 140px;
  }

  .progress-ring svg {
    transform: rotate(-90deg);
  }

  .ring-bg {
    fill: none;
    stroke: var(--input-bg);
    stroke-width: 6;
  }

  .ring-fill {
    fill: none;
    stroke: var(--accent);
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.3s ease;
  }

  .time {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 600;
    color: var(--text-primary);
    font-family: 'Roboto Mono', monospace;
  }

  .controls {
    display: flex;
    gap: 12px;
  }

  .control-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--glass-border);
    background: var(--input-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .control-btn .material-icons {
    font-size: 22px;
    color: var(--text-primary);
  }

  .control-btn.start:hover {
    background: var(--accent);
    border-color: var(--accent);
  }

  .control-btn.start:hover .material-icons {
    color: white;
  }

  .control-btn.pause:hover .material-icons {
    color: var(--warning);
  }

  .control-btn.stop:hover .material-icons {
    color: var(--danger);
  }

  .duration-selector {
    display: flex;
    gap: 6px;
  }

  .duration-btn {
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid var(--glass-border);
    background: transparent;
    color: var(--text-secondary);
    font-size: 12px;
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .duration-btn:hover {
    background: var(--hover-bg);
  }

  .duration-btn.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  @media (max-width: 480px) {
    .pomodoro {
      padding: 16px;
      gap: 14px;
    }

    .progress-ring {
      width: 120px;
      height: 120px;
    }

    .time {
      font-size: 26px;
    }

    .control-btn {
      width: 48px;
      height: 48px;
    }

    .duration-btn {
      padding: 8px 14px;
      font-size: 13px;
    }
  }
</style>
