<script>
  import { filter, categories, todos } from '../stores/todos.js'

  let completedCount = $derived($todos.filter(t => t.completed).length)
</script>

<div class="filter-bar">
  <div class="search-box">
    <span class="material-icons search-icon">search</span>
    <input
      type="text"
      class="search-input"
      placeholder="Search tasks..."
      bind:value={$filter.search}
    />
    {#if $filter.search}
      <button class="clear-search" onclick={() => $filter.search = ''}>
        <span class="material-icons">close</span>
      </button>
    {/if}
  </div>

  <div class="filter-chips">
    <div class="chip-group">
      <button
        class="chip"
        class:active={$filter.status === 'all'}
        onclick={() => $filter.status = 'all'}
      >All</button>
      <button
        class="chip"
        class:active={$filter.status === 'active'}
        onclick={() => $filter.status = 'active'}
      >Active</button>
      <button
        class="chip"
        class:active={$filter.status === 'completed'}
        onclick={() => $filter.status = 'completed'}
      >Done</button>
    </div>

    <div class="chip-group">
      <button
        class="chip priority-chip"
        class:active={$filter.priority === 'all'}
        onclick={() => $filter.priority = 'all'}
      >All Priority</button>
      <button
        class="chip priority-chip high"
        class:active={$filter.priority === 'high'}
        onclick={() => $filter.priority = 'high'}
      >
        <span class="dot"></span>High
      </button>
      <button
        class="chip priority-chip medium"
        class:active={$filter.priority === 'medium'}
        onclick={() => $filter.priority = 'medium'}
      >
        <span class="dot"></span>Med
      </button>
      <button
        class="chip priority-chip low"
        class:active={$filter.priority === 'low'}
        onclick={() => $filter.priority = 'low'}
      >
        <span class="dot"></span>Low
      </button>
    </div>
  </div>

  {#if completedCount > 0}
    <button class="clear-completed" onclick={() => todos.clearCompleted()}>
      <span class="material-icons">delete_sweep</span>
      Clear {completedCount} completed
    </button>
  {/if}
</div>

<style>
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--input-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 10px 14px;
    transition: all 0.3s ease;
  }

  .search-box:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .search-icon {
    color: var(--text-muted);
    font-size: 20px;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    color: var(--text-primary);
    font-family: 'Roboto', sans-serif;
    outline: none;
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .clear-search {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 2px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .clear-search:hover {
    background: var(--hover-bg);
  }

  .clear-search .material-icons {
    font-size: 18px;
    color: var(--text-muted);
  }

  .filter-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .chip-group {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .chip {
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid var(--glass-border);
    background: transparent;
    color: var(--text-secondary);
    font-size: 12px;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .chip:hover {
    background: var(--hover-bg);
  }

  .chip.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .priority-chip {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .priority-chip.high .dot { background: #f87171; }
  .priority-chip.medium .dot { background: #fbbf24; }
  .priority-chip.low .dot { background: #34d399; }

  .clear-completed {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: 1px solid rgba(248, 113, 113, 0.3);
    border-radius: 10px;
    color: var(--danger);
    font-size: 12px;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
  }

  .clear-completed:hover {
    background: rgba(248, 113, 113, 0.1);
    border-color: var(--danger);
  }

  .clear-completed .material-icons {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    .filter-bar {
      padding: 12px;
      gap: 10px;
    }

    .chip {
      padding: 8px 12px;
      font-size: 13px;
      min-height: 36px;
    }

    .search-box {
      padding: 12px 14px;
    }

    .search-input {
      font-size: 16px; /* prevents iOS zoom on focus */
    }

    .clear-completed {
      width: 100%;
      justify-content: center;
      padding: 10px;
      min-height: 40px;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .chip {
      min-height: 36px;
    }
  }
</style>
