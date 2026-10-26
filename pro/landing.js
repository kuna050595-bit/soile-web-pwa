/* Сөйле Pro — публичная страница (лендинг) для центров */
function renderLanding() {
  document.title = "Сөйле Pro — платформа для центров развития";
  S.view = "landing";
  const feats = [
    ["target", "ld_f1t", "ld_f1"], ["check", "ld_f2t", "ld_f2"], ["trend", "ld_f3t", "ld_f3"],
    ["send", "ld_f4t", "ld_f4"], ["branch", "ld_f5t", "ld_f5"], ["sparkle", "ld_f6t", "ld_f6"],
  ];
  const steps = [["ld_s1t", "ld_s1"], ["ld_s2t", "ld_s2"], ["ld_s3t", "ld_s3"], ["ld_s4t", "ld_s4"]];
  const who = [["branch", "ld_w1t", "ld_w1"], ["kids", "ld_w2t", "ld_w2"], ["user", "ld_w3t", "ld_w3"]];
  const faq = [1, 2, 3, 4, 5, 6];
  const goals = [["aba", S.lang === "kk" ? "Атына жауап беру" : "Отклик на имя", 78, 12], ["logo", S.lang === "kk" ? "Екі сөзден тұратын фраза" : "Фраза из двух слов", 54, 9], ["afk", S.lang === "kk" ? "Бір аяқпен тепе-теңдік" : "Равновесие на одной ноге", 41, 6]];
  const spark = [22, 28, 27, 35, 41, 46, 52, 61];
  const mx = Math.max(...spark), mn = Math.min(...spark);
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${36 - ((v - mn) / (mx - mn)) * 30 - 3}`).join(" ");
  $("#app").innerHTML = `
  <div class="ld">
    <header class="ld-head"><div class="ld-wrap ld-head-in">
      ${brand()}
      <nav class="ld-nav hide-m">
        <a href="#" data-act="ld-scroll" data-to="ld-feat">${t("ld_nav_feat")}</a>
        <a href="#" data-act="ld-scroll" data-to="ld-how">${t("ld_nav_how")}</a>
        <a href="#" data-act="ld-scroll" data-to="ld-price">${t("ld_nav_price")}</a>
        <a href="#" data-act="ld-scroll" data-to="ld-faq">${t("ld_nav_faq")}</a>
      </nav>
      <span class="spacer"></span>
      ${langSwitch()}
      <button class="btn ghost" data-act="to-auth" data-tab="login">${t("ld_login")}</button>
      <button class="btn primary hide-m" data-act="to-auth" data-tab="register">${t("ld_try")}</button>
    </div></header>

    <section class="ld-hero"><div class="ld-wrap ld-hero-in">
      <div class="ld-hero-text">
        <span class="ld-badge">${ic("shield", 14)} ${t("ld_badge")}</span>
        <h1>${t("ld_h1")}</h1>
        <p class="ld-lead">${t("ld_lead")}</p>
        <div class="ld-cta">
          <button class="btn primary lg" data-act="to-auth" data-tab="register">${t("ld_try")}${ic("right", 16)}</button>
          <button class="btn lg" data-act="demo" data-role="owner">${ic("sparkle", 16)}${t("ld_demo")}</button>
        </div>
        <p class="ld-note">${ic("check", 14)} ${t("ld_note")}</p>
      </div>
      <div class="ld-mock" aria-hidden="true">
        <div class="ld-mock-card">
          <div class="ld-mock-top">
            <span class="avatar">АТ</span>
            <div><b>Айсулу Т.</b><span>${S.lang === "kk" ? "6 жас · Самал филиалы" : "6 лет · филиал Самал"}</span></div>
            <span class="delta up">${ic("up", 12)}+14</span>
          </div>
          <div class="ld-mock-chart">
            <svg viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points="0,36 ${pts} 100,36" fill="var(--accent-soft)" stroke="none"/><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>
            <span>${S.lang === "kk" ? "8 апта" : "8 недель"}</span>
          </div>
          ${goals.map(([d, g, p, dl]) => `<div class="ld-goal"><div class="row" style="justify-content:space-between"><span>${dirTag(d)}</span><span class="small delta up">+${dl}</span></div><div class="ld-goal-t">${esc(g)}</div>${meter(p, `var(--${d})`)}</div>`).join("")}
        </div>
        <div class="ld-mock-float">
          ${ic("send", 16)}<div><b>${S.lang === "kk" ? "Есеп ата-анаға жіберілді" : "Отчёт отправлен родителю"}</b><span>WhatsApp · ${S.lang === "kk" ? "қазір" : "сейчас"}</span></div>
        </div>
      </div>
    </div></section>

    <section class="ld-stats"><div class="ld-wrap ld-stats-in">
      <div><b>30</b><span>${t("ld_stat1")}</span></div>
      <div><b>4</b><span>${t("ld_stat2")}</span></div>
      <div><b>2</b><span>${t("ld_stat3")}</span></div>
    </div></section>

    <section class="ld-sec" id="ld-feat"><div class="ld-wrap">
      <h2 class="ld-h2">${t("ld_feat_t")}</h2>
      <div class="ld-grid3">${feats.map(([i, a, b]) => `<div class="ld-feat"><span class="ld-ico">${ic(i, 20)}</span><h3>${t(a)}</h3><p>${t(b)}</p></div>`).join("")}</div>
    </div></section>

    <section class="ld-sec alt" id="ld-how"><div class="ld-wrap">
      <h2 class="ld-h2">${t("ld_how_t")}</h2>
      <ol class="ld-steps">${steps.map(([a, b], i) => `<li><span class="ld-step-n">${i + 1}</span><h3>${t(a)}</h3><p>${t(b)}</p></li>`).join("")}</ol>
    </div></section>

    <section class="ld-sec"><div class="ld-wrap">
      <h2 class="ld-h2">${t("ld_who_t")}</h2>
      <div class="ld-grid3">${who.map(([i, a, b]) => `<div class="ld-who"><span class="ld-ico soft">${ic(i, 20)}</span><h3>${t(a)}</h3><p>${t(b)}</p></div>`).join("")}</div>
    </div></section>

    <section class="ld-sec alt" id="ld-price"><div class="ld-wrap">
      <h2 class="ld-h2">${t("ld_price_t")}</h2>
      <p class="ld-sub">${t("ld_price_sub")}</p>
      <div class="ld-grid3 plans">${PLANS.map((pl) => `<div class="card plan-card ${pl.popular ? "popular" : ""}">
        ${pl.popular ? `<span class="plan-flag">${t("bl_popular")}</span>` : ""}
        <h3>${esc(t("plan_" + pl.id))}</h3>
        <div class="plan-price"><b class="num">${fmtMoney(pl.price)}</b> <span>${t("bl_per_month")}</span></div>
        <ul class="plan-list">${planLimitsText(pl).map((x) => `<li>${ic("check", 14)}${esc(x)}</li>`).join("")}<li>${ic("check", 14)}${esc(t("bl_feat_all"))}</li></ul>
        <button class="btn ${pl.popular ? "primary" : ""} block" data-act="to-auth" data-tab="register">${t("ld_try")}</button>
      </div>`).join("")}</div>
      <p class="ld-price-note">${ic("info", 14)} ${t("bl_year")} · ${t("bl_founder")}</p>
    </div></section>

    <section class="ld-sec" id="ld-faq"><div class="ld-wrap ld-narrow">
      <h2 class="ld-h2">${t("ld_faq_t")}</h2>
      <div class="ld-faq">${faq.map((n) => `<details><summary>${t("ld_q" + n)}${ic("down_chev", 18)}</summary><p>${t("ld_a" + n)}</p></details>`).join("")}</div>
    </div></section>

    <section class="ld-final"><div class="ld-wrap ld-final-in">
      <div><h2>${t("ld_cta_t")}</h2><p>${t("ld_cta")}</p></div>
      <div class="ld-cta">
        <button class="btn lg ld-white" data-act="to-auth" data-tab="register">${t("ld_try")}${ic("right", 16)}</button>
        <a class="btn lg ld-outline" target="_blank" rel="noopener" href="${esc(waLink(t("ld_wa"), SUPPORT_PHONE))}">${ic("chat", 16)}${t("ld_contact")}</a>
      </div>
    </div></section>

    <footer class="ld-foot"><div class="ld-wrap ld-foot-in">
      ${brand()}
      ${legalLinks()}
      <span class="faint small">© ${new Date().getFullYear()} Сөйле</span>
    </div></footer>
  </div>`;
}
ACT["ld-scroll"] = (el) => { const x = document.getElementById(el.dataset.to); if (x) x.scrollIntoView({ behavior: "smooth", block: "start" }); };
