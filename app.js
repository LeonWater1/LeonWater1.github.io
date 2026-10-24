import {findRecords} from './search.mjs';

const $ = selector => document.querySelector(selector);
const english = document.documentElement.lang === 'en';
const header = $('header-component');
const menuButton = $('#toggleMenu');
const nav = $('#headerExpandConetent');
const themeButton = $('#toggleDarkMode');
const media = matchMedia('(prefers-color-scheme: dark)');
const mobile = matchMedia('(max-width: 767px)');

function applyTheme(preference) {
  const dark = preference === 'dark' || (preference === 'system' && media.matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.themePreference = preference;
  themeButton.dataset.theme = preference;
  const label = english ? `Color theme: ${preference}. Click to change.` : `当前主题：${{light:'浅色',dark:'深色',system:'跟随系统'}[preference]}，点击切换`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  $('meta[name="theme-color"]').content = dark ? '#0B0B10' : '#FCFCFD';
}
applyTheme(document.documentElement.dataset.themePreference || 'light');
themeButton.addEventListener('click', () => {
  const themes = ['light', 'dark', 'system'];
  const next = themes[(themes.indexOf(document.documentElement.dataset.themePreference) + 1) % 3];
  try { localStorage.setItem('axi-theme', next); } catch {}
  applyTheme(next);
});
media.addEventListener('change', () => applyTheme(document.documentElement.dataset.themePreference));
$('#language-switch-btn').addEventListener('click', event => {
  location.href = event.currentTarget.dataset.targetUrl + location.hash;
});

function setMenu(open, returnFocus = false) {
  header.classList.toggle('expanded', open);
  menuButton.setAttribute('aria-expanded', String(open));
  nav.inert = mobile.matches && !open;
  if (returnFocus) menuButton.focus();
}
setMenu(false);
menuButton.addEventListener('click', () => setMenu(!header.classList.contains('expanded')));
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('expanded')) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});

const route = location.pathname.replace(/^\/en(?=\/|$)/, '/').replace(/\/+/g, '/');
for (const a of header.querySelectorAll('a[href^="/"]')) {
  const target = new URL(a.href).pathname.replace(/^\/en(?=\/|$)/, '/').replace(/\/+/g, '/');
  if (target === route || (target.startsWith('/blog/') && route.startsWith('/blog/') && a.classList.contains('blog-menu-link'))) a.setAttribute('aria-current', 'page');
}

let previousY = scrollY;
let frame;
function updateScroll() {
  frame = undefined;
  header.classList.toggle('not-top', scrollY > 20);
  header.dataset.show = String(scrollY < 600 || scrollY <= previousY);
  previousY = scrollY;
  for (const link of document.querySelectorAll('toc-heading a[href^="#"]')) {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) continue;
    const top = target.getBoundingClientRect().top;
    const active = top >= 0 && top < innerHeight * .7;
    link.classList.toggle('highlight', active);
    link.classList.toggle('highlight-bg-translucent', active);
  }
}
addEventListener('scroll', () => { if (frame === undefined) frame = requestAnimationFrame(updateScroll); }, {passive:true});
updateScroll();

for (const image of document.querySelectorAll('.profile-avatar')) {
  const fallback = () => {
    const placeholder = document.createElement('div');
    placeholder.className = image.className + ' avatar-fallback';
    placeholder.textContent = '若';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', english ? 'Liang Jo-shui avatar' : '梁若水的文字头像');
    image.replaceWith(placeholder);
  };
  image.addEventListener('error', fallback, {once:true});
  if (image.complete && !image.naturalWidth) fallback();
}

function legacyLinks() {
  if (route !== '/') return;
  const prefix = english ? '/en' : '';
  const redirects = {'#en':'/en/','#zh':'/#about','#learning':`${prefix}/academic/#research-interests`,'#notes':`${prefix}/blog/all/`,'#practice':`${prefix}/blog/all/`};
  if (location.hash.startsWith('#note/')) location.replace(`${prefix}/blog/all/`);
  else if (redirects[location.hash]) location.replace(redirects[location.hash]);
  else if (location.hash === '#home') $('#content-header').scrollIntoView();
}
legacyLinks();
addEventListener('hashchange', legacyLinks);

const searchInput = $('#search-input');
if (searchInput) {
  const results = $('#search-results');
  let records;
  let request;
  let version = 0;
  async function search() {
    const current = ++version;
    const query = searchInput.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    results.replaceChildren();
    if (!query) return;
    try {
      request ||= fetch(english ? '/search-index-en.json' : '/search-index-zh.json').then(response => {
        if (!response.ok) throw Error('Search unavailable');
        return response.json();
      }).catch(error => { request = undefined; throw error; });
      records ||= await request;
      if (current !== version) return;
      const matches = findRecords(records, query);
      const status = document.createElement('p');
      status.className = 'my-4 text-sm text-muted-foreground';
      status.textContent = english ? `${matches.length} results` : `找到 ${matches.length} 个结果`;
      results.append(status);
      for (const match of matches) {
        const a = document.createElement('a');
        a.href = match.url;
        a.className = 'search-result block rounded-xl border border-border bg-card px-6 py-4 hover:bg-muted/30';
        const h = document.createElement('h2');
        h.className = 'font-medium';
        h.textContent = match.title;
        const p = document.createElement('p');
        p.className = 'mt-2 text-sm text-muted-foreground';
        p.textContent = match.text.slice(0, 170);
        a.append(h, p);
        results.append(a);
      }
    } catch {
      if (current === version) results.textContent = english ? 'Search is unavailable. Please try again.' : '搜索暂时不可用，请稍后重试。';
    }
  }
  $('#site-search').addEventListener('submit', event => {event.preventDefault();search();});
  searchInput.addEventListener('input', search);
  searchInput.value = new URLSearchParams(location.search).get('q') || '';
  if (searchInput.value) search();
}
