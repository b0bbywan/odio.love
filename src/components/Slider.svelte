<script>
  const slides = [
    { src: '/screenshots/embedded-ui.png', alt: 'Embedded web UI — full dashboard (RIP Dooz Kawa)' },
    { src: '/screenshots/audio-cd-playback.png', alt: 'Audio CD playback with metadata' },
    { src: '/screenshots/bt-playing.png', alt: 'Bluetooth streaming via PWA' },
    { src: '/screenshots/pwa-instances.png', alt: 'PWA — multi-node management' },
    { src: '/screenshots/rpi-imager.png', alt: 'Raspberry Pi Imager — flash odio' },
  ];

  let current = $state(0);
  let lightbox = $state(false);
  let timer;

  function go(i) {
    current = ((i % slides.length) + slides.length) % slides.length;
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => current = (current + 1) % slides.length, 5000);
  }

  $effect(() => {
    resetTimer();
    return () => clearInterval(timer);
  });
</script>

<div class="slider">
  <div class="viewport">
    <button class="nav prev" onclick={() => go(current - 1)} aria-label="Previous">&#8249;</button>
    <button class="nav next" onclick={() => go(current + 1)} aria-label="Next">&#8250;</button>
    {#each slides as slide, i}
      <button
        type="button"
        class="slide-btn"
        class:active={i === current}
        onclick={() => { lightbox = true; clearInterval(timer); }}
        aria-label="View {slide.alt}"
      >
        <img src={slide.src} alt={slide.alt} class="slide-img" />
      </button>
    {/each}
  </div>
  <div class="caption">{slides[current].alt}</div>
  <div class="dots">
    {#each slides as _, i}
      <button
        class="dot"
        class:active={i === current}
        onclick={() => go(i)}
        aria-label="Go to slide {i + 1}"
      ></button>
    {/each}
  </div>
</div>

{#if lightbox}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="lightbox"
    onclick={(e) => { if (e.target === e.currentTarget) { lightbox = false; resetTimer(); } }}
    onkeydown={(e) => {
      if (e.key === 'Escape') { lightbox = false; resetTimer(); }
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
    }}
  >
    <button class="lb-close" onclick={() => { lightbox = false; resetTimer(); }} aria-label="Close">&times;</button>
    <button class="lb-nav lb-prev" onclick={() => go(current - 1)} aria-label="Previous">&#8249;</button>
    <button class="lb-nav lb-next" onclick={() => go(current + 1)} aria-label="Next">&#8250;</button>
    <img src={slides[current].src} alt={slides[current].alt} class="lb-img" />
    <div class="lb-caption">{slides[current].alt}</div>
  </div>
{/if}

<style>
  .slider {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
  }

  .viewport {
    position: relative;
    aspect-ratio: 16 / 10;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
  }

  .slide-btn {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    padding: 0;
    cursor: zoom-in;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .slide-btn.active {
    opacity: 1;
  }

  .slide-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    background: color-mix(in srgb, var(--color-bg) 80%, transparent);
    border: none;
    color: var(--color-muted);
    font-size: 2rem;
    line-height: 1;
    padding: 0.25rem 0.6rem;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
  }

  .nav:hover {
    color: var(--color-text);
    background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  }

  .prev { left: 8px; }
  .next { right: 8px; }

  .caption {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 0.75rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    background-color: var(--color-border);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s;
  }

  .dot.active {
    background-color: var(--color-moss);
  }

  .dot:hover {
    background-color: var(--color-leaf);
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
  }

  .lb-img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
  }

  .lb-close {
    position: absolute;
    top: 16px;
    right: 24px;
    background: none;
    border: none;
    color: var(--color-muted);
    font-size: 2.5rem;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
  }

  .lb-close:hover {
    color: var(--color-text);
  }

  .lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-muted);
    font-size: 3rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    transition: color 0.2s;
  }

  .lb-nav:hover {
    color: var(--color-text);
  }

  .lb-prev { left: 16px; }
  .lb-next { right: 16px; }

  .lb-caption {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-muted);
    font-size: 0.875rem;
    text-align: center;
  }
</style>
