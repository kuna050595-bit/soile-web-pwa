/* Игра №10 — «Лупа»: по увеличенному кусочку угадай картинку. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 6, L = 210, SCALE = 3.4, RATIO = 220 / 270;

  SG.defineGame({
    id:'zoom', kk:'Лупа', ru:'Лупа', color:'#7C9C3F', color2:'#B5D36A',
    sub:{ kk:'Бөлшегіне қарап, суретті тап', ru:'По кусочку угадай, что на картинке' },
    options:[
      { key:'n', title:{ kk:'Қанша сурет', ru:'Сколько картинок' }, big:true, default:3,
        values:[ { v:2, label:'2' }, { v:3, label:'3' }, { v:4, label:'4' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var n = ctx.settings.n, targets = SG.pick(ctx.settings.cat, ROUNDS), pool = SG.pool(ctx.settings.cat), round = 0, locked = false, target = null;
      var lens = SG.el('div', 'g-lens'); lens.style.width = lens.style.height = L + 'px';
      var zoomLayer = SG.el('div', 'g-lenszoom'); var full = SG.el('img', 'g-lensfull'); full.alt = ''; full.draggable = false;
      lens.appendChild(zoomLayer); lens.appendChild(full);
      var word = SG.el('div', 'g-word', ''); word.style.minHeight = '1.25em';
      ctx.top.appendChild(lens); ctx.top.appendChild(word);
      ctx.onLang(function(){ if (lens.classList.contains('rev')) word.textContent = SG.name(target); });

      function next(){
        if (round >= targets.length){ ctx.win(); return; }
        target = targets[round]; locked = false;
        lens.classList.remove('rev'); word.textContent = '';
        ctx.main.setAttribute('data-target', target.id);
        var url = SG.photoURL(target);
        full.src = url;
        SG.focusPoint(target, function(p){
          var iw = L * SCALE, ih = iw / RATIO;
          var ox = Math.max(0, Math.min(iw - L, p.x * iw - L / 2)), oy = Math.max(0, Math.min(ih - L, p.y * ih - L / 2));
          zoomLayer.style.backgroundImage = 'url("' + url + '")';
          zoomLayer.style.backgroundSize = iw + 'px ' + ih + 'px';
          zoomLayer.style.backgroundPosition = (-ox) + 'px ' + (-oy) + 'px';
        });
        ctx.board.innerHTML = '';
        ctx.board.appendChild(SG.choiceGrid(SG.buildChoices(target, pool, n), pick, { reserve: 470 }));
      }
      function pick(btn, card){
        if (locked) return;
        if (card.id === target.id){
          locked = true; btn.classList.add('ok'); lens.classList.add('rev'); word.textContent = SG.name(target);
          SG.chime('match'); SG.speak(target); ctx.star(round); round++;
          ctx.later(next, 2200);
        } else { btn.classList.add('tried'); }
      }
      next();
    }
  });
})();
