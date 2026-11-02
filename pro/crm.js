/* Сөйле Pro — CRM: расписание с посещаемостью, абонементы, оплаты, касса.
 * Таблицы: lessons, subscriptions, payments (+ rpc crm_balances). Списание занятий с абонемента делает триггер в БД:
 * «Был» и «Пропуск» списываются, «Уважительная причина» и «Отмена» — нет. Деньги видят только руководитель и админ. */

/* ---------- тексты ---------- */
Object.assign(I18N.ru, {
  nav_schedule: "Расписание", nav_cash: "Касса", tab_pay: "Абонемент",
  sc_title: "Расписание", sc_today: "Сегодня", sc_add: "Занятие", sc_all_staff: "Все специалисты", sc_empty_day: "Нет занятий",
  sc_week_empty: "На этой неделе занятий нет", sc_week_empty_sub: "Добавьте занятие — можно сразу на несколько недель вперёд.",
  ls_new: "Новое занятие", ls_edit: "Изменить занятие", ls_child: "Ребёнок", ls_staff: "Специалист", ls_date: "Дата", ls_time: "Время",
  ls_dur: "Длительность", ls_min: "мин", ls_dir: "Направление", ls_room: "Кабинет", ls_note: "Заметка", ls_repeat: "Повторять",
  ls_once: "Один раз", ls_weekly: "Каждую неделю", ls_days: "Дни недели", ls_weeks: "Сколько недель", ls_created: "Добавлено занятий: {n}",
  ls_conflict: "Пересечение по времени: {list}. Нажмите «Сохранить» ещё раз, если всё верно.", ls_pick_child: "Выберите ребёнка",
  ls_status: "Отметка", st_planned: "Запланировано", st_done: "Был", st_missed: "Пропуск", st_excused: "Уваж. причина", st_cancelled: "Отменено",
  st_hint: "«Был» и «Пропуск» списываются с абонемента, «Уважительная причина» и «Отмена» — нет.",
  ls_back_plan: "Вернуть в план", ls_journal: "Записать результаты", ls_delete: "Удалить", ls_delete_series: "Удалить и следующие в серии",
  ls_del_q: "Удалить это занятие?", ls_charged: "списано с абонемента", ls_not_charged: "абонемента нет — занятие не списано",
  ls_left: "Осталось занятий: {n}", ls_open_child: "Карточка ребёнка",
  dow: "Пн,Вт,Ср,Чт,Пт,Сб,Вс", sc_room_s: "каб.", sc_nosub: "нет абонемента",
  pay_left: "Осталось занятий", pay_next: "Следующее занятие", pay_debt: "Долг", pay_paid_all: "Оплачено", pay_none: "нет",
  sub_title: "Абонементы", sub_new: "Новый абонемент", sub_name: "Название", sub_name_ph: "Например: ABA, 8 занятий", sub_count: "Занятий",
  sub_price: "Стоимость, ₸", sub_from: "Начало", sub_to: "Действует до", sub_paid_now: "Оплачен сразу", sub_empty: "Абонементов пока нет",
  sub_used: "{used} из {total}", sub_expired: "истёк", sub_archive: "В архив", sub_restore: "Вернуть", sub_saved: "Абонемент добавлен",
  sub_only_mgr: "Абонементы и оплаты добавляет руководитель или администратор.",
  pm_title: "Оплаты", pm_new: "Принять оплату", pm_amount: "Сумма, ₸", pm_method: "Способ", pm_date: "Дата", pm_sub: "За абонемент",
  pm_saved: "Оплата сохранена", pm_empty: "Оплат пока нет", pm_del_q: "Удалить эту оплату?",
  m_cash: "Наличные", m_kaspi: "Kaspi", m_card: "Карта", m_transfer: "Перевод", m_other: "Другое",
  hist_title: "Занятия", hist_upcoming: "Ближайшие", hist_past: "Прошедшие", hist_empty: "Занятий в расписании пока нет", hist_book: "Записать на занятие",
  cs_title: "Касса", cs_month_in: "Поступило за месяц", cs_debtors: "Должники", cs_ending: "Заканчиваются абонементы", cs_att: "Посещаемость за месяц",
  cs_payments: "Оплаты за месяц", cs_no_debt: "Должников нет 🎉", cs_no_end: "Нет абонементов, которые скоро закончатся",
  cs_remind: "Напомнить", cs_left_n: "осталось {n}", cs_until: "до {d}", cs_total_debt: "на сумму {s} ₸",
  wa_debt: "Здравствуйте{p}! Напоминаем об оплате занятий ({c}) в «{o}»: {s} ₸. Спасибо!",
  wa_end: "Здравствуйте{p}! У {c} в «{o}» заканчивается абонемент (осталось занятий: {n}). Продлеваем?",
});
Object.assign(I18N.kk, {
  nav_schedule: "Кесте", nav_cash: "Касса", tab_pay: "Абонемент",
  sc_title: "Кесте", sc_today: "Бүгін", sc_add: "Сабақ", sc_all_staff: "Барлық мамандар", sc_empty_day: "Сабақ жоқ",
  sc_week_empty: "Бұл аптада сабақ жоқ", sc_week_empty_sub: "Сабақ қосыңыз — бірнеше аптаға алдын ала қоюға болады.",
  ls_new: "Жаңа сабақ", ls_edit: "Сабақты өзгерту", ls_child: "Бала", ls_staff: "Маман", ls_date: "Күні", ls_time: "Уақыты",
  ls_dur: "Ұзақтығы", ls_min: "мин", ls_dir: "Бағыт", ls_room: "Кабинет", ls_note: "Ескертпе", ls_repeat: "Қайталау",
  ls_once: "Бір рет", ls_weekly: "Әр апта сайын", ls_days: "Апта күндері", ls_weeks: "Неше апта", ls_created: "Қосылған сабақтар: {n}",
  ls_conflict: "Уақыт қайталанады: {list}. Бәрі дұрыс болса, «Сақтау» батырмасын қайта басыңыз.", ls_pick_child: "Баланы таңдаңыз",
  ls_status: "Белгі", st_planned: "Жоспарда", st_done: "Келді", st_missed: "Келмеді", st_excused: "Себепті", st_cancelled: "Болмады",
  st_hint: "«Келді» мен «Келмеді» абонементтен шегеріледі, «Себепті» мен «Болмады» — жоқ.",
  ls_back_plan: "Жоспарға қайтару", ls_journal: "Нәтижелерді жазу", ls_delete: "Жою", ls_delete_series: "Сериядағы келесілерін де жою",
  ls_del_q: "Бұл сабақты жою керек пе?", ls_charged: "абонементтен шегерілді", ls_not_charged: "абонемент жоқ — сабақ шегерілмеді",
  ls_left: "Қалған сабақ: {n}", ls_open_child: "Бала карточкасы",
  dow: "Дс,Сс,Ср,Бс,Жм,Сб,Жс", sc_room_s: "каб.", sc_nosub: "абонемент жоқ",
  pay_left: "Қалған сабақ", pay_next: "Келесі сабақ", pay_debt: "Қарыз", pay_paid_all: "Төленген", pay_none: "жоқ",
  sub_title: "Абонементтер", sub_new: "Жаңа абонемент", sub_name: "Атауы", sub_name_ph: "Мысалы: ABA, 8 сабақ", sub_count: "Сабақ саны",
  sub_price: "Бағасы, ₸", sub_from: "Басталуы", sub_to: "Мерзімі", sub_paid_now: "Бірден төленді", sub_empty: "Әзірге абонемент жоқ",
  sub_used: "{used} / {total}", sub_expired: "мерзімі өтті", sub_archive: "Мұрағатқа", sub_restore: "Қайтару", sub_saved: "Абонемент қосылды",
  sub_only_mgr: "Абонемент пен төлемді басшы не әкімші қосады.",
  pm_title: "Төлемдер", pm_new: "Төлем қабылдау", pm_amount: "Сомасы, ₸", pm_method: "Тәсілі", pm_date: "Күні", pm_sub: "Абонемент үшін",
  pm_saved: "Төлем сақталды", pm_empty: "Әзірге төлем жоқ", pm_del_q: "Бұл төлемді жою керек пе?",
  m_cash: "Қолма-қол", m_kaspi: "Kaspi", m_card: "Карта", m_transfer: "Аударым", m_other: "Басқа",
  hist_title: "Сабақтар", hist_upcoming: "Алдағы", hist_past: "Өткен", hist_empty: "Кестеде әзірге сабақ жоқ", hist_book: "Сабаққа жазу",
  cs_title: "Касса", cs_month_in: "Айдағы түсім", cs_debtors: "Қарыздарлар", cs_ending: "Аяқталып жатқан абонементтер", cs_att: "Айдағы қатысу",
  cs_payments: "Айдағы төлемдер", cs_no_debt: "Қарыздар жоқ 🎉", cs_no_end: "Жақында аяқталатын абонемент жоқ",
  cs_remind: "Еске салу", cs_left_n: "{n} қалды", cs_until: "{d} дейін", cs_total_debt: "жалпы {s} ₸",
  wa_debt: "Сәлеметсіз бе{p}! «{o}» орталығындағы сабақтар ({c}) үшін төлемді еске саламыз: {s} ₸. Рақмет!",
  wa_end: "Сәлеметсіз бе{p}! «{o}» орталығында {c} абонементі аяқталып келеді (қалған сабақ: {n}). Ұзартамыз ба?",
});
ICONS.wallet = '<path d="M3 7a2 2 0 0 1 2-2h12v4"/><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3"/><path d="M20 9H15a3 3 0 0 0 0 6h5a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/>';

/* ---------- утилиты ---------- */
const LS_STATUSES = ["planned", "done", "missed", "excused", "cancelled"];
const ST_TAG = { planned: "accent", done: "ok", missed: "danger", excused: "warn", cancelled: "" };
const PAY_METHODS = ["cash", "kaspi", "card", "transfer", "other"];
const CRM = { week: null, member: null, day: null };
function isoLocal(d) { const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10); }
function addDays(iso, n) { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return isoLocal(d); }
function hhmm(ts) { const d = new Date(ts); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
function endTime(ts, min) { return hhmm(new Date(new Date(ts).getTime() + min * 60000)); }
function dowNames() { return t("dow").split(","); }
function stTag(st) { return `<span class="tag ${ST_TAG[st] || ""}">${esc(t("st_" + st))}</span>`; }
function kidById(id) { return (S.kids || []).find((k) => k.id === id); }
function staffShort(id) { const n = staffName(id); if (!n) return ""; const p = n.trim().split(/\s+/); return p.length > 1 ? p[0] + " " + p[1][0] + "." : p[0]; }
function money(n) { return fmtMoney(n || 0) + " ₸"; }
async function balances() { const { data, error } = await sb.rpc("crm_balances", { p_org: S.org.id }); if (error) throw error; return Object.fromEntries((data || []).map((b) => [b.child_id, b])); }
function crmErr(e) {
  const m = String((e && (e.message || e.error_description)) || e || "");
  if (/row-level security|permission denied/i.test(m)) return t("sub_only_mgr");
  return errMsg(e);
}

/* ---------- расписание ---------- */
PAGES.schedule = async (el, args, alive) => {
  document.title = t("nav_schedule") + " · Сөйле Pro";
  if (args[0] && /^\d{4}-\d{2}-\d{2}$/.test(args[0])) CRM.week = weekOf(args[0]);
  if (!CRM.week) CRM.week = weekOf(todayISO());
  if (CRM.member == null) CRM.member = S.me.role === "specialist" ? S.me.id : "";
  const from = new Date(CRM.week + "T00:00:00"), to = new Date(addDays(CRM.week, 7) + "T00:00:00");
  const [kids, ls, bal] = await Promise.all([
    getKids(),
    sb.from("lessons").select("*").eq("org_id", S.org.id).gte("starts_at", from.toISOString()).lt("starts_at", to.toISOString()).order("starts_at"),
    balances().catch(() => ({})),
  ]);
  if (!alive()) return;
  if (ls.error) throw ls.error;
  CRM.lessons = ls.data || []; CRM.bal = bal;
  const days = [...Array(7)].map((_, i) => addDays(CRM.week, i));
  const range = fmtDate(days[0]) + " – " + fmtDate(days[6]);
  el.innerHTML = `
  ${pageHead(t("sc_title"), range, `
    <div class="row" style="gap:6px">
      <button class="btn icon" data-act="go" data-href="#/schedule/${addDays(CRM.week, -7)}" aria-label="‹">${ic("left")}</button>
      <button class="btn" data-act="go" data-href="#/schedule/${todayISO()}">${t("sc_today")}</button>
      <button class="btn icon" data-act="go" data-href="#/schedule/${addDays(CRM.week, 7)}" aria-label="›">${ic("right")}</button>
    </div>
    <button class="btn primary" data-act="lesson-new">${ic("plus")}${t("sc_add")}</button>`)}
  <div class="card" style="margin-bottom:16px"><div class="toolbar">
    <select class="input" id="sc-staff"><option value="">${t("sc_all_staff")}</option>${S.staff.map((m) => `<option value="${m.id}" ${CRM.member === m.id ? "selected" : ""}>${esc(m.full_name || roleName(m.role))}</option>`).join("")}</select>
  </div></div>
  <div id="sc-week"></div>`;
  $("#sc-staff").addEventListener("change", (e) => { CRM.member = e.target.value; drawWeek(days); });
  drawWeek(days);
};
function drawWeek(days) {
  const box = $("#sc-week"); if (!box) return;
  const list = CRM.lessons.filter((l) => !CRM.member || l.member_id === CRM.member);
  const names = dowNames(), today = todayISO();
  if (!list.length) {
    box.innerHTML = `<div class="card">${emptyState("calendar", t("sc_week_empty"), t("sc_week_empty_sub"), `<button class="btn primary" style="margin-top:14px" data-act="lesson-new">${ic("plus")}${t("sc_add")}</button>`)}</div>`;
    return;
  }
  box.innerHTML = `<div class="sc-week">${days.map((d, i) => {
    const items = list.filter((l) => isoLocal(l.starts_at) === d);
    return `<div class="sc-day ${d === today ? "today" : ""} ${items.length ? "" : "empty"}">
      <div class="sc-dh"><b>${names[i]}</b><span>${new Date(d + "T00:00:00").getDate()}</span><button class="btn ghost icon sm" data-act="lesson-new" data-date="${d}" aria-label="+">${ic("plus", 16)}</button></div>
      ${items.length ? items.map(lessonTile).join("") : `<div class="sc-none">${t("sc_empty_day")}</div>`}
    </div>`;
  }).join("")}</div>`;
}
function lessonTile(l) {
  const k = kidById(l.child_id); const b = CRM.bal && CRM.bal[l.child_id];
  const low = b && l.status === "planned" && b.lessons_left <= 1;
  const noSub = b && !b.lessons_total;
  return `<button class="sc-l st-${l.status}" data-act="lesson-open" data-id="${l.id}" style="--c:${l.direction ? DIR_COLORS[l.direction] : "var(--border-strong)"}">
    <span class="sc-t">${hhmm(l.starts_at)}–${endTime(l.starts_at, l.dur_min)}${l.room ? " · " + esc(t("sc_room_s")) + " " + esc(l.room) : ""}</span>
    <b>${esc(k ? childName(k) : "—")}</b>
    <span class="sc-m">${esc(staffShort(l.member_id))}${l.direction ? " · " + esc(t("dir_" + l.direction)) : ""}</span>
    <span class="sc-tags">${l.status !== "planned" ? stTag(l.status) : ""}${low ? `<span class="tag warn">${esc(noSub ? t("sc_nosub") : t("cs_left_n", { n: b.lessons_left }))}</span>` : ""}</span>
  </button>`;
}

/* --- карточка занятия: отметка посещаемости --- */
ACT["lesson-open"] = async (el) => {
  const l = (CRM.lessons || []).find((x) => x.id === el.dataset.id) || (CRM.childLessons || []).find((x) => x.id === el.dataset.id);
  if (!l) return;
  await getKids();
  const k = kidById(l.child_id); const b = CRM.bal ? CRM.bal[l.child_id] : null;
  const d = isoLocal(l.starts_at);
  openModal(`${modalHead(k ? childName(k) : "", `${dowNames()[(new Date(d + "T00:00:00").getDay() + 6) % 7]}, ${fmtDate(d, { day: "numeric", month: "long" })} · ${hhmm(l.starts_at)}–${endTime(l.starts_at, l.dur_min)}`)}
    <div class="modal-body">
      <div class="row wrap" style="gap:8px;margin-bottom:12px">
        ${l.member_id ? `<span class="tag">${ic("user", 12)}${esc(staffName(l.member_id))}</span>` : ""}
        ${l.direction ? dirTag(l.direction, true) : ""}${l.room ? `<span class="tag">${esc(t("ls_room"))}: ${esc(l.room)}</span>` : ""}
        ${b ? `<span class="tag ${b.lessons_left <= 1 ? "warn" : ""}">${esc(t("ls_left", { n: b.lessons_left }))}</span>` : ""}
      </div>
      ${l.note ? `<p class="small" style="margin-bottom:12px">${esc(l.note)}</p>` : ""}
      <div class="label small muted" style="margin-bottom:6px">${t("ls_status")}</div>
      <div class="sc-marks">${["done", "missed", "excused", "cancelled"].map((s) => `<button class="btn ${l.status === s ? "primary" : ""}" data-act="lesson-mark" data-id="${l.id}" data-st="${s}">${esc(t("st_" + s))}</button>`).join("")}</div>
      <p class="hint" style="margin-top:8px">${t("st_hint")}</p>
      ${["done", "missed"].includes(l.status) ? `<p class="small" style="margin-top:6px">${l.subscription_id ? "✓ " + t("ls_charged") : "⚠ " + t("ls_not_charged")}</p>` : ""}
      <div class="row wrap" style="gap:6px;margin-top:12px">
        ${l.status !== "planned" ? `<button class="btn ghost sm" data-act="lesson-mark" data-id="${l.id}" data-st="planned">${t("ls_back_plan")}</button>` : ""}
        <button class="btn ghost sm" data-act="close-modal-go" data-href="#/child/${l.child_id}/pay">${ic("user", 14)}${t("ls_open_child")}</button>
        <button class="btn ghost sm" data-act="lesson-del" data-id="${l.id}" style="color:var(--danger)">${ic("x", 14)}${t("ls_delete")}</button>
      </div>
    </div>
    <div class="modal-foot">
      <span class="spacer"></span>
      <button class="btn" data-act="lesson-edit" data-id="${l.id}">${ic("edit")}${t("edit")}</button>
      ${l.status === "done" ? `<button class="btn primary" data-act="lesson-journal" data-child="${l.child_id}">${ic("plus")}${t("ls_journal")}</button>` : ""}
    </div>`, { noFocus: true });
};
ACT["close-modal-go"] = (el) => { closeModal(); location.hash = el.dataset.href; };
ACT["lesson-journal"] = (el) => { closeModal(); openSessionModal(el.dataset.child); };
ACT["lesson-mark"] = async (el) => {
  await busy(el, async () => {
    const { data, error } = await sb.from("lessons").update({ status: el.dataset.st }).eq("id", el.dataset.id).select().single();
    if (error) return toast(crmErr(error), true);
    toast(t("st_" + data.status) + (["done", "missed"].includes(data.status) ? " · " + (data.subscription_id ? t("ls_charged") : t("ls_not_charged")) : ""), ["done", "missed"].includes(data.status) && !data.subscription_id);
    closeModal(); route();
    if (data.status === "done" && parseHash().name === "schedule") setTimeout(() => { const l = (CRM.lessons || []).find((x) => x.id === data.id); if (l) ACT["lesson-open"]({ dataset: { id: data.id } }); }, 350);
  });
};
ACT["lesson-del"] = async (el) => {
  const l = (CRM.lessons || []).concat(CRM.childLessons || []).find((x) => x.id === el.dataset.id); if (!l) return;
  if (!window.confirm(t("ls_del_q"))) return;
  let q = sb.from("lessons").delete();
  if (l.series_id && window.confirm(t("ls_delete_series") + "?")) q = q.eq("series_id", l.series_id).gte("starts_at", l.starts_at).eq("status", "planned");
  else q = q.eq("id", l.id);
  const { error } = await q; if (error) return toast(crmErr(error), true);
  closeModal(); route();
};

/* --- создание / изменение занятия --- */
ACT["lesson-new"] = (el) => lessonForm(null, { date: el.dataset.date, child: el.dataset.child });
ACT["lesson-edit"] = (el) => { const l = (CRM.lessons || []).concat(CRM.childLessons || []).find((x) => x.id === el.dataset.id); if (l) lessonForm(l); };
async function lessonForm(l, pre = {}) {
  const kids = (await getKids()).filter((k) => k.active);
  const childId = l ? l.child_id : pre.child || "";
  const k = kidById(childId);
  const memberId = l ? l.member_id : (S.me.role === "specialist" ? S.me.id : (CRM.member || S.me.id));
  const date = l ? isoLocal(l.starts_at) : (pre.date || todayISO());
  const time = l ? hhmm(l.starts_at) : "10:00";
  const dir = l ? l.direction : (k && (k.directions || [])[0]) || "";
  const dow = (new Date(date + "T00:00:00").getDay() + 6) % 7;
  openModal(`${modalHead(l ? t("ls_edit") : t("ls_new"))}
    <form data-form="lesson-save" data-id="${l ? l.id : ""}"><div class="modal-body form-grid">
      <div class="field"><label>${t("ls_child")}</label><select class="input" name="child_id" required ${l ? "disabled" : ""}>
        <option value="">${t("ls_pick_child")}</option>${kids.map((x) => `<option value="${x.id}" ${x.id === childId ? "selected" : ""}>${esc(childName(x))}</option>`).join("")}</select></div>
      <div class="form-row">
        <div class="field"><label>${t("ls_staff")}</label><select class="input" name="member_id">${S.staff.map((m) => `<option value="${m.id}" ${m.id === memberId ? "selected" : ""}>${esc(m.full_name || roleName(m.role))}</option>`).join("")}</select></div>
        <div class="field"><label>${t("ls_dir")}</label><select class="input" name="direction"><option value="">—</option>${DIRS.map((d) => `<option value="${d}" ${d === dir ? "selected" : ""}>${esc(t("dirf_" + d))}</option>`).join("")}</select></div>
      </div>
      <div class="form-row">
        <div class="field"><label>${t("ls_date")}</label><input class="input" type="date" name="date" value="${date}" required></div>
        <div class="field"><label>${t("ls_time")}</label><input class="input" type="time" name="time" value="${time}" step="300" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label>${t("ls_dur")}</label><select class="input" name="dur_min">${[30, 40, 45, 60, 90, 120].map((m) => `<option value="${m}" ${m === (l ? l.dur_min : 45) ? "selected" : ""}>${m} ${t("ls_min")}</option>`).join("")}</select></div>
        <div class="field"><label>${t("ls_room")} <span class="hint">${t("optional")}</span></label><input class="input" name="room" maxlength="40" value="${esc(l ? l.room || "" : "")}"></div>
      </div>
      ${l ? "" : `<div class="field"><span class="label">${t("ls_repeat")}</span>
        <div class="seg" id="ls-rep"><button type="button" class="on" data-v="0">${t("ls_once")}</button><button type="button" data-v="1">${t("ls_weekly")}</button></div>
        <input type="hidden" name="repeat" value="0">
        <div id="ls-rep-box" class="hidden" style="margin-top:10px">
          <div class="chips-select" style="margin-bottom:10px">${dowNames().map((n, i) => `<label class="chip-toggle"><input type="checkbox" name="dow" value="${i}" ${i === dow ? "checked" : ""}>${n}</label>`).join("")}</div>
          <div class="field" style="max-width:200px"><label>${t("ls_weeks")}</label><select class="input" name="weeks">${[2, 4, 6, 8, 12, 16, 26].map((n) => `<option value="${n}" ${n === 4 ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        </div></div>`}
      <div class="field"><label>${t("ls_note")} <span class="hint">${t("optional")}</span></label><input class="input" name="note" maxlength="300" value="${esc(l ? l.note || "" : "")}"></div>
      <div class="error-text hidden" data-err></div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${ic("check")}${t("save")}</button></div></form>`, { noFocus: !!l });
  const rep = $("#ls-rep");
  if (rep) rep.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", rep).forEach((x) => x.classList.toggle("on", x === b));
    $("[name=repeat]").value = b.dataset.v; $("#ls-rep-box").classList.toggle("hidden", b.dataset.v !== "1");
  });
  const cs = $("[name=child_id]");
  if (cs && !l) cs.addEventListener("change", () => { const x = kidById(cs.value); const ds = $("[name=direction]"); if (x && (x.directions || [])[0] && !ds.value) ds.value = x.directions[0]; });
}
FORMS["lesson-save"] = async (f, fd) => {
  const id = f.dataset.id;
  const old = id ? (CRM.lessons || []).concat(CRM.childLessons || []).find((x) => x.id === id) : null;
  const childId = old ? old.child_id : String(fd.get("child_id") || "");
  if (!childId) return showFormErr(f, t("ls_pick_child"));
  const k = kidById(childId);
  const base = {
    member_id: String(fd.get("member_id") || "") || null, direction: String(fd.get("direction") || "") || null,
    dur_min: +fd.get("dur_min") || 45, room: String(fd.get("room") || "").trim() || null, note: String(fd.get("note") || "").trim() || null,
  };
  const date = String(fd.get("date")), time = String(fd.get("time") || "10:00");
  let starts = [new Date(date + "T" + time)];
  if (!id && fd.get("repeat") === "1") {
    const dows = fd.getAll("dow").map(Number); const weeks = +fd.get("weeks") || 4;
    const wk = weekOf(date); starts = [];
    for (let w = 0; w < weeks; w++) dows.forEach((dw) => { const d = addDays(wk, w * 7 + dw); if (d >= date) starts.push(new Date(d + "T" + time)); });
    starts.sort((a, b) => a - b);
    if (!starts.length) return showFormErr(f, t("ls_days"));
  }
  // пересечения у специалиста
  if (base.member_id && f.dataset.force !== "1") {
    const min = starts[0], max = new Date(starts[starts.length - 1].getTime() + base.dur_min * 60000);
    const { data: busyL } = await sb.from("lessons").select("id, starts_at, dur_min, child_id").eq("org_id", S.org.id).eq("member_id", base.member_id)
      .neq("status", "cancelled").gte("starts_at", new Date(min.getTime() - 8 * 3600e3).toISOString()).lte("starts_at", max.toISOString());
    const clash = [];
    starts.forEach((s) => (busyL || []).forEach((b) => {
      if (b.id === id) return;
      const bs = new Date(b.starts_at).getTime(), be = bs + b.dur_min * 60000, ss = s.getTime(), se = ss + base.dur_min * 60000;
      if (ss < be && bs < se) clash.push(fmtDate(isoLocal(b.starts_at)) + " " + hhmm(b.starts_at));
    }));
    if (clash.length) { f.dataset.force = "1"; return showFormErr(f, t("ls_conflict", { list: [...new Set(clash)].slice(0, 4).join(", ") })); }
  }
  await busy(f.querySelector(".btn.primary"), async () => {
    let error, n = 1;
    if (id) ({ error } = await sb.from("lessons").update({ ...base, starts_at: starts[0].toISOString() }).eq("id", id));
    else {
      const series = starts.length > 1 ? (crypto.randomUUID ? crypto.randomUUID() : null) : null;
      const rows = starts.map((s) => ({ ...base, org_id: S.org.id, branch_id: k ? k.branch_id : null, child_id: childId, starts_at: s.toISOString(), series_id: series }));
      n = rows.length; ({ error } = await sb.from("lessons").insert(rows));
    }
    if (error) return showFormErr(f, crmErr(error));
    closeModal(); toast(id ? t("saved") : t("ls_created", { n }));
    if (!id && parseHash().name === "schedule") { CRM.week = weekOf(date); location.hash = "#/schedule/" + date; } else route();
  });
};

/* ---------- вкладка «Абонемент» в карточке ребёнка ---------- */
async function childPay(box) {
  box.innerHTML = `<div class="boot" style="min-height:30vh"><div class="spinner"></div></div>`;
  const id = CH.child.id; const mgr = isManager();
  const [subs, pays, ls, bal] = await Promise.all([
    sb.from("subscriptions").select("*").eq("child_id", id).order("starts_on", { ascending: false }),
    mgr ? sb.from("payments").select("*").eq("child_id", id).order("paid_on", { ascending: false }).limit(50) : Promise.resolve({ data: [] }),
    sb.from("lessons").select("*").eq("child_id", id).order("starts_at", { ascending: false }).limit(60),
    balances().catch(() => ({})),
  ]);
  if (!$("#child-tab") || !CH || CH.child.id !== id) return;
  const S2 = subs.data || [], P = pays.data || [], L = ls.data || []; const b = bal[id] || {};
  CRM.childLessons = L; CRM.bal = bal;
  const used = (sid) => L.filter((x) => x.subscription_id === sid && ["done", "missed"].includes(x.status)).length;
  const now = Date.now();
  const upcoming = L.filter((x) => x.status === "planned" && new Date(x.starts_at).getTime() >= now - 3600e3).reverse();
  const past = L.filter((x) => !(x.status === "planned" && new Date(x.starts_at).getTime() >= now - 3600e3)).slice(0, 20);
  const lessonRow = (x) => `<div class="list-item click" data-act="lesson-open" data-id="${x.id}">
      <span class="sc-dot" style="background:${x.direction ? DIR_COLORS[x.direction] : "var(--border-strong)"}"></span>
      <span class="t"><b>${esc(fmtDate(isoLocal(x.starts_at), { weekday: "short", day: "numeric", month: "short" }))} · ${hhmm(x.starts_at)}</b><span>${esc(staffName(x.member_id) || "")}${x.direction ? " · " + esc(t("dir_" + x.direction)) : ""}</span></span>
      ${stTag(x.status)}</div>`;
  box.innerHTML = `
  <div class="grid g-3" style="margin-bottom:16px">
    <div class="card kpi"><div class="label">${ic("wallet")}${t("pay_left")}</div><div class="value num">${b.lessons_left != null ? b.lessons_left : 0}</div><div class="foot">${b.sub_expires ? esc(t("cs_until", { d: fmtDate(b.sub_expires) })) : ""}</div></div>
    <div class="card kpi"><div class="label">${ic("calendar")}${t("pay_next")}</div><div class="value" style="font-size:20px">${b.next_lesson ? esc(fmtDate(isoLocal(b.next_lesson), { weekday: "short", day: "numeric", month: "short" })) + " · " + hhmm(b.next_lesson) : esc(t("pay_none"))}</div><div class="foot"></div></div>
    ${mgr ? `<div class="card kpi"><div class="label">${ic("card")}${b.debt > 0 ? t("pay_debt") : t("pay_paid_all")}</div><div class="value num" style="${b.debt > 0 ? "color:var(--danger)" : ""}">${money(Math.max(0, b.debt || 0))}</div><div class="foot">${money(b.paid)} / ${money(b.billed)}</div></div>` : ""}
  </div>
  <div class="grid g-2">
    <div class="stack" style="display:grid;gap:16px">
      <div class="card"><div class="card-head"><h3>${t("sub_title")}</h3>${mgr ? `<button class="btn sm primary" data-act="sub-new">${ic("plus")}${t("sub_new")}</button>` : ""}</div>
        ${S2.length ? `<div class="list">${S2.map((s) => {
          const u = used(s.id); const exp = s.expires_on && s.expires_on < todayISO();
          return `<div class="list-item"><span class="t"><b>${esc(s.title || t("sub_title"))}</b>
            <span>${esc(fmtDate(s.starts_on))}${s.expires_on ? " – " + esc(fmtDate(s.expires_on)) : ""}${s.price ? " · " + money(s.price) : ""}</span>
            <span style="display:block;margin-top:6px">${meter(Math.round(u / s.lessons_total * 100), u >= s.lessons_total ? "var(--danger)" : "var(--accent)")}</span></span>
            <span class="tag ${!s.active || exp ? "" : s.lessons_total - u <= 1 ? "warn" : "ok"}">${esc(t("sub_used", { used: u, total: s.lessons_total }))}${!s.active ? " · " + t("inactive") : exp ? " · " + t("sub_expired") : ""}</span>
            ${mgr ? `<button class="btn ghost sm" data-act="sub-toggle" data-id="${s.id}" data-on="${s.active ? 0 : 1}">${s.active ? t("sub_archive") : t("sub_restore")}</button>` : ""}</div>`;
        }).join("")}</div>` : emptyState("wallet", t("sub_empty"), mgr ? "" : t("sub_only_mgr"))}
      </div>
      ${mgr ? `<div class="card"><div class="card-head"><h3>${t("pm_title")}</h3><button class="btn sm" data-act="pay-new">${ic("plus")}${t("pm_new")}</button></div>
        ${P.length ? `<div class="list">${P.map((p) => `<div class="list-item"><span class="t"><b>${money(p.amount)}</b><span>${esc(fmtDate(p.paid_on))} · ${esc(t("m_" + p.method))}${p.note ? " · " + esc(p.note) : ""}</span></span>
          <button class="btn ghost icon sm" data-act="pay-del" data-id="${p.id}" aria-label="${esc(t("del"))}">${ic("x", 16)}</button></div>`).join("")}</div>` : emptyState("card", t("pm_empty"), "")}
      </div>` : ""}
    </div>
    <div class="card"><div class="card-head"><h3>${t("hist_title")}</h3>${CH.editable ? `<button class="btn sm primary" data-act="lesson-new" data-child="${id}">${ic("plus")}${t("hist_book")}</button>` : ""}</div>
      ${L.length ? `${upcoming.length ? `<div class="small muted" style="padding:6px 20px 0">${t("hist_upcoming")}</div><div class="list">${upcoming.slice(0, 10).map(lessonRow).join("")}</div>` : ""}
        ${past.length ? `<div class="small muted" style="padding:10px 20px 0">${t("hist_past")}</div><div class="list">${past.map(lessonRow).join("")}</div>` : ""}`
        : emptyState("calendar", t("hist_empty"), "")}
    </div>
  </div>`;
  CRM.childSubs = S2;
}
ACT["sub-new"] = () => {
  const c = CH.child; const to = new Date(); to.setMonth(to.getMonth() + 1);
  openModal(`${modalHead(t("sub_new"), childName(c))}
    <form data-form="sub-save"><div class="modal-body form-grid">
      <div class="field"><label>${t("sub_name")}</label><input class="input" name="title" maxlength="80" placeholder="${esc(t("sub_name_ph"))}"></div>
      <div class="form-row">
        <div class="field"><label>${t("sub_count")}</label><input class="input" type="number" name="lessons_total" min="1" max="500" value="8" required>
          <div class="chips-select" style="margin-top:6px">${[4, 8, 12, 16, 20].map((n) => `<button type="button" class="chip-toggle" data-act="sub-n" data-n="${n}">${n}</button>`).join("")}</div></div>
        <div class="field"><label>${t("sub_price")}</label><input class="input" type="number" name="price" min="0" step="500" value="0"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>${t("sub_from")}</label><input class="input" type="date" name="starts_on" value="${todayISO()}" required></div>
        <div class="field"><label>${t("sub_to")} <span class="hint">${t("optional")}</span></label><input class="input" type="date" name="expires_on" value="${isoLocal(to)}"></div>
      </div>
      <label class="check"><input type="checkbox" name="paid_now" value="1"> ${t("sub_paid_now")}</label>
      <div class="field" id="sub-pm"><label>${t("pm_method")}</label><select class="input" name="method">${PAY_METHODS.map((m) => `<option value="${m}">${esc(t("m_" + m))}</option>`).join("")}</select></div>
      <div class="error-text hidden" data-err></div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${ic("check")}${t("save")}</button></div></form>`);
};
ACT["sub-n"] = (el) => { const i = $("[name=lessons_total]"); if (i) i.value = el.dataset.n; const ti = $("[name=title]"); if (ti && !ti.value) ti.placeholder = el.dataset.n + (S.lang === "kk" ? " сабақ" : " занятий"); };
FORMS["sub-save"] = async (f, fd) => {
  const c = CH.child; const n = +fd.get("lessons_total"); const price = Math.max(0, +fd.get("price") || 0);
  const title = String(fd.get("title") || "").trim() || n + (S.lang === "kk" ? " сабақ" : " занятий");
  await busy(f.querySelector(".btn.primary"), async () => {
    const { data, error } = await sb.from("subscriptions").insert({ org_id: c.org_id, child_id: c.id, title, lessons_total: n, price, starts_on: String(fd.get("starts_on")), expires_on: String(fd.get("expires_on") || "") || null }).select().single();
    if (error) return showFormErr(f, crmErr(error));
    if (fd.get("paid_now") && price > 0) {
      const p = await sb.from("payments").insert({ org_id: c.org_id, child_id: c.id, subscription_id: data.id, amount: price, method: String(fd.get("method") || "cash"), paid_on: todayISO() });
      if (p.error) toast(crmErr(p.error), true);
    }
    closeModal(); toast(t("sub_saved")); childPay($("#child-tab"));
  });
};
ACT["sub-toggle"] = async (el) => {
  const { error } = await sb.from("subscriptions").update({ active: el.dataset.on === "1" }).eq("id", el.dataset.id);
  if (error) return toast(crmErr(error), true);
  childPay($("#child-tab"));
};
ACT["pay-new"] = (el) => payForm(el.dataset.child);
async function payForm(childId) {
  const c = childId ? kidById(childId) || (CH && CH.child.id === childId ? CH.child : null) : CH.child;
  let subs = CH && CH.child.id === c.id ? CRM.childSubs || [] : null;
  if (!subs) { const r = await sb.from("subscriptions").select("*").eq("child_id", c.id).order("starts_on", { ascending: false }); subs = r.data || []; }
  const act = subs.filter((s) => s.active);
  openModal(`${modalHead(t("pm_new"), childName(c))}
    <form data-form="pay-save" data-child="${c.id}" data-org="${c.org_id || S.org.id}"><div class="modal-body form-grid">
      <div class="form-row">
        <div class="field"><label>${t("pm_amount")}</label><input class="input" type="number" name="amount" min="1" step="1" value="${act[0] && act[0].price ? act[0].price : ""}" required></div>
        <div class="field"><label>${t("pm_method")}</label><select class="input" name="method">${PAY_METHODS.map((m) => `<option value="${m}">${esc(t("m_" + m))}</option>`).join("")}</select></div>
      </div>
      <div class="form-row">
        <div class="field"><label>${t("pm_date")}</label><input class="input" type="date" name="paid_on" value="${todayISO()}" max="${todayISO()}"></div>
        <div class="field"><label>${t("pm_sub")}</label><select class="input" name="subscription_id"><option value="">—</option>${subs.map((s, i) => `<option value="${s.id}" ${i === 0 && s.active ? "selected" : ""}>${esc(s.title)} · ${esc(fmtDate(s.starts_on))}</option>`).join("")}</select></div>
      </div>
      <div class="field"><label>${t("ls_note")} <span class="hint">${t("optional")}</span></label><input class="input" name="note" maxlength="200"></div>
      <div class="error-text hidden" data-err></div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${ic("check")}${t("save")}</button></div></form>`);
}
FORMS["pay-save"] = async (f, fd) => {
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.from("payments").insert({ org_id: f.dataset.org, child_id: f.dataset.child, amount: Math.round(+fd.get("amount")), method: String(fd.get("method")), paid_on: String(fd.get("paid_on") || todayISO()), subscription_id: String(fd.get("subscription_id") || "") || null, note: String(fd.get("note") || "").trim() || null });
    if (error) return showFormErr(f, crmErr(error));
    closeModal(); toast(t("pm_saved"));
    if (parseHash().name === "child") childPay($("#child-tab")); else route();
  });
};
ACT["pay-del"] = async (el) => {
  if (!window.confirm(t("pm_del_q"))) return;
  const { error } = await sb.from("payments").delete().eq("id", el.dataset.id);
  if (error) return toast(crmErr(error), true);
  childPay($("#child-tab"));
};

/* ---------- касса ---------- */
PAGES.cash = async (el, args, alive) => {
  document.title = t("nav_cash") + " · Сөйле Pro";
  const month = args[0] && /^\d{4}-\d{2}$/.test(args[0]) ? args[0] : todayISO().slice(0, 7);
  const m1 = month + "-01"; const n = new Date(m1 + "T00:00:00"); n.setMonth(n.getMonth() + 1); const m2 = isoLocal(n);
  const p = new Date(m1 + "T00:00:00"); p.setMonth(p.getMonth() - 1); const prev = isoLocal(p).slice(0, 7);
  const [kids, pays, ls, bal] = await Promise.all([
    getKids(),
    sb.from("payments").select("*").eq("org_id", S.org.id).gte("paid_on", m1).lt("paid_on", m2).order("paid_on", { ascending: false }),
    sb.from("lessons").select("status").eq("org_id", S.org.id).gte("starts_at", new Date(m1 + "T00:00:00").toISOString()).lt("starts_at", new Date(m2 + "T00:00:00").toISOString()),
    balances(),
  ]);
  if (!alive()) return;
  if (pays.error) throw pays.error;
  const P = pays.data || [], L = ls.data || [];
  const total = P.reduce((a, x) => a + x.amount, 0);
  const byM = PAY_METHODS.map((m) => [m, P.filter((x) => x.method === m).reduce((a, x) => a + x.amount, 0)]).filter((x) => x[1]);
  const att = ["done", "missed", "excused", "cancelled"].map((s) => [s, L.filter((x) => x.status === s).length]);
  const debtors = kids.filter((k) => k.active && bal[k.id] && bal[k.id].debt > 0).map((k) => ({ k, b: bal[k.id] })).sort((a, b) => b.b.debt - a.b.debt);
  const soon = isoLocal(new Date(Date.now() + 7 * 864e5));
  const ending = kids.filter((k) => { const b = bal[k.id]; return k.active && b && b.lessons_total > 0 && (b.lessons_left <= 2 || (b.sub_expires && b.sub_expires <= soon)); }).map((k) => ({ k, b: bal[k.id] })).sort((a, b) => a.b.lessons_left - b.b.lessons_left);
  const monthName = new Date(m1 + "T00:00:00").toLocaleDateString(locale(), { month: "long", year: "numeric" });
  const pName = (k) => (k.parent_name ? ", " + k.parent_name.split(" ")[0] : "");
  el.innerHTML = `
  ${pageHead(t("cs_title"), monthName, `<div class="row" style="gap:6px">
      <button class="btn icon" data-act="go" data-href="#/cash/${prev}" aria-label="‹">${ic("left")}</button>
      <button class="btn" data-act="go" data-href="#/cash">${t("sc_today")}</button>
      <button class="btn icon" data-act="go" data-href="#/cash/${m2.slice(0, 7)}" aria-label="›">${ic("right")}</button></div>`)}
  <div class="grid g-4" style="margin-bottom:16px">
    <div class="card kpi"><div class="label">${ic("wallet")}${t("cs_month_in")}</div><div class="value num">${money(total)}</div><div class="foot">${byM.map(([m, s]) => esc(t("m_" + m)) + " " + fmtMoney(s)).join(" · ") || "—"}</div></div>
    <div class="card kpi"><div class="label">${ic("alert")}${t("cs_debtors")}</div><div class="value num">${debtors.length}</div><div class="foot">${debtors.length ? esc(t("cs_total_debt", { s: fmtMoney(debtors.reduce((a, x) => a + x.b.debt, 0)) })) : ""}</div></div>
    <div class="card kpi"><div class="label">${ic("clock")}${t("cs_ending")}</div><div class="value num">${ending.length}</div><div class="foot"></div></div>
    <div class="card kpi"><div class="label">${ic("calendar")}${t("cs_att")}</div><div class="value num">${att[0][1]}<small> / ${att.reduce((a, x) => a + x[1], 0)}</small></div><div class="foot">${att.slice(1).map(([s, c]) => esc(t("st_" + s)) + ": " + c).join(" · ")}</div></div>
  </div>
  <div class="grid g-2">
    <div class="card"><div class="card-head"><h3>${t("cs_debtors")}</h3></div>
      ${debtors.length ? `<div class="list">${debtors.map(({ k, b }) => `<div class="list-item"><span class="avatar">${esc(initials(childName(k)))}</span>
        <span class="t click" data-act="go" data-href="#/child/${k.id}/pay"><b>${esc(childName(k))}</b><span>${esc(k.parent_name || "")}</span></span>
        <span class="tag danger">${money(b.debt)}</span>
        ${k.parent_phone ? `<a class="btn sm" target="_blank" rel="noopener" href="${waLink(t("wa_debt", { p: pName(k), c: childName(k), o: S.org.name, s: fmtMoney(b.debt) }), k.parent_phone)}">${ic("chat", 14)}${t("cs_remind")}</a>` : ""}</div>`).join("")}</div>`
        : emptyState("check", t("cs_no_debt"), "")}
    </div>
    <div class="card"><div class="card-head"><h3>${t("cs_ending")}</h3></div>
      ${ending.length ? `<div class="list">${ending.map(({ k, b }) => `<div class="list-item"><span class="avatar">${esc(initials(childName(k)))}</span>
        <span class="t click" data-act="go" data-href="#/child/${k.id}/pay"><b>${esc(childName(k))}</b><span>${esc(t("cs_left_n", { n: b.lessons_left }))}${b.sub_expires ? " · " + esc(t("cs_until", { d: fmtDate(b.sub_expires) })) : ""}</span></span>
        ${k.parent_phone ? `<a class="btn sm" target="_blank" rel="noopener" href="${waLink(t("wa_end", { p: pName(k), c: childName(k), o: S.org.name, n: b.lessons_left }), k.parent_phone)}">${ic("chat", 14)}${t("cs_remind")}</a>` : ""}</div>`).join("")}</div>`
        : emptyState("check", t("cs_no_end"), "")}
    </div>
  </div>
  <div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("cs_payments")}</h3></div>
    ${P.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>${t("pm_date")}</th><th>${t("col_child")}</th><th>${t("pm_method")}</th><th class="r">${t("pm_amount")}</th></tr></thead>
      <tbody>${P.map((x) => { const k = kidById(x.child_id); return `<tr class="click" data-act="go" data-href="#/child/${x.child_id}/pay"><td class="nowrap">${esc(fmtDate(x.paid_on))}</td><td>${esc(k ? childName(k) : "—")}</td><td>${esc(t("m_" + x.method))}</td><td class="r num">${fmtMoney(x.amount)}</td></tr>`; }).join("")}</tbody></table></div>`
      : emptyState("card", t("pm_empty"), "")}
  </div>`;
};

/* ---------- стили ---------- */
(function () {
  const css = `
  .sc-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px;align-items:start}
  .sc-day{background:var(--surface);border-radius:var(--r-lg);padding:10px;box-shadow:var(--shadow);min-height:120px}
  .sc-day.today{outline:2px solid var(--accent)}
  .sc-dh{display:flex;align-items:center;gap:6px;margin-bottom:8px}.sc-dh b{font-size:14px}.sc-dh span{font-size:12.5px;color:var(--text-3);flex:1}
  .sc-none{font-size:12.5px;color:var(--text-3);padding:6px 2px}
  .sc-l{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;text-align:left;border:0;border-left:4px solid var(--c);background:var(--surface-2);border-radius:10px;padding:8px 9px;margin-bottom:6px;cursor:pointer;font:inherit;color:var(--text)}
  .sc-l:hover{background:var(--surface-3)}
  .sc-l b{font-size:13.5px;font-weight:600;line-height:1.2}
  .sc-t{font-size:12px;font-weight:600;color:var(--text-2)}.sc-m{font-size:12px;color:var(--text-3)}
  .sc-tags{display:flex;gap:4px;flex-wrap:wrap}.sc-tags:empty{display:none}
  .sc-l.st-cancelled b,.sc-l.st-cancelled .sc-t{text-decoration:line-through;color:var(--text-3)}
  .sc-l.st-done{background:var(--ok-soft)}.sc-l.st-missed{background:var(--danger-soft)}
  .sc-marks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .sc-dot{width:10px;height:10px;border-radius:50%;flex:none}
  .list-item .t.click{cursor:pointer}
  @media (max-width:1100px){.sc-week{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:700px){.sc-week{grid-template-columns:minmax(0,1fr)}.sc-day.empty{display:none}.sc-day.today.empty{display:block}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

/* =====================================================================
 * Часть 2: заявки, напоминания родителям, зарплата, «Сегодня» на главной
 * ===================================================================== */
Object.assign(I18N.ru, {
  nav_leads: "Заявки", nav_salary: "Зарплата",
  ld_title: "Заявки", ld_add: "Заявка", ld_link: "Ссылка на онлайн-заявку", ld_link_hint: "Поставьте ссылку в шапку Instagram, на сайт и в 2ГИС — заявки будут падать сюда сами.",
  ld_new: "Новая заявка", ld_edit: "Заявка", ld_parent: "Имя родителя", ld_phone: "Телефон", ld_child: "Имя ребёнка", ld_age: "Возраст ребёнка", ld_source: "Откуда пришёл",
  ld_note: "Комментарий", ld_dirs: "Что интересует", ld_trial: "Пробное занятие", ld_saved: "Заявка сохранена", ld_empty: "Пока пусто",
  ld_s_new: "Новые", ld_s_contacted: "Связались", ld_s_trial: "Пробное", ld_s_won: "Клиенты", ld_s_lost: "Отказ",
  src_instagram: "Instagram", src_whatsapp: "WhatsApp", src_site: "Сайт", src_form: "Онлайн-заявка", src_2gis: "2ГИС", src_referral: "Рекомендация", src_call: "Звонок", src_other: "Другое",
  ld_to_trial: "Записать на пробное", ld_convert: "Оформить ребёнка", ld_lost_reason: "Причина отказа", ld_call: "Позвонить", ld_wa: "WhatsApp",
  ld_converted: "Ребёнок оформлен — заявка в «Клиентах»", ld_open_child: "Открыть карточку", ld_del_q: "Удалить заявку?", ld_age_y: "{n} лет",
  ld_wa_text: "Здравствуйте{p}! Это «{o}». Вы оставляли заявку — удобно сейчас поговорить?",
  lf_title: "Запись в центр", lf_sub: "Оставьте контакты — администратор перезвонит и подберёт время.", lf_send: "Отправить заявку", lf_done: "Спасибо! Заявка отправлена — с вами свяжутся в ближайшее время.",
  lf_bad_phone: "Проверьте номер телефона", lf_name_req: "Укажите имя", lf_nf: "Ссылка недействительна", lf_note_ph: "Например: сыну 3 года, пока не говорит",
  rm_btn: "Напомнить на завтра", rm_title: "Напоминания на завтра", rm_sub: "Нажмите «WhatsApp» — откроется чат с родителем с готовым текстом.", rm_none: "На завтра занятий нет",
  rm_text: "Здравствуйте{p}! Напоминаем: завтра, {d}, в {t} занятие у {c} в «{o}»{s}. Ждём вас!", rm_nophone: "нет телефона", rm_sent: "отправлено",
  td_title: "Сегодня по расписанию", td_none: "Сегодня занятий нет", td_all: "Всё расписание", td_marked: "отмечено {a} из {b}",
  sl_title: "Зарплата", sl_staff: "Специалист", sl_done: "Проведено", sl_missed: "Пропуски", sl_rate: "Ставка", sl_sum: "К выплате", sl_total: "Итого к выплате",
  sl_mode_lesson: "₸ за занятие", sl_mode_percent: "% от абонемента", sl_set: "Настроить ставку", sl_count_missed: "Оплачивать и пропуски без причины",
  sl_no_rate: "ставка не задана", sl_csv: "Скачать CSV", sl_hint: "Считаются занятия из расписания с отметкой «Был». Ставки видит только руководство.", sl_rev: "Выручка по занятиям",
  pv_next: "Ближайшие занятия", pv_left: "Осталось занятий по абонементу: {n}", pv_tomorrow: "Завтра", pv_today: "Сегодня",
});
Object.assign(I18N.kk, {
  nav_leads: "Өтінімдер", nav_salary: "Жалақы",
  ld_title: "Өтінімдер", ld_add: "Өтінім", ld_link: "Онлайн-өтінім сілтемесі", ld_link_hint: "Сілтемені Instagram, сайт және 2ГИС-ке қойыңыз — өтінімдер осында өздігінен түседі.",
  ld_new: "Жаңа өтінім", ld_edit: "Өтінім", ld_parent: "Ата-ананың аты", ld_phone: "Телефон", ld_child: "Баланың аты", ld_age: "Баланың жасы", ld_source: "Қайдан келді",
  ld_note: "Түсініктеме", ld_dirs: "Не қызықтырады", ld_trial: "Сынақ сабақ", ld_saved: "Өтінім сақталды", ld_empty: "Әзірге бос",
  ld_s_new: "Жаңа", ld_s_contacted: "Хабарласты", ld_s_trial: "Сынақ", ld_s_won: "Клиенттер", ld_s_lost: "Бас тартты",
  src_instagram: "Instagram", src_whatsapp: "WhatsApp", src_site: "Сайт", src_form: "Онлайн-өтінім", src_2gis: "2ГИС", src_referral: "Ұсыныс", src_call: "Қоңырау", src_other: "Басқа",
  ld_to_trial: "Сынаққа жазу", ld_convert: "Баланы тіркеу", ld_lost_reason: "Бас тарту себебі", ld_call: "Қоңырау", ld_wa: "WhatsApp",
  ld_converted: "Бала тіркелді — өтінім «Клиенттерде»", ld_open_child: "Карточканы ашу", ld_del_q: "Өтінімді жою керек пе?", ld_age_y: "{n} жас",
  ld_wa_text: "Сәлеметсіз бе{p}! Бұл — «{o}». Сіз өтінім қалдырған едіңіз — қазір сөйлесуге ыңғайлы ма?",
  lf_title: "Орталыққа жазылу", lf_sub: "Байланысыңызды қалдырыңыз — әкімші хабарласып, уақыт таңдайды.", lf_send: "Өтінім жіберу", lf_done: "Рақмет! Өтінім жіберілді — жақын арада хабарласады.",
  lf_bad_phone: "Телефон нөмірін тексеріңіз", lf_name_req: "Атыңызды жазыңыз", lf_nf: "Сілтеме жарамсыз", lf_note_ph: "Мысалы: ұлым 3 жаста, әлі сөйлемейді",
  rm_btn: "Ертеңгіге еске салу", rm_title: "Ертеңгі сабақтар туралы еске салу", rm_sub: "«WhatsApp» батырмасын басыңыз — ата-анамен чат дайын мәтінмен ашылады.", rm_none: "Ертеңге сабақ жоқ",
  rm_text: "Сәлеметсіз бе{p}! Еске саламыз: ертең, {d}, сағат {t}-да «{o}» орталығында {c} сабағы бар{s}. Күтеміз!", rm_nophone: "телефон жоқ", rm_sent: "жіберілді",
  td_title: "Бүгінгі кесте", td_none: "Бүгін сабақ жоқ", td_all: "Толық кесте", td_marked: "{b}-дан {a} белгіленді",
  sl_title: "Жалақы", sl_staff: "Маман", sl_done: "Өткізілді", sl_missed: "Келмеді", sl_rate: "Мөлшерлеме", sl_sum: "Төлеуге", sl_total: "Барлығы төлеуге",
  sl_mode_lesson: "₸ әр сабаққа", sl_mode_percent: "абонементтен %", sl_set: "Мөлшерлемені баптау", sl_count_missed: "Себепсіз келмегенін де төлеу",
  sl_no_rate: "мөлшерлеме жоқ", sl_csv: "CSV жүктеу", sl_hint: "Кестедегі «Келді» белгісі бар сабақтар есептеледі. Мөлшерлемелерді тек басшылық көреді.", sl_rev: "Сабақтар бойынша түсім",
  pv_next: "Алдағы сабақтар", pv_left: "Абонемент бойынша қалған сабақ: {n}", pv_tomorrow: "Ертең", pv_today: "Бүгін",
});
const LEAD_STAGES = ["new", "contacted", "trial", "won", "lost"];
const LEAD_SOURCES = ["instagram", "whatsapp", "2gis", "site", "referral", "call", "form", "other"];
const LEAD_TAG = { new: "accent", contacted: "", trial: "warn", won: "ok", lost: "danger" };
const leadLink = () => location.origin + location.pathname + "?lead=" + S.org.id;
function agoText(iso) { const d = daysSince(iso); return d === 0 ? hhmm(iso) : relDay(isoLocal(iso)); }

/* ---------- 1. Заявки ---------- */
PAGES.leads = async (el, args, alive) => {
  document.title = t("nav_leads") + " · Сөйле Pro";
  const { data, error } = await sb.from("leads").select("*").eq("org_id", S.org.id).order("created_at", { ascending: false }).limit(500);
  if (!alive()) return; if (error) throw error;
  CRM.leads = data || []; if (!CRM.leadStage) CRM.leadStage = "new";
  el.innerHTML = `
  ${pageHead(t("ld_title"), "", `<button class="btn" data-act="lead-link">${ic("link")}<span>${t("ld_link")}</span></button><button class="btn primary" data-act="lead-new">${ic("plus")}${t("ld_add")}</button>`)}
  <div class="seg ld-seg" style="margin-bottom:12px">${LEAD_STAGES.map((s) => `<button data-act="lead-stage" data-v="${s}" class="${CRM.leadStage === s ? "on" : ""}">${t("ld_s_" + s)} <b>${CRM.leads.filter((x) => x.stage === s).length}</b></button>`).join("")}</div>
  <div class="ld-board" id="ld-board"></div>`;
  drawLeads();
};
function drawLeads() {
  const box = $("#ld-board"); if (!box) return;
  box.innerHTML = LEAD_STAGES.map((s) => {
    const items = CRM.leads.filter((x) => x.stage === s);
    return `<div class="ld-col ${CRM.leadStage === s ? "on" : ""}"><div class="ld-ch"><span class="tag ${LEAD_TAG[s]}">${t("ld_s_" + s)}</span><b>${items.length}</b></div>
      ${items.length ? items.map((x) => `<button class="ld-card" data-act="lead-open" data-id="${x.id}">
        <b>${esc(x.parent_name || x.phone || "—")}</b>
        <span>${esc(x.child_name || "")}${x.child_age != null ? " · " + esc(t("ld_age_y", { n: x.child_age })) : ""}</span>
        <span class="ld-meta"><span class="tag">${esc(t("src_" + x.source))}</span>${(x.directions || []).map((d) => dirTag(d)).join("")}${x.trial_at && s === "trial" ? `<span class="tag warn">${esc(fmtDate(isoLocal(x.trial_at)))} ${hhmm(x.trial_at)}</span>` : ""}<span class="ld-ago">${esc(agoText(x.created_at))}</span></span>
      </button>`).join("") : `<div class="sc-none">${t("ld_empty")}</div>`}</div>`;
  }).join("");
}
ACT["lead-stage"] = (el) => { CRM.leadStage = el.dataset.v; $$(".ld-seg button").forEach((b) => b.classList.toggle("on", b === el)); drawLeads(); };
ACT["lead-link"] = () => {
  openModal(`${modalHead(t("ld_link"), t("ld_link_hint"))}<div class="modal-body"><div class="copy-box"><code>${esc(leadLink())}</code></div></div>
    <div class="modal-foot"><a class="btn" href="${esc(leadLink())}" target="_blank" rel="noopener">${ic("globe")}${t("open")}</a><span class="spacer"></span><button class="btn primary" data-act="lead-copy">${ic("copy")}${t("copy")}</button></div>`);
};
ACT["lead-copy"] = () => copyText(leadLink());
ACT["lead-new"] = () => leadForm(null);
ACT["lead-open"] = (el) => { const x = (CRM.leads || []).find((l) => l.id === el.dataset.id); if (x) leadView(x); };
function leadForm(x) {
  x = x || { source: "instagram", directions: [] };
  openModal(`${modalHead(x.id ? t("ld_edit") : t("ld_new"))}
    <form data-form="lead-save" data-id="${x.id || ""}"><div class="modal-body form-grid">
      <div class="form-row">
        <div class="field"><label>${t("ld_parent")}</label><input class="input" name="parent_name" maxlength="80" value="${esc(x.parent_name || "")}"></div>
        <div class="field"><label>${t("ld_phone")}</label><input class="input" name="phone" type="tel" maxlength="30" value="${esc(x.phone || "")}" placeholder="+7 7__ ___ __ __"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>${t("ld_child")}</label><input class="input" name="child_name" maxlength="80" value="${esc(x.child_name || "")}"></div>
        <div class="field"><label>${t("ld_age")}</label><input class="input" name="child_age" type="number" min="0" max="25" value="${x.child_age != null ? x.child_age : ""}"></div>
      </div>
      <div class="field"><label>${t("ld_source")}</label><select class="input" name="source">${LEAD_SOURCES.map((s) => `<option value="${s}" ${s === x.source ? "selected" : ""}>${esc(t("src_" + s))}</option>`).join("")}</select></div>
      <div class="field"><span class="label">${t("ld_dirs")}</span><div class="chips-select">${DIRS.map((d) => `<label class="chip-toggle"><input type="checkbox" name="dirs" value="${d}" ${(x.directions || []).includes(d) ? "checked" : ""}>${esc(t("dirf_" + d))}</label>`).join("")}</div></div>
      <div class="field"><label>${t("ld_note")}</label><textarea class="input" name="note" maxlength="600">${esc(x.note || "")}</textarea></div>
      <div class="error-text hidden" data-err></div>
    </div>
    <div class="modal-foot">${x.id && isManager() ? `<button type="button" class="btn ghost" data-act="lead-del" data-id="${x.id}" style="color:var(--danger)">${t("del")}</button>` : ""}<span class="spacer"></span><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${ic("check")}${t("save")}</button></div></form>`);
}
FORMS["lead-save"] = async (f, fd) => {
  const row = {
    parent_name: String(fd.get("parent_name") || "").trim() || null, phone: String(fd.get("phone") || "").trim() || null,
    child_name: String(fd.get("child_name") || "").trim() || null, child_age: fd.get("child_age") !== "" ? Number(fd.get("child_age")) : null,
    source: String(fd.get("source") || "other"), directions: fd.getAll("dirs"), note: String(fd.get("note") || "").trim() || null,
  };
  if (!row.parent_name && !row.phone) return showFormErr(f, t("lf_name_req"));
  await busy(f.querySelector(".btn.primary"), async () => {
    const id = f.dataset.id;
    const { error } = id ? await sb.from("leads").update(row).eq("id", id) : await sb.from("leads").insert({ ...row, org_id: S.org.id, branch_id: S.me.branch_id || null, member_id: S.me.id });
    if (error) return showFormErr(f, crmErr(error));
    closeModal(); toast(t("ld_saved")); if (!id) CRM.leadStage = "new"; route();
  });
};
ACT["lead-del"] = async (el) => {
  if (!window.confirm(t("ld_del_q"))) return;
  const { error } = await sb.from("leads").delete().eq("id", el.dataset.id); if (error) return toast(crmErr(error), true);
  closeModal(); route();
};
function leadView(x) {
  const p = x.parent_name ? ", " + x.parent_name.split(" ")[0] : "";
  const dt0 = x.trial_at ? isoLocal(x.trial_at) : addDays(todayISO(), 1), tm0 = x.trial_at ? hhmm(x.trial_at) : "11:00";
  openModal(`${modalHead(x.parent_name || x.phone || t("ld_edit"), (x.child_name || "") + (x.child_age != null ? " · " + t("ld_age_y", { n: x.child_age }) : ""))}
    <div class="modal-body">
      <div class="row wrap" style="gap:6px;margin-bottom:10px"><span class="tag">${esc(t("src_" + x.source))}</span>${(x.directions || []).map((d) => dirTag(d, true)).join("")}<span class="tag">${esc(fmtDate(isoLocal(x.created_at), { day: "numeric", month: "long" }))} ${hhmm(x.created_at)}</span></div>
      ${x.note ? `<p class="small" style="margin-bottom:12px;white-space:pre-wrap">${esc(x.note)}</p>` : ""}
      ${x.phone ? `<div class="row wrap" style="gap:8px;margin-bottom:14px"><a class="btn" href="tel:${esc(phoneDigits(x.phone) ? "+" + phoneDigits(x.phone) : x.phone)}">${ic("phone")}${t("ld_call")} ${esc(x.phone)}</a>
        <a class="btn" target="_blank" rel="noopener" href="${waLink(t("ld_wa_text", { p, o: S.org.name }), x.phone)}">${ic("chat")}${t("ld_wa")}</a></div>` : ""}
      <div class="label small muted" style="margin-bottom:6px">${t("ls_status")}</div>
      <div class="seg" style="flex-wrap:wrap">${LEAD_STAGES.map((s) => `<button data-act="lead-set" data-id="${x.id}" data-v="${s}" class="${x.stage === s ? "on" : ""}">${t("ld_s_" + s)}</button>`).join("")}</div>
      <div class="card-body" style="padding:14px 0 0">
        <div class="label small muted" style="margin-bottom:6px">${t("ld_trial")}</div>
        <div class="row wrap" style="gap:8px"><input class="input" type="date" id="ld-td" value="${dt0}" style="max-width:170px"><input class="input" type="time" id="ld-tt" value="${tm0}" step="300" style="max-width:120px">
        <button class="btn" data-act="lead-trial" data-id="${x.id}">${ic("calendar")}${t("ld_to_trial")}</button></div>
      </div>
      ${x.stage === "lost" || x.lost_reason ? `<div class="field" style="margin-top:12px"><label>${t("ld_lost_reason")}</label><input class="input" id="ld-lr" maxlength="200" value="${esc(x.lost_reason || "")}" data-id="${x.id}"></div>` : ""}
    </div>
    <div class="modal-foot"><button class="btn ghost" data-act="lead-edit" data-id="${x.id}">${ic("edit")}${t("edit")}</button><span class="spacer"></span>
      ${x.child_id ? `<button class="btn primary" data-act="close-modal-go" data-href="#/child/${x.child_id}">${t("ld_open_child")}</button>` : `<button class="btn primary" data-act="lead-convert" data-id="${x.id}">${ic("plus")}${t("ld_convert")}</button>`}</div>`, { noFocus: true });
  const lr = $("#ld-lr"); if (lr) lr.addEventListener("change", () => sb.from("leads").update({ lost_reason: lr.value.trim() || null }).eq("id", x.id).then(() => { x.lost_reason = lr.value.trim(); }));
}
ACT["lead-edit"] = (el) => { const x = CRM.leads.find((l) => l.id === el.dataset.id); if (x) leadForm(x); };
ACT["lead-set"] = async (el) => {
  const { data, error } = await sb.from("leads").update({ stage: el.dataset.v }).eq("id", el.dataset.id).select().single();
  if (error) return toast(crmErr(error), true);
  const i = CRM.leads.findIndex((l) => l.id === data.id); CRM.leads[i] = data; CRM.leadStage = data.stage;
  closeModal(); route(); if (data.stage === "lost") setTimeout(() => leadView(data), 400);
};
ACT["lead-trial"] = async (el) => {
  const d = $("#ld-td").value, tm = $("#ld-tt").value || "11:00"; if (!d) return;
  const { error } = await sb.from("leads").update({ stage: "trial", trial_at: new Date(d + "T" + tm).toISOString() }).eq("id", el.dataset.id);
  if (error) return toast(crmErr(error), true);
  CRM.leadStage = "trial"; closeModal(); toast(t("ld_saved")); route();
};
ACT["lead-convert"] = (el) => {
  const x = CRM.leads.find((l) => l.id === el.dataset.id); if (!x) return;
  CRM.pendingLead = x.id;
  openModal(childFormHtml({ first_name: (x.child_name || "").split(" ")[0], birth_year: x.child_age != null ? new Date().getFullYear() - x.child_age : null,
    parent_name: x.parent_name || "", parent_phone: x.phone || "", directions: x.directions || [], branch_id: x.branch_id || S.me.branch_id || (S.branches[0] && S.branches[0].id) }),
    { onClose: () => setTimeout(() => { if (!/^#\/child\//.test(location.hash)) CRM.pendingLead = null; }, 50) });
};
window.addEventListener("hashchange", async () => {
  const m = /^#\/child\/([0-9a-f-]{36})$/.exec(location.hash);
  if (!m || !CRM.pendingLead) return;
  const id = CRM.pendingLead; CRM.pendingLead = null;
  const { error } = await sb.from("leads").update({ stage: "won", child_id: m[1] }).eq("id", id);
  if (!error) toast(t("ld_converted"));
});

/* --- публичная форма онлайн-заявки: ?lead=<org_id> --- */
async function renderLeadForm(orgId) {
  applyTheme();
  $("#app").innerHTML = `<div class="boot"><div class="spinner"></div></div>`;
  const { data } = await sb.rpc("lead_form_info", { p_org: orgId });
  if (!data) { $("#app").innerHTML = `<div class="center-screen"><div class="center-card card">${emptyState("link", t("lf_nf"), "")}</div></div>`; return; }
  document.title = data.name + " · " + t("lf_title");
  const dirs = (data.directions || []).filter((d) => DIRS.includes(d));
  $("#app").innerHTML = `<div class="center-screen"><div class="center-card card card-pad" style="max-width:480px">
    <div class="row" style="justify-content:space-between;margin-bottom:14px">${brand()}<div>${langSwitch()}</div></div>
    <h1 style="font-size:24px">${esc(data.name)}</h1><p class="muted" style="margin:4px 0 16px">${data.city ? esc(data.city) + " · " : ""}${esc(t("lf_sub"))}</p>
    <form data-form="lead-public" data-org="${esc(orgId)}" class="form-grid">
      <div class="field"><label>${t("ld_parent")}</label><input class="input" name="parent" required maxlength="80" autocomplete="name"></div>
      <div class="field"><label>${t("ld_phone")}</label><input class="input" name="phone" type="tel" required maxlength="30" placeholder="+7 7__ ___ __ __" autocomplete="tel"></div>
      <div class="form-row"><div class="field"><label>${t("ld_child")}</label><input class="input" name="child" maxlength="80"></div>
        <div class="field"><label>${t("ld_age")}</label><input class="input" name="age" type="number" min="0" max="25"></div></div>
      ${dirs.length ? `<div class="field"><span class="label">${t("ld_dirs")}</span><div class="chips-select">${dirs.map((d) => `<label class="chip-toggle"><input type="checkbox" name="dirs" value="${d}">${esc(t("dirf_" + d))}</label>`).join("")}</div></div>` : ""}
      <div class="field"><label>${t("ld_note")} <span class="hint">${t("optional")}</span></label><textarea class="input" name="note" maxlength="600" placeholder="${esc(t("lf_note_ph"))}"></textarea></div>
      <div class="error-text hidden" data-err></div>
      <button class="btn primary" style="width:100%;justify-content:center">${t("lf_send")}</button>
    </form>
    <p class="hint" style="margin-top:12px;text-align:center">Сөйле Pro</p></div></div>`;
}
FORMS["lead-public"] = async (f, fd) => {
  const phone = String(fd.get("phone") || ""); if (phoneDigits(phone).length < 10) return showFormErr(f, t("lf_bad_phone"));
  const src = new URLSearchParams(location.search).get("src") || "form";
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.rpc("submit_lead", { p_org: f.dataset.org, p_parent: String(fd.get("parent") || ""), p_phone: phone, p_child: String(fd.get("child") || ""),
      p_age: fd.get("age") !== "" ? Number(fd.get("age")) : null, p_note: String(fd.get("note") || ""), p_dirs: fd.getAll("dirs"), p_source: src });
    if (error) { const m = String(error.message || ""); return showFormErr(f, m.includes("bad_phone") ? t("lf_bad_phone") : m.includes("name_required") ? t("lf_name_req") : t("err")); }
    f.outerHTML = `<div class="alert info" style="margin-top:8px">${ic("check")}<div>${esc(t("lf_done"))}</div></div>`;
  });
};

/* ---------- 2. Напоминания родителям о завтрашних занятиях ---------- */
ACT["remind-tomorrow"] = async () => {
  const d = addDays(todayISO(), 1);
  const [kids, r] = await Promise.all([getKids(), sb.from("lessons").select("*").eq("org_id", S.org.id).eq("status", "planned")
    .gte("starts_at", new Date(d + "T00:00:00").toISOString()).lt("starts_at", new Date(addDays(d, 1) + "T00:00:00").toISOString()).order("starts_at")]);
  if (r.error) return toast(crmErr(r.error), true);
  const sent = LS.get("rm_sent_" + d, []);
  const L = (r.data || []).filter((l) => S.me.role !== "specialist" || l.member_id === S.me.id);
  const dLong = fmtDate(d, { weekday: "long", day: "numeric", month: "long" });
  openModal(`${modalHead(t("rm_title"), dLong)}<div class="modal-body">
    ${L.length ? `<p class="hint" style="margin-bottom:10px">${t("rm_sub")}</p><div class="list" style="margin:0 -20px">${L.map((l) => {
      const k = kidById(l.child_id) || {}; const sp = staffName(l.member_id);
      const txt = t("rm_text", { p: k.parent_name ? ", " + k.parent_name.split(" ")[0] : "", d: dLong, t: hhmm(l.starts_at), c: k.first_name || "", o: S.org.name, s: sp ? " (" + sp + (l.room ? ", " + t("sc_room_s") + " " + l.room : "") + ")" : "" });
      return `<div class="list-item"><span class="t"><b>${hhmm(l.starts_at)} · ${esc(childName(k))}</b><span>${esc(k.parent_name || "")}${sp ? " · " + esc(sp) : ""}</span></span>
        ${sent.includes(l.id) ? `<span class="tag ok">${ic("check", 12)}${t("rm_sent")}</span>` : ""}
        ${k.parent_phone ? `<a class="btn sm ${sent.includes(l.id) ? "" : "primary"}" target="_blank" rel="noopener" data-rm="${l.id}" href="${waLink(txt, k.parent_phone)}">${ic("chat", 14)}WhatsApp</a>` : `<span class="tag warn">${t("rm_nophone")}</span>`}</div>`;
    }).join("")}</div>` : emptyState("calendar", t("rm_none"), "")}
  </div><div class="modal-foot"><span class="spacer"></span><button class="btn" data-act="close-modal">${t("close")}</button></div>`);
  $$("[data-rm]").forEach((a) => a.addEventListener("click", () => { const s = LS.get("rm_sent_" + d, []); if (!s.includes(a.dataset.rm)) s.push(a.dataset.rm); LS.set("rm_sent_" + d, s); a.classList.remove("primary"); }));
};

/* --- для родителя: ближайшие занятия на его странице (?p=...) --- */
function pvLessons(d) {
  const L = d.lessons || []; if (!L.length && d.lessons_left == null) return "";
  const today = todayISO(), tom = addDays(today, 1);
  const lbl = (iso) => { const x = isoLocal(iso); return x === today ? t("pv_today") : x === tom ? t("pv_tomorrow") : fmtDate(x, { weekday: "short", day: "numeric", month: "short" }); };
  return `<div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("pv_next")}</h3></div>
    ${L.length ? `<div class="list">${L.slice(0, 6).map((l) => `<div class="list-item"><span class="sc-dot" style="background:${l.direction ? DIR_COLORS[l.direction] : "var(--border-strong)"}"></span>
      <span class="t"><b>${esc(lbl(l.at))} · ${hhmm(l.at)}</b><span>${l.direction ? esc(t("dirf_" + l.direction)) : ""}${l.specialist ? " · " + esc(l.specialist) : ""}${l.room ? " · " + esc(t("sc_room_s")) + " " + esc(l.room) : ""}</span></span></div>`).join("")}</div>` : ""}
    ${d.lessons_left != null ? `<div class="card-body hint">${esc(t("pv_left", { n: d.lessons_left }))}</div>` : ""}</div>`;
}

/* ---------- 3. Зарплата специалистов ---------- */
PAGES.salary = async (el, args, alive) => {
  document.title = t("nav_salary") + " · Сөйле Pro";
  const month = args[0] && /^\d{4}-\d{2}$/.test(args[0]) ? args[0] : todayISO().slice(0, 7);
  const m1 = month + "-01"; const n = new Date(m1 + "T00:00:00"); n.setMonth(n.getMonth() + 1); const m2 = isoLocal(n);
  const p = new Date(m1 + "T00:00:00"); p.setMonth(p.getMonth() - 1); const prev = isoLocal(p).slice(0, 7);
  const { data, error } = await sb.rpc("crm_salary", { p_org: S.org.id, p_from: m1, p_to: addDays(m2, -1) });
  if (!alive()) return; if (error) throw error;
  const rows = (data || []).map((r) => ({ ...r, m: S.staff.find((x) => x.id === r.member_id) })).filter((r) => r.m).sort((a, b) => b.done - a.done);
  CRM.salary = rows; CRM.salaryMonth = month;
  const total = rows.reduce((a, r) => a + r.salary, 0), rev = rows.reduce((a, r) => a + r.revenue, 0);
  const monthName = new Date(m1 + "T00:00:00").toLocaleDateString(locale(), { month: "long", year: "numeric" });
  const rateTxt = (r) => !r.amount ? `<span class="tag warn">${t("sl_no_rate")}</span>` : r.mode === "percent" ? r.amount + "%" : money(r.amount);
  el.innerHTML = `
  ${pageHead(t("sl_title"), monthName, `<div class="row" style="gap:6px">
      <button class="btn icon" data-act="go" data-href="#/salary/${prev}" aria-label="‹">${ic("left")}</button>
      <button class="btn" data-act="go" data-href="#/salary">${t("sc_today")}</button>
      <button class="btn icon" data-act="go" data-href="#/salary/${m2.slice(0, 7)}" aria-label="›">${ic("right")}</button></div>
      <button class="btn" data-act="salary-csv">${ic("report")}${t("sl_csv")}</button>`)}
  <div class="grid g-3" style="margin-bottom:16px">
    <div class="card kpi"><div class="label">${ic("wallet")}${t("sl_total")}</div><div class="value num">${money(total)}</div><div class="foot"></div></div>
    <div class="card kpi"><div class="label">${ic("calendar")}${t("sl_done")}</div><div class="value num">${rows.reduce((a, r) => a + r.done, 0)}</div><div class="foot">${t("sl_missed")}: ${rows.reduce((a, r) => a + r.missed, 0)}</div></div>
    <div class="card kpi"><div class="label">${ic("trend")}${t("sl_rev")}</div><div class="value num">${money(rev)}</div><div class="foot"></div></div>
  </div>
  <div class="card"><div class="table-wrap"><table class="table">
    <thead><tr><th>${t("sl_staff")}</th><th class="r">${t("sl_done")}</th><th class="r hide-m">${t("sl_missed")}</th><th class="hide-m">${t("sl_rate")}</th><th class="r">${t("sl_sum")}</th><th></th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td><div class="person"><span class="avatar">${esc(initials(r.m.full_name))}</span><div><b>${esc(r.m.full_name || roleName(r.m.role))}</b><span>${esc(r.m.specialty || roleName(r.m.role))}</span></div></div></td>
      <td class="r num">${r.done}</td><td class="r num hide-m">${r.missed}</td><td class="hide-m">${rateTxt(r)}${r.count_missed ? ` <span class="faint small">+${t("st_missed").toLowerCase()}</span>` : ""}</td>
      <td class="r num"><b>${fmtMoney(r.salary)}</b></td><td class="r"><button class="btn ghost sm" data-act="rate-edit" data-id="${r.member_id}">${ic("edit", 14)}</button></td></tr>`).join("")}</tbody></table></div>
    <div class="card-body hint">${t("sl_hint")}</div></div>`;
};
ACT["rate-edit"] = (el) => {
  const r = (CRM.salary || []).find((x) => x.member_id === el.dataset.id); if (!r) return;
  openModal(`${modalHead(t("sl_set"), r.m.full_name || "")}
    <form data-form="rate-save" data-id="${r.member_id}"><div class="modal-body form-grid">
      <div class="seg" id="rt-mode"><button type="button" data-v="lesson" class="${r.mode !== "percent" ? "on" : ""}">${t("sl_mode_lesson")}</button><button type="button" data-v="percent" class="${r.mode === "percent" ? "on" : ""}">${t("sl_mode_percent")}</button></div>
      <input type="hidden" name="mode" value="${r.mode === "percent" ? "percent" : "lesson"}">
      <div class="field"><label id="rt-lbl">${r.mode === "percent" ? "%" : "₸"}</label><input class="input" type="number" name="amount" min="0" max="${r.mode === "percent" ? 100 : 1000000}" step="1" value="${r.amount || ""}" required></div>
      <label class="check"><input type="checkbox" name="count_missed" ${r.count_missed ? "checked" : ""}> ${t("sl_count_missed")}</label>
      <div class="error-text hidden" data-err></div></div>
    <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${ic("check")}${t("save")}</button></div></form>`);
  $("#rt-mode").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; $$("#rt-mode button").forEach((x) => x.classList.toggle("on", x === b)); $("[name=mode]").value = b.dataset.v; $("#rt-lbl").textContent = b.dataset.v === "percent" ? "%" : "₸"; $("[name=amount]").max = b.dataset.v === "percent" ? 100 : 1000000; });
};
FORMS["rate-save"] = async (f, fd) => {
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.from("staff_rates").upsert({ member_id: f.dataset.id, org_id: S.org.id, mode: String(fd.get("mode")), amount: Math.round(+fd.get("amount") || 0), count_missed: !!fd.get("count_missed"), updated_at: new Date().toISOString() });
    if (error) return showFormErr(f, crmErr(error));
    closeModal(); toast(t("saved")); route();
  });
};
ACT["salary-csv"] = () => {
  const rows = CRM.salary || [];
  const head = [t("sl_staff"), t("sl_done"), t("sl_missed"), t("st_excused"), t("st_cancelled"), t("sl_rate"), t("sl_sum")];
  const lines = [head].concat(rows.map((r) => [r.m.full_name || "", r.done, r.missed, r.excused, r.cancelled, r.mode === "percent" ? r.amount + "%" : r.amount, r.salary]));
  const csv = "﻿" + lines.map((l) => l.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";")).join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = "zarplata-" + (CRM.salaryMonth || "") + ".csv"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
};

/* ---------- 4. «Сегодня по расписанию» на главной ---------- */
const _overview = PAGES.overview;
PAGES.overview = async (el, args, alive) => {
  await _overview(el, args, alive);
  if (!alive()) return;
  const d = todayISO();
  const [kids, r] = await Promise.all([getKids(), sb.from("lessons").select("*").eq("org_id", S.org.id)
    .gte("starts_at", new Date(d + "T00:00:00").toISOString()).lt("starts_at", new Date(addDays(d, 1) + "T00:00:00").toISOString()).order("starts_at")]);
  if (!alive() || r.error) return;
  const mine = S.me.role === "specialist";
  const L = (r.data || []).filter((l) => !mine || l.member_id === S.me.id);
  CRM.lessons = L;
  const marked = L.filter((l) => l.status !== "planned").length;
  const card = document.createElement("div"); card.className = "card"; card.style.marginBottom = "16px"; card.id = "today-card";
  card.innerHTML = `<div class="card-head"><h3>${t("td_title")}</h3><div class="row wrap" style="gap:6px">${L.length ? `<span class="small muted">${esc(t("td_marked", { a: marked, b: L.length }))}</span>` : ""}
      <button class="btn ghost sm" data-act="remind-tomorrow">${ic("chat", 14)}${t("rm_btn")}</button><a class="btn ghost sm" href="#/schedule">${t("td_all")}${ic("right", 14)}</a></div></div>
    ${L.length ? `<div class="td-list">${L.map(lessonTile).join("")}</div>` : `<div class="card-body faint">${t("td_none")}</div>`}`;
  const head = el.querySelector(".page-head");
  if (head && head.nextSibling) head.parentNode.insertBefore(card, head.nextSibling); else el.prepend(card);
};

(function () {
  const css = `
  .ld-board{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;align-items:start}
  .ld-col{background:var(--surface-3);border-radius:var(--r-lg);padding:10px;min-height:120px}
  .ld-ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.ld-ch b{font-size:13px;color:var(--text-3)}
  .ld-card{display:flex;flex-direction:column;align-items:flex-start;gap:3px;width:100%;text-align:left;border:0;background:var(--surface);border-radius:12px;padding:10px 11px;margin-bottom:8px;cursor:pointer;font:inherit;color:var(--text);box-shadow:var(--shadow)}
  .ld-card:hover{box-shadow:var(--shadow-lg)}.ld-card b{font-size:14px;font-weight:600}.ld-card>span{font-size:12.5px;color:var(--text-2)}
  .ld-meta{display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin-top:4px;width:100%}.ld-ago{margin-left:auto;font-size:11.5px;color:var(--text-3)}
  .ld-seg{display:none;flex-wrap:wrap}.ld-seg b{font-weight:700;color:var(--text-3);margin-left:2px}
  .td-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;padding:4px 16px 16px}.td-list .sc-l{margin:0}
  .copy-box code{word-break:break-all}
  @media (max-width:1100px){.ld-board{grid-template-columns:minmax(0,1fr)}.ld-col{display:none;background:none;padding:0}.ld-col.on{display:block}.ld-ch{display:none}.ld-seg{display:inline-flex}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();
