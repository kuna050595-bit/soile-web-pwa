/* Игра №9 — «Не жоғалды? / Что исчезло?»: запомни картинки, одна пропала — найди какая. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 4;

  SG.defineGame({
    id:'missing', kk:'Не жоғалды?', ru:'Что исчезло?', color:'#1F8F86', color2:'#58C9BE',
    sub:{ kk:'Суреттерді есіңде сақта: қайсысы жоғалды?', ru:'Запомни картинки: какая пропала?' },
    options:[
      { key:'n', title:{ kk:'Қанша сурет', ru:'Сколько картинок' }, big:true, default:4,
        values:[ { v:3, label:'3' }, { v:4, label:'4' }, { v:5, label:'5' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var n = ctx.settings.n, round = 0, locked = true;
      var msg = SG.el('div', 'g-word', ''); ctx.top.appendChild(msg);
      var btn = SG.el('button', 'g-big', ''); btn.type = 'button'; btn.style.cssText = 'margin:0;min-height:56px;font-size:20px;padding:12px 26px';
      ctx.top.appendChild(btn);
      var phase = 'look';
      function T(kk, ru){ return SG.t({ kk:kk, ru:ru }); }
      function refreshText(){
        if (phase === 'look'){ msg.textContent = T('Есіңде сақта', 'Запомни'); btn.textContent = T('Жабу', 'Закрыть'); btn.style.display = ''; }
        else if (phase === 'hide'){ msg.textContent = '…'; btn.style.display = 'none'; }
        else { msg.textContent = T('Қайсысы жоғалды?', 'Какая пропала?'); btn.style.display = 'none'; }
      }
      ctx.onLang(refreshText);

      function next(){
        if (round >= ROUNDS){ ctx.win(); return; }
        var cards = SG.pick(ctx.settings.cat, n);
        if (cards.length < 3){ ctx.win(); return; }
        var gone = Math.floor(Math.random() * cards.length), missing = cards[gone];
        ctx.main.setAttribute('data-answer', missing.id);
        phase = 'look'; locked = true; refreshText();
        ctx.board.innerHTML = '';
        var area = SG.el('div', 'g-missarea'); ctx.board.appendChild(area);
        var row = SG.el('div', 'g-missrow'); row.style.setProperty('--n', cards.length); area.appendChild(row);
        var slots = cards.map(function(c){
          var s = SG.el('div', 'g-mini g-minislot'); s.setAttribute('data-id', c.id);
          var im = SG.el('img'); im.src = SG.photoURL(c); im.alt = ''; im.draggable = false; s.appendChild(im);
          row.appendChild(s); return s;
        });
        var opts = SG.el('div', 'g-missrow g-missopts'); opts.style.setProperty('--n', cards.length); area.appendChild(opts); opts.style.visibility = 'hidden';
        cards.forEach(function(c){
          var b = SG.el('button', 'g-mini g-minibtn'); b.type = 'button'; b.setAttribute('data-id', c.id);
          var im = SG.el('img'); im.src = SG.photoURL(c); im.alt = ''; im.draggable = false; b.appendChild(im);
          b.addEventListener('click', function(){ pick(b, c); });
          opts.appendChild(b);
        });
        cards.forEach(function(c, i){ ctx.later(function(){ if (phase === 'look') SG.speak(c); }, 500 + i * 1100); });
        var started = false;
        function cover(){
          if (started) return; started = true; phase = 'hide'; refreshText(); SG.stopSpeech();
          slots.forEach(function(s){ s.classList.add('covered'); });
          ctx.later(function(){
            slots.forEach(function(s, i){ s.classList.remove('covered'); if (i === gone){ s.classList.add('gap'); s.innerHTML = '<span>?</span>'; } });
            phase = 'ask'; locked = false; refreshText(); opts.style.visibility = 'visible';
          }, 1800);
        }
        btn.onclick = cover;
        ctx.later(cover, 4500 + n * 1100);
        ctx._reveal = function(){ var s = slots[gone]; s.classList.remove('gap'); s.innerHTML = ''; var im = SG.el('img'); im.src = SG.photoURL(missing); im.alt = ''; s.appendChild(im); s.classList.add('found'); };
        ctx._missing = missing;
      }
      function pick(b, c){
        if (locked) return;
        if (c.id === ctx._missing.id){
          locked = true; b.classList.add('ok'); ctx._reveal(); SG.chime('match'); SG.speak(c); ctx.star(round); round++;
          ctx.later(next, 2000);
        } else { b.classList.add('tried'); }
      }
      next();
    }
  });
})();
