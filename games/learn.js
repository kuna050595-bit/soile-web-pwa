/* «Үйренеміз / Учимся» — программа занятий по разделам и уровням (как в ABA-тренажёрах).
 * 5 разделов × 5 уровней. На уровне 5 заданий; ошибка не наказывается: картинка гаснет, слово звучит ещё раз.
 * Лучший результат каждого уровня (звёзды 1–3) хранится в «soile_learn_progress»,
 * подробная статистика пишется общим трекером (engine.js) с пометкой раздела и уровня.
 */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 5, LEVEL_N = [2, 3, 4, 5, 6], PKEY = 'soile_learn_progress';
  var BASE = ['animal', 'food', 'toys', 'transport', 'clothes'];
  var T = {
    title: { kk:'Үйренеміз', ru:'Учимся' },
    sub:   { kk:'Бөлімдер мен деңгейлер — біртіндеп күрделенеді', ru:'Разделы и уровни — от простого к сложному' },
    level: { kk:'деңгей', ru:'уровень' },
    win:   { kk:'Жарайсың!', ru:'Отличная работа!' },
    next:  { kk:'Келесі деңгей', ru:'Следующий уровень' },
    again: { kk:'Тағы да', ru:'Пройти ещё раз' },
    all:   { kk:'Барлық бөлімдер', ru:'Все разделы' },
    clean: { kk:'қатесіз', ru:'без ошибок' },
    show:  { kk:'Көрсет', ru:'Покажи' },
    same:  { kk:'Дәл осындайын тап', ru:'Найди такую же' },
    group: { kk:'Осы топтан тағы біреуін тап', ru:'Найди пару по группе' }
  };
  var SECTIONS = [
    { id:'match', kk:'Сәйкестендіру', ru:'Сопоставление', sub:{ kk:'Дәл осындай суретті тап', ru:'Найди такую же картинку' }, c1:'#EF4C82', c2:'#FF9CBF', emoji:'🧩' },
    { id:'show',  kk:'Ажырату', ru:'Различение', sub:{ kk:'Сөзді тыңда — суретті көрсет', ru:'Послушай слово — покажи картинку' }, c1:'#E07A34', c2:'#FFB070', emoji:'👂' },
    { id:'group', kk:'Санаттар', ru:'Категории', sub:{ kk:'Бір топтан жұп тап', ru:'Найди пару по категории' }, c1:'#E8A93B', c2:'#FFD87F', emoji:'🧺' },
    { id:'verb',  kk:'Етістіктер', ru:'Глаголы', sub:{ kk:'Кім не істеп жатыр?', ru:'Кто что делает?' }, c1:'#3FA35A', c2:'#86DA95', emoji:'🏃' },
    { id:'emo',   kk:'Сезімдер', ru:'Эмоции', sub:{ kk:'Кім қуанып, кім жылап тұр?', ru:'Кто радуется, кто грустит?' }, c1:'#2D6CDF', c2:'#74A8FF', emoji:'😊' }
  ];

  function progress(){ return SG.load(PKEY, {}); }
  function starsFor(clean){ return clean >= ROUNDS ? 3 : clean >= ROUNDS - 2 ? 2 : 1; }
  function poolOf(cats){ var out = []; cats.forEach(function(c){ out = out.concat(SG.pool(c)); }); return out; }
  function pickFrom(cats, n){
    var all = SG.shuffle(poolOf(cats)), out = [];
    all.forEach(function(c){ if (out.length < n && !out.some(function(x){ return x.id === c.id || SG.sameGroup(x.id, c.id); })) out.push(c); });
    return out;
  }

  SG.register({
    id:'learn', kk:T.title.kk, ru:T.title.ru, sub:T.sub, color:'#1F8F86', color2:'#62D0C4',
    mount: function(root, api){
      var timers = [], cur = {};
      function later(fn, ms){ var t = setTimeout(fn, ms); timers.push(t); return t; }
      function clear(){ timers.forEach(clearTimeout); timers = []; SG.stopSpeech(); }
      function topBar(onBack, mid){
        var bar = SG.el('div', 'g-top');
        var back = SG.el('button', 'g-iconbtn', SG.ICON_BACK); back.type = 'button'; back.setAttribute('aria-label', 'Back');
        if (onBack) back.addEventListener('click', onBack); else back.style.visibility = 'hidden';
        bar.appendChild(back); bar.appendChild(mid);
        bar.appendChild(SG.controls(function(){ if (cur.onLang) cur.onLang(); }));
        return bar;
      }
      function starRow(n){ var h = ''; for (var i = 0; i < 3; i++) h += '<i class="' + (i < n ? 'on' : '') + '">' + SG.STAR + '</i>'; return '<span class="l-stars">' + h + '</span>'; }

      /* ===== список разделов ===== */
      function sections(){
        clear(); cur = {}; root.innerHTML = ''; root.removeAttribute('data-track');
        root.appendChild(topBar(api.onExit, SG.el('div', 'g-brand', SG.MASCOT + '<span>Сөйле</span>')));
        var main = SG.el('div', 'g-main'); root.appendChild(main);
        function draw(){
          main.innerHTML = '';
          var head = SG.el('div'); head.appendChild(SG.el('h1', 'g-h1', SG.t(T.title))); head.appendChild(SG.el('p', 'g-sub', SG.t(T.sub)));
          main.appendChild(head);
          var p = progress(), list = SG.el('div', 'l-list');
          SECTIONS.forEach(function(s){
            var got = 0; for (var l = 1; l <= 5; l++) got += (p[s.id] && p[s.id][l]) || 0;
            var b = SG.el('button', 'l-sec', '<span class="l-emo">' + s.emoji + '</span><span class="l-t"><b>' + SG.t(s) + '</b><small>' + SG.t(s.sub) + '</small></span>' +
              '<span class="l-got">' + SG.STAR + got + '/15</span>');
            b.type = 'button'; b.style.setProperty('--c1', s.c1); b.style.setProperty('--c2', s.c2);
            b.addEventListener('click', function(){ levels(s); });
            list.appendChild(b);
          });
          main.appendChild(list);
        }
        cur.onLang = draw; draw();
      }

      /* ===== уровни раздела ===== */
      function levels(s){
        clear(); cur = {}; root.innerHTML = ''; root.removeAttribute('data-track');
        root.appendChild(topBar(sections, SG.el('div', 'g-brand', '<span>' + s.emoji + '</span>')));
        var main = SG.el('div', 'g-main'); root.appendChild(main);
        function draw(){
          main.innerHTML = '';
          var head = SG.el('div'); head.appendChild(SG.el('h1', 'g-h1', SG.t(s))); head.appendChild(SG.el('p', 'g-sub', SG.t(s.sub)));
          main.appendChild(head);
          var p = (progress()[s.id]) || {}, list = SG.el('div', 'l-list');
          for (var l = 1; l <= 5; l++) (function(l){
            var b = SG.el('button', 'l-lvl', '<b>' + l + ' ' + SG.t(T.level) + '</b><small>' + LEVEL_N[l - 1] + ' ' + SG.t({ kk:'сурет', ru:'картинки' }) + '</small>' + starRow(p[l] || 0));
            b.type = 'button'; b.style.setProperty('--c1', s.c1); b.style.setProperty('--c2', s.c2);
            b.addEventListener('click', function(){ SG.chime('match'); play(s, l); });
            list.appendChild(b);
          })(l);
          main.appendChild(list);
        }
        cur.onLang = draw; draw();
      }

      /* ===== задания ===== */
      function makeRounds(s, n){
        var out = [];
        if (s.id === 'match' || s.id === 'show'){
          var targets = pickFrom(BASE, ROUNDS), pool = poolOf(BASE);
          targets.forEach(function(t){ out.push({ target: t, opts: SG.buildChoices(t, pool, n) }); });
        } else if (s.id === 'verb' || s.id === 'emo'){
          var cat = s.id === 'verb' ? 'action' : 'emotion', tg = pickFrom([cat], ROUNDS), pl = SG.pool(cat);
          tg.forEach(function(t){ out.push({ target: t, opts: SG.buildChoices(t, pl, Math.min(n, pl.length)) }); });
        } else {          // категории: образец + ещё одна картинка из той же темы среди чужих
          for (var r = 0; r < ROUNDS; r++){
            var cats = SG.shuffle(BASE), same = pickFrom([cats[0]], 2);
            if (same.length < 2) continue;
            var others = pickFrom(cats.slice(1), n - 1);
            out.push({ sample: same[0], target: same[1], opts: SG.shuffle([same[1]].concat(others)) });
          }
        }
        return out;
      }

      function play(s, lvl){
        clear(); cur = {}; root.innerHTML = '';
        root.setAttribute('data-track', 'learn:' + s.id + ':' + lvl);
        var n = LEVEL_N[lvl - 1], rounds = makeRounds(s, n), total = rounds.length, i = 0, locked = false, clean = 0, errHere = 0;
        var prog = SG.el('div', 'g-progress'), stars = [];
        for (var k = 0; k < total; k++){ var st = SG.el('span', 'g-star', SG.STAR); stars.push(st); prog.appendChild(st); }
        root.appendChild(topBar(function(){ levels(s); }, prog));
        var main = SG.el('div', 'g-main'); main.style.padding = '10px 14px 16px'; main.style.gap = '12px'; root.appendChild(main);
        var prompt = SG.el('div', 'g-prompt'); main.appendChild(prompt);
        var board = SG.el('div', 'g-board'); main.appendChild(board);
        var heard = s.id === 'show' || s.id === 'verb' || s.id === 'emo';
        var hideWord = s.id === 'show' && lvl >= 4;          // старшие уровни — только на слух

        function say(){ var r = rounds[i]; if (r && heard) SG.speak(r.target); }
        function drawPrompt(){
          var r = rounds[i]; prompt.innerHTML = ''; if (!r) return;
          if (heard){
            var sp = SG.el('button', 'g-speak', SG.ICON_SPEAKER); sp.type = 'button'; sp.addEventListener('click', say);
            prompt.appendChild(sp);
            prompt.appendChild(SG.el('div', 'g-word', SG.t(T.show) + (hideWord ? '' : ': ' + SG.name(r.target))));
          } else {
            prompt.appendChild(SG.el('div', 'l-ask', SG.t(s.id === 'match' ? T.same : T.group)));
            var smp = SG.el('div', 'l-sample'); var im = SG.el('img'); im.src = SG.photoURL(s.id === 'match' ? r.target : r.sample); im.alt = ''; smp.appendChild(im);
            prompt.appendChild(smp);
          }
        }
        cur.onLang = function(){ drawPrompt(); later(say, 200); };

        function next(){
          if (i >= total){ finish(); return; }
          locked = false; errHere = 0;
          drawPrompt();
          board.innerHTML = '';
          board.appendChild(SG.choiceGrid(rounds[i].opts, pick, { reserve: heard ? 210 : 300 }));
          if (heard) later(say, 450);
        }
        function pick(btn, card){
          if (locked) return;
          var r = rounds[i];
          if (card.id === r.target.id){
            locked = true; btn.classList.add('ok'); SG.chime('match'); SG.speak(card);
            if (!errHere) clean++;
            if (stars[i]) stars[i].classList.add('on');
            i++; later(next, 1300);
          } else {
            errHere++; btn.classList.add('tried');
            if (heard) later(say, 550);
          }
        }
        function finish(){
          var got = starsFor(clean), p = progress(); p[s.id] = p[s.id] || {};
          if ((p[s.id][lvl] || 0) < got) p[s.id][lvl] = got; SG.save(PKEY, p);
          later(function(){
            SG.chime('win'); SG.confetti();
            var ov = SG.el('div', 'g-overlay');
            ov.innerHTML = SG.MASCOT.replace('<svg ', '<svg class="g-mascot" ') + '<h2 class="g-win">' + SG.t(T.win) + '</h2>' +
              '<div class="l-res">' + starRow(got) + '</div><p class="l-score">' + clean + ' / ' + total + ' ' + SG.t(T.clean) + '</p>';
            var act = SG.el('div', 'g-actions');
            function btn(txt, cls, fn){ var b = SG.el('button', 'g-big ' + cls, txt); b.type = 'button'; b.style.marginTop = '0'; b.addEventListener('click', fn); act.appendChild(b); }
            if (lvl < 5) btn(SG.t(T.next) + ' →', '', function(){ play(s, lvl + 1); });
            btn('↻ ' + SG.t(T.again), lvl < 5 ? 'ghost' : '', function(){ play(s, lvl); });
            btn(SG.t(T.all), 'ghost', sections);
            ov.appendChild(act); root.appendChild(ov);
          }, 500);
        }
        next();
      }
      sections();
    }
  });

  var css = '.l-list{display:grid;gap:12px;width:100%;max-width:640px;margin:0 auto}' +
    '.l-sec,.l-lvl{display:flex;align-items:center;gap:14px;width:100%;border:0;border-radius:22px;padding:14px 16px;cursor:pointer;color:#fff;text-align:left;background:linear-gradient(135deg,var(--c1),var(--c2));box-shadow:0 8px 18px -12px var(--c1);font-family:var(--font-display)}' +
    '.l-sec:active,.l-lvl:active{transform:scale(.98)}' +
    '.l-emo{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.25);display:grid;place-items:center;font-size:28px;flex:none}' +
    '.l-t{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.l-t b{font-weight:900;font-size:20px;line-height:1.15}.l-t small{font-family:var(--font-ui);font-weight:700;font-size:13px;opacity:.92}' +
    '.l-got{display:flex;align-items:center;gap:4px;font-weight:900;font-size:15px;background:rgba(255,255,255,.25);border-radius:999px;padding:5px 10px;flex:none}.l-got svg{width:16px;height:16px}' +
    '.l-lvl{justify-content:space-between}.l-lvl b{font-weight:900;font-size:20px}.l-lvl small{font-family:var(--font-ui);font-weight:700;font-size:13px;opacity:.9;margin-right:auto;margin-left:6px}' +
    '.l-stars{display:inline-flex;gap:2px}.l-stars i{width:24px;height:24px;color:rgba(255,255,255,.35);display:inline-block}.l-stars i.on{color:#FFE066}.l-stars svg{width:100%;height:100%}' +
    '.l-res .l-stars i{width:44px;height:44px;color:var(--surface-2,#ddd)}.l-res .l-stars i.on{color:#FFC93C}' +
    '.l-score{font-family:var(--font-ui);font-weight:800;font-size:17px;color:var(--ink-dim);margin:0 0 6px}' +
    '.l-ask{font-family:var(--font-display);font-weight:900;font-size:clamp(20px,5.5vw,28px);text-align:center}' +
    '.l-sample{width:clamp(96px,26vw,140px);aspect-ratio:1;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 0 0 4px var(--accent,#EF4C82)}.l-sample img{width:100%;height:100%;object-fit:cover;display:block}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
