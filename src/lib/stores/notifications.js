import { writable, derived } from 'svelte/store'
import { todos } from './todos.js'

// Notification store for undo delete and reminders
export const notifications = writable([])

export function addNotification(message, action = null, duration = 3000) {
  const id = crypto.randomUUID()
  notifications.update((n) => [...n, { id, message, action }])
  setTimeout(() => removeNotification(id), duration)
  return id
}

export function removeNotification(id) {
  notifications.update((n) => n.filter((notification) => notification.id !== id))
}

// Deleted task store for undo
export const lastDeleted = writable(null)

export function undoLastDelete() {
  const deleted = null
  lastDeleted.subscribe((task) => {
    if (task) {
      todos.editTodo(task.id, task)
    }
  })()
  lastDeleted.set(null)
}

// Statistics derived store
export const stats = derived(todos, ($todos) => {
  const total = $todos.length
  const completed = $todos.filter((t) => t.completed).length
  const pending = total - completed
  const byPriority = {
    high: $todos.filter((t) => t.priority === 'high' && !t.completed).length,
    medium: $todos.filter((t) => t.priority === 'medium' && !t.completed).length,
    low: $todos.filter((t) => t.priority === 'low' && !t.completed).length
  }
  const byCategory = $todos.reduce((acc, todo) => {
    if (todo.category) {
      acc[todo.category] = (acc[todo.category] || 0) + 1
    }
    return acc
  }, {})
  const overdue = $todos.filter((t) =>
    t.dueDate && !t.completed && new Date(t.dueDate) < new Date(new Date().toDateString())
  ).length

  return { total, completed, pending, byPriority, byCategory, overdue }
})
