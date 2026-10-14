/* Игра №8 — «Санайық / Сколько?»: посчитай картинки и выбери число. Правильный ответ пересчитывается вслух. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 5;

  SG.defineGame({
    id:'count', kk:'Санайық', ru:'Сколько?', color:'#D9534F', color2:'#FF8F8A',
    sub:{ kk:'Суреттерді санап, дұрыс санды тап', ru:'Посчитай картинки и выбери число' },
    options:[
      { key:'max', title:{ kk:'Қаншаға дейін', ru:'Считаем до' }, big:true, default:5,
        values:[ { v:3, label:'3' }, { v:5, label:'5' }, { v:9, label:'9' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var max = ctx.settings.max, round = 0, locked = false, ans = 0, last = 0;
      var items = SG.pick(ctx.settings.cat, ROUNDS);
      var q = SG.el('div', 'g-word', ''); ctx.top.appendChild(q);
      function setQ(){ q.textContent = SG.t({ kk:'Қанша?', ru:'Сколько?' }); }
      setQ(); ctx.onLang(setQ);

      // Числа озвучиваем записанными голосами приложения (карточки num1…num9), а не системным синтезом.
      function numCard(n){
        var id = 'num' + n;
        for (var i = 0; i < SG.cards.length; i++){ if (SG.cards[i].id === id) return SG.cards[i]; }
        return { id:id, kk:String(n), ru:String(n) };
      }
      function next(){
        if (round >= ROUNDS){ ctx.win(); return; }
        locked = false;
        var card = items[round % items.length];
        do { ans = 1 + Math.floor(Math.random() * max); } while (ans === last && max > 1);
        last = ans;
        ctx.main.setAttribute('data-answer', ans);
        ctx.board.innerHTML = '';
        var box = SG.el('div', 'g-countbox'); ctx.board.appendChild(box);
        var pile = SG.el('div', 'g-pile'); pile.setAttribute('data-n', ans); box.appendChild(pile);
        var cells = [];
        for (var i = 0; i < ans; i++){
          var c = SG.el('div', 'g-pileitem'); var im = SG.el('img'); im.src = SG.photoURL(card); im.alt = ''; im.draggable = false; c.appendChild(im);
          pile.appendChild(c); cells.push(c);
        }
        var nums = SG.el('div', 'g-nums'); box.appendChild(nums);
        var choices = [ans];
        SG.shuffle(Array.apply(null, Array(max)).map(function(_, i){ return i + 1; })).forEach(function(v){ if (choices.length < Math.min(3, max) && choices.indexOf(v) < 0) choices.push(v); });
        SG.shuffle(choices).forEach(function(v){
          var b = SG.el('button', 'g-numbtn', String(v)); b.type = 'button'; b.setAttribute('data-n', v);
          b.addEventListener('click', function(){ pick(b, v, cells); });
          nums.appendChild(b);
        });
      }
      function countAloud(cells, k, done){
        if (k >= cells.length){ done(); return; }
        cells[k].classList.add('lit');
        ctx.say(numCard(k + 1), 650, function(){ countAloud(cells, k + 1, done); });
      }
      function pick(b, v, cells){
        if (locked) return;
        if (v === ans){
          locked = true; b.classList.add('ok'); SG.chime('match');
          countAloud(cells, 0, function(){ ctx.star(round); round++; ctx.later(next, 700); });
        } else { b.classList.add('tried'); }
      }
      next();
    }
  });
})();
