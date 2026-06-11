<script>
  import { notifications, removeNotification } from '../stores/notifications.js'
  import { fly, fade } from 'svelte/transition'
</script>

<div class="notifications-container">
  {#each $notifications as notification (notification.id)}
    <div class="notification" in:fly={{ y: 50, duration: 300 }} out:fade={{ duration: 200 }}>
      <span class="notification-text">{notification.message}</span>
      {#if notification.action}
        <button class="notification-action" onclick={() => {
          notification.action.callback()
          removeNotification(notification.id)
        }}>
          {notification.action.label}
        </button>
      {/if}
      <button class="notification-close" onclick={() => removeNotification(notification.id)}>
        <span class="material-icons">close</span>
      </button>
    </div>
  {/each}
</div>

<style>
  .notifications-container {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 90%;
    width: 400px;
  }

  .notification {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(30, 27, 46, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .notification-text {
    flex: 1;
    font-size: 14px;
    color: white;
  }

  .notification-action {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: var(--accent);
    color: white;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .notification-action:hover {
    background: #e11d48;
  }

  .notification-close {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .notification-close .material-icons {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.5);
  }

  .notification-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .notification-close:hover .material-icons {
    color: white;
  }
</style>
