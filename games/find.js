/* Игра №2 — «Көрсет / Покажи»: ребёнок слышит слово и находит нужную картинку.
 * Без таймера и штрафов. Неверная картинка мягко гаснет, слово звучит ещё раз — так ребёнок
 * не «проваливается», а получает подсказку (обучение без ошибок).
 */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 6;
  var T = {
    title:   { kk:'Көрсет',                              ru:'Покажи' },
    sub:     { kk:'Сөзді тыңда да, суретті тап',         ru:'Послушай слово и найди картинку' },
    theme:   { kk:'Тақырып',                             ru:'Тема' },
    choices: { kk:'Қанша сурет',                         ru:'Сколько картинок' },
    hint:    { kk:'Сөз',                                 ru:'Слово' },
    hintOn:  { kk:'Көрсету',                             ru:'Показывать' },
    hintOff: { kk:'Тек тыңдау',                          ru:'Только на слух' },
    play:    { kk:'Ойнау',                               ru:'Играть' },
    win:     { kk:'Жарайсың!',                           ru:'Молодец!' },
    again:   { kk:'Тағы да',                             ru:'Ещё раз' },
    other:   { kk:'Басқа тақырып',                       ru:'Другая тема' }
  };
  var ICON = '<svg viewBox="0 0 72 72" aria-hidden="true">' +
    '<circle cx="22" cy="24" r="14" fill="#fff"/><path d="M13 21v6h4l5 4V17l-5 4z" fill="#2D6CDF"/><path d="M26 20a5 5 0 010 8" fill="none" stroke="#2D6CDF" stroke-width="2.6" stroke-linecap="round"/>' +
    '<rect x="30" y="34" width="34" height="28" rx="7" fill="#fff"/><circle cx="47" cy="48" r="7" fill="#FFC93C"/><path d="M42 48l4 4 7-8" fill="none" stroke="#3FA35A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  SG.register({
    id: 'find', kk: T.title.kk, ru: T.title.ru, color: 'var(--cat-transport)', icon: ICON,
    mount: function(root, api){
      var settings = SG.load('soile_g_find', { cat: 'animal', choices: 3, hint: true });
      var timers = [];
      function later(fn, ms){ var t = setTimeout(fn, ms); timers.push(t); return t; }
      function clearTimers(){ timers.forEach(clearTimeout); timers = []; SG.stopSpeech(); }
      var current = {};
      function save(){ SG.save('soile_g_find', settings); }

      function topBar(onBack, middle){
        var bar = SG.el('div', 'g-top');
        var back = SG.el('button', 'g-iconbtn', SG.ICON_BACK); back.type = 'button'; back.setAttribute('aria-label', 'Back');
        if (onBack) back.addEventListener('click', onBack); else back.style.visibility = 'hidden';
        bar.appendChild(back); bar.appendChild(middle);
        bar.appendChild(SG.controls(function(){ if (current.onLang) current.onLang(); }));
        return bar;
      }

      /* ===== настройка ===== */
      function setup(){
        clearTimers(); current = {}; root.innerHTML = '';
        root.appendChild(topBar(api.onExit, SG.el('div', 'g-brand', SG.MASCOT + '<span>Сөйле</span>')));
        var main = SG.el('div', 'g-main'); root.appendChild(main);

        function draw(){
          main.innerHTML = '';
          var head = SG.el('div'); head.appendChild(SG.el('h1', 'g-h1', SG.t(T.title))); head.appendChild(SG.el('p', 'g-sub', SG.t(T.sub)));
          main.appendChild(head);

          var s1 = SG.el('div', 'g-sec'); s1.appendChild(SG.el('h3', '', SG.t(T.theme)));
          var c1 = SG.el('div', 'g-chips');
          SG.CATS_WITH_MIX.forEach(function(c){
            var b = SG.el('button', 'g-chip', SG.t(c)); b.type = 'button'; b.style.background = c.color;
            b.setAttribute('aria-pressed', settings.cat === c.id);
            b.addEventListener('click', function(){ settings.cat = c.id; save(); draw(); });
            c1.appendChild(b);
          });
          s1.appendChild(c1); main.appendChild(s1);

          var s2 = SG.el('div', 'g-sec'); s2.appendChild(SG.el('h3', '', SG.t(T.choices)));
          var c2 = SG.el('div', 'g-chips');
          [2, 3, 4].forEach(function(n){
            var b = SG.el('button', 'g-chip plain num', String(n)); b.type = 'button';
            b.setAttribute('aria-pressed', settings.choices === n);
            b.addEventListener('click', function(){ settings.choices = n; save(); draw(); });
            c2.appendChild(b);
          });
          s2.appendChild(c2); main.appendChild(s2);

          var s3 = SG.el('div', 'g-sec'); s3.appendChild(SG.el('h3', '', SG.t(T.hint)));
          var c3 = SG.el('div', 'g-chips');
          [[true, T.hintOn], [false, T.hintOff]].forEach(function(o){
            var b = SG.el('button', 'g-chip plain', SG.t(o[1])); b.type = 'button';
            b.setAttribute('aria-pressed', settings.hint === o[0]);
            b.addEventListener('click', function(){ settings.hint = o[0]; save(); draw(); });
            c3.appendChild(b);
          });
          s3.appendChild(c3); main.appendChild(s3);

          var go = SG.el('button', 'g-big', '▶ ' + SG.t(T.play)); go.type = 'button';
          go.addEventListener('click', function(){ SG.chime('match'); play(); });
          main.appendChild(go);
        }
        current.onLang = draw; draw();
      }

      /* ===== игра ===== */
      function buildRound(target, pool, k){
        var chosen = [];
        SG.shuffle(pool).forEach(function(c){
          if (chosen.length >= k - 1 || c.id === target.id || SG.sameGroup(c.id, target.id)) return;
          if (chosen.some(function(x){ return SG.sameGroup(x.id, c.id); })) return;
          chosen.push(c);
        });
        return SG.shuffle([target].concat(chosen));
      }

      function play(){
        clearTimers(); current = {}; root.innerHTML = '';
        var pool = SG.pool(settings.cat);
        var targets = SG.pick(settings.cat, ROUNDS);
        var total = targets.length, round = 0, locked = false, target = null;

        var prog = SG.el('div', 'g-progress'), stars = [];
        for (var i = 0; i < total; i++){ var s = SG.el('span', 'g-star', SG.STAR); stars.push(s); prog.appendChild(s); }
        root.appendChild(topBar(setup, prog));
        var main = SG.el('div', 'g-main'); main.style.padding = '10px 14px 16px'; main.style.gap = '12px'; root.appendChild(main);
        var prompt = SG.el('div', 'g-prompt'); main.appendChild(prompt);
        var speak = SG.el('button', 'g-speak', SG.ICON_SPEAKER); speak.type = 'button'; speak.setAttribute('aria-label', 'Listen');
        var word = SG.el('div', 'g-word', '');
        prompt.appendChild(speak); prompt.appendChild(word);
        var board = SG.el('div', 'g-board'); main.appendChild(board);

        function say(){ if (!target) return; speak.classList.remove('pulse'); void speak.offsetWidth; speak.classList.add('pulse'); SG.speak(target); }
        speak.addEventListener('click', say);

        function showWord(){ word.textContent = (settings.hint && target) ? SG.name(target) : ''; }
        current.onLang = function(){ showWord(); later(say, 200); };

        function next(){
          if (round >= total){ later(function(){ SG.win(root, { win: SG.t(T.win), again: SG.t(T.again), other: SG.t(T.other) }, play, setup); }, 400); return; }
          target = targets[round]; locked = false;
          var opts = buildRound(target, pool, settings.choices);
          var cols = (window.innerWidth >= 560) ? opts.length : 2;
          var rows = Math.ceil(opts.length / cols);
          board.innerHTML = '';
          var grid = SG.el('div', 'g-choices'); grid.style.setProperty('--cols', cols); grid.style.setProperty('--rows', rows);
          opts.forEach(function(card, idx){
            var b = SG.el('button', 'g-choice'); b.type = 'button'; b.setAttribute('data-id', card.id);
            var img = SG.el('img'); img.src = SG.photoURL(card); img.alt = ''; img.draggable = false; b.appendChild(img);
            if (cols === 2 && opts.length % 2 === 1 && idx === opts.length - 1) b.classList.add('center');
            b.addEventListener('click', function(){ choose(b, card); });
            grid.appendChild(b);
          });
          board.appendChild(grid);
          showWord();
          later(say, 450);
        }

        function choose(btn, card){
          if (locked) return;
          if (card.id === target.id){
            locked = true; btn.classList.add('ok');
            SG.chime('match');
            if (stars[round]) stars[round].classList.add('on');
            round++;
            later(next, 1300);
          } else {
            btn.classList.add('tried');
            later(say, 550);       // подсказка: слово звучит ещё раз
          }
        }
        next();
      }

      setup();
    }
  });
})();
