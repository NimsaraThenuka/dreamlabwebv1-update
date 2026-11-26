/* dreamLab 営業用HP：動きのある部分だけの小さなスクリプト（ライブラリ不使用） */
(function () {
  'use strict';

  /* ---------- スマホのメニュー ---------- */
  var ICON_OPEN = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"></path></svg>';
  var ICON_CLOSE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"></path></svg>';
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('sp-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      btn.innerHTML = open ? ICON_CLOSE : ICON_OPEN;
    });
  }

  /* ---------- お申込みフォーム：ご用件の切り替え & UTM引き継ぎ ---------- */
  var form = document.querySelector('[data-inquiry]');
  if (form) {
    var LABEL = { free: '無料相談を申し込む', session: '90分セッションを申し込む' };
    var choices = document.querySelectorAll('.choice[data-type]');
    var submit = document.getElementById('f-submit');
    var note = document.getElementById('session-note');
    var req = document.getElementById('body-req');
    var opt = document.getElementById('body-opt');
    var body = document.getElementById('f-body');
    var typeInput = document.getElementById('f-type');
    var pick = function (type) {
      choices.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.type === type ? 'true' : 'false'); });
      typeInput.value = type;
      submit.firstChild.nodeValue = LABEL[type] || 'この内容で送信する';
      note.hidden = type !== 'session';
      var must = type === 'education';
      req.hidden = !must; opt.hidden = must; body.required = must;
    };
    choices.forEach(function (c) { c.addEventListener('click', function () { pick(c.dataset.type); }); });
    var params = new URLSearchParams(location.search);
    var q = params.get('type');
    pick(Array.prototype.some.call(choices, function (c) { return c.dataset.type === q; }) ? q : 'free');

    ['utm_source', 'utm_campaign'].forEach(function (k) {
      var v = params.get(k) || sessionStorage.getItem(k);
      if (params.get(k)) sessionStorage.setItem(k, params.get(k));
      var el = document.getElementById(k);
      if (el && v) el.value = v;
    });
  }

  /* ---------- ブログ一覧：カテゴリのタブ ---------- */
  var posts = document.querySelector('[data-posts]');
  if (posts) {
    var tabs = document.querySelectorAll('.tabs [data-tab]');
    var items = posts.querySelectorAll('li');
    var show = function (key) {
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.dataset.tab === key ? 'true' : 'false'); });
      var n = 0;
      items.forEach(function (li) {
        var hit = key === 'all' || li.querySelector('.post-img--' + key);
        li.hidden = !(hit && (key !== 'all' || n < 6));
        if (hit) n++;
      });
    };
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab); }); });
    show('all');
  }

  /* ---------- 記事の「URLをコピー」 ---------- */
  document.querySelectorAll('.share button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { b.textContent = 'コピーしました'; });
    });
  });

  /* ---------- 計測（LINEボタン・電話クリック） ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || typeof window.gtag !== 'function') return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('lin.ee') > -1 || href.indexOf('line.me') > -1) {
      window.gtag('event', 'line_click', { link_text: a.textContent.trim() });
    }
    if (href.indexOf('tel:') === 0) {
      window.gtag('event', 'tel_click');
    }
  });
})();
