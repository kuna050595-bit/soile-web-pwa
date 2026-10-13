/* Игра №4 — «Артығы қайсы? / Что лишнее?»: три картинки из одной группы и одна чужая. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var ROUNDS = 6;

  SG.defineGame({
    id:'odd', kk:'Артығы қайсы?', ru:'Что лишнее?', color:'#3FA35A', color2:'#7FD58F', themes:false,
    sub:{ kk:'Басқаларына ұқсамайтын суретті тап', ru:'Найди картинку, которая не подходит к остальным' },
    options:[
      { key:'n', title:{ kk:'Қанша сурет', ru:'Сколько картинок' }, big:true, default:4,
        values:[ { v:3, label:'3' }, { v:4, label:'4' } ] }
    ],
    rounds:function(){ return ROUNDS; },
    start:function(ctx){
      var n = ctx.settings.n, round = 0, locked = false, odd = null;
      var q = SG.el('div', 'g-word', ''); ctx.top.appendChild(q);
      function setQ(){ q.textContent = SG.t({ kk:'Артығы қайсы?', ru:'Что лишнее?' }); }
      setQ(); ctx.onLang(setQ);
      var catIds = SG.CATS.map(function(c){ return c.id; });

      function next(){
        if (round >= ROUNDS){ ctx.win(); return; }
        locked = false;
        var pair = SG.shuffle(catIds).slice(0, 2);
        var same = SG.pick(pair[0], n - 1), other = SG.pick(pair[1], 1);
        if (same.length < n - 1 || !other.length){ round++; next(); return; }
        odd = other[0];
        ctx.main.setAttribute('data-target', odd.id);
        ctx.board.innerHTML = '';
        ctx.board.appendChild(SG.choiceGrid(SG.shuffle(same.concat(other)), pick, { reserve: 300 }));
      }
      function pick(btn, card){
        if (locked) return;
        SG.speak(card);
        if (card.id === odd.id){
          locked = true; btn.classList.add('ok'); SG.chime('match'); ctx.star(round); round++;
          ctx.later(next, 1500);
        } else { btn.classList.add('tried'); }
      }
      next();
    }
  });
})();
