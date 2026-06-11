<script>
  let particles = $state([])
  let active = $state(false)

  export function trigger() {
    particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#f43f5e', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4
    }))
    active = true
    setTimeout(() => {
      active = false
      particles = []
    }, 2000)
  }
</script>

{#if active}
  <div class="confetti-container">
    {#each particles as particle (particle.id)}
      <div
        class="particle"
        style="
          left: {particle.x}%;
          top: {particle.y}%;
          background: {particle.color};
          transform: rotate({particle.rotation}deg);
          width: {particle.size}px;
          height: {particle.size}px;
        "
      ></div>
    {/each}
  </div>
{/if}

<style>
  .confetti-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    border-radius: 2px;
    animation: fall 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  @keyframes fall {
    0% {
      opacity: 1;
      transform: translateY(0) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translateY(100vh) rotate(720deg);
    }
  }
</style>
