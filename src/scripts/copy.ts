export function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy-source]').forEach((btn) => {
    btn.addEventListener('click', () => handleCopy(btn));
  });
}

function handleCopy(btn: HTMLButtonElement) {
  const sourceId = btn.dataset.copySource;
  if (!sourceId) return;
  const src = document.getElementById(sourceId);
  if (!src) return;
  const svg = btn.querySelector<SVGElement>('svg');
  const check = btn.querySelector<HTMLElement>('.check');
  if (!svg || !check) return;
  navigator.clipboard.writeText(src.textContent || '').then(() => {
    svg.style.display = 'none';
    check.style.display = 'block';
    setTimeout(() => {
      svg.style.display = 'block';
      check.style.display = 'none';
    }, 2000);
  });
}
