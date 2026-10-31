/* «Үйренеміз / Учимся» — программа занятий по разделам и уровням (как в ABA-тренажёрах).
 * 9 разделов × 5 уровней (сопоставление, различение, категории, глаголы, эмоции, цвета, фигуры, цифры, буквы).
 * За каждые 3 звезды открывается новый друг-зверёк в альбоме «Менің достарым / Мои друзья».
 * Ведёт ребёнка Сөйлешік — свой персонаж приложения. На уровне 5 заданий; ошибка не наказывается: картинка гаснет, слово звучит ещё раз.
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
    group: { kk:'Осы топтан тағы біреуін тап', ru:'Найди пару по группе' },
    letter:{ kk:'Қай сурет осы әріптен басталады?', ru:'Что начинается на эту букву?' },
    friends:{ kk:'Менің достарым', ru:'Мои друзья' },
    newf:  { kk:'Жаңа дос!', ru:'Новый друг!' },
    hint:  { kk:'Жұлдыз жина — әр 3 жұлдызға жаңа дос ашылады!', ru:'Собирай звёзды — за каждые 3 звезды новый друг!' },
    left:  { kk:'Келесі досқа дейін', ru:'До нового друга' },
    allf:  { kk:'Барлық достар жиналды! Сен — чемпионсың!', ru:'Все друзья собраны! Ты чемпион!' },
    tap:   { kk:'Досты бас — атын естисің', ru:'Нажми на друга — услышишь, как его зовут' },
    praise:[ { kk:'Жарайсың!', ru:'Молодец!' }, { kk:'Керемет!', ru:'Отлично!' }, { kk:'Тамаша!', ru:'Супер!' } ]
  };
  var SECTIONS = [
    { id:'match', kk:'Сәйкестендіру', ru:'Сопоставление', sub:{ kk:'Дәл осындай суретті тап', ru:'Найди такую же картинку' }, c1:'#EF4C82', c2:'#FF9CBF', emoji:'🧩' },
    { id:'show',  kk:'Ажырату', ru:'Различение', sub:{ kk:'Сөзді тыңда — суретті көрсет', ru:'Послушай слово — покажи картинку' }, c1:'#E07A34', c2:'#FFB070', emoji:'👂' },
    { id:'group', kk:'Санаттар', ru:'Категории', sub:{ kk:'Бір топтан жұп тап', ru:'Найди пару по категории' }, c1:'#E8A93B', c2:'#FFD87F', emoji:'🧺' },
    { id:'verb',  kk:'Етістіктер', ru:'Глаголы', sub:{ kk:'Кім не істеп жатыр?', ru:'Кто что делает?' }, c1:'#3FA35A', c2:'#86DA95', emoji:'🏃' },
    { id:'emo',   kk:'Сезімдер', ru:'Эмоции', sub:{ kk:'Кім қуанып, кім жылап тұр?', ru:'Кто радуется, кто грустит?' }, c1:'#2D6CDF', c2:'#74A8FF', emoji:'😊' },
    { id:'color', kk:'Түстер', ru:'Цвета', sub:{ kk:'Түсін тыңда — көрсет', ru:'Послушай цвет — покажи' }, c1:'#B03FC2', c2:'#E89BF2', emoji:'🎨', cat:'color' },
    { id:'shape', kk:'Пішіндер', ru:'Фигуры', sub:{ kk:'Шеңбер, шаршы, жұлдыз…', ru:'Круг, квадрат, звезда…' }, c1:'#0E9AA7', c2:'#6FD9E0', emoji:'🔷', cat:'shape' },
    { id:'num',   kk:'Сандар', ru:'Цифры', sub:{ kk:'Санды тыңда — көрсет', ru:'Послушай цифру — покажи' }, c1:'#C92A2A', c2:'#FF8787', emoji:'🔢', cat:'number' },
    { id:'letter',kk:'Әріптер', ru:'Буквы', sub:{ kk:'Қай сурет осы әріптен басталады?', ru:'Что начинается на эту букву?' }, c1:'#5B5BD6', c2:'#9EA1FF', emoji:'<b class="l-abc">Әә</b>' }
  ];
  // Альбом друзей: порядок, в котором открываются зверята
  var FRIENDS = ['cat','dog','duck','sheep','horse','rooster','pig','bear','fox','lion','tiger','elephant','wolf','deer','cheetah','dolphin','whale','crab','octopus','starfish','seaturtle','shark'];
  var LETTER_CATS = ['animal','food','toys','transport','clothes','home','people','place'];
  // Сөйлешік — персонаж Сөйле (облачко-собеседник из логотипа, с лицом)
  var BUDDY = '<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="188" rx="52" ry="7" fill="rgba(0,0,0,.12)"/>' +
    '<path fill="#FFC83D" d="M100 18c47 0 82 33 82 76s-35 76-82 76c-9 0-17-1-25-3l-40 12 14-27C30 138 18 117 18 94c0-43 35-76 82-76Z"/>' +
    '<path fill="#FFD976" d="M64 40c18-12 52-14 74-2-30-4-56 2-74 2Z" opacity=".9"/>' +
    '<circle cx="74" cy="86" r="15" fill="#fff"/><circle cx="126" cy="86" r="15" fill="#fff"/>' +
    '<circle class="eye" cx="77" cy="89" r="8" fill="#2B2B33"/><circle class="eye" cx="129" cy="89" r="8" fill="#2B2B33"/>' +
    '<circle cx="80" cy="85" r="3" fill="#fff"/><circle cx="132" cy="85" r="3" fill="#fff"/>' +
    '<ellipse cx="58" cy="112" rx="10" ry="6" fill="#FF8A80" opacity=".7"/><ellipse cx="142" cy="112" rx="10" ry="6" fill="#FF8A80" opacity=".7"/>' +
    '<path d="M84 114c8 12 24 12 32 0" fill="none" stroke="#C2410C" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="168" cy="34" r="8" fill="#1FA89E"/><circle cx="182" cy="16" r="5" fill="#1FA89E"/></svg>';

  function progress(){ return SG.load(PKEY, {}); }
  function starsFor(clean){ return clean >= ROUNDS ? 3 : clean >= ROUNDS - 2 ? 2 : 1; }
  function poolOf(cats){ var out = []; cats.forEach(function(c){ out = out.concat(SG.pool(c)); }); return out; }
  function pickFrom(cats, n){
    var all = SG.shuffle(poolOf(cats)), out = [];
    all.forEach(function(c){ if (out.length < n && !out.some(function(x){ return x.id === c.id || SG.sameGroup(x.id, c.id); })) out.push(c); });
    return out;
  }

  // Записи из «Сөйле Студии» (этап «Новое»): звуки букв, похвала. Если записи ещё нет — просто тишина.
  var ALPHA = { kk:'АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЫІЭЮЯ', ru:'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ' };
  function rec(key){
    var m = SG.getLang() === 'kk' ? window.SOILE_VOICE_KK : window.SOILE_VOICE_RU;
    return m && m[key] ? { id:key, kk:'', ru:'', audioData:m[key] } : null;
  }
  function letterRec(L){ var i = ALPHA[SG.getLang()].indexOf(L); return i < 0 ? null : rec('abc' + (i < 9 ? '0' : '') + (i + 1)); }
  function totalStars(p){ var n = 0; SECTIONS.forEach(function(s){ for (var l = 1; l <= 5; l++) n += (p[s.id] && p[s.id][l]) || 0; }); return n; }
  function friendCards(){ return FRIENDS.map(function(id){ for (var i = 0; i < SG.cards.length; i++) if (SG.cards[i].id === id && SG.cards[i].photo) return SG.cards[i]; return null; }).filter(Boolean); }
  function unlocked(p){ return Math.min(friendCards().length, Math.floor(totalStars(p || progress()) / 3)); }
  function firstLetter(c){ var w = (SG.getLang() === 'kk' ? c.kk : c.ru) || ''; return w.charAt(0).toUpperCase(); }
  function letterPool(){ return poolOf(LETTER_CATS).filter(function(c){ var w = SG.getLang() === 'kk' ? c.kk : c.ru; return w && /^[А-ЯЁӘҒҚҢӨҰҮҺІ]/i.test(w) && w.indexOf(' ') < 0; }); }

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
          var fc = friendCards(), un = unlocked(p), ts = totalStars(p), need = 3 - ts % 3;
          var fb = SG.el('button', 'l-fr', '<span class="l-buddy">' + BUDDY + '</span><span class="l-frt"><b>🐾 ' + SG.t(T.friends) + '</b>' +
            '<small>' + (un >= fc.length ? SG.t(T.allf) : (un ? SG.t(T.left) + ': ' + need + ' ★' : SG.t(T.hint))) + '</small>' +
            '<span class="l-bar"><i style="width:' + (un >= fc.length ? 100 : Math.round((3 - need) / 3 * 100)) + '%"></i></span></span>' +
            '<span class="l-mini">' + fc.slice(0, Math.max(un, 0)).slice(-2).map(function(c){ return '<img src="' + SG.photoURL(c) + '" alt="">'; }).join('') + '<span class="l-cnt">' + un + '/' + fc.length + '</span></span>');
          fb.type = 'button'; fb.addEventListener('click', album);
          list.appendChild(fb);
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

      /* ===== альбом друзей ===== */
      function album(){
        clear(); cur = {}; root.innerHTML = ''; root.removeAttribute('data-track');
        root.appendChild(topBar(sections, SG.el('div', 'g-brand', '<span>🐾</span>')));
        var main = SG.el('div', 'g-main'); root.appendChild(main);
        function draw(){
          main.innerHTML = '';
          var fc = friendCards(), un = unlocked();
          var head = SG.el('div'); head.appendChild(SG.el('h1', 'g-h1', SG.t(T.friends) + ' · ' + un + '/' + fc.length));
          head.appendChild(SG.el('p', 'g-sub', SG.t(un ? T.tap : T.hint))); main.appendChild(head);
          var g = SG.el('div', 'l-album');
          fc.forEach(function(c, i){
            var open = i < un, b = SG.el('button', 'l-fcard' + (open ? '' : ' locked'),
              open ? '<img src="' + SG.photoURL(c) + '" alt=""><b>' + SG.name(c) + '</b>' : '<span class="q">?</span><b>' + (i + 1) + '</b>');
            b.type = 'button';
            b.addEventListener('click', function(){ if (open){ SG.speak(c); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } else { b.classList.remove('wob'); void b.offsetWidth; b.classList.add('wob'); } });
            g.appendChild(b);
          });
          main.appendChild(g);
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
        } else if (s.id === 'letter'){
          var lp = letterPool(), used = {};
          SG.shuffle(lp).forEach(function(t){
            if (out.length >= ROUNDS) return;
            var L = firstLetter(t); if (used[L]) return;
            var opts = [t], seen = {}; seen[L] = 1;
            SG.shuffle(lp).forEach(function(c){ var k = firstLetter(c); if (opts.length < n && !seen[k] && !SG.sameGroup(c.id, t.id)){ seen[k] = 1; opts.push(c); } });
            if (opts.length < n) return;
            used[L] = 1; out.push({ target: t, letter: L, opts: SG.shuffle(opts) });
          });
        } else if (s.id === 'verb' || s.id === 'emo' || s.cat){
          var cat = s.cat || (s.id === 'verb' ? 'action' : 'emotion'), tg = pickFrom([cat], ROUNDS), pl = SG.pool(cat);
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
        var heard = s.id === 'show' || s.id === 'verb' || s.id === 'emo' || !!s.cat;
        var hideWord = s.id === 'show' && lvl >= 4;          // старшие уровни — только на слух

        function say(){ var r = rounds[i]; if (!r) return; if (heard) SG.speak(r.target); else if (s.id === 'letter'){ var a = letterRec(r.letter); if (a) SG.speak(a); } }
        function drawPrompt(){
          var r = rounds[i]; prompt.innerHTML = ''; if (!r) return;
          if (heard){
            var sp = SG.el('button', 'g-speak', SG.ICON_SPEAKER); sp.type = 'button'; sp.addEventListener('click', say);
            prompt.appendChild(sp);
            prompt.appendChild(SG.el('div', 'g-word', SG.t(T.show) + (hideWord ? '' : ': ' + SG.name(r.target))));
          } else if (s.id === 'letter'){
            if (letterRec(r.letter)){ var lsp = SG.el('button', 'g-speak l-lsp', SG.ICON_SPEAKER); lsp.type = 'button'; lsp.addEventListener('click', say); prompt.appendChild(lsp); }
            prompt.appendChild(SG.el('div', 'l-ask', SG.t(T.letter)));
            prompt.appendChild(SG.el('div', 'l-letter', r.letter + '<small>' + r.letter.toLowerCase() + '</small>'));
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
          board.appendChild(SG.choiceGrid(rounds[i].opts, pick, { reserve: Math.max(200, Math.round(prompt.getBoundingClientRect().bottom) + 40) }));
          if (heard || s.id === 'letter') later(say, 450);
        }
        function pick(btn, card){
          if (locked) return;
          var r = rounds[i];
          if (card.id === r.target.id){
            locked = true; btn.classList.add('ok'); SG.chime('match'); SG.speak(card);
            if (s.id === 'letter'){ var w = SG.name(card); btn.appendChild(SG.el('span', 'l-wordtag', '<b>' + w.charAt(0) + '</b>' + w.slice(1))); }
            if (!errHere) clean++;
            if (stars[i]) stars[i].classList.add('on');
            i++; later(next, 1300);
          } else {
            errHere++; btn.classList.add('tried');
            if (heard || s.id === 'letter') later(say, 550);
          }
        }
        function finish(){
          var got = starsFor(clean), p = progress(), before = unlocked(p); p[s.id] = p[s.id] || {};
          if ((p[s.id][lvl] || 0) < got) p[s.id][lvl] = got; SG.save(PKEY, p);
          var after = unlocked(p), fresh = friendCards().slice(before, after);
          later(function(){
            SG.chime('win'); SG.confetti();
            var ov = SG.el('div', 'g-overlay');
            var pi = Math.floor(Math.random() * T.praise.length), pr = T.praise[pi], prA = rec('praise' + (pi + 1));
            if (prA) later(function(){ SG.speak(prA); }, 700);
            ov.innerHTML = '<div class="l-buddywin">' + BUDDY + '<span class="l-bubble">' + SG.t(pr) + '</span></div>' + '<h2 class="g-win">' + SG.t(T.win) + '</h2>' +
              '<div class="l-res">' + starRow(got) + '</div><p class="l-score">' + clean + ' / ' + total + ' ' + SG.t(T.clean) + '</p>';
            if (fresh.length){
              var nf = SG.el('button', 'l-newf', '<span class="l-newft">🎉 ' + SG.t(T.newf) + '</span>' + fresh.map(function(c){ return '<span class="l-newfc"><img src="' + SG.photoURL(c) + '" alt=""><b>' + SG.name(c) + '</b></span>'; }).join(''));
              nf.type = 'button'; nf.addEventListener('click', function(){ SG.speak(fresh[fresh.length - 1]); });
              ov.appendChild(nf);
              var nfA = rec('newfriend');
              later(function(){ if (nfA) SG.speak(nfA, function(){ SG.speak(fresh[fresh.length - 1]); }); else SG.speak(fresh[fresh.length - 1]); }, prA ? 2000 : 900);
            }
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

  var css = '.l-list{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;width:100%;max-width:640px;margin:0 auto}' +
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
  css += '.l-fr{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:22px;padding:10px 14px;cursor:pointer;text-align:left;background:linear-gradient(135deg,#FFF4D6,#FFE3A3);box-shadow:0 8px 18px -12px #C98A00;font-family:var(--font-display);color:#5A3B00}' +
    '.l-fr:active{transform:scale(.98)}.l-buddy{width:58px;height:58px;flex:none;animation:l-bob 2.6s ease-in-out infinite}.l-buddy svg,.l-buddywin svg{width:100%;height:100%;display:block}' +
    '.l-frt{display:flex;flex-direction:column;gap:3px;flex:1;min-width:0}.l-frt b{font-weight:900;font-size:18px}.l-frt small{font-family:var(--font-ui);font-weight:700;font-size:12.5px;opacity:.85;line-height:1.3}' +
    '.l-bar{height:8px;border-radius:99px;background:rgba(90,59,0,.15);overflow:hidden;margin-top:3px}.l-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#FFB020,#FF7A00)}' +
    '.l-mini{display:flex;align-items:center;flex:none}.l-mini img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:3px solid #fff;margin-left:-12px;background:#fff}' +
    '@media (max-width:420px){.l-mini img{display:none}.l-t b{font-size:17px}}' +
    '.l-cnt{margin-left:6px;background:#fff;border-radius:999px;padding:5px 10px;font-weight:900;font-size:15px;color:#5A3B00}.l-abc{font-family:var(--font-display);font-weight:900;font-size:22px}' +
    '.l-album{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px;width:100%;max-width:640px;margin:0 auto}' +
    '.l-fcard{border:0;border-radius:18px;background:#fff;padding:6px 6px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;box-shadow:0 6px 14px -10px rgba(0,0,0,.4);font-family:var(--font-display);color:var(--ink)}' +
    '.l-fcard img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px;display:block}.l-fcard b{font-weight:900;font-size:13.5px;line-height:1.1;text-align:center}' +
    '.l-fcard.locked{background:var(--surface-2,#eee);color:var(--ink-dim)}.l-fcard .q{width:100%;aspect-ratio:1;border-radius:14px;display:grid;place-items:center;font-size:40px;font-weight:900;background:repeating-linear-gradient(45deg,rgba(0,0,0,.04) 0 8px,transparent 8px 16px);color:rgba(0,0,0,.25)}' +
    '.l-fcard.pop{animation:l-pop .45s}.l-fcard.wob{animation:l-wob .4s}' +
    '.l-buddywin{position:relative;width:120px;height:120px;margin:0 auto;animation:l-jump .9s ease-out}.l-bubble{position:absolute;left:92px;top:-6px;background:#fff;border-radius:14px;padding:6px 10px;font-family:var(--font-display);font-weight:900;font-size:16px;color:var(--ink);box-shadow:0 4px 12px -6px rgba(0,0,0,.35);white-space:nowrap}' +
    '.l-newf{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;border:0;border-radius:20px;padding:10px 14px;margin:0 0 10px;background:linear-gradient(135deg,#FFF4D6,#FFE3A3);cursor:pointer;animation:l-pop .6s .3s both;font-family:var(--font-display);color:#5A3B00}' +
    '.l-newft{width:100%;font-weight:900;font-size:18px}.l-newfc{display:flex;flex-direction:column;align-items:center;gap:4px}.l-newfc img{width:84px;height:84px;border-radius:18px;object-fit:cover;border:4px solid #fff;background:#fff}.l-newfc b{font-weight:900;font-size:15px}' +
    '.l-lsp{width:56px;height:56px}.l-lsp svg{width:26px;height:26px}' +
    '.l-letter{font-family:var(--font-display);font-weight:900;font-size:clamp(64px,18vw,96px);line-height:1;color:#5B5BD6;display:flex;align-items:baseline;gap:10px}.l-letter small{font-size:.55em;opacity:.7}' +
    '.l-wordtag{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);background:#fff;border-radius:12px;padding:3px 10px;font-family:var(--font-display);font-weight:800;font-size:18px;color:var(--ink);white-space:nowrap;box-shadow:0 4px 10px -6px rgba(0,0,0,.4)}.l-wordtag b{color:#5B5BD6;font-weight:900}' +
    '@keyframes l-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes l-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}' +
    '@keyframes l-wob{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}@keyframes l-jump{0%{transform:translateY(30px) scale(.7);opacity:0}60%{transform:translateY(-10px) scale(1.05);opacity:1}100%{transform:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
