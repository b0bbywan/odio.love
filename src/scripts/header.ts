const CACHE_KEY = 'odios_release';
const CACHE_TTL = 3600000;

function showTag(tag: string) {
  const el = document.getElementById('release-tag');
  if (el) el.textContent = ' ' + tag;
}

function fetchTag() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { tag, ts } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL) {
      showTag(tag);
      return;
    }
  }
  fetch('https://api.github.com/repos/b0bbywan/odios/releases/latest')
    .then((r) => r.json())
    .then((d) => {
      if (d.tag_name) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ tag: d.tag_name, ts: Date.now() }));
        showTag(d.tag_name);
      }
    })
    .catch(() => {});
}

export function initReleaseTag() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(fetchTag);
  } else {
    setTimeout(fetchTag, 200);
  }
}

export function initMobileMenu() {
  const menu = document.getElementById('mobile-menu') as HTMLDetailsElement | null;
  if (!menu) return;
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.open = false;
    })
  );
  document.addEventListener('click', (e) => {
    if (menu.open && !menu.contains(e.target as Node)) menu.open = false;
  });
}
