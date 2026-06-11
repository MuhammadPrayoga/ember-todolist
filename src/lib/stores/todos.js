import { writable, derived } from 'svelte/store'

const STORAGE_KEY = 'todolist-app-todos'
const THEME_KEY = 'todolist-app-theme'
const CATEGORIES_KEY = 'todolist-app-categories'

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personal', color: '#f43f5e' },
  { id: 'work', name: 'Work', color: '#0984e3' },
  { id: 'shopping', name: 'Shopping', color: '#00b894' },
  { id: 'health', name: 'Health', color: '#e17055' },
  { id: 'study', name: 'Study', color: '#fdcb6e' }
]

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors
  }
}

// Theme store
function createThemeStore() {
  const { subscribe, set, update } = writable(loadFromStorage(THEME_KEY, 'dark'))
  subscribe((value) => saveToStorage(THEME_KEY, value))
  return {
    subscribe,
    toggle() {
      update((current) => (current === 'dark' ? 'light' : 'dark'))
    },
    set
  }
}

// Categories store
function createCategoriesStore() {
  const { subscribe, set, update } = writable(loadFromStorage(CATEGORIES_KEY, DEFAULT_CATEGORIES))
  subscribe((value) => saveToStorage(CATEGORIES_KEY, value))
  return {
    subscribe,
    add(name, color) {
      update((cats) => [...cats, { id: crypto.randomUUID(), name, color }])
    },
    remove(id) {
      update((cats) => cats.filter((c) => c.id !== id))
    }
  }
}

// Todos store
function createTodosStore() {
  const { subscribe, set, update } = writable(loadFromStorage(STORAGE_KEY, []))
  subscribe((value) => saveToStorage(STORAGE_KEY, value))

  return {
    subscribe,

    addTodo(text, { priority = 'medium', category = null, dueDate = null, notes = '', recurring = null } = {}) {
      update((todos) => [
        {
          id: crypto.randomUUID(),
          text: text.trim(),
          completed: false,
          priority,
          category,
          dueDate,
          notes,
          recurring,
          pinned: false,
          subtasks: [],
          createdAt: Date.now()
        },
        ...todos
      ])
    },

    editTodo(id, updates) {
      update((todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        )
      )
    },

    deleteTodo(id) {
      update((todos) => todos.filter((todo) => todo.id !== id))
    },

    toggleComplete(id) {
      update((todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      )
    },

    togglePin(id) {
      update((todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
        )
      )
    },

    addSubtask(todoId, text) {
      update((todos) =>
        todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, subtasks: [...(todo.subtasks || []), { id: crypto.randomUUID(), text, completed: false }] }
            : todo
        )
      )
    },

    toggleSubtask(todoId, subtaskId) {
      update((todos) =>
        todos.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subtasks: (todo.subtasks || []).map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st
                )
              }
            : todo
        )
      )
    },

    removeSubtask(todoId, subtaskId) {
      update((todos) =>
        todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, subtasks: (todo.subtasks || []).filter((st) => st.id !== subtaskId) }
            : todo
        )
      )
    },

    clearCompleted() {
      update((todos) => todos.filter((todo) => !todo.completed))
    },

    reorder(fromIndex, toIndex) {
      update((todos) => {
        const newTodos = [...todos]
        const [moved] = newTodos.splice(fromIndex, 1)
        newTodos.splice(toIndex, 0, moved)
        return newTodos
      })
    },

    import(importedTodos) {
      set(importedTodos)
    }
  }
}

export const todos = createTodosStore()
export const theme = createThemeStore()
export const categories = createCategoriesStore()

// Filter store
export const filter = writable({
  search: '',
  category: 'all',
  priority: 'all',
  status: 'all'
})
