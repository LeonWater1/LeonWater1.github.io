import {topics, notes} from './data.js';

const $ = selector => document.querySelector(selector);
let activeFilter = 'all';
let searchQuery = '';
let toastTimer;
const dialog = $('#article-dialog');

function showTopic(index, moveFocus = false) {
  const topic = topics[index];
  $('#topic-tabs').innerHTML = topics.map((item, i) => `<button class="topic-tab" id="tab-${item.id}" type="button" role="tab" aria-selected="${i === index}" aria-controls="topic-panel" tabindex="${i === index ? 0 : -1}" data-topic="${i}"><strong>${item.title}</strong><small lang="en">${item.english}</small></button>`).join('');
  $('#topic-panel').setAttribute('aria-labelledby', `tab-${topic.id}`);
  $('#topic-panel').innerHTML = `<div class="panel-header"><h3>${topic.title}</h3><span class="panel-caption" lang="en">${topic.english}</span></div><p class="topic-summary">${topic.summary}</p><div class="topic-tags">${topic.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div><ul class="topic-questions">${topic.questions.map(question => `<li>${question}</li>`).join('')}</ul><div class="topic-next"><p>${topic.next}</p><a class="text-link" href="#notes" data-topic-filter="${topic.filter}">浏览相关手记 <span aria-hidden="true">→</span></a></div>`;
  if (moveFocus) $(`#tab-${topic.id}`).focus();
}

export function filterNotes(category, query) {
  const normalized = query.trim().toLocaleLowerCase();
  return notes.filter(note => (category === 'all' || note.category === category) && `${note.title} ${note.category} ${note.tags.join(' ')} ${note.excerpt} ${note.content.replace(/<[^>]*>/g, ' ')}`.toLocaleLowerCase().includes(normalized));
}

function renderNotes() {
  const filtered = filterNotes(activeFilter, searchQuery);
  const isFiltered = activeFilter !== 'all' || searchQuery.trim();
  $('#notes-list').classList.toggle('filtered', Boolean(isFiltered));
  $('#notes-list').innerHTML = filtered.map((note, index) => {
    const featured = index === 0 && note.image;
    return `<article class="note-card ${featured ? 'featured' : 'compact'}"><a href="#note/${note.slug}" aria-label="阅读示例手记：${note.title}">${featured ? `<div class="note-image"><img src="${note.image}" alt="" width="1536" height="1024" loading="lazy"></div>` : ''}<div class="note-meta"><span class="category">${note.category}</span><span class="sample">示例手记</span></div><h3>${note.title}</h3><p>${note.excerpt}</p><div class="note-footer"><span>${note.tags.join(' / ')}</span><span class="note-arrow" aria-hidden="true">↗</span></div></a></article>`;
  }).join('');
  $('#empty-results').hidden = filtered.length !== 0;
  $('#result-count').textContent = `${filtered.length} 篇`;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function openNote(slug) {
  const note = notes.find(item => item.slug === slug);
  if (!note) { location.hash = 'notes'; return; }
  $('#article-content').innerHTML = `<div class="note-meta"><span class="category">${note.category}</span><span>${note.tags.join(' / ')}</span></div><h2 id="article-title">${note.title}</h2><p class="reader-notice">示例手记，用于展示阅读体验；尚未作为梁若水的个人学习成果发布。</p>${note.image ? `<img class="article-cover" src="${note.image}" width="1536" height="1024" alt="抽象信息连接概念插图">` : ''}${note.content}`;
  const next = notes[(notes.indexOf(note) + 1) % notes.length];
  $('#next-article').textContent = `下一篇：${next.title} →`;
  $('#next-article').dataset.slug = next.slug;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  document.title = `${note.title} | 梁若水 Liang Jo-shui`;
}

function closeNote() {
  if (dialog.open) dialog.close();
  if (location.hash.startsWith('#note/')) {
    history.replaceState(null, '', `${location.pathname}${location.search}#notes`);
    $('#notes').scrollIntoView({block:'start'});
  }
  document.title = '梁若水 Liang Jo-shui · 大模型学习手记';
}

function syncHash() {
  if (location.hash.startsWith('#note/')) openNote(location.hash.slice(6));
  else if (dialog.open) closeNote();
  if (location.hash === '#en') $('#en').open = true;
}

function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2800);
}

$('#topic-tabs').addEventListener('click', event => {
  const tab = event.target.closest('[data-topic]');
  if (tab) showTopic(Number(tab.dataset.topic), true);
});
$('#topic-tabs').addEventListener('keydown', event => {
  const tab = event.target.closest('[data-topic]');
  if (!tab || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const current = Number(tab.dataset.topic);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? topics.length - 1 : (current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + topics.length) % topics.length;
  showTopic(next, true);
});
$('#topic-panel').addEventListener('click', event => {
  const link = event.target.closest('[data-topic-filter]');
  if (!link) return;
  activeFilter = link.dataset.topicFilter;
  searchQuery = '';
  $('#note-search').value = '';
  renderNotes();
});
$('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (button) { activeFilter = button.dataset.filter; renderNotes(); }
});
$('#note-search').addEventListener('input', event => { searchQuery = event.target.value; renderNotes(); });
$('#reset-filters').addEventListener('click', () => { activeFilter = 'all'; searchQuery = ''; $('#note-search').value = ''; renderNotes(); $('#note-search').focus(); });
function focusSearch() { location.hash = 'notes'; $('#note-search').focus({preventScroll: true}); $('#notes').scrollIntoView(); }
$('#search-shortcut').addEventListener('click', focusSearch);
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !dialog.open && !event.target.closest('input,textarea,[contenteditable]')) { event.preventDefault(); focusSearch(); }
});
function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('#theme-toggle').textContent = dark ? '日读' : '夜读';
  $('#theme-toggle').setAttribute('aria-label', dark ? '切换为浅色阅读' : '切换为深色阅读');
  $('meta[name="theme-color"]').content = dark ? '#171e1a' : '#f7f8f4';
}
$('#theme-toggle').addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('reading-theme', theme); } catch {}
  updateThemeLabel();
});
$('.menu-button').addEventListener('click', () => {
  const open = $('#main-nav').classList.toggle('open');
  $('.menu-button').setAttribute('aria-expanded', String(open));
});
$('#main-nav').addEventListener('click', event => {
  if (event.target.closest('a')) { $('#main-nav').classList.remove('open'); $('.menu-button').setAttribute('aria-expanded', 'false'); }
});
$('#close-article').addEventListener('click', closeNote);
$('#close-article-bottom').addEventListener('click', closeNote);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeNote(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeNote();
});
$('#next-article').addEventListener('click', () => { location.hash = `note/${$('#next-article').dataset.slug}`; });
$('#copy-link').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); toast('文章链接已复制'); }
  catch { toast('暂时无法复制，请从浏览器地址栏复制文章链接。'); }
});
window.addEventListener('hashchange', syncHash);
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    document.querySelectorAll('#main-nav a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, {rootMargin:'-80px 0px -180px 0px', threshold:0});
document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
showTopic(1);
renderNotes();
updateThemeLabel();
syncHash();
