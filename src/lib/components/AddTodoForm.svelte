<script>
  import { todos, categories } from '../stores/todos.js'

  let text = $state('')
  let priority = $state('medium')
  let category = $state('')
  let dueDate = $state('')
  let recurring = $state('')
  let notes = $state('')
  let showOptions = $state(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim()) {
      todos.addTodo(text, {
        priority,
        category: category || null,
        dueDate: dueDate || null,
        recurring: recurring || null,
        notes
      })
      text = ''
      priority = 'medium'
      category = ''
      dueDate = ''
      recurring = ''
      notes = ''
      showOptions = false
    }
  }
</script>

<form class="add-form" onsubmit={handleSubmit}>
  <div class="main-row">
    <div class="input-wrapper">
      <span class="material-icons input-icon">add_circle_outline</span>
      <input
        type="text"
        class="todo-input"
        placeholder="What needs to be done?"
        bind:value={text}
      />
    </div>
    <button
      type="button"
      class="options-toggle"
      class:active={showOptions}
      onclick={() => showOptions = !showOptions}
      title="More options"
    >
      <span class="material-icons">tune</span>
    </button>
    <button type="submit" class="submit-btn" disabled={!text.trim()}>
      <span class="material-icons">send</span>
    </button>
  </div>

  {#if showOptions}
    <div class="options-row">
      <div class="option-group">
        <label class="option-label">Priority</label>
        <div class="priority-selector">
          <button type="button" class="priority-btn high" class:selected={priority === 'high'} onclick={() => priority = 'high'}>
            <span class="material-icons">keyboard_double_arrow_up</span>
          </button>
          <button type="button" class="priority-btn medium" class:selected={priority === 'medium'} onclick={() => priority = 'medium'}>
            <span class="material-icons">drag_handle</span>
          </button>
          <button type="button" class="priority-btn low" class:selected={priority === 'low'} onclick={() => priority = 'low'}>
            <span class="material-icons">keyboard_double_arrow_down</span>
          </button>
        </div>
      </div>

      <div class="option-group">
        <label class="option-label">Category</label>
        <select class="select-input" bind:value={category}>
          <option value="">None</option>
          {#each $categories as cat}
            <option value={cat.id}>{cat.name}</option>
          {/each}
        </select>
      </div>

      <div class="option-group">
        <label class="option-label">Due Date</label>
        <input type="date" class="date-input" bind:value={dueDate} />
      </div>

      <div class="option-group">
        <label class="option-label">Recurring</label>
        <select class="select-input" bind:value={recurring}>
          <option value="">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div class="option-group full-width">
        <label class="option-label">Notes</label>
        <textarea class="notes-input" placeholder="Add notes..." bind:value={notes} rows="2"></textarea>
      </div>
    </div>
  {/if}
</form>

<style>
  .add-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--glass-shadow);
    transition: all 0.3s ease;
  }

  .add-form:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow), var(--glass-shadow);
  }

  .main-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--input-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 12px 14px;
    transition: all 0.3s ease;
  }

  .input-wrapper:focus-within {
    border-color: var(--accent);
  }

  .input-icon {
    color: var(--accent);
    font-size: 22px;
  }

  .todo-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px; /* 16px prevents iOS zoom on focus */
    color: var(--text-primary);
    font-family: 'Roboto', sans-serif;
    outline: none;
  }

  .todo-input::placeholder {
    color: var(--text-muted);
  }

  .options-toggle {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    background: var(--input-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .options-toggle:hover {
    background: var(--hover-bg);
  }

  .options-toggle.active {
    background: var(--accent-glow);
    border-color: var(--accent);
  }

  .options-toggle .material-icons {
    font-size: 20px;
    color: var(--text-secondary);
  }

  .options-toggle.active .material-icons {
    color: var(--accent);
  }

  .submit-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: none;
    background: var(--accent);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px var(--accent-glow);
  }

  .submit-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 20px var(--accent-glow);
  }

  .submit-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .submit-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }

  .submit-btn .material-icons {
    font-size: 20px;
    color: white;
  }

  .options-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 8px;
    border-top: 1px solid var(--glass-border);
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .option-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-width: 120px;
  }

  .option-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .priority-selector {
    display: flex;
    gap: 4px;
  }

  .priority-btn {
    flex: 1;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .priority-btn .material-icons {
    font-size: 18px;
    color: var(--text-muted);
  }

  .priority-btn.high.selected {
    background: rgba(248, 113, 113, 0.2);
    border-color: #f87171;
  }
  .priority-btn.high.selected .material-icons { color: #f87171; }

  .priority-btn.medium.selected {
    background: rgba(251, 191, 36, 0.2);
    border-color: #fbbf24;
  }
  .priority-btn.medium.selected .material-icons { color: #fbbf24; }

  .priority-btn.low.selected {
    background: rgba(52, 211, 153, 0.2);
    border-color: #34d399;
  }
  .priority-btn.low.selected .material-icons { color: #34d399; }

  .select-input, .date-input {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }

  .select-input:focus, .date-input:focus {
    border-color: var(--accent);
  }

  .select-input option {
    background: #1e1b2e;
    color: var(--text-primary);
  }

  .app.light .select-input option {
    background: #ffffff;
    color: #1c1917;
  }

  .notes-input {
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s;
  }

  .notes-input:focus {
    border-color: var(--accent);
  }

  .option-group.full-width {
    flex-basis: 100%;
  }

  @media (max-width: 480px) {
    .add-form {
      padding: 12px;
    }

    .input-wrapper {
      padding: 10px 12px;
    }

    .options-toggle, .submit-btn {
      width: 44px;
      height: 44px;
    }

    .options-row {
      flex-direction: column;
      gap: 10px;
    }

    .select-input, .date-input, .notes-input {
      padding: 10px;
      font-size: 16px; /* prevents iOS zoom */
    }

    .priority-btn {
      padding: 8px;
      min-height: 40px;
    }
  }
</style>
