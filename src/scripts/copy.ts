/**
 * Single polite live region shared by every copy button: the check icon is
 * aria-hidden decoration, so without this a screen reader gets no feedback
 * that the copy happened.
 */
function announce(message: string) {
  let region = document.getElementById('copy-status');
  if (!region) {
    region = document.createElement('span');
    region.id = 'copy-status';
    region.className = 'sr-only';
    region.setAttribute('role', 'status');
    document.body.appendChild(region);
  }
  region.textContent = message;
}

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
    announce('Copied to clipboard');
    setTimeout(() => {
      svg.style.display = 'block';
      check.style.display = 'none';
      announce('');
    }, 2000);
  });
}
