/* Сөйле — «Успехи в играх» в режиме родителя.
 * Данные пишет трекер игр (games/engine.js) в localStorage «soile_game_stats»,
 * уровни раздела «Учимся» — в «soile_learn_progress». Если приложение подключено к центру (Сөйле Pro),
 * pro-link.js сам отправляет результаты специалисту. */
(function(){
  'use strict';
  var GAMES = {
    learn:['Үйренеміз','Учимся'], memory:['Жұбын тап','Найди пару'], find:['Көрсет','Покажи'], sort:['Сұрыпта','Сортировка'],
    odd:['Артығы қайсы?','Что лишнее?'], puzzle:['Пазл','Пазл'], shadow:['Көлеңке','Тень'], bubbles:['Көпіршік','Пузыри'],
    count:['Санайық','Сколько?'], missing:['Не жоғалды?','Что исчезло?'], zoom:['Лупа','Лупа'], words:['Сөз бен сурет','Слово и картинка'],
    simon:['Қайтала','Повтори'], sentence:['Сөйлем құра','Составь предложение'], colors:['Түсі қайсы?','Какого цвета?']
  };
  var SECS = [
    ['match','Сәйкестендіру','Сопоставление','#EF4C82'], ['show','Ажырату','Различение','#E07A34'], ['group','Санаттар','Категории','#E8A93B'],
    ['verb','Етістіктер','Глаголы','#3FA35A'], ['emo','Сезімдер','Эмоции','#2D6CDF'],
    ['color','Түстер','Цвета','#B03FC2'], ['shape','Пішіндер','Фигуры','#0E9AA7'], ['num','Сандар','Цифры','#C92A2A'], ['letter','Әріптер','Буквы','#5B5BD6']
  ];
  function ls(k, d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function lang(){ var b = document.getElementById('lang-ru'); return b && b.getAttribute('aria-pressed') === 'true' ? 'ru' : 'kk'; }
  function L(kk, ru){ return lang() === 'kk' ? kk : ru; }
  function gname(r){
    var g = GAMES[r.g] ? GAMES[r.g][lang() === 'kk' ? 0 : 1] : r.g;
    if (r.g === 'learn' && r.sec){ var s = SECS.filter(function(x){ return x[0] === r.sec; })[0]; if (s) g = (lang() === 'kk' ? s[1] : s[2]) + ' · ' + r.lvl + ' ' + L('деңг.', 'ур.'); }
    return g;
  }
  function fmt(iso){
    var d = new Date(iso); if (isNaN(d)) return '';
    var M = lang() === 'kk' ? ['қаң','ақп','нау','сәу','мам','мау','шіл','там','қыр','қаз','қар','жел'] : ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    return d.getDate() + ' ' + M[d.getMonth()] + ' · ' + d.toTimeString().slice(0, 5);
  }
  function mins(s){ var m = Math.floor(s / 60), x = s % 60; return (m ? m + ' ' + L('мин', 'мин') + ' ' : '') + (m && !x ? '' : x + ' ' + L('сек', 'сек')); }

  var css = '.gs-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}' +
    '.gs-sum div{background:var(--surface-2);border-radius:14px;padding:10px;text-align:center}.gs-sum b{display:block;font-size:22px;font-weight:900;color:var(--ink)}.gs-sum span{font-size:11.5px;color:var(--ink-dim);font-weight:700}' +
    '.gs-sec{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-dim);margin:14px 0 6px}' +
    '.gs-lv{display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:center;padding:7px 0;border-top:1px solid var(--line)}.gs-lv:first-of-type{border-top:0}' +
    '.gs-lv b{font-size:14px;color:var(--ink)}.gs-dots{display:flex;gap:4px}.gs-dots i{width:22px;height:8px;border-radius:4px;background:var(--surface-2)}' +
    '.gs-row{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:8px 0;border-top:1px solid var(--line);font-size:13.5px;color:var(--ink)}' +
    '.gs-row small{color:var(--ink-dim);font-size:12px}.gs-row .ok{font-weight:800;text-align:right}.gs-row .ok.g{color:#079455}.gs-row .ok.y{color:#B54708}' +
    '.gs-empty{font-size:13.5px;color:var(--ink-dim);margin-top:8px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function render(){
    var parent = document.querySelector('#view-parent .parent-view'); if (!parent) return;
    var sec = document.getElementById('game-stats-section');
    if (!sec){
      sec = document.createElement('div'); sec.className = 'p-section'; sec.id = 'game-stats-section';
      var after = document.getElementById('home-tech-section') || document.getElementById('center-section');
      if (after && after.nextSibling) parent.insertBefore(sec, after.nextSibling); else parent.appendChild(sec);
    }
    var all = ls('soile_game_stats', []), prog = ls('soile_learn_progress', {});
    var weekAgo = Date.now() - 7 * 864e5, week = all.filter(function(r){ return new Date(r.d).getTime() > weekAgo; });
    var tot = week.reduce(function(a, r){ return a + (r.total || 0); }, 0), cl = week.reduce(function(a, r){ return a + (r.clean || 0); }, 0);
    var time = week.reduce(function(a, r){ return a + (r.sec_t || 0); }, 0);
    var h = '<h3>📊 ' + L('Ойындағы жетістіктер', 'Успехи в играх') + '</h3>' +
      '<p class="key-note">' + L('Бала ойнаған сайын нәтиже өздігінен сақталады. Орталыққа қосылған болса — маман да көреді.', 'Результаты сохраняются сами, пока ребёнок играет. Если приложение подключено к центру — их видит и специалист.') + '</p>';
    if (!all.length){
      sec.innerHTML = h + '<p class="gs-empty">' + L('Әзірге нәтиже жоқ. «Ойындар» → «Үйренеміз» бөлімін ашып көріңіз.', 'Пока нет результатов. Откройте «Игры» → «Учимся».') + '</p>';
      return;
    }
    h += '<div class="gs-sum"><div><b>' + week.length + '</b><span>' + L('сабақ / 7 күн', 'занятий за 7 дней') + '</span></div>' +
      '<div><b>' + Math.round(time / 60) + '</b><span>' + L('минут', 'минут') + '</span></div>' +
      '<div><b>' + (tot ? Math.round(cl / tot * 100) + '%' : '—') + '</b><span>' + L('қатесіз', 'без ошибок') + '</span></div></div>';
    var stTot = 0; SECS.forEach(function(x){ for (var q = 1; q <= 5; q++) stTot += (prog[x[0]] && prog[x[0]][q]) || 0; });
    h += '<div class="gs-sec">🧩 ' + L('Үйренеміз — деңгейлер', 'Учимся — уровни') + ' · ★ ' + stTot + ' · 🐾 ' + Math.min(22, Math.floor(stTot / 3)) + '/22 ' + L('дос', 'друзей') + '</div>';
    SECS.forEach(function(s){
      var p = prog[s[0]] || {}, dots = '';
      for (var l = 1; l <= 5; l++){ var v = p[l] || 0; dots += '<i style="' + (v ? 'background:' + s[3] + ';opacity:' + (0.35 + v * 0.22) : '') + '" title="' + l + '"></i>'; }
      h += '<div class="gs-lv"><b>' + esc(lang() === 'kk' ? s[1] : s[2]) + '</b><span class="gs-dots">' + dots + '</span></div>';
    });
    h += '<div class="gs-sec">🕘 ' + L('Соңғы сабақтар', 'Последние занятия') + '</div>';
    all.slice(-10).reverse().forEach(function(r){
      var pct = r.total ? r.clean / r.total : 0;
      h += '<div class="gs-row"><span>' + esc(gname(r)) + '<br><small>' + esc(fmt(r.d)) + ' · ' + esc(mins(r.sec_t || 0)) + '</small></span>' +
        '<span class="ok ' + (pct >= .8 ? 'g' : pct < .5 ? 'y' : '') + '">' + r.clean + ' / ' + r.total + '<br><small>' + L('қатесіз', 'без ошибок') + '</small></span></div>';
    });
    var txt = L('Сөйле — соңғы 7 күн: ', 'Сөйле — за 7 дней: ') + week.length + L(' сабақ, ', ' занятий, ') + Math.round(time / 60) + L(' минут, қатесіз ', ' минут, без ошибок ') + (tot ? Math.round(cl / tot * 100) : 0) + '%.\n' +
      all.slice(-8).reverse().map(function(r){ return '• ' + gname(r) + ' — ' + r.clean + '/' + r.total + ' (' + fmt(r.d) + ')'; }).join('\n');
    h += '<div style="margin-top:12px"><a class="btn ghost" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(txt) + '">' + L('Маманға WhatsApp арқылы жіберу', 'Отправить специалисту в WhatsApp') + '</a></div>';
    sec.innerHTML = h;
  }
  function mount(){
    render();
    window.addEventListener('soile-game-stats', render);
    window.addEventListener('storage', function(e){ if (e.key === 'soile_game_stats' || e.key === 'soile_learn_progress') render(); });
    ['lang-kk', 'lang-ru', 'mode-parent'].forEach(function(id){ var b = document.getElementById(id); if (b) b.addEventListener('click', function(){ setTimeout(render, 0); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  window.SoileStats = { render: render };
})();
