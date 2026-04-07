// ── Context menu registration ─────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'defang-ioc',
      title: '🔬 Defang IOCs — copy to clipboard',
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'refang-ioc',
      title: '🔁 Refang IOCs — copy to clipboard',
      contexts: ['selection'],
    });
  });
});

// ── Context menu click ────────────────────────────────────
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText) return;

  if (info.menuItemId === 'defang-ioc') {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: defangAndCopy,
        args: [info.selectionText],
      })
      .catch(() => {
        const url = 'https://dgiry.github.io/defang-ioc?input=' +
                    encodeURIComponent(info.selectionText);
        chrome.tabs.create({ url });
      });
  }

  if (info.menuItemId === 'refang-ioc') {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: refangAndCopy,
        args: [info.selectionText],
      })
      .catch(() => {
        const url = 'https://dgiry.github.io/defang-ioc?input=' +
                    encodeURIComponent(info.selectionText) + '&mode=refang';
        chrome.tabs.create({ url });
      });
  }
});

// ── Defang function (runs in page context) ────────────────
// NOTE: this function is serialised & injected into the page.
// It must be fully self-contained — no references to outer scope.
function defangAndCopy(rawText) {
  const PRIVATE =
    /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.|169\.254\.)/;
  const TLD =
    'com|net|org|io|ru|cn|de|uk|fr|nl|br|jp|kr|su|cc|biz|info|me|co|' +
    'xyz|app|dev|onion|top|club|site|online|live|tech|gov|edu|mil|int|' +
    'eu|au|ca|ch|it|es|pl|se|no|fi|dk|be|at|nz|sg|hk|tw|in|id|ph|th|' +
    'vn|ua|tr|sa|ae|za|mx|ar|cl|pe|ve|eg|ng|ke|gh';

  function defangURL(url) {
    return url
      .replace(/^https?/i, p => p.replace(/http/i, 'hxxp'))
      .replace(/\./g, '[.]');
  }
  function defangEmail(e) { return e.replace('@', '[@]').replace(/\./g, '[.]'); }
  function defangIP(ip)   { return ip.replace(/\./g, '[.]'); }
  function defangDomain(d){ return d.replace(/\./g, '[.]'); }

  const result = rawText
    .replace(/\bhttps?:\/\/[^\s<>"{}|\\^`[\]]+/gi, m => defangURL(m))
    .replace(/\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g, m => defangEmail(m))
    .replace(
      /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
      m => (PRIVATE.test(m) ? m : defangIP(m)),
    )
    .replace(
      new RegExp(`\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+(?:${TLD})\\b`, 'gi'),
      m => defangDomain(m),
    );

  navigator.clipboard.writeText(result).then(() => {
    document.getElementById('__defang_toast__')?.remove();
    const el = document.createElement('div');
    el.id = '__defang_toast__';
    el.style.cssText = 'all:initial;position:fixed;top:16px;right:16px;z-index:2147483647;' +
      'background:#0f172a;border:1px solid rgba(34,211,238,.4);color:#67e8f9;' +
      'padding:10px 16px;border-radius:10px;font:600 13px/1.5 system-ui,sans-serif;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.6);pointer-events:none';
    el.textContent = '🔬 Defanged & copied to clipboard!';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }).catch(() => alert('Defanged result:\n\n' + result));
}

// ── Refang function (runs in page context) ────────────────
function refangAndCopy(rawText) {
  function refangURL(url) {
    return url.replace(/hxx([pt]+)/gi, 'htt$1').replace(/\[\.\]/g, '.');
  }
  function refangEmail(e)  { return e.replace(/\[@\]/g, '@').replace(/\[\.\]/g, '.'); }
  function refangIP(ip)    { return ip.replace(/\[\.\]/g, '.'); }
  function refangDomain(d) { return d.replace(/\[\.\]/g, '.'); }

  const result = rawText
    .replace(/\bhxx[pt]+s?:\/\/[^\s<>"{}|\\^`]+/gi, m => refangURL(m))
    .replace(/\b[a-zA-Z0-9._%+\-]+\[@\][a-zA-Z0-9.\-]+\[\.\][a-zA-Z]{2,}\b/g, m => refangEmail(m))
    .replace(
      /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\[\.\]){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
      m => refangIP(m),
    )
    .replace(
      /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\[\.\])+[a-zA-Z]{2,}\b/gi,
      m => refangDomain(m),
    );

  navigator.clipboard.writeText(result).then(() => {
    document.getElementById('__defang_toast__')?.remove();
    const el = document.createElement('div');
    el.id = '__defang_toast__';
    el.style.cssText = 'all:initial;position:fixed;top:16px;right:16px;z-index:2147483647;' +
      'background:#0f172a;border:1px solid rgba(251,191,36,.4);color:#fcd34d;' +
      'padding:10px 16px;border-radius:10px;font:600 13px/1.5 system-ui,sans-serif;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.6);pointer-events:none';
    el.textContent = '🔁 Refanged & copied to clipboard!';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }).catch(() => alert('Refanged result:\n\n' + result));
}
