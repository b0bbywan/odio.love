<script>
  const slides = [
    { src: '/screenshots/embedded-ui.png', alt: 'Embedded web UI — full dashboard (RIP Dooz Kawa)' },
    { src: '/screenshots/audio-cd-playback.png', alt: 'Audio CD playback with metadata' },
    { src: '/screenshots/bt-playing.png', alt: 'Bluetooth streaming via PWA' },
    { src: '/screenshots/bt-output.png', alt: 'Bluetooth output to a JBL Go 3 speaker, playing a web radio with live track metadata and cover art' },
    { src: '/screenshots/webradio-cover.png', alt: 'Web radio with cover art' },
    { src: '/screenshots/pwa-instances.png', alt: 'PWA — multi-node management' },
    { src: '/screenshots/odio-ha.png', alt: 'Home Assistant — odio-ha integration' },
    { src: '/screenshots/rpi-imager.png', alt: 'Raspberry Pi Imager — flash odio' },
  ];

  // WCAG 2.2.2: auto-rotating content needs a pause control, and it must not
  // start rotating at all for someone who asked for reduced motion.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = $state(0);
  let lightbox = $state(false);
  let playing = $state(!prefersReducedMotion);
  let lightboxEl = $state(null);
  let lastTrigger = null;
  let timer;

  function stopTimer() {
    clearInterval(timer);
    timer = undefined;
  }

  function startTimer() {
    stopTimer();
    if (!playing || lightbox) return;
    timer = setInterval(() => (current = (current + 1) % slides.length), 5000);
  }

  function go(i) {
    current = ((i % slides.length) + slides.length) % slides.length;
    startTimer();
  }

  function openLightbox(event) {
    lastTrigger = event.currentTarget;
    lightbox = true;
  }

  function closeLightbox() {
    lightbox = false;
    lastTrigger?.focus();
    lastTrigger = null;
  }

  // Keep focus inside the dialog: aria-modal only tells assistive tech, it does
  // not stop Tab from walking into the page behind.
  function trapFocus(event) {
    if (event.key !== 'Tab' || !lightboxEl) return;
    const focusable = lightboxEl.querySelectorAll('button');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === lightboxEl)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onWindowKeydown(event) {
    if (!lightbox) return;
    if (event.key === 'Escape') closeLightbox();
    else if (event.key === 'ArrowLeft') go(current - 1);
    else if (event.key === 'ArrowRight') go(current + 1);
    else trapFocus(event);
  }

  $effect(() => {
    // reading both keeps the timer in sync with playback and lightbox state
    if (playing && !lightbox) startTimer();
    else stopTimer();
    return stopTimer;
  });

  $effect(() => {
    if (lightbox) lightboxEl?.focus();
  });
</script>

<svelte:window onkeydown={onWindowKeydown} />

<div class="slider" role="group" aria-roledescription="carousel" aria-label="odio screenshots">
  <div class="viewport">
    <button class="nav prev" onclick={() => go(current - 1)} aria-label="Previous screenshot">&#8249;</button>
    <button class="nav next" onclick={() => go(current + 1)} aria-label="Next screenshot">&#8250;</button>
    {#each slides as slide, i (slide.src)}
      <!-- inert: the off-screen slides stay in the DOM for the crossfade, but
           they must not be tabbable or announced -->
      <button
        type="button"
        class="slide-btn"
        class:active={i === current}
        inert={i !== current}
        onclick={openLightbox}
        aria-label="Enlarge screenshot: {slide.alt}"
      >
        <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" class="slide-img" />
      </button>
    {/each}
  </div>
  <div class="caption" aria-live={playing ? 'off' : 'polite'}>{slides[current].alt}</div>
  <div class="dots">
    <button
      type="button"
      class="playpause"
      onclick={() => (playing = !playing)}
      aria-label={playing ? 'Pause the screenshot slideshow' : 'Play the screenshot slideshow'}
    >{playing ? '❚❚' : '▶'}</button>
    {#each slides as slide, i (slide.src)}
      <button
        type="button"
        class="dot"
        class:active={i === current}
        onclick={() => go(i)}
        aria-label="Go to slide {i + 1} of {slides.length}"
        aria-current={i === current ? 'true' : undefined}
      ></button>
    {/each}
  </div>
</div>

{#if lightbox}
  <div
    class="lightbox"
    bind:this={lightboxEl}
    role="dialog"
    aria-modal="true"
    aria-label="Screenshot viewer"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
  >
    <button type="button" class="lb-close" onclick={closeLightbox} aria-label="Close the screenshot viewer">&times;</button>
    <button type="button" class="lb-nav lb-prev" onclick={() => go(current - 1)} aria-label="Previous screenshot">&#8249;</button>
    <button type="button" class="lb-nav lb-next" onclick={() => go(current + 1)} aria-label="Next screenshot">&#8250;</button>
    <img src={slides[current].src} alt={slides[current].alt} decoding="async" class="lb-img" />
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
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 0.75rem;
  }

  .playpause {
    background: none;
    border: none;
    padding: 0;
    margin-right: 4px;
    font-size: 0.7rem;
    line-height: 8px;
    color: var(--color-muted);
    cursor: pointer;
    transition: color 0.2s;
  }

  .playpause:hover {
    color: var(--color-leaf);
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
    outline: none;
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
