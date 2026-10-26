/* Реквизиты исполнителя — ЗАПОЛНИТЬ один раз, подставляются во все документы */
window.OPERATOR = {
  name: "ИП «[название ИП]»",          // напр. ИП «Сөйле» или ТОО «...»
  person: "[ФИО руководителя]",
  bin: "[ИИН/БИН]",
  address: "[город, адрес]",
  email: "[email для обращений]",
  phone: "+7 707 776 0327",
  bank: "[банк, ИИК (IBAN), БИК]",
};
window.LEGAL_DATE = "26.10.2026";

(function () {
  const q = new URLSearchParams(location.search);
  let lang = q.get("lang") === "kk" ? "kk" : (localStorage.getItem("sp_lang") || "").includes("kk") && !q.get("lang") ? "kk" : "ru";
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach((el) => { el.hidden = el.dataset.lang !== lang; });
    document.querySelectorAll(".lg-switch button").forEach((b) => b.classList.toggle("on", b.dataset.v === lang));
    const tt = document.querySelector(`[data-lang="${lang}"] h1`); if (tt) document.title = tt.textContent + " · Сөйле Pro";
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-op]").forEach((el) => { el.textContent = window.OPERATOR[el.dataset.op] || ""; });
    document.querySelectorAll("[data-date]").forEach((el) => { el.textContent = window.LEGAL_DATE; });
    document.querySelectorAll(".lg-switch button").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.v; apply(); }));
    document.querySelectorAll("[data-print]").forEach((b) => b.addEventListener("click", () => window.print()));
    apply();
  });
})();
