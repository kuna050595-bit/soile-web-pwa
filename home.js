/* Сөйле — «Занятия дома»: 40 техник для родителей (АФК, ABA, логопед, сенсорика).
   Данные — techniques.js (window.SOILE_TECH). Центр на Сөйле Pro может назначить техники ребёнку —
   pro-link.js кладёт их в localStorage «soile_center_tech» и шлёт событие «soile-center-tech». */
(function () {
  var TECH = window.SOILE_TECH || [];
  if (!TECH.length) return;
  var BY = {}; TECH.forEach(function (x) { BY[x.id] = x; });
  var DIRS = [
    { id: "afk", kk: "АФК", ru: "АФК", kkf: "Бейімделген дене шынықтыру", ruf: "Адаптивная физкультура", c: "#D97706" },
    { id: "aba", kk: "ABA", ru: "ABA", kkf: "ABA-терапия", ruf: "ABA-терапия", c: "#2563EB" },
    { id: "logo", kk: "Логопед", ru: "Логопед", kkf: "Логопедия", ruf: "Логопедия", c: "#7C3AED" },
    { id: "sens", kk: "Сенсорика", ru: "Сенсорика", kkf: "Сенсорлық интеграция", ruf: "Сенсорная интеграция", c: "#DB2777" },
  ];
  var DIR = {}; DIRS.forEach(function (d) { DIR[d.id] = d; });

  function ls(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* */ } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function appLang() { var b = document.getElementById("lang-ru"); return b && b.getAttribute("aria-pressed") === "true" ? "ru" : "kk"; }
  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function assigned() { return ls("soile_center_tech", []).filter(function (id) { return BY[id]; }); }
  function doneLog() { return ls("soile_tech_done", {}); }

  var S = { open: false, lang: "kk", tab: "all", id: null };
  function L(kk, ru) { return S.lang === "kk" ? kk : ru; }

  var css =
    "#hm-open{display:flex;align-items:center;gap:12px;width:calc(100% - 24px);margin:6px 12px 4px;padding:12px 16px;border:0;border-radius:18px;cursor:pointer;background:linear-gradient(135deg,#12A07F,#0D7466);color:#fff;font:800 16px var(--font-ui,system-ui);text-align:left;box-shadow:0 8px 20px -12px #0D7466}" +
    "#hm-open .ic{width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:22px;flex:none}" +
    "#hm-open small{display:block;font-weight:700;font-size:12px;opacity:.88;margin-top:2px}" +
    "#hm-open .bd{margin-left:auto;background:#fff;color:#0D7466;border-radius:999px;padding:3px 9px;font-size:12px;font-weight:900}" +
    "#hm{position:fixed;inset:0;z-index:61;background:var(--bg,#F6F8F7);overflow:auto;display:flex;flex-direction:column}#hm[hidden]{display:none}" +
    ".hm-top{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--surface,#fff);border-bottom:1px solid var(--line,#eee)}" +
    ".hm-top h2{flex:1;margin:0;font:900 18px var(--font-ui,system-ui);color:var(--ink,#222)}" +
    ".hm-x{width:42px;height:42px;border-radius:12px;border:0;background:var(--surface-2,#f3f3f3);font-size:20px;cursor:pointer;color:var(--ink,#222)}" +
    ".hm-lang{display:flex;background:var(--surface-2,#f3f3f3);border-radius:12px;padding:3px}.hm-lang button{border:0;background:transparent;border-radius:9px;padding:8px 11px;font:900 13px var(--font-ui,system-ui);color:var(--ink-dim,#777);cursor:pointer}.hm-lang button.on{background:var(--surface,#fff);color:var(--ink,#222)}" +
    ".hm-body{padding:14px;max-width:900px;width:100%;margin:0 auto;box-sizing:border-box;flex:1}" +
    ".hm-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px}.hm-tabs button{flex:none;border:0;border-radius:999px;padding:9px 14px;background:var(--surface,#fff);font:800 14px var(--font-ui,system-ui);color:var(--ink,#222);cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.06)}.hm-tabs button.on{background:var(--ink,#222);color:var(--surface,#fff)}" +
    ".hm-sec{font:900 13px var(--font-ui,system-ui);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-dim,#777);margin:8px 2px 10px}" +
    ".hm-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}" +
    ".hm-item{display:flex;gap:12px;align-items:flex-start;text-align:left;border:0;border-radius:18px;background:var(--surface,#fff);padding:14px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.06);font-family:var(--font-ui,system-ui);color:var(--ink,#222)}" +
    ".hm-item.as{box-shadow:0 0 0 2px #12A07F}" +
    ".hm-emo{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:24px;flex:none}" +
    ".hm-item b{display:block;font-weight:900;font-size:15.5px;line-height:1.25}.hm-item span.g{display:block;font-size:13px;color:var(--ink-dim,#777);margin-top:3px;line-height:1.35}" +
    ".hm-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.hm-chip{font:800 11.5px var(--font-ui,system-ui);padding:2px 8px;border-radius:999px;background:var(--surface-2,#f3f3f3);color:var(--ink-dim,#666)}" +
    ".hm-dot{color:#fff}" +
    ".hm-card{background:var(--surface,#fff);border-radius:22px;padding:18px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:12px;color:var(--ink,#222);font-family:var(--font-ui,system-ui)}" +
    ".hm-hero{display:flex;gap:14px;align-items:center}.hm-hero .hm-emo{width:64px;height:64px;font-size:32px}.hm-hero h3{margin:0;font:900 21px/1.2 var(--font-ui,system-ui)}" +
    ".hm-steps{margin:6px 0 0;padding:0;list-style:none;counter-reset:s}.hm-steps li{counter-increment:s;position:relative;padding:10px 0 10px 44px;border-top:1px solid var(--line,#eee);font-size:15.5px;line-height:1.5}.hm-steps li:first-child{border-top:0}" +
    ".hm-steps li::before{content:counter(s);position:absolute;left:0;top:8px;width:30px;height:30px;border-radius:50%;background:#E3F4EF;color:#0D7466;display:grid;place-items:center;font-weight:900}" +
    ".hm-box{border-radius:16px;padding:12px 14px;font-size:14.5px;line-height:1.5;margin-top:10px}.hm-box.tip{background:#E3F4EF;color:#0B5E53}.hm-box.care{background:#FEF3E6;color:#8A3A05}" +
    ".hm-lbl{font:900 12px var(--font-ui,system-ui);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-dim,#777);margin:14px 0 4px}" +
    ".hm-done{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:0;border-radius:16px;padding:16px;font:900 17px var(--font-ui,system-ui);background:#12A07F;color:#fff;cursor:pointer;margin-top:4px}.hm-done[disabled]{background:var(--surface-2,#eee);color:var(--ink-dim,#777);cursor:default}" +
    ".hm-back{border:0;background:transparent;font:800 15px var(--font-ui,system-ui);color:var(--ink-dim,#666);padding:6px 2px 12px;cursor:pointer}" +
    ".hm-note{font-size:12.5px;color:var(--ink-dim,#888);line-height:1.5;margin:14px 2px 24px}" +
    ".hm-psec .hm-list{grid-template-columns:1fr}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function dirName(d, full) { var x = DIR[d]; return x ? (full ? L(x.kkf, x.ruf) : L(x.kk, x.ru)) : ""; }
  function emo(x) { var c = (DIR[x.dir] || {}).c || "#888"; return '<span class="hm-emo" style="background:' + c + '1f">' + esc(x.emoji || "•") + "</span>"; }
  function item(x, as) {
    var T = x[S.lang], c = (DIR[x.dir] || {}).c;
    return '<button type="button" class="hm-item' + (as ? " as" : "") + '" data-hm="open" data-v="' + x.id + '">' + emo(x) +
      "<span><b>" + esc(T.t) + '</b><span class="g">' + esc(T.goal) + '</span><span class="hm-meta"><span class="hm-chip hm-dot" style="background:' + c + '">' + esc(dirName(x.dir)) + "</span>" +
      '<span class="hm-chip">' + esc(x.age) + "</span>" + (x.min ? '<span class="hm-chip">' + x.min + " " + L("мин", "мин") + "</span>" : "") +
      (as ? '<span class="hm-chip" style="background:#E3F4EF;color:#0B5E53">' + L("Орталықтан", "От центра") + "</span>" : "") + "</span></span></button>";
  }
  function listHtml() {
    var as = assigned(), h = "";
    h += '<div class="hm-tabs">' + [["all", L("Барлығы", "Все")]].concat(as.length ? [["center", L("Орталық ұсынды", "Задал центр") + " · " + as.length]] : []).concat(DIRS.map(function (d) { return [d.id, L(d.kk, d.ru)]; }))
      .map(function (t) { return '<button type="button" data-hm="tab" data-v="' + t[0] + '" class="' + (S.tab === t[0] ? "on" : "") + '">' + esc(t[1]) + "</button>"; }).join("") + "</div>";
    if (S.tab === "all" && as.length) {
      h += '<div class="hm-sec">🏫 ' + L("Маман ұсынған", "Рекомендовал специалист") + '</div><div class="hm-list">' + as.map(function (id) { return item(BY[id], true); }).join("") + "</div>";
    }
    var list = S.tab === "center" ? as.map(function (id) { return BY[id]; }) : TECH.filter(function (x) { return S.tab === "all" || x.dir === S.tab; });
    if (S.tab === "all") {
      DIRS.forEach(function (d) {
        h += '<div class="hm-sec" style="margin-top:18px">' + esc(L(d.kkf, d.ruf)) + '</div><div class="hm-list">' + TECH.filter(function (x) { return x.dir === d.id; }).map(function (x) { return item(x, as.indexOf(x.id) >= 0); }).join("") + "</div>";
      });
    } else {
      h += '<div class="hm-list">' + list.map(function (x) { return item(x, as.indexOf(x.id) >= 0); }).join("") + "</div>";
    }
    h += '<p class="hm-note">' + L("Бұл жаттығулар — ата-аналарға арналған жалпы ұсыныстар, маман сабағын алмастырмайды. Бала ауырса, шаршаса немесе қарсылық білдірсе — тоқтаңыз. Күмәніңіз болса, маманмен ақылдасыңыз.",
      "Эти занятия — общие рекомендации для родителей и не заменяют работу специалиста. Если ребёнку больно, он устал или протестует — остановитесь. Сомневаетесь — посоветуйтесь со специалистом.") + "</p>";
    return h;
  }
  function detailHtml() {
    var x = BY[S.id]; if (!x) return listHtml();
    var T = x[S.lang], log = doneLog()[x.id] || [], doneToday = log.indexOf(today()) >= 0, c = (DIR[x.dir] || {}).c;
    return '<button type="button" class="hm-back" data-hm="back">← ' + L("Барлық жаттығулар", "Все занятия") + "</button>" +
      '<div class="hm-card"><div class="hm-hero">' + emo(x) + "<div><h3>" + esc(T.t) + '</h3><div class="hm-meta"><span class="hm-chip hm-dot" style="background:' + c + '">' + esc(dirName(x.dir, true)) + '</span><span class="hm-chip">' + esc(x.age) + "</span>" + (x.min ? '<span class="hm-chip">' + x.min + " мин</span>" : "") + "</div></div></div>" +
      '<div class="hm-lbl">' + L("Мақсаты", "Зачем") + "</div><div>" + esc(T.goal) + "</div>" +
      '<div class="hm-lbl">' + L("Не керек", "Что нужно") + "</div><div>" + esc(T.need) + "</div></div>" +
      '<div class="hm-card"><div class="hm-lbl" style="margin-top:0">' + L("Қалай жасаймыз", "Как делать") + '</div><ol class="hm-steps">' + T.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
      '<div class="hm-box tip">💡 ' + esc(T.tip) + "</div>" + (T.care ? '<div class="hm-box care">⚠️ ' + esc(T.care) + "</div>" : "") + "</div>" +
      '<button type="button" class="hm-done" data-hm="done"' + (doneToday ? " disabled" : "") + ">" + (doneToday ? "✓ " + L("Бүгін жасалды", "Сегодня сделали") : "✓ " + L("Жасадық!", "Сделали!")) + "</button>" +
      (log.length ? '<p class="hm-note" style="text-align:center;margin-top:10px">' + L("Барлығы", "Всего") + ": " + log.length + " " + L("рет", "раз") + "</p>" : "") +
      '<p class="hm-note">' + L("Маман сабағын алмастырмайды. Бала қарсылық білдірсе — тоқтаңыз.", "Не заменяет занятия со специалистом. Если ребёнок протестует — остановитесь.") + "</p>";
  }
  function render() {
    var root = document.getElementById("hm"); if (!root) return;
    root.querySelector(".hm-body").innerHTML = S.id ? detailHtml() : listHtml();
    root.querySelector(".hm-top h2").textContent = L("Үйде жаттығу", "Занятия дома");
    root.querySelectorAll(".hm-lang button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-l") === S.lang); });
  }
  function openHM(id) {
    S.lang = appLang(); S.id = id || null; if (!S.open) { S.tab = assigned().length ? "all" : "all"; }
    S.open = true; document.getElementById("hm").hidden = false; document.body.style.overflow = "hidden"; render();
    try { history.pushState({ soileHM: 1 }, ""); } catch (e) { /* */ }
  }
  function closeHM(fromPop) {
    if (!S.open) return; S.open = false;
    document.getElementById("hm").hidden = true; document.body.style.overflow = "";
    if (fromPop !== true) { try { if (history.state && history.state.soileHM) history.back(); } catch (e) { /* */ } }
  }
  window.addEventListener("popstate", function () { if (S.open) { if (S.id) { S.id = null; render(); try { history.pushState({ soileHM: 1 }, ""); } catch (e) { /* */ } } else closeHM(true); } });

  // секция в режиме родителя
  function parentSection() {
    var sec = document.getElementById("home-tech-section");
    if (!sec) {
      var parent = document.querySelector("#view-parent .parent-view"); if (!parent) return;
      sec = document.createElement("div"); sec.className = "p-section hm-psec"; sec.id = "home-tech-section";
      var after = document.getElementById("center-section");
      if (after && after.nextSibling) parent.insertBefore(sec, after.nextSibling); else parent.appendChild(sec);
    }
    S.lang = appLang();
    var as = assigned();
    sec.innerHTML = "<h3>🏠 " + L("Үйде жаттығу", "Занятия дома") + "</h3>" +
      '<p class="key-note">' + L("АФК, ABA, логопед және сенсорика бойынша 40 қарапайым жаттығу — үйде балаңызбен 5–10 минут.", "40 простых упражнений по АФК, ABA, логопедии и сенсорике — 5–10 минут дома с ребёнком.") + "</p>" +
      (as.length ? '<div class="hm-sec" style="margin-top:12px">🏫 ' + L("Маман ұсынған", "Рекомендовал специалист") + '</div><div class="hm-list">' + as.map(function (id) { return item(BY[id], true); }).join("") + "</div>" : "") +
      '<div style="margin-top:12px"><button type="button" class="btn accent" data-hm="open-all">' + L("Барлық жаттығуларды ашу", "Открыть все занятия") + " (" + TECH.length + ")</button></div>";
  }
  function label() {
    var btn = document.getElementById("hm-open"); if (!btn) return;
    var kk = appLang() === "kk", n = assigned().length;
    btn.innerHTML = '<span class="ic">🏠</span><span>' + (kk ? "Үйде жаттығу" : "Занятия дома") + "<small>" + (kk ? "Ата-аналарға 40 жаттығу" : "40 упражнений для родителей") + "</small></span>" + (n ? '<span class="bd">' + n + "</span>" : "");
  }
  function refresh() { label(); parentSection(); if (S.open) render(); }

  function mount() {
    var view = document.getElementById("view-child"); if (!view || document.getElementById("hm-open")) return;
    var btn = document.createElement("button"); btn.type = "button"; btn.id = "hm-open";
    var sb = document.getElementById("sb-open");
    if (sb && sb.parentNode === view) view.insertBefore(btn, sb.nextSibling); else view.insertBefore(btn, view.firstChild);
    var ov = document.createElement("div"); ov.id = "hm"; ov.hidden = true;
    ov.innerHTML = '<div class="hm-top"><button type="button" class="hm-x" data-hm="close" aria-label="Закрыть">✕</button><h2></h2><div class="hm-lang"><button type="button" data-hm="lang" data-l="kk">ҚАЗ</button><button type="button" data-hm="lang" data-l="ru">РУС</button></div></div><div class="hm-body"></div>';
    document.body.appendChild(ov);
    btn.addEventListener("click", function () { openHM(); });
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-hm]"); if (!b) return;
      var a = b.getAttribute("data-hm"), v = b.getAttribute("data-v");
      if (a === "open-all") return openHM();
      if (!document.getElementById("hm").contains(b)) { if (a === "open") openHM(v); return; }
      if (a === "close") return closeHM();
      if (a === "lang") { S.lang = b.getAttribute("data-l"); }
      else if (a === "tab") { S.tab = v; }
      else if (a === "open") { S.id = v; }
      else if (a === "back") { S.id = null; }
      else if (a === "done") { var log = doneLog(); var arr = log[S.id] || []; if (arr.indexOf(today()) < 0) arr.push(today()); log[S.id] = arr.slice(-60); lsSet("soile_tech_done", log); }
      render(); var ovl = document.getElementById("hm"); if (a !== "done") ovl.scrollTop = 0;
    });
    ["lang-kk", "lang-ru"].forEach(function (id) { var b = document.getElementById(id); if (b) b.addEventListener("click", function () { setTimeout(refresh, 0); }); });
    window.addEventListener("soile-center-tech", refresh);
    refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  window.SoileHome = { open: openHM, refresh: refresh };
})();
