<script>
  import { todos, categories } from '../stores/todos.js'
  import { addNotification } from '../stores/notifications.js'

  let { todo, onConfetti = null } = $props()
  let editing = $state(false)
  let editText = $state('')
  let expanded = $state(false)
  let showNotes = $state(false)
  let newSubtaskText = $state('')

  let categoryInfo = $derived(
    todo.category ? $categories.find(c => c.id === todo.category) : null
  )

  let isOverdue = $derived(
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString())
  )

  let dueDateFormatted = $derived(
    todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null
  )

  let subtasksProgress = $derived(
    todo.subtasks && todo.subtasks.length > 0
      ? Math.round((todo.subtasks.filter(s => s.completed).length / todo.subtasks.length) * 100)
      : 0
  )

  function startEdit() {
    editing = true
    editText = todo.text
  }

  function confirmEdit() {
    if (editText.trim()) {
      todos.editTodo(todo.id, { text: editText.trim() })
    }
    editing = false
  }

  function cancelEdit() {
    editing = false
  }

  function handleEditKeydown(e) {
    if (e.key === 'Enter') confirmEdit()
    else if (e.key === 'Escape') cancelEdit()
  }

  function cyclePriority() {
    const priorities = ['low', 'medium', 'high']
    const currentIndex = priorities.indexOf(todo.priority)
    const nextPriority = priorities[(currentIndex + 1) % priorities.length]
    todos.editTodo(todo.id, { priority: nextPriority })
  }

  function handleDelete() {
    const deleted = { ...todo }
    todos.deleteTodo(todo.id)
    addNotification('Task deleted', {
      label: 'Undo',
      callback: () => todos.addTodo(deleted.text, deleted)
    }, 5000)
  }

  function handleToggleComplete() {
    todos.toggleComplete(todo.id)
    if (!todo.completed && onConfetti) {
      onConfetti()
    }
  }

  function addSubtask() {
    if (newSubtaskText.trim()) {
      todos.addSubtask(todo.id, newSubtaskText.trim())
      newSubtaskText = ''
    }
  }

  function handleSubtaskKeydown(e) {
    if (e.key === 'Enter') addSubtask()
  }
</script>

<div class="todo-item" class:completed={todo.completed} class:overdue={isOverdue} class:pinned={todo.pinned}>
  <div class="priority-indicator {todo.priority}"></div>

  {#if editing}
    <div class="edit-mode">
      <input
        type="text"
        class="edit-input"
        bind:value={editText}
        onkeydown={handleEditKeydown}
        autofocus
      />
      <button class="icon-btn confirm" onclick={confirmEdit}>
        <span class="material-icons">check</span>
      </button>
      <button class="icon-btn cancel" onclick={cancelEdit}>
        <span class="material-icons">close</span>
      </button>
    </div>
  {:else}
    <button class="checkbox-wrapper" onclick={handleToggleComplete}>
      <div class="custom-checkbox" class:checked={todo.completed}>
        {#if todo.completed}
          <span class="material-icons check-icon">check</span>
        {/if}
      </div>
    </button>

    <div class="todo-content">
      <span class="todo-text">{todo.text}</span>
      <div class="meta-row">
        {#if categoryInfo}
          <span class="category-badge" style="--cat-color: {categoryInfo.color}">
            {categoryInfo.name}
          </span>
        {/if}
        {#if dueDateFormatted}
          <span class="due-date" class:overdue={isOverdue}>
            <span class="material-icons">event</span>
            {dueDateFormatted}
          </span>
        {/if}
        {#if todo.recurring}
          <span class="recurring-badge">
            <span class="material-icons">autorenew</span>
            {todo.recurring}
          </span>
        {/if}
        {#if todo.subtasks && todo.subtasks.length > 0}
          <span class="subtasks-progress">
            {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length}
          </span>
        {/if}
        {#if todo.notes}
          <button class="notes-toggle" onclick={() => showNotes = !showNotes}>
            <span class="material-icons">notes</span>
          </button>
        {/if}
      </div>
      {#if showNotes && todo.notes}
        <div class="notes-content">{todo.notes}</div>
      {/if}
    </div>

    <div class="actions">
      <button class="icon-btn pin" class:active={todo.pinned} onclick={() => todos.togglePin(todo.id)} title="Pin">
        <span class="material-icons">{todo.pinned ? 'push_pin' : 'push_pin'}</span>
      </button>
      <button class="icon-btn expand" onclick={() => expanded = !expanded} title="Subtasks">
        <span class="material-icons">{expanded ? 'expand_less' : 'expand_more'}</span>
      </button>
      <button class="icon-btn priority-toggle" onclick={cyclePriority} title="Change priority">
        <span class="material-icons priority-icon {todo.priority}">
          {todo.priority === 'high' ? 'keyboard_double_arrow_up' : todo.priority === 'low' ? 'keyboard_double_arrow_down' : 'drag_handle'}
        </span>
      </button>
      <button class="icon-btn edit" onclick={startEdit} title="Edit">
        <span class="material-icons">edit</span>
      </button>
      <button class="icon-btn delete" onclick={handleDelete} title="Delete">
        <span class="material-icons">delete_outline</span>
      </button>
    </div>
  {/if}
</div>

{#if expanded && !editing}
  <div class="subtasks-panel">
    <div class="subtask-input-row">
      <input
        type="text"
        class="subtask-input"
        placeholder="Add subtask..."
        bind:value={newSubtaskText}
        onkeydown={handleSubtaskKeydown}
      />
      <button class="subtask-add" onclick={addSubtask}>
        <span class="material-icons">add</span>
      </button>
    </div>
    {#if subtasksProgress > 0}
      <div class="subtask-progress-bar">
        <div class="subtask-progress-fill" style="width: {subtasksProgress}%"></div>
      </div>
    {/if}
    {#if todo.subtasks && todo.subtasks.length > 0}
      <div class="subtasks-list">
        {#each todo.subtasks as subtask}
          <div class="subtask-item" class:completed={subtask.completed}>
            <button class="subtask-checkbox" onclick={() => todos.toggleSubtask(todo.id, subtask.id)}>
              <span class="material-icons">{subtask.completed ? 'check_box' : 'check_box_outline_blank'}</span>
            </button>
            <span class="subtask-text">{subtask.text}</span>
            <button class="subtask-remove" onclick={() => todos.removeSubtask(todo.id, subtask.id)}>
              <span class="material-icons">close</span>
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-subtasks">No subtasks yet</div>
    {/if}
  </div>
{/if}

<style>
  .todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .todo-item:hover {
    background: var(--hover-bg);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .todo-item.completed { opacity: 0.6; }
  .todo-item.overdue { border-color: rgba(248, 113, 113, 0.4); }
  .todo-item.pinned { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent-glow); }

  .priority-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }

  .priority-indicator.high { background: #f87171; }
  .priority-indicator.medium { background: #fbbf24; }
  .priority-indicator.low { background: #34d399; }

  .checkbox-wrapper {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
  }

  .custom-checkbox {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .custom-checkbox:hover { border-color: var(--accent); }
  .custom-checkbox.checked { background: var(--accent); border-color: var(--accent); }

  .check-icon {
    font-size: 14px;
    color: white;
    animation: popIn 0.2s ease;
  }

  @keyframes popIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }

  .todo-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .todo-text {
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.4;
    word-break: break-word;
    transition: all 0.2s;
  }

  .completed .todo-text {
    text-decoration: line-through;
    color: var(--text-muted);
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .category-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--cat-color) 20%, transparent);
    color: var(--cat-color);
    font-weight: 500;
  }

  .due-date {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .due-date .material-icons { font-size: 13px; }
  .due-date.overdue { color: #f87171; }

  .recurring-badge {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 11px;
    color: var(--accent);
  }

  .recurring-badge .material-icons { font-size: 13px; }

  .subtasks-progress {
    font-size: 11px;
    color: var(--accent);
    font-weight: 600;
  }

  .notes-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .notes-toggle:hover { background: var(--hover-bg); }
  .notes-toggle .material-icons { font-size: 14px; color: var(--text-muted); }

  .notes-content {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
    padding: 8px;
    background: var(--input-bg);
    border-radius: 6px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .todo-item:hover .actions { opacity: 1; }

  .icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .icon-btn .material-icons { font-size: 18px; color: var(--text-muted); }
  .icon-btn:hover { background: var(--hover-bg); }
  .icon-btn.edit:hover .material-icons { color: var(--accent); }
  .icon-btn.delete:hover .material-icons { color: #f87171; }
  .icon-btn.pin.active .material-icons { color: var(--accent); }

  .priority-icon.high { color: #f87171 !important; }
  .priority-icon.medium { color: #fbbf24 !important; }
  .priority-icon.low { color: #34d399 !important; }

  .icon-btn.confirm:hover .material-icons { color: #34d399; }
  .icon-btn.cancel:hover .material-icons { color: #f87171; }

  .edit-mode {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 8px;
  }

  .edit-input {
    flex: 1;
    border: none;
    border-bottom: 2px solid var(--accent);
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    padding: 8px 4px;
    outline: none;
    background: transparent;
    color: var(--text-primary);
  }

  .subtasks-panel {
    margin-left: 34px;
    padding: 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    margin-top: -4px;
    margin-bottom: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subtask-input-row {
    display: flex;
    gap: 6px;
  }

  .subtask-input {
    flex: 1;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid var(--glass-border);
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    outline: none;
  }

  .subtask-input:focus { border-color: var(--accent); }

  .subtask-add {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    background: var(--accent);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .subtask-add .material-icons { font-size: 18px; color: white; }

  .subtask-progress-bar {
    height: 4px;
    background: var(--input-bg);
    border-radius: 2px;
    overflow: hidden;
  }

  .subtask-progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.3s;
  }

  .subtasks-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .subtask-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .subtask-item:hover { background: var(--hover-bg); }
  .subtask-item.completed { opacity: 0.6; }
  .subtask-item.completed .subtask-text { text-decoration: line-through; }

  .subtask-checkbox {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
  }

  .subtask-checkbox .material-icons { font-size: 18px; color: var(--text-muted); }
  .subtask-item.completed .subtask-checkbox .material-icons { color: var(--accent); }

  .subtask-text {
    flex: 1;
    font-size: 13px;
    color: var(--text-primary);
  }

  .subtask-remove {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .subtask-item:hover .subtask-remove { opacity: 1; }
  .subtask-remove .material-icons { font-size: 14px; color: var(--text-muted); }
  .subtask-remove:hover .material-icons { color: #f87171; }

  .no-subtasks {
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
    padding: 8px;
  }

  @media (max-width: 480px) {
    .actions {
      opacity: 1;
    }

    .todo-item {
      padding: 12px 12px;
      gap: 8px;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
    }

    .subtasks-panel {
      margin-left: 16px;
      padding: 10px;
    }

    .subtask-remove {
      opacity: 1;
    }

    .todo-text {
      font-size: 15px;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .actions {
      opacity: 1;
    }

    .subtask-remove {
      opacity: 1;
    }
  }
</style>
