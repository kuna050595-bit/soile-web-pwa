/* Игра №6 — «Көлеңке / Тень»: чья это тень? Найди подходящую картинку. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 6;

  SG.defineGame({
    id:'shadow', kk:'Көлеңке', ru:'Тень', color:'#3C4A8A', color2:'#6D7FD0',
    sub:{ kk:'Көлеңкеге сәйкес суретті тап', ru:'Найди картинку, которая подходит к тени' },
    options:[
      { key:'n', title:{ kk:'Қанша сурет', ru:'Сколько картинок' }, big:true, default:3,
        values:[ { v:2, label:'2' }, { v:3, label:'3' }, { v:4, label:'4' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var n = ctx.settings.n, targets = SG.pick(ctx.settings.cat, ROUNDS), pool = SG.pool(ctx.settings.cat), round = 0, locked = false, target = null;
      var sil = SG.el('div', 'g-sil'); var img = SG.el('img', 'sil-full'); img.alt = ''; img.draggable = false;
      var dark = SG.el('img', 'sil-dark'); dark.alt = ''; dark.draggable = false; sil.appendChild(dark); sil.appendChild(img);
      var word = SG.el('div', 'g-word', ''); word.style.minHeight = '1.25em';
      ctx.top.appendChild(sil); ctx.top.appendChild(word);
      ctx.onLang(function(){ if (sil.classList.contains('lit')) word.textContent = SG.name(target); });

      function next(){
        if (round >= targets.length){ ctx.win(); return; }
        target = targets[round]; locked = false;
        sil.classList.remove('lit'); word.textContent = '';
        img.src = SG.photoURL(target); dark.removeAttribute('src');
        sil.classList.remove('nofallback');
        var shown = target;
        SG.silhouette(target, function(url){
          if (shown !== target) return;
          if (url) dark.src = url; else { dark.src = SG.photoURL(target); sil.classList.add('fallback'); }
        });
        ctx.main.setAttribute('data-target', target.id);
        ctx.board.innerHTML = '';
        ctx.board.appendChild(SG.choiceGrid(SG.buildChoices(target, pool, n), pick, { reserve: 470 }));
      }
      function pick(btn, card){
        if (locked) return;
        if (card.id === target.id){
          locked = true; btn.classList.add('ok'); sil.classList.add('lit'); word.textContent = SG.name(target);
          SG.chime('match'); SG.speak(target); ctx.star(round); round++;
          ctx.later(next, 2000);
        } else { btn.classList.add('tried'); }
      }
      next();
    }
  });
})();
