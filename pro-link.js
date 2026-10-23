/* Сөйле ↔ Сөйле Pro: прогресс из центра прямо в приложении у родителя.
   Связка по коду (родитель получает код здесь и говорит центру) или по ссылке от центра (?p=...).
   В приложении хранится только случайный ключ устройства и токены ссылок — без данных ребёнка. */
(function () {
  var PRO_URL = "https://vfkwljhjuukakghcqymn.supabase.co/rest/v1/rpc/";
  var PRO_KEY = "sb_publishable_ZuBpenQhdW5ntDMMKpP3EQ_gMAlWxLg";
  var PRO_PAGE = "https://kuna050595-bit.github.io/soile-web-pwa/pro/?p=";
  var DIRS = { afk: ["АФК", "#D97706"], aba: ["ABA", "#2563EB"], logo: ["Логопед", "#7C3AED"], sens: ["Сенсорика", "#DB2777"] };

  function ls(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function deviceKey() {
    var k = ls("soile_pro_key", "");
    if (!k || k.length < 24) {
      var a = new Uint8Array(24); (window.crypto || window.msCrypto).getRandomValues(a);
      k = Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      lsSet("soile_pro_key", k);
    }
    return k;
  }
  function rpc(name, body) {
    return fetch(PRO_URL + name, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: PRO_KEY }, body: JSON.stringify(body),
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error((j && j.message) || "error"); return j; }); });
  }
  function tokenFrom(text) {
    var s = String(text || "").trim(); var m = s.match(/[?&]p=([a-f0-9]{20,})/i);
    if (m) return m[1].toLowerCase();
    if (/^[a-f0-9]{20,}$/i.test(s)) return s.toLowerCase();
    return null;
  }
  function fmtDate(iso, long) {
    if (!iso) return "";
    var d = new Date(String(iso).slice(0, 10) + "T00:00:00");
    return d.toLocaleDateString("ru-RU", long ? { day: "numeric", month: "long" } : { day: "numeric", month: "short", weekday: "short" });
  }
  function weekStarts(n) {
    var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    var out = []; for (var i = n - 1; i >= 0; i--) { var x = new Date(d); x.setDate(d.getDate() - 7 * i); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); out.push(x.toISOString().slice(0, 10)); }
    return out;
  }
  function spark(vals, color) {
    var W = 120, H = 34, P = 3, pts = [];
    vals.forEach(function (v, i) { if (v != null) pts.push([P + i * (W - 2 * P) / Math.max(1, vals.length - 1), H - P - v / 100 * (H - 2 * P)]); });
    if (!pts.length) return "";
    var d = "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L");
    var last = pts[pts.length - 1];
    return '<svg viewBox="0 0 ' + W + " " + H + '" class="spk"><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + last[0] + '" cy="' + last[1] + '" r="3" fill="' + color + '"/></svg>';
  }

  var css = ".cp-card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:14px;margin-top:10px}" +
    ".cp-head{display:flex;align-items:center;gap:10px}.cp-ava{width:40px;height:40px;border-radius:12px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex:none}" +
    ".cp-head b{display:block;font-size:16px;color:var(--ink)}.cp-head span{font-size:12px;color:var(--ink-dim)}" +
    ".cp-goal{display:grid;grid-template-columns:1fr 120px;gap:10px;align-items:center;padding:9px 0;border-top:1px solid var(--line)}" +
    ".cp-goal .t{font-size:13.5px;font-weight:700;color:var(--ink)}.cp-goal .m{font-size:12px;color:var(--ink-dim);margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}" +
    ".cp-dir{display:inline-block;font-size:11px;font-weight:800;padding:1px 7px;border-radius:6px;color:#fff}" +
    ".cp-pct{font-weight:800;color:var(--ink)}.cp-up{color:#079455;font-weight:800}.cp-dn{color:var(--danger);font-weight:800}" +
    ".spk{width:120px;height:34px;display:block}" +
    ".cp-rep{margin-top:10px;padding:12px;border-radius:12px;background:var(--surface-2);font-size:13.5px;line-height:1.55;white-space:pre-wrap;color:var(--ink)}" +
    ".cp-sec{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-dim);margin:12px 0 4px}" +
    ".cp-sess{font-size:13px;padding:6px 0;border-top:1px solid var(--line);color:var(--ink)}.cp-sess i{font-style:normal;color:var(--ink-dim);font-size:12px}" +
    ".cp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}" +
    ".cp-code{font-size:34px;font-weight:900;letter-spacing:.18em;text-align:center;padding:14px;border-radius:14px;background:var(--surface-2);color:var(--ink);margin-top:10px;user-select:all}" +
    ".cp-input{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:14px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var section = document.getElementById("center-section");
  if (!section) return;
  var state = { loading: false, children: [], code: null, codeExp: null, linkOpen: false, err: "" };

  function childCard(c) {
    var weeks = weekStarts(8);
    var goals = (c.goals || []).map(function (g) {
      var vals = weeks.map(function (w) { var p = (c.progress || []).filter(function (x) { return x.goal_id === g.id && String(x.week).slice(0, 10) === w; })[0]; return p ? p.pct : null; });
      var known = vals.filter(function (v) { return v != null; });
      var now = known.length ? known[known.length - 1] : null, first = known.length > 1 ? known[0] : null;
      var dir = DIRS[g.direction] || ["", "#888"], delta = now != null && first != null ? now - first : null;
      return '<div class="cp-goal"><div><div class="t">' + esc(g.title) + '</div><div class="m"><span class="cp-dir" style="background:' + dir[1] + '">' + esc(dir[0]) + "</span>" +
        (g.status === "achieved" ? "<span class=\"cp-up\">✓ достигнута</span>" : "") +
        (now != null ? '<span class="cp-pct">' + now + "%</span>" : "<span>пока нет данных</span>") +
        (delta != null && Math.abs(delta) > 2 ? '<span class="' + (delta > 0 ? "cp-up" : "cp-dn") + '">' + (delta > 0 ? "+" : "") + delta + "</span>" : "") +
        "</div></div><div>" + spark(vals, dir[1]) + "</div></div>";
    }).join("");
    var sess = (c.sessions || []).slice(0, 3).map(function (s) {
      var dir = DIRS[s.direction] || [""];
      return '<div class="cp-sess"><i>' + esc(fmtDate(s.date)) + " · " + esc(dir[0]) + "</i>" + (s.note ? "<br>" + esc(s.note) : "") + "</div>";
    }).join("");
    var key = c.pairing_id ? "pair:" + c.pairing_id : "tok:" + c.token;
    return '<div class="cp-card"><div class="cp-head"><div class="cp-ava">' + esc((c.first_name || "?")[0]) + "</div><div><b>" + esc(c.first_name) + "</b><span>Центр «" + esc(c.org || "") + "»" + (c.branch ? ", " + esc(c.branch) : "") + "</span></div></div>" +
      (c.home && (c.home.cards || []).length ? '<div class="cp-sec">Задание на дом · Үй тапсырмасы</div><div class="cp-rep" style="background:var(--surface-2)">' + (c.home.note ? esc(c.home.note) + "<br><br>" : "") + "<b>" + c.home.cards.length + " карточек</b> — у ребёнка во вкладке «Задание» / «Тапсырма».</div>" : "") +
      (c.report ? '<div class="cp-sec">Отчёт специалиста · ' + esc(fmtDate(c.report.sent_at, true)) + '</div><div class="cp-rep">' + esc(c.report.body) + "</div>" : "") +
      (goals ? '<div class="cp-sec">Цели и прогресс за 8 недель · Мақсаттар</div>' + goals : '<p class="key-note" style="margin-top:8px">Специалист ещё не добавил цели.</p>') +
      (sess ? '<div class="cp-sec">Последние занятия · Сабақтар</div>' + sess : "") +
      '<div class="cp-actions">' + (c.token ? '<a class="btn ghost" href="' + PRO_PAGE + esc(c.token) + '" target="_blank" rel="noopener" style="text-decoration:none">Подробнее</a>' : "") +
      (c.org_phone ? '<a class="btn ghost" href="tel:' + esc(c.org_phone) + '" style="text-decoration:none">Позвонить в центр</a>' : "") +
      '<button type="button" class="btn danger" data-cp-unlink="' + esc(key) + '">Отключить</button></div>' +
      '<p class="key-note" style="margin-top:6px">Процент — доля попыток, которые ребёнок сделал сам (с подсказкой считается за половину).</p></div>';
  }

  function render() {
    var h = "<h3>🏫 Центр развития · Даму орталығы</h3>";
    h += '<p class="key-note">Если ребёнок занимается в центре на Сөйле Pro — здесь видно цели, прогресс и отчёты специалистов. <span style="opacity:.8">Орталықтағы мақсаттар, прогресс пен маман есептері осында көрінеді.</span></p>';
    if (state.loading && !state.children.length) h += '<p class="key-note" style="margin-top:10px">Загружаем…</p>';
    h += state.children.map(childCard).join("");
    if (state.err) h += '<p class="key-note" style="color:var(--danger);margin-top:8px">' + esc(state.err) + "</p>";
    if (state.code) {
      h += '<div class="cp-card"><b style="color:var(--ink)">Код для центра · Орталыққа код</b><div class="cp-code">' + esc(state.code) + '</div><p class="key-note" style="margin-top:8px">Скажите этот код специалисту — он введёт его в карточке ребёнка в Сөйле Pro. Код действует до ' + esc(fmtDate(state.codeExp, true)) + '. После подключения прогресс появится здесь.</p><div class="cp-actions"><button type="button" class="btn ghost" data-cp="refresh">Проверить подключение</button><button type="button" class="btn ghost" data-cp="share">Отправить код</button></div></div>';
    }
    if (state.linkOpen) {
      h += '<div class="cp-card"><b style="color:var(--ink)">Ссылка от центра</b><p class="key-note" style="margin:6px 0 8px">Вставьте ссылку, которую центр прислал в WhatsApp.</p><input class="cp-input" id="cp-link-input" placeholder="https://…/pro/?p=…" autocomplete="off"><div class="cp-actions"><button type="button" class="btn accent" data-cp="add-link">Подключить</button><button type="button" class="btn ghost" data-cp="close-link">Отмена</button></div></div>';
    }
    h += '<div class="cp-actions">' + (!state.code ? '<button type="button" class="btn accent" data-cp="get-code">Получить код для центра</button>' : "") +
      (!state.linkOpen ? '<button type="button" class="btn ghost" data-cp="open-link">У меня ссылка от центра</button>' : "") + "</div>";
    section.innerHTML = h;
  }

  // Карточки «Задание» от центра → вкладка у ребёнка (index.html слушает событие soile-center-cards)
  function syncCenterCards(list) {
    var ids = [];
    list.forEach(function (c) { ((c.home && c.home.cards) || []).forEach(function (id) { if (ids.indexOf(id) === -1) ids.push(id); }); });
    if (JSON.stringify(ids) !== JSON.stringify(ls("soile_center_cards", []))) {
      lsSet("soile_center_cards", ids);
      try { window.dispatchEvent(new Event("soile-center-cards")); } catch (e) { /* old webview */ }
    }
  }

  function load() {
    state.loading = true; render();
    var tokens = ls("soile_pro_tokens", []);
    var jobs = [rpc("app_feed", { p_device_key: deviceKey() }).then(function (r) { return (r && r.children) || []; }).catch(function () { return null; })];
    tokens.forEach(function (tk) { jobs.push(rpc("parent_view", { p_token: tk }).then(function (d) { return d ? [Object.assign({ token: tk }, d)] : []; }).catch(function () { return []; })); });
    Promise.all(jobs).then(function (res) {
      state.loading = false;
      if (res[0] === null) { state.err = "Нет интернета — прогресс из центра обновится, когда появится связь."; }
      else state.err = "";
      var seen = {}, list = [];
      res.forEach(function (arr) { (arr || []).forEach(function (c) { var k = c.token || c.pairing_id; if (!seen[k]) { seen[k] = 1; list.push(c); } }); });
      if (list.length || res[0] !== null) state.children = list;
      if (list.some(function (c) { return c.pairing_id; })) state.code = null;
      lsSet("soile_pro_cache", state.children);
      if (res[0] !== null) syncCenterCards(list);
      render();
    });
  }

  section.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cp],[data-cp-unlink]"); if (!b) return;
    var a = b.getAttribute("data-cp");
    if (b.hasAttribute("data-cp-unlink")) {
      if (!confirm("Отключить центр? Прогресс перестанет показываться в приложении.")) return;
      var key = b.getAttribute("data-cp-unlink");
      if (key.indexOf("tok:") === 0) { lsSet("soile_pro_tokens", ls("soile_pro_tokens", []).filter(function (x) { return x !== key.slice(4); })); load(); }
      else rpc("app_unlink", { p_device_key: deviceKey(), p_pairing: key.slice(5) }).then(load, load);
      return;
    }
    if (a === "get-code") {
      b.disabled = true;
      rpc("app_pair_start", { p_device_key: deviceKey() }).then(function (r) { state.code = r.code; state.codeExp = r.expires_at; state.err = ""; render(); })
        .catch(function () { state.err = "Не получилось получить код — проверьте интернет."; render(); });
    } else if (a === "refresh") load();
    else if (a === "share") {
      var txt = "Код Сөйле для подключения к центру: " + state.code;
      if (navigator.share) navigator.share({ text: txt }).catch(function () {}); else window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
    } else if (a === "open-link") { state.linkOpen = true; render(); var i = document.getElementById("cp-link-input"); if (i) i.focus(); }
    else if (a === "close-link") { state.linkOpen = false; render(); }
    else if (a === "add-link") {
      var tk = tokenFrom((document.getElementById("cp-link-input") || {}).value);
      if (!tk) { state.err = "Не похоже на ссылку от центра. Скопируйте её из сообщения целиком."; render(); return; }
      rpc("parent_view", { p_token: tk }).then(function (d) {
        if (!d) { state.err = "Ссылка недействительна — попросите у центра новую."; render(); return; }
        var arr = ls("soile_pro_tokens", []); if (arr.indexOf(tk) === -1) arr.push(tk); lsSet("soile_pro_tokens", arr);
        state.linkOpen = false; state.err = ""; load();
      }).catch(function () { state.err = "Нет интернета — попробуйте ещё раз."; render(); });
    }
  });

  // Ссылка от центра, открытая прямо в приложении (?p=...), подключается сама
  var urlTok = tokenFrom(location.search);
  if (urlTok) { var arr0 = ls("soile_pro_tokens", []); if (arr0.indexOf(urlTok) === -1) { arr0.push(urlTok); lsSet("soile_pro_tokens", arr0); } }

  state.children = ls("soile_pro_cache", []);
  render();
  var view = document.getElementById("view-parent"), last = 0;
  function maybeLoad() { if (view && !view.hidden && Date.now() - last > 20000) { last = Date.now(); load(); } }
  if (view && window.MutationObserver) new MutationObserver(maybeLoad).observe(view, { attributes: true, attributeFilter: ["hidden"] });
  maybeLoad();
  // При запуске тихо обновляем задание от центра, даже если родитель не открывал раздел
  if (view && view.hidden && (ls("soile_pro_tokens", []).length || ls("soile_pro_key", ""))) { setTimeout(function () { last = Date.now(); load(); }, 1500); }
})();
