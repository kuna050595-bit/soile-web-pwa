/* Сөйле Pro — pages */

/* ---------- charts ---------- */
function sparkline(values, color, h = 56) {
  const W = 220, H = h, P = 4;
  const pts = values.map((v, i) => (v == null ? null : [P + (i * (W - 2 * P)) / Math.max(1, values.length - 1), H - P - (v / 100) * (H - 2 * P)]));
  const segs = []; let cur = [];
  pts.forEach((p) => { if (p) cur.push(p); else if (cur.length) { segs.push(cur); cur = []; } });
  if (cur.length) segs.push(cur);
  const known = pts.filter(Boolean);
  const line = segs.map((s) => "M" + s.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L")).join("");
  const area = known.length > 1 ? `M${known[0][0]},${H - P}L` + known.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + `L${known[known.length - 1][0]},${H - P}Z` : "";
  const last = known[known.length - 1];
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="trend">
    <defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <line x1="${P}" x2="${W - P}" y1="${H - P - (H - 2 * P) / 2}" y2="${H - P - (H - 2 * P) / 2}" stroke="var(--border)" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>
    ${area ? `<path d="${area}" fill="url(#${gid})"/>` : ""}
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    ${known.length === 1 ? `<circle cx="${known[0][0]}" cy="${known[0][1]}" r="3" fill="${color}"/>` : ""}
    ${last ? `<circle cx="${last[0]}" cy="${last[1]}" r="3.5" fill="var(--surface)" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/>` : ""}
  </svg>`;
}
function weeklyBars(weeks, series) {
  // series: {dir: [counts per week]}
  const W = 640, H = 200, P = { l: 30, r: 8, t: 10, b: 26 };
  const totals = weeks.map((_, i) => DIRS.reduce((a, d) => a + (series[d] ? series[d][i] : 0), 0));
  const max = Math.max(4, ...totals); const step = Math.ceil(max / 4);
  const top = step * 4; const bw = (W - P.l - P.r) / weeks.length;
  let g = "";
  for (let k = 0; k <= 4; k++) {
    const y = P.t + (H - P.t - P.b) * (1 - (k * step) / top);
    g += `<line x1="${P.l}" x2="${W - P.r}" y1="${y}" y2="${y}" stroke="var(--border)" ${k ? 'stroke-dasharray="3 3"' : ""}/><text x="${P.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--text-3)">${k * step}</text>`;
  }
  weeks.forEach((w, i) => {
    let y = H - P.b; const x = P.l + i * bw + bw * 0.22; const width = bw * 0.56;
    DIRS.forEach((d, di) => {
      const v = series[d] ? series[d][i] : 0; if (!v) return;
      const hh = ((H - P.t - P.b) * v) / top; y -= hh;
      g += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${Math.max(0, hh - 1.5).toFixed(1)}" rx="3" fill="${DIR_COLORS[d]}"><title>${t("dir_" + d)}: ${v}</title></rect>`;
    });
    g += `<text x="${(x + width / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--text-3)">${esc(fmtDate(w, { day: "numeric", month: "numeric" }))}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="sessions per week" style="width:100%;height:auto">${g}</svg>`;
}
function emptyState(icon, title, sub, action) {
  return `<div class="empty"><div class="ico">${ic(icon)}</div><b>${esc(title)}</b>${sub ? `<div>${esc(sub)}</div>` : ""}${action || ""}</div>`;
}
function pageHead(title, sub, actions) {
  return `<div class="page-head"><div><h1>${esc(title)}</h1>${sub ? `<div class="sub">${esc(sub)}</div>` : ""}</div>${actions ? `<div class="actions">${actions}</div>` : ""}</div>`;
}

/* ---------- overview ---------- */
PAGES.overview = async (el, args, alive) => {
  document.title = t("nav_overview") + " · Сөйле Pro";
  if (!isManager()) return overviewSpecialist(el, alive);
  const since = new Date(Date.now() - 55 * 864e5).toISOString().slice(0, 10);
  const [ov, ss] = await Promise.all([
    sb.rpc("org_overview", { p_org: S.org.id }),
    sb.from("sessions").select("held_on, direction").eq("org_id", S.org.id).gte("held_on", since).limit(5000),
  ]);
  if (ov.error) throw ov.error;
  if (!alive()) return;
  const o = ov.data || {};
  const weeks = weekStarts(8); const series = {};
  DIRS.forEach((d) => (series[d] = weeks.map(() => 0)));
  (ss.data || []).forEach((s) => { const i = weeks.indexOf(weekOf(s.held_on)); if (i >= 0 && series[s.direction]) series[s.direction][i]++; });
  const staffCount = S.staff.filter((m) => m.role !== "owner").length;
  const att = (o.idle || []).length + (o.stuck || []).length + (o.unsent_reports ? 1 : 0);

  el.innerHTML = `
  ${pageHead(t("ov_title"), t("ov_sub"), `<button class="btn" data-act="go" data-href="#/children">${ic("kids")}${t("nav_children")}</button><button class="btn primary" data-act="log-session">${ic("plus")}${t("quick_log")}</button>`)}
  <div class="grid g-4">
    <div class="card kpi"><div class="label">${ic("kids")}${t("kpi_kids")}</div><div class="value num">${o.kids || 0}</div><div class="foot">${t("kpi_kids_foot", { n: (o.branches || []).length })}</div></div>
    <div class="card kpi"><div class="label">${ic("team")}${t("kpi_staff")}</div><div class="value num">${staffCount}</div><div class="foot">${t("kpi_staff_foot")}</div></div>
    <div class="card kpi"><div class="label">${ic("calendar")}${t("kpi_sessions")}</div><div class="value num">${o.sessions_week || 0}</div><div class="foot">${esc(fmtDate(new Date(Date.now() - 6 * 864e5).toISOString()))} – ${esc(fmtDate(todayISO()))}</div></div>
    <div class="card kpi"><div class="label">${ic("trend")}${t("kpi_progress")}</div><div class="value num">${o.avg_now != null ? o.avg_now + "<small>%</small>" : "—"}</div><div class="foot">${deltaTag(o.avg_delta)} ${t("kpi_prog_foot")}</div></div>
  </div>

  <div class="grid g-main" style="margin-top:16px">
    <div class="stack">
      <div class="card">
        <div class="card-head"><h3>${t("ov_branches")}</h3>${isManager() ? `<button class="btn ghost sm" data-act="go" data-href="#/branches">${t("open")}${ic("right")}</button>` : ""}</div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>${t("col_branch")}</th><th class="r">${t("col_kids")}</th><th class="r hide-m">${t("col_sessions7")}</th><th style="width:34%">${t("col_progress")}</th><th class="r hide-m">${t("col_delta")}</th></tr></thead>
          <tbody>${(o.branches || []).map((b) => `<tr class="click" data-act="go" data-href="#/children/${b.id}">
            <td><b>${esc(b.name)}</b><div class="small faint">${esc(b.city || "")}</div></td>
            <td class="r num">${b.kids}</td><td class="r num hide-m">${b.sessions_week}</td>
            <td>${meter(b.avg_now)}</td><td class="r hide-m">${deltaTag(b.avg_delta) || '<span class="faint">—</span>'}</td></tr>`).join("")}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>${t("ov_weekly")}</h3><div class="legend">${DIRS.map((d) => `<span><i style="background:${DIR_COLORS[d]}"></i>${esc(t("dir_" + d))}</span>`).join("")}</div></div>
        <div class="card-body">${weeklyBars(weeks, series)}</div>
      </div>
    </div>
    <div class="stack">
      <div class="card">
        <div class="card-head"><h3>${t("ov_attention")}</h3>${att ? `<span class="tag warn">${att}</span>` : ""}</div>
        <div class="list">
          ${!att ? `<div class="empty"><div class="ico">${ic("check")}</div>${t("att_none")}</div>` : ""}
          ${(o.idle || []).slice(0, 4).map((k) => `<div class="list-item click" data-act="go" data-href="#/child/${k.id}">
            <span class="avatar">${esc(initials(k.name))}</span><span class="t"><b>${esc(k.name)}</b><span>${t("att_idle")}</span></span><span class="tag warn">${ic("clock", 12)}${k.days} ${S.lang === "kk" ? "күн" : "дн."}</span></div>`).join("")}
          ${(o.stuck || []).slice(0, 4).map((k) => `<div class="list-item click" data-act="go" data-href="#/child/${k.id}">
            <span class="avatar">${esc(initials(k.name))}</span><span class="t"><b>${esc(k.name)}</b><span>${esc(k.goal)} · ${t("att_stuck").toLowerCase()}</span></span>${ic("right", 16)}</div>`).join("")}
          ${o.unsent_reports ? `<div class="list-item click" data-act="go" data-href="#/reports"><span class="avatar" style="background:var(--warn-soft);color:var(--warn)">${ic("report", 18)}</span><span class="t"><b>${o.unsent_reports} · ${t("att_reports")}</b><span>${t("att_open_reports")}</span></span>${ic("right", 16)}</div>` : ""}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>${t("ov_dirs")}</h3></div>
        <div class="card-body stack" style="gap:14px">
          ${(o.by_direction || []).sort((a, b) => DIRS.indexOf(a.direction) - DIRS.indexOf(b.direction)).map((d) => `<div>
            <div class="row" style="justify-content:space-between;margin-bottom:6px">${dirTag(d.direction, true)}<span class="small faint">${t("ov_dirs_kids", { n: d.kids })}</span></div>
            ${meter(d.avg_now, DIR_COLORS[d.direction])}</div>`).join("") || `<div class="faint">${t("no_data")}</div>`}
        </div>
      </div>
    </div>
  </div>`;
};

async function overviewSpecialist(el, alive) {
  const kids = await getKids(true);
  if (!alive()) return;
  const active = kids.filter((k) => k.active);
  const withP = active.filter((k) => k.pct_now != null);
  const avg = withP.length ? Math.round(withP.reduce((a, k) => a + k.pct_now, 0) / withP.length) : null;
  const withD = active.filter((k) => k.pct_delta != null);
  const avgD = withD.length ? Math.round(withD.reduce((a, k) => a + k.pct_delta, 0) / withD.length) : null;
  const idle = active.filter((k) => daysSince(k.last_on) == null || daysSince(k.last_on) >= 7);
  const due = active.filter((k) => !k.last_report || daysSince(k.last_report) > 35);
  const sess = active.reduce((a, k) => a + (k.sessions_28 || 0), 0);
  const first = (S.me.full_name || "").split(" ")[0];
  el.innerHTML = `
  ${pageHead(t("ov_title_spec", { name: first }), t("ov_sub_spec"), `<button class="btn primary" data-act="log-session">${ic("plus")}${t("quick_log")}</button>`)}
  <div class="grid g-4">
    <div class="card kpi"><div class="label">${ic("kids")}${t("my_kids")}</div><div class="value num">${active.length}</div><div class="foot">${esc(branchName(S.me.branch_id) || "")}</div></div>
    <div class="card kpi"><div class="label">${ic("calendar")}${t("tab_sessions")}</div><div class="value num">${sess}</div><div class="foot">4 ${t("weeks")}</div></div>
    <div class="card kpi"><div class="label">${ic("trend")}${t("kpi_progress")}</div><div class="value num">${avg != null ? avg + "<small>%</small>" : "—"}</div><div class="foot">${deltaTag(avgD)} ${t("kpi_prog_foot")}</div></div>
    <div class="card kpi"><div class="label">${ic("report")}${t("rp_overdue")}</div><div class="value num">${due.length}</div><div class="foot"><a href="#/reports">${t("att_open_reports")}</a></div></div>
  </div>
  <div class="grid g-main" style="margin-top:16px">
    <div class="card">
      <div class="card-head"><h3>${t("my_kids")}</h3><a class="btn ghost sm" href="#/children">${t("open")}${ic("right")}</a></div>
      <div class="list">${active.slice().sort((a, b) => (a.last_on || "") > (b.last_on || "") ? 1 : -1).slice(0, 8).map((k) => `
        <div class="list-item click" data-act="go" data-href="#/child/${k.id}">
          <span class="avatar">${esc(initials(childName(k)))}</span>
          <span class="t"><b>${esc(childName(k))}</b><span>${esc(relDay(k.last_on))}</span></span>
          <span class="hide-m" style="width:160px">${meter(k.pct_now)}</span>
          <button class="btn sm" data-act="log-session" data-child="${k.id}">${ic("plus")}<span class="hide-m">${t("nav_session")}</span></button>
        </div>`).join("") || emptyState("kids", t("ch_empty"), "")}</div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t("ov_attention")}</h3></div>
      <div class="list">${idle.slice(0, 6).map((k) => `<div class="list-item click" data-act="go" data-href="#/child/${k.id}"><span class="avatar">${esc(initials(childName(k)))}</span><span class="t"><b>${esc(childName(k))}</b><span>${t("att_idle")}</span></span><span class="tag warn">${esc(relDay(k.last_on))}</span></div>`).join("") || `<div class="empty"><div class="ico">${ic("check")}</div>${t("att_none")}</div>`}</div>
    </div>
  </div>`;
}

/* ---------- children ---------- */
const kidFilter = { q: "", branch: "", dir: "", status: "active" };
PAGES.children = async (el, args, alive) => {
  document.title = t("nav_children") + " · Сөйле Pro";
  kidFilter.branch = args[0] || "";
  const [kids, links] = await Promise.all([
    getKids(true),
    sb.from("child_links").select("id, child_id, org_id, children(id, first_name, last_initial, birth_year, directions), src:orgs!child_links_org_id_fkey(name)").eq("target_org_id", S.org.id).eq("active", true),
  ]);
  if (!alive()) return;
  const showBranch = isManager() && S.branches.length > 1;
  el.innerHTML = `
  ${pageHead(t("ch_title"), t("ch_count", { n: kids.filter((k) => k.active).length }), `<button class="btn primary" data-act="child-new">${ic("plus")}${t("ch_add")}</button>`)}
  <div class="card">
    <div class="toolbar">
      <label class="search"><span class="sr">${t("search")}</span>${ic("search")}<input class="input" data-kf="q" placeholder="${esc(t("ch_search"))}" value="${esc(kidFilter.q)}"></label>
      ${showBranch ? `<select class="input" data-kf="branch"><option value="">${t("ch_all_branches")}</option>${S.branches.map((b) => `<option value="${b.id}" ${kidFilter.branch === b.id ? "selected" : ""}>${esc(b.name)}</option>`).join("")}</select>` : ""}
      <select class="input" data-kf="dir"><option value="">${t("ch_all_dirs")}</option>${DIRS.map((d) => `<option value="${d}" ${kidFilter.dir === d ? "selected" : ""}>${esc(t("dirf_" + d))}</option>`).join("")}</select>
      <div class="seg"><button data-act="kf-status" data-v="active" class="${kidFilter.status === "active" ? "on" : ""}">${t("st_active")}</button><button data-act="kf-status" data-v="archive" class="${kidFilter.status === "archive" ? "on" : ""}">${t("inactive")}</button></div>
    </div>
    <div id="kids-table"></div>
  </div>
  ${(links.data || []).length ? `<div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("ch_linked")}</h3></div><div class="list">
    ${links.data.filter((l) => l.children).map((l) => `<div class="list-item click" data-act="go" data-href="#/child/${l.child_id}"><span class="avatar">${esc(initials(childName(l.children)))}</span><span class="t"><b>${esc(childName(l.children))}</b><span>${esc((l.src && l.src.name) || "")}</span></span><div class="tags hide-m">${(l.children.directions || []).map((d) => dirTag(d)).join("")}</div>${ic("right", 16)}</div>`).join("")}
  </div></div>` : ""}`;
  drawKids(kids, showBranch);
  $$("[data-kf]", el).forEach((inp) => inp.addEventListener("input", () => { kidFilter[inp.dataset.kf] = inp.value; drawKids(kids, showBranch); }));
};
ACT["kf-status"] = (el) => { kidFilter.status = el.dataset.v; $$(".seg button", el.parentNode).forEach((b) => b.classList.toggle("on", b === el)); drawKids(S.kids || [], isManager() && S.branches.length > 1); };
function drawKids(kids, showBranch) {
  const q = kidFilter.q.trim().toLowerCase();
  const list = kids.filter((k) => (kidFilter.status === "active" ? k.active : !k.active)
    && (!q || childName(k).toLowerCase().includes(q))
    && (!kidFilter.branch || k.branch_id === kidFilter.branch)
    && (!kidFilter.dir || (k.directions || []).includes(kidFilter.dir)));
  const box = $("#kids-table"); if (!box) return;
  if (!kids.length) { box.innerHTML = emptyState("kids", t("ch_empty"), t("ch_empty_sub"), `<button class="btn primary" style="margin-top:14px" data-act="child-new">${ic("plus")}${t("ch_add")}</button>`); return; }
  if (!list.length) { box.innerHTML = emptyState("search", t("ch_nores"), ""); return; }
  box.innerHTML = `<div class="table-wrap"><table class="table">
    <thead><tr><th>${t("col_child")}</th>${showBranch ? `<th class="hide-m">${t("col_branch")}</th>` : ""}<th class="hide-m">${t("col_dirs")}</th><th class="hide-m">${t("col_last")}</th><th style="width:24%">${t("col_prog")}</th><th class="r hide-m">${t("col_delta")}</th></tr></thead>
    <tbody>${list.map((k) => {
      const idle = daysSince(k.last_on); const warn = idle == null || idle >= 7;
      return `<tr class="click" data-act="go" data-href="#/child/${k.id}">
      <td><div class="person"><span class="avatar">${esc(initials(childName(k)))}</span><div><b>${esc(childName(k))}</b><span>${k.birth_year ? esc(t("age", { n: ageOf(k.birth_year) })) : ""}${k.goals_active ? " · " + k.goals_active + " " + (S.lang === "kk" ? "мақсат" : "цел.") : ""}</span></div></div></td>
      ${showBranch ? `<td class="hide-m">${esc(branchName(k.branch_id))}</td>` : ""}
      <td class="hide-m"><div class="tags">${(k.directions || []).map((d) => dirTag(d)).join("")}</div></td>
      <td class="hide-m nowrap ${warn ? "" : "muted"}">${warn ? `<span class="tag warn">${esc(relDay(k.last_on))}</span>` : esc(relDay(k.last_on))}</td>
      <td>${meter(k.pct_now)}</td>
      <td class="r hide-m">${deltaTag(k.pct_delta) || '<span class="faint">—</span>'}</td></tr>`;
    }).join("")}</tbody></table></div>`;
}

/* ---------- child form ---------- */
function childFormHtml(c) {
  c = c || {};
  const branches = !isManager() && S.me.branch_id ? S.branches.filter((b) => b.id === S.me.branch_id) : S.branches;
  const year = new Date().getFullYear();
  return `${modalHead(c.id ? t("cf_edit") : t("cf_new"), t("cf_privacy"))}
  <form data-form="child-save" data-id="${c.id || ""}">
  <div class="modal-body form-grid">
    <div class="form-row">
      <div class="field"><label>${t("cf_first")}</label><input class="input" name="first_name" required maxlength="60" value="${esc(c.first_name || "")}"></div>
      <div class="field"><label>${t("cf_initial")}</label><input class="input" name="last_initial" maxlength="1" value="${esc(c.last_initial || "")}" placeholder="А"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>${t("cf_birth")}</label><select class="input" name="birth_year"><option value="">—</option>${Array.from({ length: 18 }, (_, i) => year - 1 - i).map((y) => `<option ${c.birth_year === y ? "selected" : ""}>${y}</option>`).join("")}</select></div>
      <div class="field"><label>${t("cf_branch")}</label><select class="input" name="branch_id" required>${branches.map((b) => `<option value="${b.id}" ${c.branch_id === b.id ? "selected" : ""}>${esc(b.name)}</option>`).join("")}</select></div>
    </div>
    <div class="field"><span class="label">${t("directions")}</span><div class="chips-select">${DIRS.map((d) => `<label class="chip-toggle"><input type="checkbox" name="dirs" value="${d}" ${(c.directions || []).includes(d) ? "checked" : ""}>${esc(t("dirf_" + d))}</label>`).join("")}</div></div>
    <div class="form-row">
      <div class="field"><label>${t("cf_parent")} <span class="faint">· ${t("optional")}</span></label><input class="input" name="parent_name" maxlength="60" value="${esc(c.parent_name || "")}"></div>
      <div class="field"><label>${t("cf_phone")} <span class="faint">· ${t("optional")}</span></label><input class="input" name="parent_phone" type="tel" maxlength="20" placeholder="+7 7__ ___ __ __" value="${esc(c.parent_phone || "")}"></div>
    </div>
    <div class="field"><label>${t("cf_notes")} <span class="faint">· ${t("optional")}</span></label><textarea class="input" name="notes" maxlength="1000" placeholder="${esc(t("cf_notes_ph"))}">${esc(c.notes || "")}</textarea></div>
    <div class="field"><label>${t("cf_code")} <span class="faint">· ${t("optional")}</span></label><input class="input" name="soile_code" maxlength="20" value="${esc(c.soile_code || "")}" placeholder="XXXX-XXXX"></div>
    ${c.id ? `<label class="check"><input type="checkbox" name="active" ${c.active ? "checked" : ""}>${t("cf_active")}</label>` : ""}
    <label class="check"><input type="checkbox" name="consent" ${c.consent_at ? "checked disabled" : ""}>${t("cf_consent")}</label>
    <a class="small" href="legal/consent.html${S.lang === "kk" ? "?lang=kk" : ""}" target="_blank" rel="noopener" style="margin-top:-6px">${ic("report", 14)} ${t("cf_consent_form")}</a>
    <div class="error-text hidden" data-err></div>
  </div>
  <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${t("save")}</button></div>
  </form>`;
}
ACT["child-new"] = () => openModal(childFormHtml(null));
FORMS["child-save"] = async (f, fd) => {
  const id = f.dataset.id;
  const consentEl = f.querySelector("[name=consent]");
  if (!id && !consentEl.checked) return showFormErr(f, t("cf_consent_req"));
  const row = {
    first_name: String(fd.get("first_name") || "").trim(), last_initial: String(fd.get("last_initial") || "").trim().toUpperCase() || null,
    birth_year: fd.get("birth_year") ? Number(fd.get("birth_year")) : null, branch_id: String(fd.get("branch_id")),
    directions: fd.getAll("dirs"), parent_name: String(fd.get("parent_name") || "").trim() || null,
    parent_phone: String(fd.get("parent_phone") || "").trim() || null, notes: String(fd.get("notes") || "").trim() || null,
    soile_code: String(fd.get("soile_code") || "").trim().toUpperCase() || null,
  };
  if (!row.first_name) return showFormErr(f, t("err_name"));
  if (id) row.active = !!f.querySelector("[name=active]").checked;
  if (consentEl.checked && !consentEl.disabled) row.consent_at = new Date().toISOString();
  await busy(f.querySelector(".btn.primary"), async () => {
    let res;
    if (id) res = await sb.from("children").update(row).eq("id", id).select("id").single();
    else res = await sb.from("children").insert({ ...row, org_id: S.org.id, created_by: S.user.id }).select("id").single();
    if (res.error) return showFormErr(f, errMsg(res.error));
    closeModal(); toast(t("saved")); S.kids = null;
    if (id) route(); else location.hash = "#/child/" + res.data.id;
  });
};

/* ---------- child page ---------- */
let CH = null; // current child bundle
async function loadChild(id) {
  const since = new Date(Date.now() - 120 * 864e5).toISOString().slice(0, 10);
  const [c, g, p, s, r, l, pa, ap, hc] = await Promise.all([
    sb.from("children").select("*").eq("id", id).maybeSingle(),
    sb.from("goals").select("*").eq("child_id", id).order("created_at"),
    sb.rpc("child_progress", { p_child: id, p_weeks: 8 }),
    sb.from("sessions").select("id, direction, held_on, note, member_id, created_at, session_results(goal_id, ok, pr, no)").eq("child_id", id).gte("held_on", since).order("held_on", { ascending: false }).order("created_at", { ascending: false }).limit(60),
    sb.from("reports").select("*").eq("child_id", id).order("created_at", { ascending: false }),
    sb.from("child_links").select("id, target_org_id, active, consent_note, created_at, tgt:orgs!child_links_target_org_id_fkey(name, city)").eq("child_id", id).eq("active", true),
    sb.from("parent_access").select("token").eq("child_id", id).maybeSingle(),
    sb.from("app_pairings").select("id, linked_at, active").eq("child_id", id).eq("active", true).order("linked_at", { ascending: false }),
    sb.from("child_home_cards").select("card_ids, note, updated_at").eq("child_id", id).maybeSingle(),
  ]);
  if (c.error) throw c.error;
  if (!c.data) return null;
  let srcOrg = null;
  if (c.data.org_id !== S.org.id) { const o = await sb.from("orgs").select("name").eq("id", c.data.org_id).maybeSingle(); srcOrg = o.data ? o.data.name : ""; }
  return { child: c.data, goals: g.data || [], prog: p.data || [], sessions: s.data || [], reports: r.data || [], links: l.data || [], token: pa.data ? pa.data.token : null, apps: ap.data || [], home: hc.data || null, editable: c.data.org_id === S.org.id, srcOrg };
}
function goalStats(goalId) {
  const weeks = weekStarts(8);
  const vals = weeks.map((w) => { const p = CH.prog.find((x) => x.goal_id === goalId && String(x.week_start).slice(0, 10) === w); return p ? p.pct : null; });
  const known = vals.filter((v) => v != null);
  const now = known.length ? known[known.length - 1] : null;
  const first = known.length > 1 ? known[0] : null;
  const attempts = CH.prog.filter((x) => x.goal_id === goalId).reduce((a, x) => a + x.attempts, 0);
  return { vals, now, delta: now != null && first != null ? now - first : null, attempts };
}
PAGES.child = async (el, args, alive) => {
  const id = args[0]; const tab = args[1] || "progress";
  const data = await loadChild(id);
  if (!alive()) return;
  if (!data) { el.innerHTML = emptyState("kids", t("ch_nores"), ""); return; }
  CH = data; const c = data.child;
  document.title = childName(c) + " · Сөйле Pro";
  const ed = data.editable;
  const tabs = ["progress", "home", "sessions", "reports", "info"];
  const tabHref = (x) => `#/child/${id}/${x}`;
  el.innerHTML = `
  <a class="back" href="#/children">${ic("left")}${t("nav_children")}</a>
  <div class="child-head">
    <span class="avatar">${esc(initials(childName(c)))}</span>
    <div class="t">
      <h1>${esc(childName(c))} ${!c.active ? `<span class="tag">${t("inactive")}</span>` : ""}${ed && data.apps.length ? `<span class="tag accent" title="${esc(t("app_connected"))}">${ic("check", 12)}Сөйле</span>` : ""}</h1>
      <div class="meta">
        ${c.birth_year ? `<span>${esc(t("age", { n: ageOf(c.birth_year) }))}</span>` : ""}
        ${ed ? `<span>${ic("branch", 14)} ${esc(branchName(c.branch_id))}</span>` : `<span>${esc(data.srcOrg || "")}</span>`}
        <span class="tags">${(c.directions || []).map((d) => dirTag(d)).join("")}</span>
      </div>
    </div>
    <div class="row wrap">
      ${ed ? `<button class="btn" data-act="parent-link">${ic("link")}<span>${t("parent_link")}</span></button>
      <button class="btn primary" data-act="log-session" data-child="${c.id}">${ic("plus")}${t("log_session")}</button>` : ""}
    </div>
  </div>
  ${!ed ? `<div class="alert info" style="margin-bottom:16px">${ic("info")}<div>${esc(t("readonly_linked", { org: data.srcOrg || "" }))}</div></div>` : ""}
  <nav class="tabs">${tabs.filter((x) => ed || x !== "reports").map((x) => `<a href="${tabHref(x)}" class="${tab === x ? "on" : ""}">${t("tab_" + x)}</a>`).join("")}</nav>
  <div id="child-tab"></div>`;
  drawChildTab(tab);
};
function drawChildTab(tab) {
  const box = $("#child-tab"); if (!box) return;
  if (tab === "home") box.innerHTML = childHome();
  else if (tab === "sessions") box.innerHTML = childSessions();
  else if (tab === "reports") box.innerHTML = childReports();
  else if (tab === "info") box.innerHTML = childInfo();
  else box.innerHTML = childProgress();
}
function childProgress() {
  const ed = CH.editable;
  const goals = CH.goals;
  if (!goals.length) return `<div class="card">${emptyState("target", t("no_goals"), t("no_goals_sub"), ed ? `<button class="btn primary" style="margin-top:14px" data-act="goal-new">${ic("plus")}${t("goal_add")}</button>` : "")}</div>`;
  const dirs = DIRS.filter((d) => goals.some((g) => g.direction === d));
  return `<div class="stack">${dirs.map((d) => `
    <div class="card">
      <div class="card-head">${dirTag(d, true)}${ed ? `<button class="btn ghost sm" data-act="goal-new" data-dir="${d}">${ic("plus")}${t("goal_add")}</button>` : ""}</div>
      ${goals.filter((g) => g.direction === d).sort((a, b) => (a.status === "active" ? 0 : 1) - (b.status === "active" ? 0 : 1)).map((g) => {
        const st = goalStats(g.id);
        return `<div class="goal ${g.status}">
          <div>
            <div class="gt"><b>${esc(g.title)}</b></div>
            <div class="gmeta">
              <span class="tag ${g.status === "achieved" ? "ok" : g.status === "paused" ? "" : "accent"}">${t("st_" + g.status)}</span>
              ${st.now != null ? `<span class="pct" style="color:var(--text)">${st.now}%</span>` : `<span>${t("no_data")}</span>`}
              ${deltaTag(st.delta)}
              ${st.attempts ? `<span>${esc(t("attempts", { n: st.attempts }))}</span>` : ""}
              ${ed ? `<span class="spacer"></span><button class="btn ghost sm" data-act="goal-menu" data-id="${g.id}" aria-label="menu">${ic("more")}</button>` : ""}
            </div>
          </div>
          <div class="chart" title="${esc(t("trend_8w"))}">${sparkline(st.vals, DIR_COLORS[d])}</div>
        </div>`;
      }).join("")}
    </div>`).join("")}
    ${ed ? `<div><button class="btn" data-act="goal-new">${ic("plus")}${t("goal_add")}</button></div>` : ""}
  </div>`;
}
/* ---------- home cards (задание на дом в Сөйле) ---------- */
const CARD_MAP = Object.fromEntries((window.SOILE_CARDS || []).map((c) => [c[0], { id: c[0], cat: c[1], kk: c[2], ru: c[3], photo: c[4] }]));
const HOME_MAX = 12;
function cardTile(id, opts = {}) {
  const c = CARD_MAP[id]; if (!c) return "";
  const word = S.lang === "kk" ? c.kk : c.ru, sub = S.lang === "kk" ? c.ru : c.kk;
  return `<button type="button" class="hc-tile ${opts.on ? "on" : ""}" ${opts.act ? `data-act="${opts.act}" data-id="${esc(id)}"` : "tabindex=\"-1\""} data-name="${esc((c.ru + " " + c.kk).toLowerCase())}" data-cat="${esc(c.cat)}">
    ${c.photo ? `<img src="../${esc(c.photo)}" alt="" loading="lazy">` : `<span class="hc-ph">${esc(word.slice(0, 2))}</span>`}
    <span class="hc-w">${esc(word)}</span><span class="hc-s">${esc(sub)}</span>${opts.on ? `<span class="hc-check">${ic("check", 14)}</span>` : ""}</button>`;
}
function childHome() {
  const h = CH.home || { card_ids: [], note: "" }; const ids = h.card_ids || []; const ed = CH.editable;
  return `<div class="stack">
    <div class="card card-pad">
      <div class="row wrap" style="justify-content:space-between;gap:12px">
        <div style="max-width:620px"><h3>${t("hc_title")}</h3><p class="muted small" style="margin-top:4px">${t("hc_sub")}</p></div>
        ${ed ? `<button class="btn primary" data-act="hc-pick">${ic("plus")}${ids.length ? t("hc_change") : t("hc_pick")}</button>` : ""}
      </div>
      ${CH.apps.length ? `<div class="alert info" style="margin-top:14px">${ic("check")}<div>${t("hc_app_on")}</div></div>`
        : `<div class="alert" style="margin-top:14px">${ic("info")}<div>${t("hc_app_off")} ${ed ? `<a href="#/child/${CH.child.id}/info">${t("hc_connect")}</a>` : ""}</div></div>`}
    </div>
    <div class="card">
      <div class="card-head"><h3>${t("hc_cards")} · ${ids.length}/${HOME_MAX}</h3>${h.updated_at ? `<span class="small faint">${esc(fmtDate(h.updated_at, { day: "numeric", month: "short" }))}</span>` : ""}</div>
      <div class="card-body">${ids.length ? `<div class="hc-grid">${ids.map((id) => cardTile(id)).join("")}</div>` : `<div class="empty" style="padding:20px">${t("hc_empty")}</div>`}</div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t("hc_note")}</h3></div>
      <div class="card-body">${ed ? `<form data-form="hc-note" class="form-grid"><textarea class="input" name="note" maxlength="600" placeholder="${esc(t("hc_note_ph"))}">${esc(h.note || "")}</textarea><div><button class="btn">${t("save")}</button></div></form>` : `<p>${esc(h.note || "—")}</p>`}</div>
    </div>
  </div>`;
}
let HC = null;
ACT["hc-pick"] = () => {
  HC = { sel: ((CH.home && CH.home.card_ids) || []).slice(), cat: "", q: "" };
  const cats = window.SOILE_CATS || [];
  openModal(`${modalHead(t("hc_pick"), t("hc_pick_sub", { n: HOME_MAX }))}
    <div class="modal-body form-grid" style="padding-bottom:6px">
      <label class="search">${ic("search")}<input class="input" id="hc-q" placeholder="${esc(t("hc_search"))}"></label>
      <div class="chips-select" id="hc-cats" style="flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px">
        <button type="button" class="chip-toggle on" data-act="hc-cat" data-v="">${t("all")}</button>
        ${cats.map((c) => `<button type="button" class="chip-toggle" data-act="hc-cat" data-v="${c.key}">${esc(S.lang === "kk" ? c.kk : c.ru)}</button>`).join("")}
      </div>
      <div class="hc-grid hc-picker" id="hc-list"></div>
    </div>
    <div class="modal-foot"><span class="muted small" id="hc-count" style="margin-right:auto"></span><button class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary" data-act="hc-save">${t("save")}</button></div>`, { wide: true, noFocus: true });
  $("#hc-q").addEventListener("input", (e) => { HC.q = e.target.value.trim().toLowerCase(); drawPicker(); });
  drawPicker();
};
function drawPicker() {
  const list = Object.values(CARD_MAP).filter((c) => (!HC.cat || c.cat === HC.cat) && (!HC.q || (c.ru + " " + c.kk).toLowerCase().includes(HC.q)));
  const sel = HC.sel.filter((id) => list.some((c) => c.id === id));
  const rest = list.filter((c) => !HC.sel.includes(c.id));
  $("#hc-list").innerHTML = [...sel.map((id) => cardTile(id, { on: true, act: "hc-toggle" })), ...rest.map((c) => cardTile(c.id, { act: "hc-toggle" }))].join("") || `<div class="faint">${t("ch_nores")}</div>`;
  $("#hc-count").textContent = t("hc_count", { n: HC.sel.length, m: HOME_MAX });
}
ACT["hc-cat"] = (el) => { HC.cat = el.dataset.v; $$("#hc-cats .chip-toggle").forEach((b) => b.classList.toggle("on", b === el)); drawPicker(); };
ACT["hc-toggle"] = (el) => {
  const id = el.dataset.id; const i = HC.sel.indexOf(id);
  if (i >= 0) HC.sel.splice(i, 1); else { if (HC.sel.length >= HOME_MAX) return toast(t("hc_max", { n: HOME_MAX }), true); HC.sel.push(id); }
  drawPicker();
};
async function saveHome(patch) {
  const row = { child_id: CH.child.id, org_id: CH.child.org_id, card_ids: (CH.home && CH.home.card_ids) || [], note: (CH.home && CH.home.note) || null, updated_at: new Date().toISOString(), updated_by: S.user.id, ...patch };
  const { error } = await sb.from("child_home_cards").upsert(row, { onConflict: "child_id" });
  if (error) { toast(errMsg(error), true); return false; }
  return true;
}
ACT["hc-save"] = async (el) => {
  await busy(el, async () => { if (await saveHome({ card_ids: HC.sel })) { closeModal(); toast(t("hc_saved")); route(); } });
};
FORMS["hc-note"] = async (f, fd) => {
  await busy(f.querySelector(".btn"), async () => { if (await saveHome({ note: String(fd.get("note") || "").trim() || null })) { toast(t("saved")); route(); } });
};

function childSessions() {
  if (!CH.sessions.length) return `<div class="card">${emptyState("calendar", t("sessions_empty"), "", CH.editable ? `<button class="btn primary" style="margin-top:14px" data-act="log-session" data-child="${CH.child.id}">${ic("plus")}${t("log_session")}</button>` : "")}</div>`;
  const gmap = Object.fromEntries(CH.goals.map((g) => [g.id, g]));
  return `<div class="card">${CH.sessions.map((s) => `
    <div class="tl-item">
      <div class="tl-date">${esc(fmtDate(s.held_on, { day: "numeric", month: "short", weekday: "short" }))}</div>
      <div>
        <div class="row wrap">${dirTag(s.direction)}<span class="small muted">${esc(staffName(s.member_id))}</span></div>
        ${s.note ? `<p style="margin-top:6px">${esc(s.note)}</p>` : ""}
        ${(s.session_results || []).length ? `<div class="tl-res">${s.session_results.map((r) => gmap[r.goal_id] ? `<span class="res-pill">${esc(gmap[r.goal_id].title)} · <b style="color:var(--ok)">${r.ok}</b> / <b style="color:var(--warn)">${r.pr}</b> / <b style="color:var(--danger)">${r.no}</b></span>` : "").join("")}</div>` : ""}
      </div>
    </div>`).join("")}</div>`;
}
function childReports() {
  return `<div class="stack">
    <div class="card card-pad row wrap" style="justify-content:space-between">
      <div><h3>${t("rp_editor")}</h3><p class="muted small" style="margin-top:2px">${t("rp_sub")}</p></div>
      <button class="btn primary" data-act="report-new" data-child="${CH.child.id}">${ic("sparkle")}${t("rp_generate")}</button>
    </div>
    <div class="card">${CH.reports.length ? CH.reports.map((r) => `
      <div class="report-card">
        <div class="row wrap" style="margin-bottom:10px">
          <span class="tag ${r.status === "sent" ? "ok" : "warn"}">${r.status === "sent" ? t("rp_sent") : t("rp_draft")}</span>
          <span class="small faint">${esc(fmtDate(r.sent_at || r.created_at, { day: "numeric", month: "long", year: "numeric" }))} · ${r.lang === "kk" ? "Қаз" : "Рус"}</span>
          <span class="spacer"></span>
          ${r.status === "draft" ? `<button class="btn sm" data-act="report-edit" data-id="${r.id}">${ic("edit")}${t("edit")}</button>` : ""}
          <a class="btn sm" target="_blank" rel="noopener" href="${esc(waLink(r.body + (CH.token ? "\n\n" + appUrl("p=" + CH.token) : ""), CH.child.parent_phone))}" ${r.status === "draft" ? `data-act="report-wa" data-id="${r.id}"` : ""}>${ic("chat")}WhatsApp</a>
        </div>
        <div class="report-body">${esc(r.body)}</div>
      </div>`).join("") : emptyState("report", t("rp_empty"), "")}</div>
  </div>`;
}
function childInfo() {
  const c = CH.child; const ed = CH.editable;
  const row = (k, v) => `<div class="list-item"><span class="t"><span>${esc(k)}</span><b style="font-weight:500">${v || '<span class="faint">—</span>'}</b></span></div>`;
  return `<div class="grid g-2">
    <div class="card">
      <div class="card-head"><h3>${t("cf_edit")}</h3>${ed ? `<button class="btn sm" data-act="child-edit">${ic("edit")}${t("edit")}</button>` : ""}</div>
      <div class="list">
        ${row(t("cf_birth"), esc(c.birth_year || ""))}
        ${ed ? row(t("cf_branch"), esc(branchName(c.branch_id))) : ""}
        ${ed ? row(t("cf_parent"), esc(c.parent_name || "")) : ""}
        ${ed ? row(t("cf_phone"), c.parent_phone ? `<a href="tel:${esc(c.parent_phone)}">${esc(c.parent_phone)}</a>` : "") : ""}
        ${row(t("cf_notes"), esc(c.notes || ""))}
        ${ed ? row(t("cf_code"), esc(c.soile_code || "")) : ""}
        ${ed ? row(t("cf_consent").split(" ").slice(0, 3).join(" ") + "…", c.consent_at ? `<span class="tag ok">${ic("check", 12)} ${esc(fmtDate(c.consent_at, { day: "numeric", month: "short", year: "numeric" }))}</span>` : `<span class="tag warn">${t("cf_consent_req")}</span>`) : ""}
      </div>
    </div>
    ${ed ? `<div class="stack">
      <div class="card">
        <div class="card-head"><h3>${t("app_title")}</h3><button class="btn sm primary" data-act="app-pair">${ic("link")}${t("app_connect")}</button></div>
        <div class="list">${CH.apps.length ? CH.apps.map((a) => `<div class="list-item"><span class="org-avatar" style="background:var(--accent-soft);color:var(--accent)">${ic("check", 16)}</span><span class="t"><b>${t("app_connected")}</b><span>${esc(fmtDate(a.linked_at, { day: "numeric", month: "short", year: "numeric" }))}</span></span><button class="btn ghost sm danger" data-act="app-unpair" data-id="${a.id}">${t("tr_revoke")}</button></div>`).join("") : `<div class="card-body muted small">${t("app_none")}</div>`}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>${t("tr_title")}</h3><button class="btn sm" data-act="transfer">${ic("transfer")}${t("tr_btn")}</button></div>
        <div class="list">${CH.links.length ? CH.links.map((l) => `<div class="list-item"><span class="org-avatar">${esc(initials((l.tgt && l.tgt.name) || "?"))}</span><span class="t"><b>${esc((l.tgt && l.tgt.name) || "—")}</b><span>${esc(fmtDate(l.created_at, { day: "numeric", month: "short", year: "numeric" }))}</span></span><button class="btn ghost sm danger" data-act="link-revoke" data-id="${l.id}">${t("tr_revoke")}</button></div>`).join("") : `<div class="card-body muted small">${t("tr_none")}</div>`}</div>
      </div>
      ${isManager() && S.branches.length > 1 ? `<div class="card card-pad">
        <h3>${t("move_branch")}</h3>
        <div class="row" style="margin-top:12px"><select class="input" id="move-branch">${S.branches.map((b) => `<option value="${b.id}" ${b.id === c.branch_id ? "selected" : ""}>${esc(b.name)}</option>`).join("")}</select><button class="btn" data-act="move-branch">${t("save")}</button></div>
      </div>` : ""}
    </div>` : ""}
  </div>`;
}
ACT["child-edit"] = () => openModal(childFormHtml(CH.child));
ACT["app-pair"] = () => {
  openModal(`${modalHead(t("app_title"), t("app_how"))}
    <form data-form="app-pair"><div class="modal-body form-grid">
      <div class="field"><label>${t("app_code")}</label><input class="input" name="code" required maxlength="8" autocomplete="off" placeholder="ABC234" style="text-transform:uppercase;letter-spacing:.2em;font-size:20px;font-weight:600;height:52px;max-width:220px"></div>
      <div class="error-text hidden" data-err></div>
    </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${t("app_connect")}</button></div></form>`);
};
FORMS["app-pair"] = async (f, fd) => {
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.rpc("pair_child", { p_child: CH.child.id, p_code: String(fd.get("code") || "") });
    if (error) return showFormErr(f, /code_invalid|code_used/.test(error.message) ? t("app_bad_code") : errMsg(error));
    closeModal(); toast(t("app_done")); route();
  });
};
ACT["app-unpair"] = async (el) => {
  const { error } = await sb.from("app_pairings").update({ active: false }).eq("id", el.dataset.id);
  if (error) return toast(errMsg(error), true); route();
};
ACT["move-branch"] = async (el) => {
  const b = $("#move-branch").value; if (b === CH.child.branch_id) return;
  await busy(el, async () => {
    const { error } = await sb.from("children").update({ branch_id: b }).eq("id", CH.child.id);
    if (error) return toast(errMsg(error), true);
    toast(t("move_done")); S.kids = null; route();
  });
};

/* goals */
ACT["goal-new"] = (el) => {
  const d0 = el.dataset.dir || (CH.child.directions || [])[0] || "aba";
  openModal(`${modalHead(t("goal_add"))}
    <form data-form="goal-save"><div class="modal-body form-grid">
      <div class="field"><span class="label">${t("goal_dir")}</span><div class="chips-select">${DIRS.map((d) => `<label class="chip-toggle"><input type="radio" name="direction" value="${d}" ${d === d0 ? "checked" : ""}>${esc(t("dirf_" + d))}</label>`).join("")}</div></div>
      <div class="field"><label>${t("goals")}</label><input class="input" name="title" required minlength="2" maxlength="200" placeholder="${esc(t("goal_ph"))}"></div>
      <div class="error-text hidden" data-err></div>
    </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${t("add")}</button></div></form>`);
};
FORMS["goal-save"] = async (f, fd) => {
  await busy(f.querySelector(".btn.primary"), async () => {
    const dir = String(fd.get("direction"));
    const { error } = await sb.from("goals").insert({ child_id: CH.child.id, org_id: CH.child.org_id, direction: dir, title: String(fd.get("title")).trim() });
    if (error) return showFormErr(f, errMsg(error));
    if (!(CH.child.directions || []).includes(dir)) await sb.from("children").update({ directions: [...(CH.child.directions || []), dir] }).eq("id", CH.child.id);
    closeModal(); toast(t("saved")); route();
  });
};
ACT["goal-menu"] = (el) => {
  const g = CH.goals.find((x) => x.id === el.dataset.id); if (!g) return;
  const opt = (st, label, icon) => `<div class="list-item click" data-act="goal-status" data-id="${g.id}" data-st="${st}">${ic(icon, 18)}<span class="t"><b style="font-weight:500">${label}</b></span></div>`;
  openModal(`${modalHead(g.title)}<div class="list" style="padding:8px 0 12px">
    ${g.status !== "achieved" ? opt("achieved", t("goal_mark_achieved"), "check") : ""}
    ${g.status === "active" ? opt("paused", t("goal_pause"), "clock") : opt("active", t("goal_resume"), "target")}
    <div class="list-item click" data-act="goal-del" data-id="${g.id}" style="color:var(--danger)">${ic("x", 18)}<span class="t"><b style="font-weight:500">${t("del")}</b></span></div>
  </div>`);
};
ACT["goal-status"] = async (el) => {
  const { error } = await sb.from("goals").update({ status: el.dataset.st }).eq("id", el.dataset.id);
  closeModal(); if (error) return toast(errMsg(error), true); route();
};
ACT["goal-del"] = async (el) => {
  if (!confirm(t("del") + "?")) return;
  const { error } = await sb.from("goals").delete().eq("id", el.dataset.id);
  closeModal(); if (error) return toast(errMsg(error), true); route();
};

/* parent link */
ACT["parent-link"] = async () => {
  let token = CH.token;
  if (!token) {
    const { data, error } = await sb.from("parent_access").insert({ child_id: CH.child.id }).select("token").single();
    if (error) return toast(errMsg(error), true);
    token = CH.token = data.token;
  }
  const url = appUrl("p=" + token);
  openModal(`${modalHead(t("pl_title"), t("pl_text"))}
    <div class="modal-body form-grid">
      <div class="copy-box"><input class="input" readonly value="${esc(url)}"><button class="btn" data-act="copy" data-v="${esc(url)}">${ic("copy")}</button></div>
    </div>
    <div class="modal-foot"><a class="btn" target="_blank" rel="noopener" href="${esc(url)}">${t("open")}</a><a class="btn primary" target="_blank" rel="noopener" href="${esc(waLink(t("pl_wa", { name: CH.child.first_name, url }), CH.child.parent_phone))}">${ic("chat")}${t("share_wa")}</a></div>`);
};
ACT["copy"] = (el) => copyText(el.dataset.v);

/* transfer */
ACT["transfer"] = async () => {
  const { data } = await sb.from("orgs").select("id, name, city, is_demo").eq("listed", true).neq("id", S.org.id).order("name");
  const orgs = (data || []).filter((o) => !!o.is_demo === !!S.org.is_demo && !CH.links.some((l) => l.target_org_id === o.id));
  openModal(`${modalHead(t("tr_title"), t("tr_sub"))}
    <form data-form="transfer"><div class="modal-body form-grid">
      <div class="field"><label>${t("tr_org")}</label><select class="input" name="org" required>${orgs.map((o) => `<option value="${o.id}">${esc(o.name)}${o.city ? " — " + esc(o.city) : ""}</option>`).join("")}</select>${!orgs.length ? `<span class="hint">${t("cat_empty")}</span>` : ""}</div>
      <label class="check"><input type="checkbox" name="consent" required>${t("tr_consent")}</label>
      <div class="error-text hidden" data-err></div>
    </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary" ${orgs.length ? "" : "disabled"}>${ic("transfer")}${t("tr_btn")}</button></div></form>`);
};
FORMS["transfer"] = async (f, fd) => {
  if (!fd.get("consent")) return showFormErr(f, t("cf_consent_req"));
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.from("child_links").insert({ child_id: CH.child.id, org_id: CH.child.org_id, target_org_id: String(fd.get("org")), consent_note: "parent_consent " + new Date().toISOString(), created_by: S.user.id });
    if (error) return showFormErr(f, errMsg(error));
    closeModal(); toast(t("tr_done")); route();
  });
};
ACT["link-revoke"] = async (el) => {
  const { error } = await sb.from("child_links").update({ active: false }).eq("id", el.dataset.id);
  if (error) return toast(errMsg(error), true); route();
};

/* ---------- session logging ---------- */
let SS = null;
ACT["log-session"] = async (el) => {
  let childId = el.dataset.child || (CH && parseHash().name === "child" && CH.editable ? CH.child.id : null);
  if (!childId) {
    const kids = (await getKids()).filter((k) => k.active);
    openModal(`${modalHead(t("ss_title"))}<div class="modal-body form-grid">
      <div class="field"><label>${t("ss_pick_child")}</label><label class="search">${ic("search")}<input class="input" id="ss-kid-q" placeholder="${esc(t("ch_search"))}"></label></div>
      <div class="list" id="ss-kid-list" style="max-height:50vh;overflow:auto;border:1px solid var(--border);border-radius:12px">${kids.map((k) => `<div class="list-item click" data-act="ss-pick" data-id="${k.id}" data-name="${esc(childName(k).toLowerCase())}"><span class="avatar">${esc(initials(childName(k)))}</span><span class="t"><b>${esc(childName(k))}</b><span>${esc(branchName(k.branch_id))}</span></span>${ic("right", 16)}</div>`).join("") || emptyState("kids", t("ch_empty"), "")}</div>
    </div>`);
    const q = $("#ss-kid-q"); if (q) q.addEventListener("input", () => { const v = q.value.trim().toLowerCase(); $$("#ss-kid-list .list-item").forEach((it) => it.classList.toggle("hidden", !!v && !it.dataset.name.includes(v))); });
    return;
  }
  openSessionModal(childId);
};
ACT["ss-pick"] = (el) => openSessionModal(el.dataset.id);
async function openSessionModal(childId) {
  const [c, g] = await Promise.all([
    sb.from("children").select("id, first_name, last_initial, directions, org_id").eq("id", childId).single(),
    sb.from("goals").select("id, direction, title, status").eq("child_id", childId).eq("status", "active").order("created_at"),
  ]);
  if (c.error) return toast(errMsg(c.error), true);
  const goals = g.data || [];
  const dirs = DIRS.filter((d) => (c.data.directions || []).includes(d) || goals.some((x) => x.direction === d));
  const pref = S.me.specialty ? DIRS.find((d) => (S.me.specialty.toLowerCase().includes(t("dir_" + d).toLowerCase()) || S.me.specialty.toLowerCase().includes(d))) : null;
  const dir = dirs.includes(pref) ? pref : dirs[0] || "aba";
  SS = { child: c.data, goals, dir, counts: {} };
  openModal(`${modalHead(t("ss_title"), childName(c.data))}
    <form data-form="session-save"><div class="modal-body form-grid">
      <div class="form-row">
        <div class="field"><label>${t("ss_dir")}</label><select class="input" name="direction" id="ss-dir">${(dirs.length ? dirs : DIRS).map((d) => `<option value="${d}" ${d === dir ? "selected" : ""}>${esc(t("dirf_" + d))}</option>`).join("")}</select></div>
        <div class="field"><label>${t("ss_date")}</label><input class="input" type="date" name="held_on" value="${todayISO()}" max="${todayISO()}"></div>
      </div>
      <div class="field"><label>${t("ss_note")}</label><textarea class="input" name="note" id="ss-note" maxlength="4000" placeholder="${esc(t("ss_note_ph"))}"></textarea>
        <div class="row wrap" style="margin-top:4px"><button type="button" class="btn sm" data-act="ss-ai">${ic("sparkle")}${t("ss_ai")}</button><span class="hint">${t("ss_ai_hint")}</span></div>
        <div id="ss-ai-out"></div>
      </div>
      <div class="field"><span class="label">${t("ss_counts")}</span><div id="ss-goals"></div></div>
      <div class="error-text hidden" data-err></div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${ic("check")}${t("save")}</button></div></form>`, { wide: true, noFocus: true });
  $("#ss-dir").addEventListener("change", (e) => { SS.dir = e.target.value; drawCounters(); });
  drawCounters();
}
function drawCounters() {
  const box = $("#ss-goals"); if (!box) return;
  const list = SS.goals.filter((g) => g.direction === SS.dir);
  if (!list.length) { box.innerHTML = `<div class="alert info">${ic("info")}<div>${t("ss_no_goals")}</div></div>`; return; }
  box.innerHTML = list.map((g) => {
    const c = SS.counts[g.id] || { ok: 0, pr: 0, no: 0 };
    const ctr = (k, sym, label) => `<div class="counter ${k}"><span class="k">${sym}<span class="kl"> ${label}</span></span><button type="button" data-act="ss-dec" data-g="${g.id}" data-k="${k}" aria-label="−">−</button><span class="num">${c[k]}</span><button type="button" data-act="ss-inc" data-g="${g.id}" data-k="${k}" aria-label="+">+</button></div>`;
    return `<div class="counter-row"><div><b style="font-weight:500">${esc(g.title)}</b></div><div class="counters">${ctr("ok", "✓", t("ok_s"))}${ctr("pr", "П", t("pr_s"))}${ctr("no", "✗", t("no_s"))}</div></div>`;
  }).join("");
}
ACT["ss-inc"] = (el) => { const c = (SS.counts[el.dataset.g] = SS.counts[el.dataset.g] || { ok: 0, pr: 0, no: 0 }); c[el.dataset.k] = Math.min(99, c[el.dataset.k] + 1); drawCounters(); };
ACT["ss-dec"] = (el) => { const c = (SS.counts[el.dataset.g] = SS.counts[el.dataset.g] || { ok: 0, pr: 0, no: 0 }); c[el.dataset.k] = Math.max(0, c[el.dataset.k] - 1); drawCounters(); };
ACT["ss-ai"] = async (el) => {
  const note = $("#ss-note").value.trim(); if (!note) { $("#ss-note").focus(); return; }
  await busy(el, async () => {
    const { data, error } = await sb.functions.invoke("ai", { body: { action: "parse_note", child_id: SS.child.id, direction: SS.dir, note } });
    const out = $("#ss-ai-out");
    if (error) {
      let code = ""; try { code = (await error.context.json()).error; } catch { /* ignore */ }
      out.innerHTML = `<div class="alert" style="margin-top:8px">${ic("alert")}<div>${code === "ai_not_configured" ? t("ai_off").split("—")[0] : t("ai_err")}</div></div>`; return;
    }
    (data.results || []).forEach((r) => { SS.counts[r.goal_id] = { ok: r.ok, pr: r.pr, no: r.no }; });
    drawCounters();
    out.innerHTML = `<div class="ai-box" style="margin-top:8px"><span class="ai-label">${ic("sparkle")}${t("ss_ai_done")}</span>${data.summary ? `<p class="small muted" style="margin-top:4px">${esc(data.summary)}</p>` : ""}</div>`;
  });
};
FORMS["session-save"] = async (f, fd) => {
  const results = SS.goals.filter((g) => g.direction === SS.dir).map((g) => ({ goal_id: g.id, ...(SS.counts[g.id] || { ok: 0, pr: 0, no: 0 }) })).filter((r) => r.ok + r.pr + r.no > 0);
  const note = String(fd.get("note") || "").trim();
  if (!results.length && !note) return showFormErr(f, t("ss_counts"));
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.rpc("save_session", { p_child: SS.child.id, p_direction: SS.dir, p_held_on: String(fd.get("held_on") || todayISO()), p_note: note, p_results: results });
    if (error) return showFormErr(f, errMsg(error));
    closeModal(); toast(t("ss_saved")); S.kids = null;
    if (parseHash().name === "child" && CH && CH.child.id === SS.child.id) route(); else location.hash = "#/child/" + SS.child.id + "/sessions";
  });
};

/* ---------- reports ---------- */
const HOME_TASKS = {
  ru: { afk: "Игры с мячом 5–10 минут: бросать, ловить, катить.", aba: "Просите подать предмет («дай ложку») и сразу хвалите.", logo: "На прогулке называйте вместе 5–10 предметов.", sens: "Игры с крупой или песком 5–10 минут перед сном." },
  kk: { afk: "Доппен 5–10 минут ойнаңыз: лақтыру, қағып алу, домалату.", aba: "Затты беруін сұраңыз («қасықты бер») және бірден мақтаңыз.", logo: "Серуенде 5–10 затты бірге атаңыз.", sens: "Ұйқы алдында жармамен не құммен 5–10 минут ойын." },
};
function templateReport(lang, c, goals, prog) {
  const st = goals.filter((g) => g.status !== "paused").map((g) => {
    const pts = prog.filter((p) => p.goal_id === g.id).sort((a, b) => (a.week_start > b.week_start ? 1 : -1));
    return { g, now: pts.length ? pts[pts.length - 1].pct : null, first: pts.length > 1 ? pts[0].pct : null };
  });
  const best = st.filter((x) => x.now != null).sort((a, b) => (b.now - (b.first || 0)) - (a.now - (a.first || 0)))[0];
  const work = st.filter((x) => x !== best && x.g.status === "active").slice(0, 2);
  const dirs = [...new Set(goals.map((g) => g.direction))].slice(0, 3);
  const n = c.first_name;
  if (lang === "kk") {
    return `Сәлеметсіз бе! ${n} соңғы 4 аптадағы жетістіктері туралы айтамыз.\n\n` +
      (best ? `✅ Жақсы шығып жатыр: «${best.g.title}» — ${best.now}%${best.first != null ? ` (бұрын ${best.first}%)` : ""}.\n` : "") +
      (work.length ? `🎯 Жұмыс істеп жатырмыз: ${work.map((x) => "«" + x.g.title + "»").join(", ")}.\n` : "") +
      `\n🏠 Үйде:\n${dirs.map((d) => "• " + HOME_TASKS.kk[d]).join("\n")}\n\nКішкентай жетістіктің өзі маңызды. Бізбен біргесіз — рахмет!`;
  }
  return `Здравствуйте! Делимся прогрессом ${n} за последние 4 недели.\n\n` +
    (best ? `✅ Хорошо получается: «${best.g.title}» — ${best.now}%${best.first != null ? ` (было ${best.first}%)` : ""}.\n` : "") +
    (work.length ? `🎯 Работаем над: ${work.map((x) => "«" + x.g.title + "»").join(", ")}.\n` : "") +
    `\n🏠 Дома:\n${dirs.map((d) => "• " + HOME_TASKS.ru[d]).join("\n")}\n\nДаже маленький шаг — это шаг. Спасибо, что вы с нами!`;
}
let RP = null;
ACT["report-new"] = (el) => openReportEditor(el.dataset.child, null);
ACT["report-edit"] = (el) => openReportEditor(CH.child.id, el.dataset.id);
async function openReportEditor(childId, reportId) {
  const [c, pa] = await Promise.all([
    sb.from("children").select("id, first_name, last_initial, parent_phone, org_id").eq("id", childId).single(),
    sb.from("parent_access").select("token").eq("child_id", childId).maybeSingle(),
  ]);
  if (c.error) return toast(errMsg(c.error), true);
  let existing = null;
  if (reportId) { const r = await sb.from("reports").select("*").eq("id", reportId).single(); existing = r.data; }
  RP = { child: c.data, token: pa.data ? pa.data.token : null, id: reportId, lang: existing ? existing.lang : S.lang };
  openModal(`${modalHead(t("rp_editor"), childName(c.data))}
    <div class="modal-body form-grid">
      <div class="row wrap"><span class="label">${t("rp_lang")}</span><div class="seg"><button class="${RP.lang === "kk" ? "on" : ""}" data-act="rp-lang" data-v="kk">Қазақша</button><button class="${RP.lang === "ru" ? "on" : ""}" data-act="rp-lang" data-v="ru">Русский</button></div><span class="spacer"></span><button class="btn sm" data-act="rp-gen">${ic("sparkle")}${t("rp_generate")}</button></div>
      <div id="rp-note"></div>
      <textarea class="input" id="rp-body" style="min-height:280px" maxlength="4000">${esc(existing ? existing.body : "")}</textarea>
    </div>
    <div class="modal-foot"><button class="btn" data-act="rp-save" data-st="draft">${t("save")}</button><button class="btn primary" data-act="rp-save" data-st="sent">${ic("chat")}${t("rp_send_wa")}</button></div>`, { wide: true, noFocus: true });
  if (!existing) ACT["rp-gen"]($("[data-act=rp-gen]"));
}
ACT["rp-lang"] = (el) => { RP.lang = el.dataset.v; $$(".seg button", el.parentNode).forEach((b) => b.classList.toggle("on", b === el)); ACT["rp-gen"]($("[data-act=rp-gen]")); };
ACT["rp-gen"] = async (el) => {
  const body = $("#rp-body"); const note = $("#rp-note");
  note.innerHTML = `<div class="ai-box"><span class="ai-label"><span class="spinner sm"></span>${t("rp_writing")}</span></div>`;
  await busy(el, async () => {
    const { data, error } = await sb.functions.invoke("ai", { body: { action: "report", child_id: RP.child.id, lang: RP.lang } });
    if (!error && data && data.text) {
      body.value = data.text.split("{ИМЯ}").join(RP.child.first_name);
      note.innerHTML = `<div class="ai-box"><span class="ai-label">${ic("sparkle")}${t("ss_ai_done")}</span></div>`;
      return;
    }
    const [g, p] = await Promise.all([
      sb.from("goals").select("id, direction, title, status").eq("child_id", RP.child.id),
      sb.rpc("child_progress", { p_child: RP.child.id, p_weeks: 8 }),
    ]);
    body.value = templateReport(RP.lang, RP.child, g.data || [], p.data || []);
    note.innerHTML = `<div class="alert info">${ic("info")}<div>${t("ai_off")}</div></div>`;
  });
};
ACT["rp-save"] = async (el) => {
  const text = $("#rp-body").value.trim(); if (!text) return;
  const sent = el.dataset.st === "sent";
  let win = null;
  if (sent) win = window.open("about:blank", "_blank");
  await busy(el, async () => {
    const row = { body: text, lang: RP.lang, status: sent ? "sent" : "draft", sent_at: sent ? new Date().toISOString() : null };
    const res = RP.id ? await sb.from("reports").update(row).eq("id", RP.id) : await sb.from("reports").insert({ ...row, child_id: RP.child.id, org_id: RP.child.org_id, created_by: S.user.id });
    if (res.error) { if (win) win.close(); return toast(errMsg(res.error), true); }
    if (sent) {
      let token = RP.token;
      if (!token) { const pa = await sb.from("parent_access").insert({ child_id: RP.child.id }).select("token").single(); token = pa.data && pa.data.token; }
      const url = waLink(text + (token ? "\n\n" + appUrl("p=" + token) : ""), RP.child.parent_phone);
      if (win) win.location.href = url; else location.href = url;
    }
    closeModal(); toast(t("saved")); S.kids = null; route();
  });
};
ACT["report-wa"] = async (el) => {
  await sb.from("reports").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", el.dataset.id);
  window.open(el.href, "_blank", "noopener"); route();
};

PAGES.reports = async (el, args, alive) => {
  document.title = t("nav_reports") + " · Сөйле Pro";
  const [kids, rp] = await Promise.all([
    getKids(true),
    sb.from("reports").select("id, child_id, status, lang, sent_at, created_at, body").eq("org_id", S.org.id).order("created_at", { ascending: false }).limit(40),
  ]);
  if (!alive()) return;
  const visible = new Set(kids.map((k) => k.id));
  const due = kids.filter((k) => k.active && (!k.last_report || daysSince(k.last_report) > 35));
  const recent = (rp.data || []).filter((r) => visible.has(r.child_id));
  const kmap = Object.fromEntries(kids.map((k) => [k.id, k]));
  el.innerHTML = `
  ${pageHead(t("rp_title"), t("rp_sub"))}
  <div class="grid g-2">
    <div class="card">
      <div class="card-head"><h3>${t("rp_due_list")}</h3>${due.length ? `<span class="tag warn">${due.length}</span>` : ""}</div>
      <div class="list">${due.map((k) => `<div class="list-item">
        <span class="avatar">${esc(initials(childName(k)))}</span>
        <span class="t"><b>${esc(childName(k))}</b><span>${k.last_report ? esc(t("rp_last", { d: fmtDate(k.last_report, { day: "numeric", month: "short" }) })) : t("rp_empty")}</span></span>
        <button class="btn sm" data-act="report-new" data-child="${k.id}">${ic("sparkle")}<span class="hide-m">${t("rp_generate")}</span></button>
      </div>`).join("") || `<div class="empty"><div class="ico">${ic("check")}</div>${t("rp_all_ok")}</div>`}</div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t("rp_recent")}</h3></div>
      <div class="list">${recent.map((r) => `<div class="list-item click" data-act="go" data-href="#/child/${r.child_id}/reports">
        <span class="avatar">${esc(initials(childName(kmap[r.child_id])))}</span>
        <span class="t"><b>${esc(childName(kmap[r.child_id]))}</b><span>${esc(r.body.slice(0, 70))}…</span></span>
        <span class="tag ${r.status === "sent" ? "ok" : "warn"}">${r.status === "sent" ? esc(fmtDate(r.sent_at)) : t("rp_draft")}</span>
      </div>`).join("") || emptyState("report", t("rp_empty"), "")}</div>
    </div>
  </div>`;
};

/* ---------- team ---------- */
PAGES.team = async (el, args, alive) => {
  document.title = t("nav_team") + " · Сөйле Pro";
  const [st, inv] = await Promise.all([
    sb.from("members").select("id, user_id, role, branch_id, full_name, specialty, created_at").eq("org_id", S.org.id).order("created_at"),
    sb.from("invites").select("*").eq("org_id", S.org.id).is("accepted_at", null).order("created_at", { ascending: false }),
  ]);
  if (!alive()) return;
  S.staff = st.data || [];
  el.innerHTML = `
  ${pageHead(t("tm_title"), t("tm_sub"), `<button class="btn primary" data-act="invite-new">${ic("plus")}${t("tm_invite")}</button>`)}
  <div class="card"><div class="table-wrap"><table class="table">
    <thead><tr><th>${t("col_member")}</th><th>${t("inv_role")}</th><th class="hide-m">${t("inv_branch")}</th><th></th></tr></thead>
    <tbody>${S.staff.map((m) => `<tr>
      <td><div class="person"><span class="avatar">${esc(initials(m.full_name))}</span><div><b>${esc(m.full_name || "—")}</b><span>${esc(m.specialty || "")}${m.user_id === S.user.id ? " · " + t("tm_you") : ""}</span></div></div></td>
      <td><span class="tag ${m.role === "owner" ? "accent" : ""}">${esc(roleName(m.role))}</span></td>
      <td class="hide-m">${m.branch_id ? esc(branchName(m.branch_id)) : `<span class="faint">${t("all_branches")}</span>`}</td>
      <td class="r">${m.role !== "owner" && m.user_id !== S.user.id && m.user_id && (S.me.role === "owner" || m.role !== "admin") ? `<button class="btn ghost sm" data-act="member-reset" data-id="${m.id}" data-name="${esc(m.full_name)}" title="${esc(t("tm_reset"))}" aria-label="${esc(t("tm_reset"))}">${ic("key")}</button>` : ""}${m.role !== "owner" && m.user_id !== S.user.id ? `<button class="btn ghost sm" data-act="member-remove" data-id="${m.id}" data-name="${esc(m.full_name)}" aria-label="${esc(t("tm_remove"))}">${ic("x")}</button>` : ""}</td>
    </tr>`).join("")}</tbody></table></div></div>
  ${(inv.data || []).length ? `<div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("tm_pending")}</h3></div><div class="list">
    ${inv.data.map((i) => `<div class="list-item"><span class="avatar">${ic("clock", 16)}</span><span class="t"><b>${esc(i.full_name || "—")}</b><span>${esc(roleName(i.role))}${i.branch_id ? " · " + esc(branchName(i.branch_id)) : ""}</span></span>
      <button class="btn sm" data-act="copy" data-v="${esc(appUrl("invite=" + i.token))}">${ic("copy")}<span class="hide-m">${t("copy")}</span></button>
      <button class="btn ghost sm danger" data-act="invite-revoke" data-id="${i.id}">${t("inv_revoke")}</button></div>`).join("")}
  </div></div>` : ""}`;
};
ACT["invite-new"] = () => {
  openModal(`${modalHead(t("tm_invite"))}
    <form data-form="invite-save"><div class="modal-body form-grid">
      <div class="field"><label>${t("inv_name")}</label><input class="input" name="full_name" required maxlength="80"></div>
      <div class="form-row">
        <div class="field"><label>${t("inv_role")}</label><select class="input" name="role"><option value="specialist">${t("role_specialist")}</option><option value="admin">${t("role_admin")}</option></select></div>
        <div class="field"><label>${t("inv_branch")}</label><select class="input" name="branch_id"><option value="">${t("all_branches")}</option>${S.branches.map((b) => `<option value="${b.id}">${esc(b.name)}</option>`).join("")}</select></div>
      </div>
      <div class="field"><label>${t("inv_spec")}</label><input class="input" name="specialty" maxlength="80" placeholder="${esc(t("inv_spec_ph"))}"></div>
      <div class="error-text hidden" data-err></div>
    </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${t("tm_invite")}</button></div></form>`);
};
FORMS["invite-save"] = async (f, fd) => {
  await busy(f.querySelector(".btn.primary"), async () => {
    const { data, error } = await sb.from("invites").insert({
      org_id: S.org.id, role: String(fd.get("role")), branch_id: String(fd.get("branch_id") || "") || null,
      full_name: String(fd.get("full_name") || "").trim(), specialty: String(fd.get("specialty") || "").trim() || null, created_by: S.user.id,
    }).select("token").single();
    if (error) return showFormErr(f, errMsg(error));
    const url = appUrl("invite=" + data.token);
    openModal(`${modalHead(t("inv_ready"))}<div class="modal-body"><div class="copy-box"><input class="input" readonly value="${esc(url)}"><button class="btn" data-act="copy" data-v="${esc(url)}">${ic("copy")}</button></div></div>
      <div class="modal-foot"><button class="btn" data-act="close-modal">${t("close")}</button><a class="btn primary" target="_blank" rel="noopener" href="${esc(waLink(t("inv_wa", { org: S.org.name, url })))}">${ic("chat")}${t("share_wa")}</a></div>`, { onClose: () => route() });
  });
};
ACT["invite-revoke"] = async (el) => { const { error } = await sb.from("invites").delete().eq("id", el.dataset.id); if (error) return toast(errMsg(error), true); route(); };
ACT["member-reset"] = async (el) => {
  if (S.org.is_demo) return toast(t("tm_reset_demo"), true);
  if (!confirm(t("tm_reset_q", { name: el.dataset.name }))) return;
  await busy(el, async () => {
    const { data, error } = await sb.functions.invoke("pub", { body: { action: "staff_reset", member_id: el.dataset.id } });
    if (error || !data || !data.password) {
      let code = ""; try { code = (await error.context.json()).error; } catch { /* ignore */ }
      return toast(code === "multi_org" ? t("tm_reset_multi") : t("err"), true);
    }
    const url = appUrl("login=1");
    const msg = t("tm_reset_wa", { org: S.org.name, url, email: data.email, pass: data.password });
    openModal(`${modalHead(t("tm_reset_title"), el.dataset.name)}<div class="modal-body stack" style="gap:12px">
      <p class="muted small">${t("tm_reset_text")}</p>
      <div class="copy-box"><input class="input" readonly value="${esc(data.email)}"><button class="btn" data-act="copy" data-v="${esc(data.email)}">${ic("copy")}</button></div>
      <div class="copy-box"><input class="input mono" readonly value="${esc(data.password)}"><button class="btn" data-act="copy" data-v="${esc(data.password)}">${ic("copy")}</button></div>
    </div><div class="modal-foot"><button class="btn" data-act="close-modal">${t("close")}</button><a class="btn primary" target="_blank" rel="noopener" href="${esc(waLink(msg))}">${ic("chat")}${t("share_wa")}</a></div>`);
  });
};
ACT["member-remove"] = async (el) => {
  if (!confirm(t("tm_remove_q", { name: el.dataset.name }))) return;
  const { error } = await sb.from("members").delete().eq("id", el.dataset.id); if (error) return toast(errMsg(error), true); route();
};

/* ---------- branches ---------- */
PAGES.branches = async (el, args, alive) => {
  document.title = t("nav_branches") + " · Сөйле Pro";
  const ov = await sb.rpc("org_overview", { p_org: S.org.id });
  if (!alive()) return;
  const stats = Object.fromEntries(((ov.data && ov.data.branches) || []).map((b) => [b.id, b]));
  el.innerHTML = `
  ${pageHead(t("br_title"), t("br_sub"), `<button class="btn primary" data-act="branch-edit">${ic("plus")}${t("br_add")}</button>`)}
  <div class="grid g-3">${S.branches.map((b) => { const s = stats[b.id] || {}; return `
    <div class="card card-pad stack" style="gap:14px">
      <div class="row"><span class="org-avatar">${ic("branch", 16)}</span><div class="spacer"><h3>${esc(b.name)}</h3><div class="small faint">${esc([b.city, b.address].filter(Boolean).join(", "))}</div></div><button class="btn ghost sm" data-act="branch-edit" data-id="${b.id}" aria-label="${esc(t("edit"))}">${ic("edit")}</button></div>
      <div class="grid g-3" style="gap:8px">
        <div><div class="small faint">${t("col_kids")}</div><div class="num" style="font-size:20px;font-weight:600">${s.kids || 0}</div></div>
        <div><div class="small faint">${t("col_staff")}</div><div class="num" style="font-size:20px;font-weight:600">${s.staff || 0}</div></div>
        <div><div class="small faint">7 ${S.lang === "kk" ? "күн" : "дн."}</div><div class="num" style="font-size:20px;font-weight:600">${s.sessions_week || 0}</div></div>
      </div>
      <div><div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="small muted">${t("col_progress")}</span>${deltaTag(s.avg_delta)}</div>${meter(s.avg_now)}</div>
      <a class="btn sm" href="#/children/${b.id}">${t("nav_children")}${ic("right")}</a>
    </div>`; }).join("")}</div>`;
};
ACT["branch-edit"] = (el) => {
  const b = S.branches.find((x) => x.id === el.dataset.id) || {};
  openModal(`${modalHead(b.id ? b.name : t("br_add"))}
    <form data-form="branch-save" data-id="${b.id || ""}"><div class="modal-body form-grid">
      <div class="field"><label>${t("br_name")}</label><input class="input" name="name" required maxlength="120" value="${esc(b.name || "")}"></div>
      <div class="form-row"><div class="field"><label>${t("br_city")}</label><input class="input" name="city" maxlength="60" value="${esc(b.city || S.org.city || "")}"></div>
      <div class="field"><label>${t("br_address")}</label><input class="input" name="address" maxlength="160" value="${esc(b.address || "")}"></div></div>
      <div class="error-text hidden" data-err></div>
    </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t("cancel")}</button><button class="btn primary">${t("save")}</button></div></form>`);
};
FORMS["branch-save"] = async (f, fd) => {
  const row = { name: String(fd.get("name")).trim(), city: String(fd.get("city") || "").trim() || null, address: String(fd.get("address") || "").trim() || null };
  await busy(f.querySelector(".btn.primary"), async () => {
    const res = f.dataset.id ? await sb.from("branches").update(row).eq("id", f.dataset.id) : await sb.from("branches").insert({ ...row, org_id: S.org.id });
    if (res.error) return showFormErr(f, errMsg(res.error));
    closeModal(); toast(t("saved")); await selectOrg(S.org.id); route();
  });
};

/* ---------- catalog ---------- */
const catFilter = { q: "", dir: "" };
PAGES.catalog = async (el, args, alive) => {
  document.title = t("nav_catalog") + " · Сөйле Pro";
  const { data, error } = await sb.from("orgs").select("id, name, city, description, phone, directions, is_demo").eq("listed", true).order("name");
  if (error) throw error;
  if (!alive()) return;
  const orgs = (data || []).filter((o) => !!o.is_demo === !!S.org.is_demo);
  el.innerHTML = `${pageHead(t("cat_title"), t("cat_sub"))}
  <div class="card" style="margin-bottom:16px"><div class="toolbar" style="border:0">
    <label class="search">${ic("search")}<input class="input" data-cf="q" placeholder="${esc(t("org_name") + " / " + t("city"))}"></label>
    <select class="input" data-cf="dir"><option value="">${t("ch_all_dirs")}</option>${DIRS.map((d) => `<option value="${d}">${esc(t("dirf_" + d))}</option>`).join("")}</select>
  </div></div>
  <div class="grid g-3" id="cat-list"></div>`;
  const draw = () => {
    const q = catFilter.q.trim().toLowerCase();
    const list = orgs.filter((o) => (!q || (o.name + " " + (o.city || "")).toLowerCase().includes(q)) && (!catFilter.dir || (o.directions || []).includes(catFilter.dir)));
    $("#cat-list").innerHTML = list.map((o) => `<div class="card cat-card">
      <div class="row"><span class="org-avatar">${esc(initials(o.name))}</span><div class="spacer"><h3>${esc(o.name)}</h3><div class="small faint">${esc(o.city || "")}</div></div>${o.id === S.org.id ? `<span class="tag accent">${t("cat_you")}</span>` : ""}</div>
      <div class="tags">${(o.directions || []).map((d) => dirTag(d)).join("")}</div>
      ${o.description ? `<p class="muted">${esc(o.description)}</p>` : ""}
      ${o.phone && o.id !== S.org.id ? `<div class="row" style="margin-top:auto"><a class="btn sm" href="tel:${esc(o.phone)}">${ic("phone")}${t("cat_call")}</a><a class="btn sm" target="_blank" rel="noopener" href="${esc(waLink("", o.phone))}">${ic("chat")}WhatsApp</a></div>` : ""}
    </div>`).join("") || `<div class="card" style="grid-column:1/-1">${emptyState("globe", t("cat_empty"), "")}</div>`;
  };
  $$("[data-cf]", el).forEach((i) => i.addEventListener("input", () => { catFilter[i.dataset.cf] = i.value; draw(); }));
  draw();
};

/* ---------- settings ---------- */
PAGES.settings = async (el) => {
  document.title = t("nav_settings") + " · Сөйле Pro";
  const o = S.org; const m = isManager();
  el.innerHTML = `${pageHead(t("st_title"))}
  <div class="grid g-main">
    <div class="stack">
      ${m ? `<div class="card"><div class="card-head"><h3>${t("st_org")}</h3></div>
      <form data-form="org-save" class="card-body form-grid">
        <div class="form-row"><div class="field"><label>${t("org_name")}</label><input class="input" name="name" required maxlength="120" value="${esc(o.name)}"></div>
        <div class="field"><label>${t("city")}</label><input class="input" name="city" maxlength="60" value="${esc(o.city || "")}"></div></div>
        <div class="field"><label>${t("st_desc")}</label><textarea class="input" name="description" maxlength="600">${esc(o.description || "")}</textarea></div>
        <div class="field"><label>${t("st_phone")}</label><input class="input" name="phone" type="tel" maxlength="20" value="${esc(o.phone || "")}"></div>
        <div class="field"><span class="label">${t("directions")}</span><div class="chips-select">${DIRS.map((d) => `<label class="chip-toggle"><input type="checkbox" name="dirs" value="${d}" ${(o.directions || []).includes(d) ? "checked" : ""}>${esc(t("dirf_" + d))}</label>`).join("")}</div></div>
        <label class="check"><input type="checkbox" name="listed" ${o.listed ? "checked" : ""}><span><b style="color:var(--text);font-weight:500">${t("st_listed")}</b><br>${t("st_listed_hint")}</span></label>
        <div class="error-text hidden" data-err></div>
        <div><button class="btn primary">${t("save")}</button></div>
      </form></div>` : ""}
      <div class="card"><div class="card-head"><h3>${t("st_prefs")}</h3></div><div class="card-body form-grid">
        <div class="row wrap" style="justify-content:space-between"><span>${t("st_lang")}</span>${langSwitch()}</div>
        <div class="row wrap" style="justify-content:space-between"><span>${t("st_theme")}</span><div class="seg">${["auto", "light", "dark"].map((x) => `<button class="${S.theme === x ? "on" : ""}" data-act="theme" data-v="${x}">${t("theme_" + x)}</button>`).join("")}</div></div>
      </div></div>
    </div>
    <div class="stack">
      <div class="card"><div class="card-head"><h3>${t("st_account")}</h3></div><div class="card-body stack" style="gap:12px">
        <div class="person"><span class="avatar">${esc(initials(S.me.full_name || S.user.email))}</span><div><b>${esc(S.me.full_name || "")}</b><span>${esc(S.user.email || "")}</span></div></div>
        <div class="row"><span class="tag accent">${esc(roleName(S.me.role))}</span>${S.me.branch_id ? `<span class="tag">${esc(branchName(S.me.branch_id))}</span>` : ""}</div>
        <div class="row wrap"><button class="btn" data-act="change-pass">${ic("key")}${t("st_change_pass")}</button><button class="btn" data-act="logout">${ic("logout")}${t("logout")}</button></div>
      </div></div>
      <div class="card card-pad"><div class="row" style="margin-bottom:8px">${ic("shield", 18)}<h3>${t("st_data")}</h3></div><p class="muted small">${t("st_data_text")}</p><p class="muted small" style="margin-top:8px">${t("cf_privacy")}</p>${legalLinks()}</div>
    </div>
  </div>`;
};
ACT["theme"] = (el) => { S.theme = el.dataset.v; LS.set("theme", S.theme); applyTheme(); $$(".seg button[data-act=theme]").forEach((b) => b.classList.toggle("on", b === el)); };
FORMS["org-save"] = async (f, fd) => {
  const row = { name: String(fd.get("name")).trim(), city: String(fd.get("city") || "").trim() || null, description: String(fd.get("description") || "").trim() || null, phone: String(fd.get("phone") || "").trim() || null, directions: fd.getAll("dirs"), listed: !!fd.get("listed") };
  await busy(f.querySelector(".btn.primary"), async () => {
    const { error } = await sb.from("orgs").update(row).eq("id", S.org.id);
    if (error) return showFormErr(f, errMsg(error));
    toast(t("saved")); await loadMemberships(); await selectOrg(S.org.id); route();
  });
};

/* ---------- more (mobile) ---------- */
PAGES.more = async (el) => {
  const { net } = navItems();
  el.innerHTML = `${pageHead(t("nav_more"))}<div class="card"><div class="list">
    ${net.map((i) => `<a class="list-item click" href="${i.href}" style="color:inherit;text-decoration:none">${ic(i.icon, 20)}<span class="t"><b style="font-weight:500">${t(i.key)}</b></span>${ic("right", 16)}</a>`).join("")}
    <div class="list-item click" data-act="org-menu">${ic("branch", 20)}<span class="t"><b style="font-weight:500">${t("switch_org")}</b><span>${esc(S.org.name)}</span></span>${ic("right", 16)}</div>
    <div class="list-item click" data-act="logout" style="color:var(--danger)">${ic("logout", 20)}<span class="t"><b style="font-weight:500">${t("logout")}</b></span></div>
  </div></div>`;
};

/* ---------- parent view (public) ---------- */
let PV = null;
async function renderParent(token) {
  applyTheme();
  if (!PV || PV.token !== token) {
    $("#app").innerHTML = `<div class="boot"><div class="spinner"></div></div>`;
    const { data, error } = await sb.rpc("parent_view", { p_token: token });
    PV = { token, data: error ? null : data };
  }
  const d = PV.data;
  if (!d) {
    $("#app").innerHTML = `<div class="center-screen"><div class="center-card card">${emptyState("link", t("pv_invalid"), "")}</div></div>`;
    return;
  }
  document.title = d.first_name + " · Сөйле Pro";
  const weeks = weekStarts(8);
  const goals = d.goals || [];
  const dirs = DIRS.filter((x) => goals.some((g) => g.direction === x));
  const statsFor = (gid) => {
    const vals = weeks.map((w) => { const p = (d.progress || []).find((x) => x.goal_id === gid && String(x.week).slice(0, 10) === w); return p ? p.pct : null; });
    const known = vals.filter((v) => v != null);
    return { vals, now: known.length ? known[known.length - 1] : null, delta: known.length > 1 ? known[known.length - 1] - known[0] : null };
  };
  $("#app").innerHTML = `
  <div class="parent">
    <div class="parent-hero">
      <div class="brand" style="padding:0"><div class="brand-mark" style="background:rgba(255,255,255,.16)">${LOGO_SVG}</div><div class="brand-name">Сөйле<span class="pro" style="background:rgba(255,255,255,.18);color:#fff">Pro</span></div></div>
      <div class="lang-switch">${langSwitch()}</div>
      <h1>${esc(d.first_name)}${d.birth_year ? `<span style="font-weight:500;opacity:.75;font-size:18px"> · ${esc(t("age", { n: ageOf(d.birth_year) }))}</span>` : ""}</h1>
      <p>${esc(t("pv_center", { org: d.org || "", b: d.branch || "" }))}</p>
    </div>
    ${d.home && (d.home.cards || []).length ? `<div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("hc_title")}</h3></div><div class="card-body">${d.home.note ? `<p style="margin-bottom:12px">${esc(d.home.note)}</p>` : ""}<div class="hc-grid">${d.home.cards.map((id) => cardTile(id)).join("")}</div><p class="hint" style="margin-top:10px">${t("hc_parent_hint")}</p></div></div>` : ""}
    ${d.report ? `<div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("pv_report")}</h3><span class="small faint">${esc(fmtDate(d.report.sent_at, { day: "numeric", month: "long" }))}</span></div><div class="card-body report-body">${esc(d.report.body)}</div></div>` : ""}
    <div class="card" style="margin-top:16px">
      <div class="card-head"><h3>${t("pv_goals")}</h3><span class="small faint">${t("trend_8w")}</span></div>
      ${dirs.map((dir) => `<div class="card-body" style="border-bottom:1px solid var(--border);padding-bottom:4px">${dirTag(dir, true)}</div>
        ${goals.filter((g) => g.direction === dir).map((g) => { const s = statsFor(g.id); return `<div class="goal ${g.status}">
          <div><b>${esc(g.title)}</b><div class="gmeta">${g.status === "achieved" ? `<span class="tag ok">${ic("check", 12)}${t("st_achieved")}</span>` : ""}${s.now != null ? `<span class="pct" style="color:var(--text)">${s.now}%</span>` : `<span>${t("no_data")}</span>`}${deltaTag(s.delta)}</div></div>
          <div class="chart">${sparkline(s.vals, DIR_COLORS[dir])}</div></div>`; }).join("")}`).join("") || `<div class="card-body faint">${t("no_goals")}</div>`}
      <div class="card-body hint" style="border-top:1px solid var(--border)">${t("pv_hint")}</div>
    </div>
    ${(d.sessions || []).length ? `<div class="card" style="margin-top:16px"><div class="card-head"><h3>${t("pv_sessions")}</h3></div>
      ${d.sessions.map((s) => `<div class="tl-item"><div class="tl-date">${esc(fmtDate(s.date, { day: "numeric", month: "short", weekday: "short" }))}</div><div>${dirTag(s.direction)}${s.note ? `<p style="margin-top:6px">${esc(s.note)}</p>` : ""}</div></div>`).join("")}</div>` : ""}
    <p class="hint" style="text-align:center;margin-top:24px">${t("pv_foot")}</p>
  </div>`;
}

boot();


/* ---------- тариф и оплата ---------- */
const BL = { period: "m" };
function planPrice(pl) { const f = S.plan && S.plan.founder ? 0.7 : 1; return Math.round(pl.price * f / 100) * 100; }
function planLimitsText(pl) {
  return [pl.kids ? t("bl_kids_upto", { n: pl.kids }) : t("bl_kids_any"), pl.branches === 1 ? t("bl_br_one") : t("bl_br_many"), t("bl_staff_any")];
}
function usageRow(label, n, max) {
  const pct = max ? Math.min(100, Math.round((n / max) * 100)) : null;
  return `<div><div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="small muted">${esc(label)}</span><span class="small num"><b>${n}</b>${max ? " / " + max : " · " + t("bl_unlimited")}</span></div>
    ${max ? `<div class="meter"><div class="bar"><i style="width:${Math.max(2, pct)}%;${pct >= 90 ? "background:var(--warn)" : ""}"></i></div></div>` : ""}</div>`;
}
PAGES.billing = async (el, args, alive) => {
  document.title = t("nav_billing") + " · Сөйле Pro";
  await loadPlan(); if (!alive()) return;
  const p = S.plan;
  if (!p) throw new Error("plan");
  if (!isManager()) { el.innerHTML = `${pageHead(t("bl_title"))}<div class="card">${emptyState("card", t("bl_only_owner"), "")}</div>`; return; }
  const dfmt = { day: "numeric", month: "long", year: "numeric" };
  const until = fmtDate(p.paid_until, dfmt);
  const status = p.is_demo ? `<span class="tag accent">${t("plan_network")}</span>`
    : p.expired ? `<span class="tag danger">${esc(t("bl_expired", { d: until }))}</span>`
    : `<span class="tag ${p.days_left <= 5 ? "warn" : "ok"}">${esc(t("bl_days_left", { n: p.days_left }))}</span>`;
  el.innerHTML = `${pageHead(t("bl_title"), t("bl_sub"))}
  ${p.is_demo ? `<div class="alert info" style="margin-bottom:16px">${ic("info")}<div>${t("bl_demo")}</div></div>` : ""}
  ${p.expired && !p.is_demo ? `<div class="alert" style="margin-bottom:16px">${ic("alert")}<div>${p.writable ? t("bl_grace") : t("bl_readonly")}</div></div>` : ""}
  <div class="grid g-main" style="margin-bottom:20px">
    <div class="card card-pad stack" style="gap:14px">
      <div class="row wrap" style="justify-content:space-between"><div><div class="small faint">${t("bl_current")}</div><h2 style="margin-top:2px">${esc(t("plan_" + p.plan))}</h2></div>${status}</div>
      ${p.is_demo ? "" : `<div class="muted small">${esc(p.plan === "trial" ? t("bl_trial_until", { d: until }) : t("bl_until", { d: until }))}${p.founder ? " · " + t("bl_founder_on") : ""}</div>`}
      <div class="grid g-3" style="gap:14px">${usageRow(t("bl_usage_kids"), p.children, p.max_children)}${usageRow(t("bl_usage_br"), p.branches, p.max_branches)}${usageRow(t("bl_usage_staff"), p.staff, null)}</div>
    </div>
    <div class="card card-pad stack" style="gap:10px">
      <div class="row">${ic("info", 18)}<h3>${t("bl_how")}</h3></div>
      <p class="muted small">${t("bl_how_text")}</p>
      <a class="btn sm" style="align-self:flex-start" target="_blank" rel="noopener" href="${esc(waLink(t("ld_wa"), SUPPORT_PHONE))}">${ic("chat")}${t("bl_support")}</a>
    </div>
  </div>
  <div class="row wrap" style="justify-content:space-between;margin-bottom:12px">
    <div class="seg" role="group"><button class="${BL.period === "m" ? "on" : ""}" data-act="bl-period" data-v="m">${t("bl_period_m")}</button><button class="${BL.period === "y" ? "on" : ""}" data-act="bl-period" data-v="y">${t("bl_period_y")}</button></div>
    <span class="small muted">${t("bl_year")}${p.founder ? "" : " · " + t("bl_founder")}</span>
  </div>
  <div class="grid g-3 plans">${PLANS.map((pl) => {
    const cur = !p.is_demo && p.plan === pl.id;
    const price = planPrice(pl); const total = BL.period === "y" ? price * 10 : price;
    return `<div class="card plan-card ${pl.popular ? "popular" : ""} ${cur ? "current" : ""}">
      ${cur ? `<span class="plan-flag">${t("bl_current_badge")}</span>` : pl.popular ? `<span class="plan-flag">${t("bl_popular")}</span>` : ""}
      <h3>${esc(t("plan_" + pl.id))}</h3>
      <div class="plan-price"><b class="num">${fmtMoney(price)}</b> <span>${t("bl_per_month")}</span></div>
      ${BL.period === "y" ? `<div class="small muted" style="margin-top:-6px">${fmtMoney(total)} ₸ / 12 ${S.lang === "kk" ? "ай" : "мес."}</div>` : ""}
      <ul class="plan-list">${planLimitsText(pl).map((x) => `<li>${ic("check", 14)}${esc(x)}</li>`).join("")}<li>${ic("check", 14)}${esc(t("bl_feat_all"))}</li></ul>
      <a class="btn ${pl.popular || cur ? "primary" : ""} block" target="_blank" rel="noopener" href="${esc(waLink(t("bl_wa_msg", { org: S.org.name, plan: t("plan_" + pl.id), price: fmtMoney(price), period: BL.period === "y" ? t("bl_period_y") + " — " + fmtMoney(total) + " ₸" : t("bl_period_m"), id: S.org.id.slice(0, 8) }), SUPPORT_PHONE))}">${ic("chat")}${t("bl_pay")}</a>
    </div>`; }).join("")}</div>`;
};
ACT["bl-period"] = (el) => { BL.period = el.dataset.v; route(); };
