<script>
  import { todos } from '../stores/todos.js'
  import { addNotification } from '../stores/notifications.js'

  let fileInput = $state(null)

  function exportData() {
    const data = JSON.stringify($todos, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ember-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    addNotification('Data exported successfully!')
  }

  function importData() {
    fileInput.click()
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (Array.isArray(data)) {
          todos.import(data)
          addNotification(`Imported ${data.length} tasks!`)
        } else {
          addNotification('Invalid file format')
        }
      } catch {
        addNotification('Failed to parse file')
      }
    }
    reader.readAsText(file)
    fileInput.value = ''
  }
</script>

<div class="export-import">
  <input
    type="file"
    accept=".json"
    bind:this={fileInput}
    onchange={handleFileSelect}
    style="display: none;"
  />
  <button class="io-btn" onclick={exportData}>
    <span class="material-icons">download</span>
    Export
  </button>
  <button class="io-btn" onclick={importData}>
    <span class="material-icons">upload</span>
    Import
  </button>
</div>

<style>
  .export-import {
    display: flex;
    gap: 8px;
  }

  .io-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 10px;
    border: 1px solid var(--glass-border);
    background: var(--glass-bg);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }

  .io-btn:hover {
    background: var(--hover-bg);
    border-color: var(--accent);
  }

  .io-btn .material-icons {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    .io-btn {
      padding: 12px;
      min-height: 44px;
      font-size: 14px;
    }
  }
</style>
