/* Игра №7 — «Көпіршік / Пузыри»: лопни пузырь с названной картинкой. Пузыри только покачиваются, ничего не улетает. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 6;

  SG.defineGame({
    id:'bubbles', kk:'Көпіршік', ru:'Пузыри', color:'#2CA5B0', color2:'#7FD6DE',
    sub:{ kk:'Аталған суреті бар көпіршікті жар', ru:'Лопни пузырь с той картинкой, которую назвали' },
    options:[
      { key:'n', title:{ kk:'Көпіршік саны', ru:'Сколько пузырей' }, big:true, default:4,
        values:[ { v:3, label:'3' }, { v:4, label:'4' }, { v:5, label:'5' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var n = ctx.settings.n, targets = SG.pick(ctx.settings.cat, ROUNDS), pool = SG.pool(ctx.settings.cat), round = 0, locked = false, target = null;
      var speak = SG.el('button', 'g-speak', SG.ICON_SPEAKER); speak.type = 'button'; speak.setAttribute('aria-label', 'Listen');
      var word = SG.el('div', 'g-word', ''); ctx.top.appendChild(speak); ctx.top.appendChild(word);
      function say(){ if (!target) return; speak.classList.remove('pulse'); void speak.offsetWidth; speak.classList.add('pulse'); SG.speak(target); }
      speak.addEventListener('click', say);
      function showWord(){ word.textContent = target ? SG.name(target) : ''; }
      ctx.onLang(function(){ showWord(); ctx.later(say, 200); });

      function next(){
        if (round >= targets.length){ ctx.win(); return; }
        target = targets[round]; locked = false; showWord();
        ctx.main.setAttribute('data-target', target.id);
        var opts = SG.buildChoices(target, pool, n);
        ctx.board.innerHTML = '';
        var sea = SG.el('div', 'g-sea'); ctx.board.appendChild(sea);
        opts.forEach(function(card, i){
          var b = SG.el('button', 'g-bubble'); b.type = 'button'; b.setAttribute('data-id', card.id);
          var img = SG.el('img'); img.src = SG.photoURL(card); img.alt = ''; img.draggable = false; b.appendChild(img);
          b.style.setProperty('--dx', (Math.random() * 18 - 9).toFixed(1) + 'px');
          b.style.setProperty('--dy', (Math.random() * 14 - 7).toFixed(1) + 'px');
          b.style.setProperty('--sc', (.92 + Math.random() * .14).toFixed(2));
          b.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
          b.addEventListener('click', function(){ pick(b, card); });
          sea.appendChild(b);
        });
        ctx.later(say, 450);
      }
      function pick(b, card){
        if (locked || b.classList.contains('wob')) return;
        if (card.id === target.id){
          locked = true; b.classList.add('pop'); SG.chime('match'); ctx.star(round); round++;
          ctx.later(next, 1400);
        } else { b.classList.remove('wob'); void b.offsetWidth; b.classList.add('wob'); ctx.later(function(){ b.classList.remove('wob'); }, 500); ctx.later(say, 600); }
      }
      next();
    }
  });
})();
