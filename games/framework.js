/* Сөйле · Игры — каркас. Игра описывается через SoileGames.defineGame({...}):
 * настройка (тема + свои параметры), шапка, звёздочки прогресса, экран победы — всё общее.
 * Игра пишет только start(ctx): что показывать в каждом раунде.
 */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var C = {
    theme: { kk:'Тақырып',      ru:'Тема' },
    play:  { kk:'Ойнау',        ru:'Играть' },
    win:   { kk:'Жарайсың!',    ru:'Молодец!' },
    again: { kk:'Тағы да',      ru:'Ещё раз' },
    other: { kk:'Басқа ойын',   ru:'Другие настройки' }
  };

  /* подбор отвлекающих картинок: не похожих на цель и друг на друга */
  SG.buildChoices = function(target, pool, k){
    var chosen = [];
    SG.shuffle(pool).forEach(function(c){
      if (chosen.length >= k - 1 || c.id === target.id || SG.sameGroup(c.id, target.id)) return;
      if (chosen.some(function(x){ return SG.sameGroup(x.id, c.id); })) return;
      chosen.push(c);
    });
    return SG.shuffle([target].concat(chosen));
  };

  /* сетка крупных картинок-кнопок. onPick(btn, card). opt: cols, reserve (px сверху под заголовки) */
  SG.choiceGrid = function(cards, onPick, opt){
    opt = opt || {};
    var cols = opt.cols || ((window.innerWidth >= 560) ? cards.length : 2);
    var rows = Math.ceil(cards.length / cols);
    var grid = SG.el('div', 'g-choices');
    grid.style.setProperty('--cols', cols); grid.style.setProperty('--rows', rows);
    if (opt.reserve) grid.style.setProperty('--reserve', opt.reserve + 'px');
    cards.forEach(function(card, idx){
      var b = SG.el('button', 'g-choice'); b.type = 'button'; b.setAttribute('data-id', card.id);
      var img = SG.el('img'); img.src = SG.photoURL(card); img.alt = ''; img.draggable = false; b.appendChild(img);
      if (cols === 2 && cards.length % 2 === 1 && idx === cards.length - 1) b.classList.add('center');
      b.addEventListener('click', function(){ onPick(b, card); });
      grid.appendChild(b);
    });
    return grid;
  };

  /* перетаскивание пальцем/мышью. o: onDrop(x,y,el), onTap(), onLift(), disabled() */
  SG.makeDraggable = function(el, o){
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', function(e){
      if (o.disabled && o.disabled()) return;
      e.preventDefault();
      var r = el.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, moved = false, ghost = null, dx = sx - r.left, dy = sy - r.top;
      try{ el.setPointerCapture(e.pointerId); }catch(_){}
      function mv(ev){
        if (!moved){
          if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) return;
          moved = true;
          ghost = el.cloneNode(true);
          ghost.style.cssText += ';position:fixed;z-index:60;pointer-events:none;margin:0;opacity:1;width:' + r.width + 'px;height:' + r.height + 'px;transform:scale(1.07);box-shadow:0 16px 30px -10px rgba(0,0,0,.45)';
          document.body.appendChild(ghost); el.style.opacity = '.25';
          if (o.onLift) o.onLift();
        }
        ghost.style.left = (ev.clientX - dx) + 'px'; ghost.style.top = (ev.clientY - dy) + 'px';
      }
      function up(ev){
        el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        try{ el.releasePointerCapture(e.pointerId); }catch(_){}
        if (ghost) ghost.remove();
        el.style.opacity = '';
        if (!moved){ if (o.onTap) o.onTap(); return; }
        if (o.onDrop) o.onDrop(ev.clientX, ev.clientY, el);
      }
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
  };

  /* точка на картинке, где есть предмет (не белый фон) — чтобы «лупа» не показывала пустоту */
  var fpCache = {};
  SG.focusPoint = function(card, cb){
    if (fpCache[card.id]) return cb(fpCache[card.id]);
    var fallback = { x: .5, y: .5 }, img = new Image();
    img.onload = function(){
      try{
        var W = 22, H = 27, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, W, H);
        var d = cx.getImageData(0, 0, W, H).data, pts = [];
        for (var y = 3; y < H - 3; y++) for (var x = 3; x < W - 3; x++){
          var i = (y * W + x) * 4, dev = (255 - d[i]) + (255 - d[i+1]) + (255 - d[i+2]);
          if (dev > 120) pts.push({ x: x / W, y: y / H });
        }
        fpCache[card.id] = pts.length > 8 ? pts[Math.floor(Math.random() * pts.length)] : fallback;
      }catch(e){ fpCache[card.id] = fallback; }
      cb(fpCache[card.id]);
    };
    img.onerror = function(){ cb(fallback); };
    img.src = SG.photoURL(card);
  };

  /* силуэт: тёмная заливка по контуру предмета (белый фон фото становится прозрачным) */
  var silCache = {};
  SG.silhouette = function(card, cb){
    if (silCache[card.id]) return cb(silCache[card.id]);
    var img = new Image();
    img.onload = function(){
      try{
        var W = img.naturalWidth, H = img.naturalHeight, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
        var id = cx.getImageData(0, 0, W, H), d = id.data;
        for (var i = 0; i < d.length; i += 4){
          var m = Math.min(d[i], d[i+1], d[i+2]), a = m >= 232 ? 0 : (m <= 200 ? 255 : Math.round((232 - m) / 32 * 255));
          d[i] = 38; d[i+1] = 50; d[i+2] = 95; d[i+3] = a;
        }
        cx.putImageData(id, 0, 0);
        silCache[card.id] = cv.toDataURL('image/png');
      }catch(e){ silCache[card.id] = null; }
      cb(silCache[card.id]);
    };
    img.onerror = function(){ cb(null); };
    img.src = SG.photoURL(card);
  };

  /* ---------- описание игры ---------- */
  SG.defineGame = function(def){
    SG.register({
      id: def.id, kk: def.kk, ru: def.ru, sub: def.sub, color: def.color, color2: def.color2 || def.color, icon: def.icon || '',
      mount: function(root, api){
        var key = 'soile_g_' + def.id;
        var settings = { cat: def.defaultCat || 'animal' };
        (def.options || []).forEach(function(op){ settings[op.key] = op.default !== undefined ? op.default : op.values[0].v; });
        var saved = SG.load(key, {}); Object.keys(saved).forEach(function(k){ if (k in settings) settings[k] = saved[k]; });
        var timers = [], cur = {};
        function later(fn, ms){ var t = setTimeout(fn, ms); timers.push(t); return t; }
        function clear(){ timers.forEach(clearTimeout); timers = []; SG.stopSpeech(); }
        function persist(){ SG.save(key, settings); }

        function topBar(onBack, mid){
          var bar = SG.el('div', 'g-top');
          var back = SG.el('button', 'g-iconbtn', SG.ICON_BACK); back.type = 'button'; back.setAttribute('aria-label', 'Back');
          if (onBack) back.addEventListener('click', onBack); else back.style.visibility = 'hidden';
          bar.appendChild(back); bar.appendChild(mid);
          bar.appendChild(SG.controls(function(){ if (cur.onLang) cur.onLang(); }));
          return bar;
        }
        function chips(parent, title, items, isActive, onSelect, cls){
          var s = SG.el('div', 'g-sec'); s.appendChild(SG.el('h3', '', SG.t(title)));
          var c = SG.el('div', 'g-chips');
          items.forEach(function(it){
            var b = SG.el('button', 'g-chip ' + (cls(it) || ''), it.html); b.type = 'button';
            if (it.color) b.style.background = it.color;
            b.setAttribute('aria-pressed', isActive(it));
            b.addEventListener('click', function(){ onSelect(it); });
            c.appendChild(b);
          });
          s.appendChild(c); parent.appendChild(s);
        }

        /* ===== настройка ===== */
        function setup(){
          clear(); cur = {}; root.innerHTML = '';
          root.appendChild(topBar(api.onExit, SG.el('div', 'g-brand', SG.MASCOT + '<span>Сөйле</span>')));
          var main = SG.el('div', 'g-main'); root.appendChild(main);
          function draw(){
            main.innerHTML = '';
            var head = SG.el('div'); head.appendChild(SG.el('h1', 'g-h1', SG.t(def)));
            if (def.sub) head.appendChild(SG.el('p', 'g-sub', SG.t(def.sub)));
            main.appendChild(head);
            if (def.themes !== false){
              var list = SG.CATS_WITH_MIX.filter(function(c){ return !def.themes || def.themes.indexOf(c.id) >= 0; });
              chips(main, C.theme, list.map(function(c){ return { id: c.id, html: SG.t(c), color: c.color }; }),
                function(it){ return settings.cat === it.id; },
                function(it){ settings.cat = it.id; persist(); draw(); },
                function(){ return ''; });
            }
            (def.options || []).forEach(function(op){
              chips(main, op.title, op.values.map(function(v){
                var lab = (typeof v.label === 'object') ? SG.t(v.label) : String(v.label);
                return { v: v.v, html: lab + (v.sub ? '<small>' + SG.t(v.sub) + '</small>' : '') };
              }), function(it){ return settings[op.key] === it.v; },
                function(it){ settings[op.key] = it.v; persist(); draw(); },
                function(it){ return 'plain' + (op.big ? ' num' : ''); });
            });
            var go = SG.el('button', 'g-big', '▶ ' + SG.t(C.play)); go.type = 'button';
            go.addEventListener('click', function(){ SG.chime('match'); play(); });
            main.appendChild(go);
          }
          cur.onLang = draw; draw();
        }

        /* ===== игра ===== */
        function play(){
          clear(); cur = {}; root.innerHTML = '';
          var total = def.rounds ? def.rounds(settings) : 0, stars = [];
          var prog = SG.el('div', 'g-progress');
          for (var i = 0; i < total; i++){ var s = SG.el('span', 'g-star', SG.STAR); stars.push(s); prog.appendChild(s); }
          root.appendChild(topBar(setup, prog));
          var main = SG.el('div', 'g-main'); main.style.padding = '10px 14px 16px'; main.style.gap = '12px'; root.appendChild(main);
          var top = SG.el('div', 'g-prompt'); main.appendChild(top);
          var board = SG.el('div', 'g-board'); main.appendChild(board);
          var ctx = {
            settings: settings, root: root, main: main, top: top, board: board, total: total,
            later: later, t: SG.t, name: SG.name, photo: SG.photoURL,
            star: function(i){ if (stars[i]) stars[i].classList.add('on'); },
            speak: function(card, cb){ SG.speak(card, cb); },
            // сказать слово и продолжить не раньше, чем через minMs (чтобы ритм не зависел от длины записи)
            say: function(card, minMs, cb){
              var n = 0, fin = function(){ if (++n === 2 && cb) cb(); };
              SG.speak(card, fin); later(fin, minMs || 700);
            },
            win: function(){ later(function(){ SG.win(root, { win: SG.t(C.win), again: SG.t(C.again), other: SG.t(C.other) }, play, setup); }, 500); },
            restart: play, setup: setup,
            onLang: function(fn){ cur.onLang = fn; }
          };
          def.start(ctx);
        }
        setup();
      }
    });
  };
})();
