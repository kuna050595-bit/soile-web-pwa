/* Игра №1 — «Жұбын тап / Найди пару» (мемори на карточках Сөйле).
 * Без таймера и без «ошибок»: неверная пара просто мягко переворачивается обратно.
 */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var T = {
    title:  { kk:'Жұбын тап',            ru:'Найди пару' },
    sub:    { kk:'Бірдей суреттерді тап', ru:'Найди одинаковые картинки' },
    theme:  { kk:'Тақырып',               ru:'Тема' },
    pairs:  { kk:'Қанша жұп',             ru:'Сколько пар' },
    cards:  { kk:'карта',                 ru:'карточек' },
    play:   { kk:'Ойнау',                 ru:'Играть' },
    win:    { kk:'Жарайсың!',             ru:'Молодец!' },
    again:  { kk:'Тағы да',               ru:'Ещё раз' },
    other:  { kk:'Басқа тақырып',         ru:'Другая тема' }
  };
  // Подбираем сетку (колонки×строки) так, чтобы карточки были как можно крупнее на текущем экране.
  function bestLayout(total){
    var availW = Math.min(760, window.innerWidth) - 40;
    var availH = window.innerHeight - 190;
    var best = null;
    for (var cols = 2; cols <= 6; cols++){
      if (total % cols) continue;
      var rows = total / cols;
      var cardW = Math.min(availW, availH * cols / rows * .8) / cols;
      if (!best || cardW > best.w + .5) best = { cols: cols, rows: rows, w: cardW };
    }
    return best || { cols: 4, rows: Math.ceil(total / 4), w: 0 };
  }

  var ICON = '<svg viewBox="0 0 72 72" aria-hidden="true">' +
    '<rect x="6" y="14" width="26" height="34" rx="7" fill="#fff" opacity=".95" transform="rotate(-8 19 31)"/>' +
    '<rect x="38" y="20" width="26" height="34" rx="7" fill="#fff" transform="rotate(7 51 37)"/>' +
    '<circle cx="51" cy="37" r="7" fill="#FFC93C"/><path d="M17 33l5 5 8-10" fill="none" stroke="#3FA35A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-8 19 31)"/></svg>';

  SG.register({
    id: 'memory', kk: T.title.kk, ru: T.title.ru, color: 'var(--accent)', icon: ICON,
    mount: function(root, api){
      var settings = SG.load('soile_g_memory', { cat: 'animal', pairs: 3 });
      var timers = [];
      function later(fn, ms){ var t = setTimeout(fn, ms); timers.push(t); return t; }
      function clearTimers(){ timers.forEach(clearTimeout); timers = []; SG.stopSpeech(); }

      function topBar(onBack, middle){
        var bar = SG.el('div', 'g-top');
        var back = SG.el('button', 'g-iconbtn', SG.ICON_BACK); back.type = 'button'; back.setAttribute('aria-label', 'Back');
        if (onBack) back.addEventListener('click', onBack); else back.style.visibility = 'hidden';
        bar.appendChild(back);
        bar.appendChild(middle);
        bar.appendChild(SG.controls(function(){ if (current.onLang) current.onLang(); }));
        return bar;
      }
      var current = {};

      /* ===== экран настройки ===== */
      function setup(){
        clearTimers(); current = {};
        root.innerHTML = '';
        var brand = SG.el('div', 'g-brand', SG.MASCOT + '<span>Сөйле</span>');
        root.appendChild(topBar(api.onExit, brand));
        var main = SG.el('div', 'g-main'); root.appendChild(main);

        function draw(){
          var maxP = SG.maxPairs(settings.cat);
          if (settings.pairs > maxP) settings.pairs = [6,4,3].filter(function(n){ return n <= maxP; })[0] || 3;
          main.innerHTML = '';
          var head = SG.el('div'); head.appendChild(SG.el('h1', 'g-h1', SG.t(T.title))); head.appendChild(SG.el('p', 'g-sub', SG.t(T.sub)));
          main.appendChild(head);

          var s1 = SG.el('div', 'g-sec'); s1.appendChild(SG.el('h3', '', SG.t(T.theme)));
          var c1 = SG.el('div', 'g-chips');
          SG.CATS_WITH_MIX.forEach(function(c){
            var b = SG.el('button', 'g-chip', SG.t(c)); b.type = 'button'; b.style.background = c.color;
            b.setAttribute('aria-pressed', settings.cat === c.id);
            b.addEventListener('click', function(){ settings.cat = c.id; SG.save('soile_g_memory', settings); draw(); });
            c1.appendChild(b);
          });
          s1.appendChild(c1); main.appendChild(s1);

          var s2 = SG.el('div', 'g-sec'); s2.appendChild(SG.el('h3', '', SG.t(T.pairs)));
          var c2 = SG.el('div', 'g-chips');
          [3, 4, 6].forEach(function(n){
            if (n > maxP) return;
            var b = SG.el('button', 'g-chip plain num', n + '<small>' + (n * 2) + ' ' + SG.t(T.cards) + '</small>'); b.type = 'button';
            b.setAttribute('aria-pressed', settings.pairs === n);
            b.addEventListener('click', function(){ settings.pairs = n; SG.save('soile_g_memory', settings); draw(); });
            c2.appendChild(b);
          });
          s2.appendChild(c2); main.appendChild(s2);

          var go = SG.el('button', 'g-big', '▶ ' + SG.t(T.play)); go.type = 'button';
          go.addEventListener('click', function(){ SG.chime('match'); play(); });
          main.appendChild(go);
        }
        current.onLang = draw;
        draw();
      }

      /* ===== игра ===== */
      function play(){
        clearTimers(); current = {};
        root.innerHTML = '';
        var n = settings.pairs;
        var picked = SG.pick(settings.cat, n);
        n = picked.length;
        var deck = SG.shuffle(picked.concat(picked));
        var matched = 0, first = null, lock = false;

        // шапка: назад + звёздочки прогресса
        var prog = SG.el('div', 'g-progress');
        var stars = [];
        for (var i = 0; i < n; i++){ var s = SG.el('span', 'g-star', SG.STAR); stars.push(s); prog.appendChild(s); }
        root.appendChild(topBar(setup, prog));

        var main = SG.el('div', 'g-main'); main.style.padding = '10px 14px 16px'; root.appendChild(main);
        var board = SG.el('div', 'g-board'); main.appendChild(board);
        var grid = SG.el('div', 'g-grid');
        function fit(){ var l = bestLayout(deck.length); grid.style.setProperty('--cols', l.cols); grid.style.setProperty('--rows', l.rows); }
        fit(); board.appendChild(grid);
        var onResize = function(){ if (!document.body.contains(grid)) { window.removeEventListener('resize', onResize); return; } fit(); };
        window.addEventListener('resize', onResize);

        var items = deck.map(function(card){
          var el = SG.el('button', 'g-card'); el.type = 'button';
          var inner = SG.el('div', 'g-inner');
          var front = SG.el('div', 'g-face front', SG.MASCOT);
          var back = SG.el('div', 'g-face back');
          var img = SG.el('img'); img.src = SG.photoURL(card); img.alt = ''; img.draggable = false;
          var label = SG.el('div', 'g-label', SG.name(card));
          back.appendChild(img); back.appendChild(label);
          inner.appendChild(front); inner.appendChild(back); el.appendChild(inner);
          var it = { card: card, el: el, label: label, flipped: false, matched: false };
          el.setAttribute('aria-label', '?');
          el.addEventListener('click', function(){ tap(it); });
          grid.appendChild(el);
          return it;
        });

        function setFlip(it, v){
          it.flipped = v; it.el.classList.toggle('flipped', v);
          it.el.setAttribute('aria-label', v ? SG.name(it.card) : '?');
        }
        function tap(it){
          if (lock || it.flipped || it.matched) return;
          setFlip(it, true);
          SG.speak(it.card);
          if (!first){ first = it; return; }
          var a = first, b = it; first = null;
          if (a.card.id === b.card.id){
            lock = true;
            later(function(){
              [a, b].forEach(function(x){ x.matched = true; x.el.classList.add('matched', 'pop'); });
              SG.chime('match');
              if (stars[matched]) stars[matched].classList.add('on');
              matched++;
              lock = false;
              if (matched >= n) later(win, 900);
            }, 450);
          } else {
            lock = true;
            later(function(){ setFlip(a, false); setFlip(b, false); lock = false; }, 1500);
          }
        }
        current.onLang = function(){ items.forEach(function(it){ it.label.textContent = SG.name(it.card); if (it.flipped) it.el.setAttribute('aria-label', SG.name(it.card)); }); };

        function win(){
          SG.chime('win'); SG.confetti();
          var ov = SG.el('div', 'g-overlay');
          ov.innerHTML = SG.MASCOT.replace('<svg ', '<svg class="g-mascot" ') +
            '<h2 class="g-win">' + SG.t(T.win) + '</h2>' +
            '<div class="g-stars">' + SG.STAR + SG.STAR + SG.STAR + '</div>';
          var act = SG.el('div', 'g-actions');
          var again = SG.el('button', 'g-big', '↻ ' + SG.t(T.again)); again.type = 'button'; again.style.marginTop = '0';
          var other = SG.el('button', 'g-big ghost', SG.t(T.other)); other.type = 'button'; other.style.marginTop = '0';
          again.addEventListener('click', play); other.addEventListener('click', setup);
          act.appendChild(again); act.appendChild(other); ov.appendChild(act);
          root.appendChild(ov);
        }
      }

      setup();
    }
  });
})();
