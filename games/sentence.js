/* Игра №13 — «Сөйлем құра / Составь предложение»: послушай фразу и выложи её из карточек по порядку.
 * Фразы короткие, «телеграфные» — как в самом приложении (Мен · алма · керек / Я · хочу · яблоко).
 * Порядок слов в казахском и русском разный, поэтому у каждого шаблона два порядка. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 4;

  var FOOD = ['apple','bread','milk','banana','candy','soup','juice','yogurt','cookie','porridge','chocolate','pizza','egg','water'];
  var TOYS = ['ball','doll','blocks','teddybear','toycar'];
  var WORDS = ['yes','no','stop','help','thanks','sit','look','play','sleep','happy','tired','more'];   // «лишние» слова-приманки

  // {X} — подставляется предмет. kk / ru — порядок карточек для каждого языка.
  var T = {
    2: [
      { kk:['{X}','want'],    ru:['want','{X}'] },
      { kk:['{X}','like'],    ru:['like','{X}'] },
      { kk:['more','{X}'],    ru:['more','{X}'] },
      { kk:['mom','help'],    ru:['mom','help'],   plain:true },
      { kk:['dad','help'],    ru:['dad','help'],   plain:true },
      { kk:['dad','play'],    ru:['dad','play'],   plain:true }
    ],
    3: [
      { kk:['me','{X}','want'],        ru:['me','want','{X}'] },
      { kk:['me','{X}','dontwant'],    ru:['me','dontwant','{X}'] },
      { kk:['mom','{X}','give'],       ru:['mom','give','{X}'] },
      { kk:['dad','{X}','give'],       ru:['dad','give','{X}'] },
      { kk:['please','{X}','give'],    ru:['please','give','{X}'] }
    ],
    4: [
      { kk:['please','mom','{X}','give'], ru:['please','mom','give','{X}'] },
      { kk:['please','dad','{X}','give'], ru:['please','dad','give','{X}'] },
      { kk:['me','more','{X}','want'],    ru:['me','want','more','{X}'] },
      { kk:['hi','mom','{X}','give'],     ru:['hi','mom','give','{X}'] }
    ]
  };

  function byId(id){ for (var i = 0; i < SG.cards.length; i++) if (SG.cards[i].id === id) return SG.cards[i]; return null; }
  function objects(cat){
    var ids = cat === 'food' ? FOOD : cat === 'toys' ? TOYS : FOOD.concat(TOYS);
    return ids.map(byId).filter(function(c){ return c && c.photo; });
  }

  SG.defineGame({
    id:'sentence', kk:'Сөйлем құра', ru:'Составь предложение', color:'#B23A9E', color2:'#E58ACF',
    themes:['food','toys','mix'],
    sub:{ kk:'Тыңда да, суреттерді ретімен қой', ru:'Послушай и выложи карточки по порядку' },
    options:[
      { key:'n', title:{ kk:'Қанша сөз', ru:'Сколько слов' }, big:true, default:3,
        values:[ { v:2, label:'2' }, { v:3, label:'3' }, { v:4, label:'4' } ] },
      { key:'extra', title:{ kk:'Артық суреттер', ru:'Лишние карточки' }, big:true, default:2,
        values:[ { v:0, label:'0' }, { v:2, label:'2' }, { v:4, label:'4' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var n = ctx.settings.n, extra = ctx.settings.extra, cat = ctx.settings.cat;
      var objs = SG.shuffle(objects(cat)), objIdx = 0;
      var tpls = SG.shuffle(T[n]);
      var round = 0, filled = 0, locked = true, wrong = 0, seq = 0;
      var cur = null;       // { tpl, X, kkIds, ruIds, extraIds }

      var listen = SG.el('button', 'g-listen', SG.ICON_SPEAKER + '<span></span>'); listen.type = 'button';
      var hint = SG.el('div', 'g-sub', ''); hint.style.cssText = 'text-align:center;margin:0';
      ctx.top.appendChild(listen); ctx.top.appendChild(hint);
      var wrap = SG.el('div', 'g-sent'); ctx.board.appendChild(wrap);
      var strip = SG.el('div', 'g-sentslots'); var bank = SG.el('div', 'g-sentbank');
      wrap.appendChild(strip); wrap.appendChild(bank);
      var slots = [], banks = [];

      function L(){ return SG.getLang(); }
      function ids(){ return L() === 'kk' ? cur.kkIds : cur.ruIds; }
      function text(){ return ids().map(function(id){ return SG.name(byId(id)); }).join(' · '); }
      function refreshText(){
        listen.querySelector('span').textContent = SG.t({ kk:'Тыңда', ru:'Послушать' });
        hint.textContent = SG.t({ kk:'Суреттерді ретімен қой', ru:'Выложи карточки по порядку' });
      }

      function sayAll(done){
        var my = ++seq, order = ids();
        function step(i){
          if (my !== seq) return;
          if (i >= order.length){ slots.forEach(function(s){ s.classList.remove('lit'); }); if (done) done(); return; }
          var card = byId(order[i]);
          slots.forEach(function(s, k){ s.classList.toggle('lit', k === i); });
          ctx.say(card, 750, function(){ step(i + 1); });
        }
        step(0);
      }

      function build(){
        seq++; locked = false; filled = 0; wrong = 0; strip.innerHTML = ''; bank.innerHTML = ''; slots = []; banks = [];
        var order = ids();
        strip.style.setProperty('--n', order.length);
        order.forEach(function(id, i){
          var s = SG.el('div', 'g-sslot'); s.setAttribute('data-i', i);
          s.appendChild(SG.el('b', 'g-snum', String(i + 1)));
          strip.appendChild(s); slots.push(s);
        });
        var all = SG.shuffle(cur.kkIds.concat(cur.extraIds));
        bank.style.setProperty('--n', all.length <= 4 ? all.length : Math.ceil(all.length / 2));
        all.forEach(function(id){
          var card = byId(id);
          var b = SG.el('button', 'g-scard'); b.type = 'button'; b.setAttribute('data-id', id);
          b.appendChild(SG.face(card)); b.appendChild(SG.el('span', 'g-sword', SG.name(card)));
          b.addEventListener('click', function(){ pick(b, card); });
          bank.appendChild(b); banks.push(b);
        });
        ctx.main.setAttribute('data-answer', order.join(','));
      }

      function pick(b, card){
        if (locked || b.classList.contains('used')) return;
        seq++; slots.forEach(function(x){ x.classList.remove('lit'); });   // тап прерывает проговаривание фразы
        var want = ids()[filled];
        if (card.id === want){
          var s = slots[filled];
          s.classList.add('filled'); s.innerHTML = '';
          s.appendChild(SG.face(card)); s.appendChild(SG.el('span', 'g-sword', SG.name(card)));
          b.classList.add('used'); wrong = 0;
          banks.forEach(function(x){ x.classList.remove('nudge'); });
          filled++; SG.chime('match');
          if (filled >= ids().length){ complete(); }
          else SG.speak(card);
        } else {
          b.classList.add('tried'); ctx.later(function(){ b.classList.remove('tried'); }, 450);
          wrong++;
          if (wrong >= 2){      // мягкая подсказка: нужная карточка слегка подпрыгивает
            banks.forEach(function(x){ x.classList.toggle('nudge', x.getAttribute('data-id') === want && !x.classList.contains('used')); });
          }
          SG.speak(card);   // просто повторяем выбранное слово — без наказаний
        }
      }

      function complete(){
        locked = true;
        var my = ++seq, order = ids();
        strip.classList.add('done');
        ctx.later(function(){
          (function step(i){
            if (my !== seq) return;
            if (i >= order.length){
              ctx.star(round); round++;
              ctx.later(next, 1500); return;
            }
            slots[i].classList.add('lit');
            ctx.say(byId(order[i]), 650, function(){ slots[i].classList.remove('lit'); step(i + 1); });
          })(0);
        }, 500);
      }

      function make(){
        if (!objs.length) return null;
        var tpl = tpls[round % tpls.length];
        var X = tpl.plain ? null : objs[objIdx++ % objs.length];
        function fill(arr){ return arr.map(function(id){ return id === '{X}' ? X.id : id; }); }
        var kkIds = fill(tpl.kk), ruIds = fill(tpl.ru);
        var used = {}; kkIds.forEach(function(id){ used[id] = 1; });
        var extraIds = [], pool = SG.shuffle(objects(cat === 'toys' ? 'toys' : 'food').concat(WORDS.map(byId).filter(Boolean)));
        pool.forEach(function(c){
          if (extraIds.length >= extra || used[c.id]) return;
          if (!c.photo && !c.svg) return;
          // не берём приманку, которая тоже подошла бы к фразе (лишний предмет вместо {X} при тех же словах)
          extraIds.push(c.id); used[c.id] = 1;
        });
        return { tpl: tpl, X: X, kkIds: kkIds, ruIds: ruIds, extraIds: extraIds };
      }

      function next(){
        if (round >= ROUNDS){ ctx.win(); return; }
        cur = make();
        if (!cur){ ctx.win(); return; }
        strip.classList.remove('done');
        refreshText(); build();
        ctx.later(function(){ sayAll(); }, 450);
      }

      listen.addEventListener('click', function(){ sayAll(); });
      ctx.onLang(function(){ if (cur){ refreshText(); build(); ctx.later(function(){ sayAll(); }, 250); } });
      next();
    }
  });
})();
