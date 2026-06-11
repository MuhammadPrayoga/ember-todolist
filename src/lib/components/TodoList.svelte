<script>
  import { todos, filter } from '../stores/todos.js'
  import TodoItem from './TodoItem.svelte'
  import { fly, fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  let { onConfetti = null } = $props()
  let draggedId = $state(null)

  let filteredTodos = $derived((() => {
    let result = [...$todos]

    // Filter by search
    if ($filter.search) {
      const query = $filter.search.toLowerCase()
      result = result.filter(t => t.text.toLowerCase().includes(query))
    }

    // Filter by status
    if ($filter.status === 'active') {
      result = result.filter(t => !t.completed)
    } else if ($filter.status === 'completed') {
      result = result.filter(t => t.completed)
    }

    // Filter by priority
    if ($filter.priority !== 'all') {
      result = result.filter(t => t.priority === $filter.priority)
    }

    // Filter by category
    if ($filter.category !== 'all') {
      result = result.filter(t => t.category === $filter.category)
    }

    // Sort: pinned first, incomplete, priority, creation date
    const priorityWeight = { high: 0, medium: 1, low: 2 }
    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.priority !== b.priority) return priorityWeight[a.priority] - priorityWeight[b.priority]
      return b.createdAt - a.createdAt
    })

    return result
  })())

  let totalCount = $derived($todos.length)
  let filteredCount = $derived(filteredTodos.length)

  function handleDragStart(e, todoId) {
    draggedId = todoId
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e, targetTodo) {
    e.preventDefault()
    if (draggedId && draggedId !== targetTodo.id) {
      const fromIndex = filteredTodos.findIndex(t => t.id === draggedId)
      const toIndex = filteredTodos.findIndex(t => t.id === targetTodo.id)
      if (fromIndex !== -1 && toIndex !== -1) {
        todos.reorder(fromIndex, toIndex)
      }
    }
    draggedId = null
  }
</script>

<div class="todo-list-container">
  {#if totalCount === 0}
    <div class="empty-state" in:fade={{ duration: 300 }}>
      <div class="empty-illustration">
        <span class="material-icons">task_alt</span>
      </div>
      <h3>All clear!</h3>
      <p>Add your first task to get started</p>
    </div>
  {:else if filteredCount === 0}
    <div class="empty-state" in:fade={{ duration: 300 }}>
      <div class="empty-illustration">
        <span class="material-icons">filter_list_off</span>
      </div>
      <h3>No matching tasks</h3>
      <p>Try adjusting your filters</p>
    </div>
  {:else}
    <div class="list-header">
      <span class="count">{filteredCount} task{filteredCount !== 1 ? 's' : ''}</span>
    </div>
    <div class="todo-list">
      {#each filteredTodos as todo (todo.id)}
        <div
          class="todo-item-wrapper"
          draggable="true"
          ondragstart={(e) => handleDragStart(e, todo.id)}
          ondragover={handleDragOver}
          ondrop={(e) => handleDrop(e, todo)}
          animate:flip={{ duration: 300 }}
          in:fly={{ y: 20, duration: 300, delay: 50 }}
          out:fade={{ duration: 150 }}
        >
          <TodoItem {todo} {onConfetti} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .todo-list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px 8px;
  }

  .count {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .todo-item-wrapper {
    width: 100%;
    cursor: grab;
  }

  .todo-item-wrapper:active {
    cursor: grabbing;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 24px;
    text-align: center;
  }

  .empty-illustration {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
  }

  .empty-illustration .material-icons {
    font-size: 36px;
    color: var(--accent);
    opacity: 0.7;
  }

  .empty-state h3 {
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 6px;
    font-size: 18px;
  }

  .empty-state p {
    font-family: 'Roboto', sans-serif;
    color: var(--text-muted);
    margin: 0;
    font-size: 14px;
  }
</style>
