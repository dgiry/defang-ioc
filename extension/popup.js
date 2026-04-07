// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let mode    = 'defang';
let results = [];

// ═══════════════════════════════════════════════════════════
// PATTERNS
// ═══════════════════════════════════════════════════════════
const PRIVATE = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.|169\.254\.)/;
const TLD = 'com|net|org|io|ru|cn|de|uk|fr|nl|br|jp|kr|su|cc|biz|info|me|co|xyz|app|dev|onion|top|club|site|online|live|tech|gov|edu|mil|int|eu|au|ca|ch|it|es|pl|se|no|fi|dk|be|at|nz|sg|hk|tw|in|id|ph|th|vn|ua|tr|sa|ae|za|mx|ar|cl|pe|ve|eg|ng|ke|gh';

const RX = {
  ip:         /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
  url:        /\bhttps?:\/\/[^\s<>"{}|\\^`[\]]+/gi,
  url_fanged: /\bhxx[pt]+s?:\/\/[^\s<>"{}|\\^`]+/gi,
  email:      /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g,
  sha256:     /\b[a-fA-F0-9]{64}\b/g,
  sha1:       /\b[a-fA-F0-9]{40}\b/g,
  md5:        /\b[a-fA-F0-9]{32}\b/g,
  cve:        /\bCVE-\d{4}-\d{4,}\b/gi,
};
const DOMAIN_RX = new RegExp(
  `\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+(?:${TLD})\\b`, 'gi'
);

const RX_D = {
  ip:     /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\[\.\]){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
  url:    /\bhxx[pt]+s?:\/\/[^\s<>"{}|\\^`]+/gi,
  email:  /\b[a-zA-Z0-9._%+\-]+\[@\][a-zA-Z0-9.\-]+\[\.\][a-zA-Z]{2,}\b/g,
  domain: /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\[\.\])+[a-zA-Z]{2,}\b/gi,
};

// ═══════════════════════════════════════════════════════════
// TRANSFORMS
// ═══════════════════════════════════════════════════════════
const defangIP  = ip  => ip.replace(/\./g, '[.]');
const defangDom = d   => d.replace(/\./g, '[.]');
const defangURL = url => url.replace(/^https?/i, p => p.replace(/http/i, 'hxxp')).replace(/\./g, '[.]');
const defangEml = e   => e.replace('@', '[@]').replace(/\./g, '[.]');
const refangIP  = ip  => ip.replace(/\[\.\]/g, '.');
const refangDom = d   => d.replace(/\[\.\]/g, '.');
const refangURL = url => url.replace(/hxx([pt]+)/gi, 'htt$1').replace(/\[\.\]/g, '.');
const refangEml = e   => e.replace(/\[@\]/g, '@').replace(/\[\.\]/g, '.');

// ═══════════════════════════════════════════════════════════
// EXTRACT
// ═══════════════════════════════════════════════════════════
function makeAdder() {
  const found = [], seen = new Set();
  function add(type, original, processed) {
    const key = type + ':' + original.toLowerCase();
    if (seen.has(key)) {
      const ex = found.find(r => r.type === type && r.original.toLowerCase() === original.toLowerCase());
      if (ex) ex.count++;
      return;
    }
    seen.add(key);
    found.push({ type, original, processed, count: 1 });
  }
  return { add, found };
}

function extract(text) {
  const { add, found } = makeAdder();
  (text.match(RX.url_fanged) || []).forEach(u => add('url', u, u));
  let s = text.replace(RX.url_fanged, ' ');
  (s.match(RX.url) || []).forEach(u => add('url', u, defangURL(u)));
  s = s.replace(RX.url, ' ');
  (s.match(RX.email) || []).forEach(e => add('email', e, defangEml(e)));
  s = s.replace(RX.email, ' ');
  (s.match(RX.ip) || []).forEach(ip => { if (!PRIVATE.test(ip)) add('ip', ip, defangIP(ip)); });
  s = s.replace(RX.ip, ' ');
  (s.match(RX.sha256) || []).forEach(h => add('hash', h, h)); s = s.replace(RX.sha256, ' ');
  (s.match(RX.sha1)   || []).forEach(h => add('hash', h, h)); s = s.replace(RX.sha1,   ' ');
  (s.match(RX.md5)    || []).forEach(h => add('hash', h, h)); s = s.replace(RX.md5,    ' ');
  (s.match(RX.cve)    || []).forEach(c => add('cve', c.toUpperCase(), c.toUpperCase()));
  s = s.replace(RX.cve, ' ');
  (s.match(DOMAIN_RX) || []).forEach(d => {
    if (!/^\d+\.\d+/.test(d)) add('domain', d.toLowerCase(), defangDom(d.toLowerCase()));
  });
  return found;
}

function extractDefanged(text) {
  const { add, found } = makeAdder();
  (text.match(RX_D.url)    || []).forEach(u => add('url',    u, refangURL(u)));
  let s = text.replace(RX_D.url, ' ');
  (s.match(RX_D.email)     || []).forEach(e => add('email',  e, refangEml(e)));
  s = s.replace(RX_D.email, ' ');
  (s.match(RX_D.ip)        || []).forEach(ip => add('ip', ip, refangIP(ip)));
  s = s.replace(RX_D.ip, ' ');
  (s.match(RX_D.domain)    || []).forEach(d => add('domain', d.toLowerCase(), refangDom(d.toLowerCase())));
  return found;
}

// ═══════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════
const TYPE_STYLE = {
  ip:    { chip: 'border:1px solid rgba(96,165,250,.3);background:rgba(96,165,250,.12);color:#93c5fd', label: 'IP' },
  domain:{ chip: 'border:1px solid rgba(251,146,60,.3);background:rgba(251,146,60,.12);color:#fdba74', label: 'Domain' },
  url:   { chip: 'border:1px solid rgba(192,132,252,.3);background:rgba(192,132,252,.12);color:#d8b4fe', label: 'URL' },
  hash:  { chip: 'border:1px solid rgba(74,222,128,.3);background:rgba(74,222,128,.12);color:#86efac', label: 'Hash' },
  email: { chip: 'border:1px solid rgba(250,204,21,.3);background:rgba(250,204,21,.12);color:#fde047', label: 'Email' },
  cve:   { chip: 'border:1px solid rgba(248,113,113,.3);background:rgba(248,113,113,.12);color:#fca5a5', label: 'CVE' },
};
const hashLabel = v => v.length === 64 ? 'SHA256' : v.length === 40 ? 'SHA1' : 'MD5';
const esc = s => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function onInput() {
  const text = document.getElementById('input').value.trim();
  if (!text) { results = []; renderEmpty(); return; }
  results = mode === 'defang' ? extract(text) : extractDefanged(text);
  renderResults();
}

function renderEmpty() {
  document.getElementById('ioc-list').style.display = 'none';
  document.getElementById('empty-state').style.display = 'block';
  document.getElementById('footer').classList.remove('visible');
  document.getElementById('copy-all-btn').disabled = true;
}

function renderResults() {
  const list   = document.getElementById('ioc-list');
  const empty  = document.getElementById('empty-state');
  const footer = document.getElementById('footer');

  if (results.length === 0) { renderEmpty(); return; }

  empty.style.display = 'none';
  list.style.display  = 'block';
  footer.classList.add('visible');
  document.getElementById('copy-all-btn').disabled = false;
  document.getElementById('count-chip').textContent =
    results.length + ' IOC' + (results.length !== 1 ? 's' : '');

  list.innerHTML = results.map(r => {
    const s     = TYPE_STYLE[r.type];
    const lbl   = r.type === 'hash' ? hashLabel(r.original) : s.label;
    const orig  = r.type !== 'hash' && r.type !== 'cve' && r.original !== r.processed;
    const badge = r.count > 1
      ? `<span class="count-badge" title="Appears ${r.count}x">×${r.count}</span>` : '';
    return `
      <div class="ioc-row">
        <span class="chip" style="${s.chip}">${lbl}</span>
        <div class="ioc-text">
          ${orig ? `<div class="ioc-orig">${esc(r.original)}</div>` : ''}
          <div class="ioc-val">${esc(r.processed)}</div>
        </div>
        ${badge}
        <button class="copy-btn" data-val="${esc(r.processed)}">Copy</button>
      </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════
function toggleMode() {
  mode = mode === 'defang' ? 'refang' : 'defang';
  const isRefang = mode === 'refang';
  document.getElementById('mode-lbl').textContent = isRefang ? 'Refang' : 'Defang';
  document.querySelector('.mode-btn').classList.toggle('refang', isRefang);
  document.getElementById('copy-all-btn').textContent = isRefang ? 'Copy all refanged' : 'Copy all defanged';
  onInput();
}

function clearAll() {
  document.getElementById('input').value = '';
  results = [];
  renderEmpty();
}

function copyOne(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied!'));
}

function copyAll() {
  if (!results.length) return;
  navigator.clipboard.writeText(results.map(r => r.processed).join('\n'))
    .then(() => toast('All ' + results.length + ' IOCs copied!'));
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input').addEventListener('input', onInput);
  document.querySelector('.mode-btn').addEventListener('click', toggleMode);
  document.getElementById('copy-all-btn').addEventListener('click', copyAll);
  document.querySelector('.btn-secondary').addEventListener('click', clearAll);

  // Event delegation for dynamically generated copy buttons
  document.getElementById('ioc-list').addEventListener('click', e => {
    const btn = e.target.closest('.copy-btn');
    if (btn) copyOne(btn.dataset.val);
  });

  document.getElementById('input').focus();
});
