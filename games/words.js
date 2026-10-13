/* Игра №11 — «Сөз бен сурет / Слово и картинка»: нажми картинку, потом её слово. Помогает связать слово с изображением. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var PAGES = 3;

  SG.defineGame({
    id:'words', kk:'Сөз бен сурет', ru:'Слово и картинка', color:'#C0587A', color2:'#EE8FAE',
    sub:{ kk:'Әр суретке өз сөзін тап', ru:'Найди для каждой картинки её слово' },
    options:[
      { key:'n', title:{ kk:'Қанша жұп', ru:'Сколько пар' }, big:true, default:3,
        values:[ { v:3, label:'3' }, { v:4, label:'4' } ] }
    ],
    rounds:function(){ return PAGES; },
    start:function(ctx){
      var n = ctx.settings.n, page = 0, sel = null, left = 0, words = [];
      function relabel(){ words.forEach(function(w){ w.el.textContent = SG.name(w.card); }); }
      ctx.onLang(relabel);

      function build(){
        if (page >= PAGES){ ctx.win(); return; }
        var cards = SG.pick(ctx.settings.cat, n); left = cards.length; sel = null; words = [];
        ctx.board.innerHTML = '';
        var grid = SG.el('div', 'g-words'); ctx.board.appendChild(grid);
        var colA = SG.el('div', 'g-wcol'), colB = SG.el('div', 'g-wcol'); grid.appendChild(colA); grid.appendChild(colB);
        SG.shuffle(cards).forEach(function(c){
          var b = SG.el('button', 'g-wpic'); b.type = 'button'; b.setAttribute('data-id', c.id);
          var im = SG.el('img'); im.src = SG.photoURL(c); im.alt = ''; im.draggable = false; b.appendChild(im);
          b.addEventListener('click', function(){
            if (b.classList.contains('done')) return;
            Array.prototype.forEach.call(colA.children, function(x){ x.classList.remove('sel'); });
            b.classList.add('sel'); sel = { el: b, card: c }; SG.speak(c);
          });
          colA.appendChild(b);
        });
        SG.shuffle(cards).forEach(function(c){
          var w = SG.el('button', 'g-wword', SG.name(c)); w.type = 'button'; w.setAttribute('data-id', c.id);
          words.push({ el: w, card: c });
          w.addEventListener('click', function(){
            if (w.classList.contains('done') || !sel) return;
            if (sel.card.id === c.id){
              w.classList.add('done'); sel.el.classList.remove('sel'); sel.el.classList.add('done'); SG.chime('match'); SG.speak(c); sel = null; left--;
              if (left === 0){ ctx.star(page); page++; ctx.later(build, 1500); }
            } else {
              w.classList.remove('nope'); void w.offsetWidth; w.classList.add('nope');
            }
          });
          colB.appendChild(w);
        });
      }
      build();
    }
  });
})();
