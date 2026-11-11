/* WallUp accessibility menu: text size, contrast, grayscale, link highlight, readable font, stop motion.
   Settings are kept per visitor in localStorage when available. */
(function () {
  var me = document.currentScript;
  var statement = (me && me.dataset.statement) || "legal/accessibility.html";
  var KEY = "wallup-a11y";
  var state = { size: 0, contrast: false, gray: false, links: false, font: false, still: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved) for (var k in state) if (k in saved) state[k] = saved[k]; } catch (e) {}

  var css = '' +
    '.a11y-skip{position:fixed;top:-60px;right:12px;z-index:200;background:#151413;color:#fff;padding:10px 16px;border-radius:4px;font:700 15px Assistant,Arial,sans-serif;text-decoration:none;transition:top .15s}' +
    '.a11y-skip:focus{top:calc(10px + env(safe-area-inset-top,0px))}' +
    '.a11y-btn{position:fixed;right:calc(22px + env(safe-area-inset-right,0px));bottom:calc(22px + env(safe-area-inset-bottom,0px));z-index:80;width:52px;height:52px;border-radius:50%;border:0;background:#1D4ED8;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.25)}' +
    '.a11y-btn:hover{background:#1E40AF}.a11y-btn svg{width:30px;height:30px}' +
    '.a11y-btn:focus-visible{outline:3px solid #F59E0B;outline-offset:3px}' +
    '@media (max-width:760px){.a11y-btn{bottom:calc(90px + env(safe-area-inset-bottom,0px));right:calc(16px + env(safe-area-inset-right,0px));width:48px;height:48px}}' +
    '.a11y-panel{position:fixed;right:calc(22px + env(safe-area-inset-right,0px));bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:81;width:min(320px,calc(100vw - 32px));max-height:calc(100vh - 120px);overflow:auto;background:#fff;color:#151413;border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:16px;font:15px/1.4 Assistant,Arial,sans-serif;direction:rtl}' +
    '@media (max-width:760px){.a11y-panel{right:16px;bottom:calc(146px + env(safe-area-inset-bottom,0px));max-height:calc(100vh - 180px)}}' +
    '.a11y-panel h2{font:800 18px Assistant,Arial,sans-serif;margin:0 0 12px;display:flex;justify-content:space-between;align-items:center}' +
    '.a11y-panel h2 button{background:none;border:0;font-size:24px;line-height:1;cursor:pointer;color:#151413;padding:4px 8px}' +
    '.a11y-size{display:flex;align-items:center;gap:8px;margin-bottom:10px}' +
    '.a11y-size span{flex:1;font-weight:700}' +
    '.a11y-size button{width:40px;height:40px;border:1px solid #CBD5E1;background:#F8FAFC;border-radius:6px;font:800 18px Assistant,Arial,sans-serif;cursor:pointer;color:#151413}' +
    '.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.a11y-grid button{min-height:52px;border:1px solid #CBD5E1;background:#F8FAFC;border-radius:6px;font:700 14px Assistant,Arial,sans-serif;cursor:pointer;color:#151413;padding:8px}' +
    '.a11y-grid button[aria-pressed="true"]{background:#1D4ED8;border-color:#1D4ED8;color:#fff}' +
    '.a11y-panel button:focus-visible{outline:3px solid #F59E0B;outline-offset:2px}' +
    '.a11y-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;font-size:14px}' +
    '.a11y-foot a{color:#1D4ED8;font-weight:700}' +
    '.a11y-foot button{background:none;border:0;color:#B91C1C;font:700 14px Assistant,Arial,sans-serif;cursor:pointer;text-decoration:underline}' +
    /* effects: applied to page regions, not to fixed buttons, so they stay in place */
    
    'html.a11y-big nav.main{display:none!important}html.a11y-big .menu-btn{display:block!important}html.a11y-big nav.main.open{display:flex!important;position:absolute;inset:100% 0 auto 0;flex-direction:column;background:var(--paper,#fff);padding:6px 20px 14px;white-space:normal}html.a11y-big .hdr-cta,html.a11y-big .hdr-phone{white-space:normal}' +
    'html.a11y-contrast :is(main,header.site,footer,.thanks){filter:contrast(1.45)}' +
    'html.a11y-gray :is(main,header.site,footer,.thanks){filter:grayscale(1)}' +
    'html.a11y-contrast.a11y-gray :is(main,header.site,footer,.thanks){filter:grayscale(1) contrast(1.45)}' +
    'html.a11y-links a{text-decoration:underline!important;text-underline-offset:3px;outline:2px dashed #1D4ED8;outline-offset:2px}' +
    'html.a11y-font *:not(svg):not(svg *){font-family:Arial,Helvetica,sans-serif!important;letter-spacing:.01em!important}' +
    'html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var main = document.querySelector("main");
  if (main && !main.id) main.id = "main";
  var skip = document.createElement("a");
  skip.className = "a11y-skip"; skip.href = "#" + (main ? main.id : "top"); skip.textContent = "דלג לתוכן הראשי";
  document.body.insertBefore(skip, document.body.firstChild);

  var btn = document.createElement("button");
  btn.className = "a11y-btn"; btn.type = "button";
  btn.setAttribute("aria-label", "תפריט נגישות"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "a11yPanel");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 8.5c0 .6-.4 1-1 1.1l-3.9.6V13l1.9 6.7a1 1 0 0 1-1.9.6L12.4 15h-.8l-1.7 5.3a1 1 0 0 1-1.9-.6L10 13v-2.8l-3.9-.6a1 1 0 0 1 .3-2l4.3.6h2.6l4.3-.6c.7-.1 1.3.4 1.4.9Z"/></svg>';
  var panel = document.createElement("div");
  panel.className = "a11y-panel"; panel.id = "a11yPanel"; panel.hidden = true;
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "הגדרות נגישות"); panel.setAttribute("dir", "rtl"); panel.setAttribute("lang", "he");
  var opts = [["contrast", "ניגודיות גבוהה"], ["gray", "גווני אפור"], ["links", "הדגשת קישורים"], ["font", "גופן קריא"], ["still", "עצירת אנימציות"]];
  panel.innerHTML = '<h2>הגדרות נגישות<button type="button" aria-label="סגירת תפריט הנגישות" data-a="close">×</button></h2>' +
    '<div class="a11y-size"><span>גודל טקסט</span><button type="button" data-a="minus" aria-label="הקטנת טקסט">א-</button><button type="button" data-a="plus" aria-label="הגדלת טקסט">א+</button></div>' +
    '<div class="a11y-grid">' + opts.map(function (o) { return '<button type="button" data-t="' + o[0] + '" aria-pressed="false">' + o[1] + '</button>'; }).join("") + '</div>' +
    '<div class="a11y-foot"><a href="' + statement + '">הצהרת נגישות</a><button type="button" data-a="reset">איפוס הגדרות</button></div>';
  document.body.appendChild(btn); document.body.appendChild(panel);

  /* text size: scale each element's own font size so the layout reflows instead of overflowing */
  var FACT = [1, 1.12, 1.25, 1.4], textEls = null;
  function scaleText(f) {
    if (!textEls) {
      textEls = Array.prototype.filter.call(document.querySelectorAll("main *, header.site *, footer *, .thanks *"), function (el) { return !(el instanceof SVGElement); });
      textEls.forEach(function (el) { el.dataset.a11yFs = parseFloat(getComputedStyle(el).fontSize) || 16; });
    }
    textEls.forEach(function (el) { el.style.fontSize = f === 1 ? "" : (el.dataset.a11yFs * f).toFixed(1) + "px"; });
  }
  function apply() {
    var h = document.documentElement;
    if (state.size > 0 || textEls) scaleText(FACT[state.size]);
    h.classList.toggle("a11y-big", state.size > 0);
    opts.forEach(function (o) { h.classList.toggle("a11y-" + o[0], !!state[o[0]]); var b = panel.querySelector('[data-t="' + o[0] + '"]'); if (b) b.setAttribute("aria-pressed", String(!!state[o[0]])); });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function toggle(open) { panel.hidden = !open; btn.setAttribute("aria-expanded", String(open)); if (open) panel.querySelector("button").focus(); else btn.focus(); }
  btn.addEventListener("click", function () { toggle(panel.hidden); });
  panel.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (t.dataset.t) { state[t.dataset.t] = !state[t.dataset.t]; apply(); return; }
    var a = t.dataset.a;
    if (a === "close") toggle(false);
    if (a === "plus") { state.size = Math.min(3, state.size + 1); apply(); }
    if (a === "minus") { state.size = Math.max(0, state.size - 1); apply(); }
    if (a === "reset") { state = { size: 0, contrast: false, gray: false, links: false, font: false, still: false }; apply(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) toggle(false); });
  apply();
})();
