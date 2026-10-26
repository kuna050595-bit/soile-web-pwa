/* Сөйле Pro — core: client, state, utils, icons, auth, shell, router */
const SUPABASE_URL = "https://vfkwljhjuukakghcqymn.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZuBpenQhdW5ntDMMKpP3EQ_gMAlWxLg";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "soile-pro-auth" },
});
const DIRS = ["afk", "aba", "logo", "sens"];
const DIR_COLORS = { afk: "var(--afk)", aba: "var(--aba)", logo: "var(--logo)", sens: "var(--sens)" };

const LS = {
  get(k, d) { try { const v = localStorage.getItem("sp_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("sp_" + k, JSON.stringify(v)); } catch { /* private mode */ } },
};

const S = {
  lang: LS.get("lang", "ru"), theme: LS.get("theme", "auto"),
  user: null, members: [], me: null, org: null, branches: [], staff: [],
  inviteToken: null, navSeq: 0, kids: null, plan: null, view: null,
};
/* поддержка и тарифы (цены — ₸ в месяц) */
const SUPPORT_PHONE = "77077760327";
const PLANS = [
  { id: "start", price: 15000, kids: 15, branches: 1 },
  { id: "center", price: 29000, kids: 40, branches: 1, popular: true },
  { id: "network", price: 49000, kids: null, branches: null },
];
const fmtMoney = (n) => Math.round(n).toLocaleString("ru-RU").replace(/\u00a0/g, " ");

/* ---------- utils ---------- */
function t(k, vars) {
  let s = (I18N[S.lang] || I18N.ru)[k];
  if (s == null) s = I18N.ru[k] != null ? I18N.ru[k] : k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.split("{" + a + "}").join(b);
  return s;
}
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const isManager = () => S.me && (S.me.role === "owner" || S.me.role === "admin");
const locale = () => (S.lang === "kk" ? "kk-KZ" : "ru-RU");
function initials(name) { const p = String(name || "?").trim().split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w)); return (((p[0] || "?")[0]) + (p[1] ? p[1][0] : "")).toUpperCase(); }
function childName(c) { return c ? c.first_name + (c.last_initial ? " " + c.last_initial + "." : "") : ""; }
function ageOf(by) { return by ? new Date().getFullYear() - by : null; }
function todayISO() { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
function daysSince(iso) { if (!iso) return null; const a = new Date(todayISO() + "T00:00:00"); const b = new Date(String(iso).slice(0, 10) + "T00:00:00"); return Math.round((a - b) / 864e5); }
function relDay(iso) {
  const d = daysSince(iso); if (d == null) return t("never");
  if (d <= 0) return t("today"); if (d === 1) return t("yesterday"); return t("days_ago", { n: d });
}
function fmtDate(iso, opts) { if (!iso) return ""; return new Date(String(iso).slice(0, 10) + "T00:00:00").toLocaleDateString(locale(), opts || { day: "numeric", month: "short" }); }
function weekStarts(n) {
  const d = new Date(todayISO() + "T00:00:00"); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow);
  const out = []; for (let i = n - 1; i >= 0; i--) { const x = new Date(d); x.setDate(d.getDate() - 7 * i); out.push(x.toISOString().slice(0, 10)); }
  return out;
}
function weekOf(iso) { const d = new Date(String(iso).slice(0, 10) + "T00:00:00"); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
function phoneDigits(p) { const d = String(p || "").replace(/\D/g, ""); if (d.length === 11 && d[0] === "8") return "7" + d.slice(1); return d; }
function waLink(text, phone) { const p = phoneDigits(phone); return "https://wa.me/" + (p.length >= 10 ? p : "") + "?text=" + encodeURIComponent(text); }
function appUrl(q) { return location.origin + location.pathname + (q ? "?" + q : ""); }
function deltaTag(d) {
  if (d == null || isNaN(d)) return "";
  const cls = d > 2 ? "up" : d < -2 ? "down" : "flat"; const sign = d > 0 ? "+" : "";
  return `<span class="delta ${cls}">${cls === "up" ? ic("up", 12) : cls === "down" ? ic("down", 12) : ""}${sign}${d}</span>`;
}
function meter(p, color) {
  if (p == null) return `<span class="faint small">${t("no_data")}</span>`;
  return `<div class="meter"><div class="bar"><i style="width:${Math.max(2, Math.min(100, p))}%;${color ? "background:" + color : ""}"></i></div><span class="pct">${p}%</span></div>`;
}
function dirTag(d, full) { return `<span class="tag ${d}"><span class="dot"></span>${esc(t((full ? "dirf_" : "dir_") + d))}</span>`; }
function roleName(r) { return t("role_" + r); }
function branchName(id) { const b = S.branches.find((x) => x.id === id); return b ? b.name : ""; }
function staffName(id) { const m = S.staff.find((x) => x.id === id); return m ? m.full_name : ""; }
function errMsg(e) {
  console.error(e);
  const m = String((e && (e.message || e.details)) || e || "");
  if (m.includes("plan_expired")) return t("err_plan_expired");
  if (m.includes("plan_limit_children")) return t("err_plan_children");
  if (m.includes("plan_limit_branches")) return t("err_plan_branches");
  return t("err");
}

/* ---------- icons ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  kids: '<circle cx="9" cy="7" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 14.6c2.6-.3 4.7 1.2 5.5 4.4"/>',
  report: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  team: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5"/>',
  branch: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-5h6v5"/><path d="M9 11h.01M15 11h.01"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  down_chev: '<path d="m6 9 6 6 6-6"/>',
  sparkle: '<path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  transfer: '<path d="M7 17 3 13l4-4"/><path d="M3 13h13"/><path d="m17 7 4 4-4 4"/><path d="M21 11H8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.3-4 4.3-6 8-6s6.7 2 8 6"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6.5 15h4"/>',
  key: '<circle cx="7.5" cy="15.5" r="4"/><path d="m10.5 12.5 9-9M16 7l3 3M14 9l2 2"/>',
};
function ic(name, size) { return `<svg viewBox="0 0 24 24" ${size ? `width="${size}" height="${size}"` : ""} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`; }
const LOGO_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M43 22.5A14 14 0 1 0 43 41.5" fill="none" stroke="white" stroke-width="6.5" stroke-linecap="round"/><circle cx="47.5" cy="32" r="3.6" fill="white"/></svg>';
function brand() { return `<div class="brand"><div class="brand-mark">${LOGO_SVG}</div><div class="brand-name">Сөйле<span class="pro">Pro</span></div></div>`; }

/* ---------- toast / modal ---------- */
function toast(msg, err) {
  const el = document.createElement("div"); el.className = "toast" + (err ? " err" : ""); el.textContent = msg;
  $("#toast-root").appendChild(el); setTimeout(() => el.remove(), 3200);
}
let modalOnClose = null;
function openModal(html, opts = {}) {
  const root = $("#modal-root");
  root.innerHTML = `<div class="modal-bg" data-modal-bg><div class="modal ${opts.wide ? "wide" : ""}" role="dialog" aria-modal="true">${html}</div></div>`;
  modalOnClose = opts.onClose || null;
  document.body.style.overflow = "hidden";
  const first = root.querySelector("input:not([type=hidden]), textarea, select");
  if (first && !opts.noFocus && window.innerWidth > 640) setTimeout(() => first.focus(), 30);
  return root.querySelector(".modal");
}
function closeModal() {
  $("#modal-root").innerHTML = ""; document.body.style.overflow = "";
  const f = modalOnClose; modalOnClose = null; if (f) f();
}
function modalHead(title, sub) {
  return `<div class="modal-head"><div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}</div><button class="btn ghost icon sm" data-act="close-modal" aria-label="${esc(t("close"))}">${ic("x")}</button></div>`;
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#modal-root").innerHTML) closeModal(); });
async function copyText(s) {
  try { await navigator.clipboard.writeText(s); toast(t("copied")); }
  catch { const ta = document.createElement("textarea"); ta.value = s; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast(t("copied")); } catch { /* ignore */ } ta.remove(); }
}

/* ---------- theme / lang ---------- */
function applyTheme() {
  const r = document.documentElement;
  if (S.theme === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", S.theme);
  r.lang = S.lang === "kk" ? "kk" : "ru";
}
function setLang(l) { S.lang = l; LS.set("lang", l); applyTheme(); rerender(); }
function langSwitch() {
  return `<div class="seg" role="group" aria-label="Язык / Тіл"><button class="${S.lang === "kk" ? "on" : ""}" data-act="lang" data-v="kk">Қаз</button><button class="${S.lang === "ru" ? "on" : ""}" data-act="lang" data-v="ru">Рус</button></div>`;
}

/* ---------- action delegation ---------- */
const ACT = {};
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-modal-bg]")) { closeModal(); return; }
  const el = e.target.closest("[data-act]"); if (!el) return;
  const fn = ACT[el.dataset.act]; if (!fn) return;
  e.preventDefault(); fn(el, e);
});
const FORMS = {};
document.addEventListener("submit", (e) => {
  const f = e.target.closest("form[data-form]"); if (!f) return;
  e.preventDefault(); const fn = FORMS[f.dataset.form]; if (fn) fn(f, new FormData(f));
});
ACT["close-modal"] = () => closeModal();
ACT["lang"] = (el) => setLang(el.dataset.v);
ACT["go"] = (el) => { location.hash = el.dataset.href; };
async function busy(btn, fn) {
  if (!btn) return fn();
  const old = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spinner sm"></span>';
  try { return await fn(); } finally { if (btn.isConnected) { btn.disabled = false; btn.innerHTML = old; } }
}

/* ---------- auth ---------- */
let authTab = "login";
function authForm(ctx) {
  const reg = authTab === "register";
  return `
  <div class="seg" style="margin-bottom:18px;width:100%;display:grid;grid-template-columns:1fr 1fr">
    <button class="${!reg ? "on" : ""}" data-act="auth-tab" data-v="login">${t("tab_login")}</button>
    <button class="${reg ? "on" : ""}" data-act="auth-tab" data-v="register">${t("tab_register")}</button>
  </div>
  <form data-form="${reg ? "register" : "login"}" data-ctx="${ctx || ""}" class="form-grid" novalidate>
    ${reg ? `<div class="field"><label for="f-name">${t("full_name")}</label><input class="input" id="f-name" name="full_name" autocomplete="name" required></div>` : ""}
    <div class="field"><label for="f-email">${t("email")}</label><input class="input" id="f-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="f-pass">${t("password")}</label><input class="input" id="f-pass" name="password" type="password" autocomplete="${reg ? "new-password" : "current-password"}" required minlength="${reg ? 8 : 1}">${reg ? `<span class="hint">${t("pass_hint")}</span>` : ""}</div>
    ${reg ? `<label class="check terms"><input type="checkbox" name="terms" required><span>${t("reg_terms")}</span></label>` : `<div class="forgot-row"><a href="#" data-act="forgot">${t("forgot")}</a></div>`}
    <div class="error-text hidden" data-err></div>
    <button class="btn primary lg block" type="submit">${reg ? t("register_btn") : t("login_btn")}</button>
  </form>`;
}
function renderAuth() {
  document.title = "Сөйле Pro"; S.view = "auth";
  $("#app").innerHTML = `
  <div class="auth">
    <aside class="auth-side">
      ${brand()}
      <div class="auth-hero">
        <h1>${t("hero_title")}</h1>
        <p>${t("hero_text")}</p>
        <div class="feat">
          <div>${ic("target")}<span>${t("feat1")}</span></div>
          <div>${ic("sparkle")}<span>${t("feat2")}</span></div>
          <div>${ic("report")}<span>${t("feat3")}</span></div>
          <div>${ic("branch")}<span>${t("feat4")}</span></div>
        </div>
      </div>
      <div class="auth-foot">${ic("shield", 14)} ${t("hero_foot")}</div>
      <div class="lang-switch hide-d">${langSwitch()}</div>
    </aside>
    <main class="auth-main">
      <div class="auth-top"><a href="#" class="back-link" data-act="to-landing">${ic("left", 16)}${t("back_home")}</a><div class="lang-switch hide-m">${langSwitch()}</div></div>
      <div class="auth-box">
        <h2>${t("auth_title")}</h2>
        <p class="sub">${t("auth_sub")}</p>
        ${authForm()}
        <div class="divider">${t("or_demo")}</div>
        <div class="demo-btns">
          <button class="demo-btn" data-act="demo" data-role="owner"><span class="ic">${ic("branch")}</span><span><b>${t("demo_owner")}</b><span>${t("demo_owner_sub")}</span></span></button>
          <button class="demo-btn" data-act="demo" data-role="specialist"><span class="ic">${ic("kids")}</span><span><b>${t("demo_spec")}</b><span>${t("demo_spec_sub")}</span></span></button>
        </div>
        ${legalLinks()}
      </div>
    </main>
  </div>`;
}
ACT["auth-tab"] = (el) => { authTab = el.dataset.v; const box = el.closest(".auth-box, .center-card"); const wrap = box && box.querySelector("[data-auth-wrap]"); if (wrap) { wrap.innerHTML = authForm(wrap.dataset.ctx); } else rerender(); };
function showFormErr(f, msg) { const e = f.querySelector("[data-err]"); if (e) { e.textContent = msg; e.classList.remove("hidden"); } }
FORMS.login = async (f, fd) => {
  const btn = f.querySelector("[type=submit]");
  await busy(btn, async () => {
    const { error } = await sb.auth.signInWithPassword({ email: String(fd.get("email")).trim(), password: String(fd.get("password")) });
    if (error) return showFormErr(f, t("err_login"));
    await onSignedIn();
  });
};
FORMS.register = async (f, fd) => {
  const btn = f.querySelector("[type=submit]");
  const email = String(fd.get("email") || "").trim(), password = String(fd.get("password") || ""), full_name = String(fd.get("full_name") || "").trim();
  if (full_name.length < 2) return showFormErr(f, t("err_name"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return showFormErr(f, t("err_email"));
  if (password.length < 8) return showFormErr(f, t("err_weak"));
  if (!fd.get("terms")) return showFormErr(f, t("err_terms"));
  await busy(btn, async () => {
    const { data, error } = await sb.functions.invoke("pub", { body: { action: "register", email, password, full_name, terms: true } });
    if (error) {
      let code = ""; try { code = (await error.context.json()).error; } catch { /* ignore */ }
      return showFormErr(f, code === "exists" ? t("err_exists") : code === "weak_password" ? t("err_weak") : code === "bad_email" ? t("err_email") : code === "terms_required" ? t("err_terms") : t("err"));
    }
    if (!data || !data.ok) return showFormErr(f, t("err"));
    const r = await sb.auth.signInWithPassword({ email, password });
    if (r.error) return showFormErr(f, t("err"));
    await onSignedIn();
  });
};
ACT["demo"] = async (el) => {
  await busy(el, async () => {
    try {
      const { data, error } = await sb.functions.invoke("pub", { body: { action: "demo", role: el.dataset.role } });
      if (error || !data || !data.token_hash) throw error || new Error("demo");
      let r = await sb.auth.verifyOtp({ token_hash: data.token_hash, type: "magiclink" });
      if (r.error) r = await sb.auth.verifyOtp({ token_hash: data.token_hash, type: "email" });
      if (r.error) throw r.error;
      LS.set("org", null);
      await onSignedIn();
    } catch (e) { toast(errMsg(e), true); }
  });
};
async function onSignedIn() {
  const { data } = await sb.auth.getUser(); S.user = data.user || null;
  if (S.user) LS.set("known", true);
  await afterAuth();
}
ACT["logout"] = async () => {
  await sb.auth.signOut(); S.user = null; S.members = []; S.org = null; S.me = null; S.kids = null;
  LS.set("org", null); closeModal(); location.hash = ""; S.view = "auth"; renderAuth();
};

/* ---------- invite ---------- */
async function renderInvite() {
  $("#app").innerHTML = `<div class="center-screen"><div class="spinner"></div></div>`;
  const { data: info } = await sb.rpc("invite_info", { p_token: S.inviteToken });
  const bad = !info ? t("inv_notfound") : info.accepted ? t("inv_used") : "";
  $("#app").innerHTML = `
  <div class="center-screen"><div class="center-card">
    <div class="row" style="justify-content:space-between;margin-bottom:22px">${brand()}${langSwitch()}</div>
    <div class="card card-pad">
      <h2>${t("inv_title")}</h2>
      ${bad ? `<div class="alert" style="margin-top:14px">${ic("alert")}<div>${esc(bad)}</div></div>
        <div class="row" style="margin-top:16px"><button class="btn" data-act="inv-skip">${t("back")}</button></div>` : `
      <p class="muted" style="margin-top:6px">${esc(t("inv_text", { org: info.org, role: roleName(info.role).toLowerCase() }))}${info.branch ? "<br>" + esc(t("inv_branch", { b: info.branch })) : ""}</p>
      ${S.user ? `
        <form data-form="accept-invite" class="form-grid" style="margin-top:18px">
          <div class="field"><label>${t("your_name")}</label><input class="input" name="full_name" value="${esc(info.full_name || (S.user.user_metadata && S.user.user_metadata.full_name) || "")}" required></div>
          <div class="error-text hidden" data-err></div>
          <button class="btn primary lg block">${t("inv_accept")}</button>
        </form>` : `
        <div class="alert info" style="margin:16px 0">${ic("info")}<div>${t("inv_login_first")}</div></div>
        <div class="auth-box" style="max-width:none"><div data-auth-wrap data-ctx="invite">${authForm("invite")}</div></div>`}
      `}
    </div>
  </div></div>`;
}
FORMS["accept-invite"] = async (f, fd) => {
  await busy(f.querySelector("button"), async () => {
    const { data, error } = await sb.rpc("accept_invite", { p_token: S.inviteToken, p_full_name: String(fd.get("full_name") || "") });
    if (error) return showFormErr(f, error.message.includes("invite_used") ? t("inv_used") : t("err"));
    S.inviteToken = null; history.replaceState(null, "", location.pathname + "#/overview");
    LS.set("org", data); await afterAuth();
  });
};
ACT["inv-skip"] = () => { S.inviteToken = null; history.replaceState(null, "", location.pathname); afterAuth(); };

/* ---------- onboarding ---------- */
function renderOnboarding() {
  const name = (S.user && S.user.user_metadata && S.user.user_metadata.full_name) || "";
  $("#app").innerHTML = `
  <div class="center-screen"><div class="center-card">
    <div class="row" style="justify-content:space-between;margin-bottom:22px">${brand()}<div class="row">${langSwitch()}<button class="btn ghost sm" data-act="logout">${ic("logout")}</button></div></div>
    <div class="card card-pad">
      <h2>${t("onb_title")}</h2>
      <p class="muted" style="margin:6px 0 20px">${t("onb_sub")}</p>
      <form data-form="create-org" class="form-grid">
        <div class="field"><label>${t("org_name")}</label><input class="input" name="name" required minlength="2" maxlength="120"></div>
        <div class="form-row">
          <div class="field"><label>${t("city")}</label><input class="input" name="city" maxlength="60"></div>
          <div class="field"><label>${t("branch_name")}</label><input class="input" name="branch" placeholder="${esc(t("branch_ph"))}" maxlength="80"></div>
        </div>
        <div class="field"><label>${t("your_name")}</label><input class="input" name="full_name" value="${esc(name)}" required></div>
        <div class="field"><span class="label">${t("directions")}</span>
          <div class="chips-select">${DIRS.map((d) => `<label class="chip-toggle"><input type="checkbox" name="dirs" value="${d}" checked>${esc(t("dirf_" + d))}</label>`).join("")}</div>
        </div>
        <div class="error-text hidden" data-err></div>
        <button class="btn primary lg block">${t("create_center")}</button>
      </form>
      <p class="hint" style="margin-top:16px">${t("onb_invite")}</p>
    </div>
  </div></div>`;
}
FORMS["create-org"] = async (f, fd) => {
  await busy(f.querySelector("button"), async () => {
    const { data, error } = await sb.rpc("create_org", {
      p_name: String(fd.get("name") || ""), p_city: String(fd.get("city") || ""), p_directions: fd.getAll("dirs"),
      p_branch_name: String(fd.get("branch") || ""), p_full_name: String(fd.get("full_name") || ""),
    });
    if (error) return showFormErr(f, t("err"));
    LS.set("org", data); closeModal(); location.hash = "#/overview"; await afterAuth();
  });
};

/* ---------- session / org loading ---------- */
async function loadMemberships() {
  const { data, error } = await sb.from("members")
    .select("id, org_id, role, branch_id, full_name, specialty, orgs(id, name, city, description, phone, directions, listed, is_demo)")
    .eq("user_id", S.user.id);
  if (error) throw error;
  S.members = (data || []).filter((m) => m.orgs);
}
async function selectOrg(orgId) {
  const m = S.members.find((x) => x.org_id === orgId) || S.members[0];
  S.me = m; S.org = m.orgs; S.kids = null; LS.set("org", m.org_id);
  const [b, st] = await Promise.all([
    sb.from("branches").select("id, name, city, address, created_at").eq("org_id", m.org_id).order("created_at"),
    sb.from("members").select("id, user_id, role, branch_id, full_name, specialty, created_at").eq("org_id", m.org_id).order("created_at"),
  ]);
  S.branches = b.data || []; S.staff = st.data || [];
  await loadPlan();
}
async function loadPlan() {
  const { data, error } = await sb.rpc("org_plan", { p_org: S.org.id });
  S.plan = error ? null : data;
}
async function afterAuth() {
  if (!S.user) return authOrLanding();
  if (S.inviteToken) return renderInvite();
  try {
    await loadMemberships();
    if (!S.members.length) return renderOnboarding();
    await selectOrg(LS.get("org"));
    route();
  } catch (e) { $("#app").innerHTML = `<div class="center-screen"><div class="center-card card card-pad"><p>${esc(errMsg(e))}</p><div class="row" style="margin-top:14px"><button class="btn" data-act="reload">↻</button><button class="btn ghost" data-act="logout">${t("logout")}</button></div></div></div>`; }
}
ACT["reload"] = () => location.reload();
async function getKids(force) {
  if (S.kids && !force) return S.kids;
  const { data, error } = await sb.rpc("children_list", { p_org: S.org.id });
  if (error) throw error;
  S.kids = data || []; return S.kids;
}

/* ---------- shell ---------- */
function navItems() {
  const m = isManager();
  const work = [
    { href: "#/overview", key: "nav_overview", icon: "home" },
    { href: "#/children", key: "nav_children", icon: "kids" },
    { href: "#/reports", key: "nav_reports", icon: "report" },
  ];
  const net = [
    ...(m ? [{ href: "#/branches", key: "nav_branches", icon: "branch" }, { href: "#/team", key: "nav_team", icon: "team" }] : []),
    { href: "#/catalog", key: "nav_catalog", icon: "globe" },
    ...(m ? [{ href: "#/billing", key: "nav_billing", icon: "card" }] : []),
    { href: "#/settings", key: "nav_settings", icon: "settings" },
  ];
  return { work, net };
}
function renderShell(active) {
  const { work, net } = navItems();
  const link = (i) => `<a href="${i.href}" class="${active === i.href.slice(2) ? "active" : ""}">${ic(i.icon)}<span>${t(i.key)}</span></a>`;
  const me = S.me; const multi = S.members.length > 1;
  $("#app").innerHTML = `
  ${S.org.is_demo ? `<div class="demo-bar"><span>${t("demo_bar")}</span><a href="#" data-act="logout">${t("demo_exit")}</a></div>` : ""}
  <div class="shell">
    <aside class="sidebar">
      ${brand()}
      <button class="org-switch" data-act="org-menu" title="${esc(t("switch_org"))}">
        <span class="org-avatar">${esc(initials(S.org.name))}</span>
        <span class="t"><b>${esc(S.org.name)}</b><span>${esc(roleName(me.role))}${me.branch_id ? " · " + esc(branchName(me.branch_id)) : ""}</span></span>
        ${multi ? ic("down_chev", 16) : ""}
      </button>
      <nav class="nav" aria-label="Menu">
        <div class="nav-sec">${t("nav_work")}</div>${work.map(link).join("")}
        <div class="nav-sec">${t("nav_network")}</div>${net.map(link).join("")}
      </nav>
      <div class="sidebar-foot">
        <span class="avatar">${esc(initials(me.full_name || S.user.email))}</span>
        <span class="t"><b>${esc(me.full_name || S.user.email)}</b><span>${esc(me.specialty || roleName(me.role))}</span></span>
        <button class="btn ghost icon sm" data-act="logout" title="${esc(t("logout"))}" aria-label="${esc(t("logout"))}">${ic("logout")}</button>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        ${brand()}<span class="spacer"></span>
        <button class="org-switch" style="margin:0;width:auto;max-width:55vw;padding:6px 10px" data-act="org-menu">
          <span class="t"><b>${esc(S.org.name)}</b></span></button>
      </header>
      ${planBanner()}
      <main class="page" id="page"><div class="boot" style="min-height:50vh"><div class="spinner"></div></div></main>
    </div>
  </div>
  <nav class="bottom-nav" aria-label="Menu">
    <a href="#/overview" class="${active === "overview" ? "active" : ""}">${ic("home")}<span>${t("nav_overview")}</span></a>
    <a href="#/children" class="${active === "children" || active === "child" ? "active" : ""}">${ic("kids")}<span>${t("nav_children")}</span></a>
    <a href="#" class="fab" data-act="log-session"><span class="c">${ic("plus")}</span><span>${t("nav_session")}</span></a>
    <a href="#/reports" class="${active === "reports" ? "active" : ""}">${ic("report")}<span>${t("nav_reports")}</span></a>
    <a href="#/more" class="${["more", "team", "branches", "catalog", "settings", "billing"].includes(active) ? "active" : ""}">${ic("menu")}<span>${t("nav_more")}</span></a>
  </nav>`;
}
function planBanner() {
  const p = S.plan; if (!p || p.is_demo) return "";
  let cls = "", msg = "";
  if (p.expired) { cls = p.writable ? "warn" : "danger"; msg = p.writable ? t("bn_grace") : t("bn_expired"); }
  else if (p.plan === "trial" && p.days_left <= 10) { cls = "info"; msg = t("bn_trial", { n: p.days_left }); }
  else if (p.plan !== "trial" && p.days_left <= 5) { cls = "warn"; msg = t("bn_ends", { n: p.days_left }); }
  if (!msg) return "";
  const btn = isManager() ? `<a class="btn sm ${cls === "info" ? "" : "primary"}" href="#/billing">${p.plan === "trial" ? t("bn_btn_choose") : t("bn_btn")}</a>` : "";
  return `<div class="plan-banner ${cls}">${ic(cls === "info" ? "clock" : "alert", 16)}<span>${esc(msg)}</span>${btn}</div>`;
}
ACT["org-menu"] = () => {
  openModal(`${modalHead(t("switch_org"))}
    <div class="list" style="padding:8px 0">
      ${S.members.map((m) => `<div class="list-item click" data-act="switch-org" data-id="${m.org_id}">
        <span class="org-avatar">${esc(initials(m.orgs.name))}</span>
        <span class="t"><b>${esc(m.orgs.name)}</b><span>${esc(roleName(m.role))}${m.orgs.city ? " · " + esc(m.orgs.city) : ""}</span></span>
        ${m.org_id === S.org.id ? `<span class="tag accent">${ic("check", 12)}</span>` : ""}</div>`).join("")}
    </div>
    <div class="modal-foot"><button class="btn" data-act="new-org">${ic("plus")}${t("new_org")}</button><span class="spacer"></span><button class="btn ghost" data-act="logout">${ic("logout")}${t("logout")}</button></div>`);
};
ACT["switch-org"] = async (el) => { closeModal(); await selectOrg(el.dataset.id); location.hash = "#/overview"; route(); };
ACT["new-org"] = () => { closeModal(); renderOnboarding(); };

/* ---------- router ---------- */
const PAGES = {};
function parseHash() {
  const h = location.hash.replace(/^#\/?/, ""); const parts = h.split("/").filter(Boolean);
  return { name: parts[0] || "overview", args: parts.slice(1) };
}
async function route() {
  if (!S.user || !S.org) return;
  const { name, args } = parseHash();
  const page = PAGES[name] ? name : "overview";
  if ((page === "team" || page === "branches") && !isManager()) { location.hash = "#/overview"; return; }
  renderShell(page);
  const seq = ++S.navSeq;
  const el = $("#page");
  try { await PAGES[page](el, args, () => seq === S.navSeq); }
  catch (e) { if (seq === S.navSeq) el.innerHTML = `<div class="card empty"><div class="ico">${ic("alert")}</div><b>${esc(errMsg(e))}</b><button class="btn sm" style="margin-top:10px" data-act="reload">↻</button></div>`; }
  window.scrollTo(0, 0);
}
function rerender() {
  const params = new URLSearchParams(location.search);
  if (params.get("p")) return renderParent(params.get("p"));
  if (S.recovery) return renderNewPassword();
  if (!S.user) return authOrLanding();
  if (S.inviteToken) return renderInvite();
  if (!S.org) return renderOnboarding();
  route();
}
function authOrLanding() {
  const v = S.view || (LS.get("known", false) ? "auth" : "landing");
  return v === "landing" && typeof renderLanding === "function" ? renderLanding() : renderAuth();
}
ACT["to-landing"] = () => { S.view = "landing"; history.replaceState(null, "", location.pathname); rerender(); window.scrollTo(0, 0); };
ACT["to-auth"] = (el) => { S.view = "auth"; authTab = el.dataset.tab || "login"; renderAuth(); window.scrollTo(0, 0); };
function legalLinks() {
  const q = S.lang === "kk" ? "?lang=kk" : "";
  return `<div class="legal-links"><a href="legal/offer.html${q}" target="_blank" rel="noopener">${t("lg_offer")}</a><a href="legal/privacy.html${q}" target="_blank" rel="noopener">${t("lg_privacy")}</a><a href="legal/consent.html${q}" target="_blank" rel="noopener">${t("lg_consent")}</a></div>`;
}

/* ---------- восстановление пароля ---------- */
ACT["forgot"] = (el) => {
  const box = el.closest("form"); const em = box ? (box.querySelector("[name=email]") || {}).value || "" : "";
  openModal(`${modalHead(t("fp_title"), t("fp_sub"))}
    <form data-form="forgot"><div class="modal-body form-grid">
      <div class="field"><label>${t("email")}</label><input class="input" name="email" type="email" autocomplete="email" required value="${esc(em)}"></div>
      <div class="error-text hidden" data-err></div>
      <div class="alert info hidden" data-ok>${ic("info")}<div>${t("fp_sent")}</div></div>
      <p class="hint">${t("fp_staff")}</p>
      <a class="small" target="_blank" rel="noopener" data-wa href="${esc(waLink(t("fp_wa", { email: em || "—" }), SUPPORT_PHONE))}">${ic("chat", 14)} ${t("fp_help")}</a>
    </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("close")}</button><button class="btn primary">${t("fp_send")}</button></div></form>`);
};
FORMS.forgot = async (f, fd) => {
  const email = String(fd.get("email") || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return showFormErr(f, t("err_email"));
  const wa = f.querySelector("[data-wa]"); if (wa) wa.href = waLink(t("fp_wa", { email }), SUPPORT_PHONE);
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + "?reset=1" });
    if (error && !/rate|seconds/i.test(error.message || "")) console.warn(error);
    f.querySelector("[data-err]").classList.add("hidden");
    f.querySelector("[data-ok]").classList.remove("hidden");
  });
};
async function consumeRecoveryLink() {
  // ссылка из письма: …/pro/?reset=1#access_token=…&refresh_token=…&type=recovery
  const h = new URLSearchParams(location.hash.replace(/^#/, ""));
  const q = new URLSearchParams(location.search);
  if (h.get("type") === "recovery" && h.get("access_token")) {
    const { data, error } = await sb.auth.setSession({ access_token: h.get("access_token"), refresh_token: h.get("refresh_token") || "" });
    history.replaceState(null, "", location.pathname);
    if (error) { S.recovery = "bad"; return true; }
    S.user = data.user || (data.session && data.session.user) || null; S.recovery = "ok"; return true;
  }
  if (q.get("reset") && (h.get("error") || h.get("error_code"))) { history.replaceState(null, "", location.pathname); S.recovery = "bad"; return true; }
  if (q.get("reset") && q.get("code")) {
    const { data, error } = await sb.auth.exchangeCodeForSession(q.get("code"));
    history.replaceState(null, "", location.pathname);
    if (error) { S.recovery = "bad"; return true; }
    S.user = data.user || (data.session && data.session.user) || null; S.recovery = "ok"; return true;
  }
  if (q.get("reset")) history.replaceState(null, "", location.pathname);
  return false;
}
function newPasswordForm(inModal) {
  return `<form data-form="new-pass" data-modal="${inModal ? 1 : ""}" class="form-grid">
      <div class="field"><label>${t("np_label")}</label><input class="input" name="p1" type="password" autocomplete="new-password" minlength="8" required><span class="hint">${t("pass_hint")}</span></div>
      <div class="field"><label>${t("np_label2")}</label><input class="input" name="p2" type="password" autocomplete="new-password" minlength="8" required></div>
      <div class="error-text hidden" data-err></div>
      <button class="btn primary lg block">${t("np_save")}</button>
    </form>`;
}
function renderNewPassword() {
  const bad = S.recovery === "bad";
  $("#app").innerHTML = `
  <div class="center-screen"><div class="center-card">
    <div class="row" style="justify-content:space-between;margin-bottom:22px">${brand()}${langSwitch()}</div>
    <div class="card card-pad">
      <h2>${t("np_title")}</h2>
      ${bad ? `<div class="alert" style="margin-top:14px">${ic("alert")}<div>${t("np_bad_link")}</div></div>
        <div class="row" style="margin-top:16px"><button class="btn primary" data-act="np-cancel">${t("login_btn")}</button></div>`
      : `<p class="muted" style="margin:6px 0 18px">${esc(t("np_sub", { email: (S.user && S.user.email) || "" }))}</p>${newPasswordForm(false)}`}
    </div>
  </div></div>`;
}
ACT["np-cancel"] = () => { S.recovery = null; S.view = "auth"; authTab = "login"; rerender(); };
ACT["change-pass"] = () => openModal(`${modalHead(t("st_change_pass"))}<div class="modal-body">${newPasswordForm(true)}</div>`);
FORMS["new-pass"] = async (f, fd) => {
  const p1 = String(fd.get("p1") || ""), p2 = String(fd.get("p2") || "");
  if (p1.length < 8) return showFormErr(f, t("err_weak"));
  if (p1 !== p2) return showFormErr(f, t("np_mismatch"));
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.auth.updateUser({ password: p1 });
    if (error) return showFormErr(f, /different|same/i.test(error.message || "") ? t("np_mismatch") : /weak|short|least/i.test(error.message || "") ? t("err_weak") : t("err"));
    toast(t("np_done"));
    if (f.dataset.modal) return closeModal();
    S.recovery = null; await onSignedIn();
  });
};
window.addEventListener("hashchange", () => { if (S.user && S.org) route(); });

async function boot() {
  applyTheme();
  const params = new URLSearchParams(location.search);
  if (params.get("p")) return renderParent(params.get("p"));
  if (params.get("invite")) S.inviteToken = params.get("invite");
  if (params.has("login") || params.has("register")) { S.view = "auth"; authTab = params.has("register") ? "register" : "login"; }
  if (await consumeRecoveryLink()) { applyTheme(); return renderNewPassword(); }
  const { data } = await sb.auth.getSession();
  S.user = (data.session && data.session.user) || null;
  sb.auth.onAuthStateChange((ev, session) => {
    if (ev === "SIGNED_OUT") { S.user = null; S.org = null; }
    else if (session) S.user = session.user;
  });
  await afterAuth();
}
