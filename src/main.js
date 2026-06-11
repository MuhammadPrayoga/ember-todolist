import { mount } from 'svelte'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

export default app
