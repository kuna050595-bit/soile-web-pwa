/* Игра №5 — «Жұмбақ / Пазл»: собери картинку из частей (перетащить или нажать часть, затем место). */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var PUZZLES = 3;
  var RATIO = 220 / 270;     // ширина / высота фото карточек

  SG.defineGame({
    id:'puzzle', kk:'Пазл', ru:'Пазл', color:'#8367B8', color2:'#B49CE6',
    sub:{ kk:'Бөліктерді орнына қойып, суретті жина', ru:'Собери картинку из частей' },
    options:[
      { key:'pieces', title:{ kk:'Бөліктер', ru:'Сколько частей' }, big:true, default:4,
        values:[ { v:4, label:'4' }, { v:6, label:'6' } ] }
    ],
    rounds:function(){ return PUZZLES; },
    start:function(ctx){
      var cols = 2, rows = ctx.settings.pieces === 6 ? 3 : 2;
      var cards = SG.pick(ctx.settings.cat, PUZZLES), round = 0;
      var W = Math.min(300, window.innerWidth - 80), H = W / RATIO;
      var cw = W / cols, ch = H / rows;
      var wrap = SG.el('div', 'g-puzwrap'); ctx.board.appendChild(wrap);

      function build(){
        if (round >= cards.length){ ctx.win(); return; }
        var card = cards[round], url = 'url("' + SG.photoURL(card) + '")', done = 0, sel = null, locked = false;
        wrap.innerHTML = '';
        var frame = SG.el('div', 'g-puz'); frame.style.width = W + 'px'; frame.style.height = H + 'px';
        frame.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)'; frame.style.gridTemplateRows = 'repeat(' + rows + ',1fr)';
        var tray = SG.el('div', 'g-tray');
        var label = SG.el('div', 'g-word', ''); label.style.minHeight = '1.3em';
        wrap.appendChild(frame); wrap.appendChild(tray); wrap.appendChild(label);
        ctx.onLang(function(){ if (done === cols * rows) label.textContent = SG.name(card); });

        function bg(el, i){
          var c = i % cols, r = Math.floor(i / cols);
          el.style.backgroundImage = url;
          el.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
          el.style.backgroundPosition = (cols > 1 ? c / (cols - 1) * 100 : 0) + '% ' + (rows > 1 ? r / (rows - 1) * 100 : 0) + '%';
        }
        var slots = [];
        for (var i = 0; i < cols * rows; i++){
          (function(i){
            var sl = SG.el('div', 'g-slot'); sl.setAttribute('data-idx', i); bg(sl, i);
            sl.addEventListener('click', function(){ if (sel) place(sel, i, sl); });
            frame.appendChild(sl); slots.push(sl);
          })(i);
        }
        function place(piece, i, sl){
          if (locked || sl.classList.contains('filled')) return;
          var pi = +piece.getAttribute('data-idx');
          if (pi !== i){
            sl.classList.remove('nope'); void sl.offsetWidth; sl.classList.add('nope');
            piece.classList.remove('nope'); void piece.offsetWidth; piece.classList.add('nope');
            return;
          }
          sl.classList.add('filled'); piece.remove(); sel = null; SG.chime('match'); done++;
          if (done === cols * rows){
            locked = true; ctx.star(round); label.textContent = SG.name(card); SG.speak(card);
            frame.classList.add('whole'); round++;
            ctx.later(build, 2300);
          }
        }
        var order = SG.shuffle(slots.map(function(_, i){ return i; }));
        order.forEach(function(i){
          var p = SG.el('div', 'g-piece'); p.setAttribute('data-idx', i); bg(p, i);
          p.style.width = (cw * .8) + 'px'; p.style.height = (ch * .8) + 'px';
          SG.makeDraggable(p, {
            disabled: function(){ return locked; },
            onTap: function(){
              Array.prototype.forEach.call(tray.children, function(x){ x.classList.remove('sel'); });
              p.classList.add('sel'); sel = p;
            },
            onDrop: function(x, y){
              var el = document.elementFromPoint(x, y), sl = el && el.closest && el.closest('.g-slot');
              if (sl) place(p, +sl.getAttribute('data-idx'), sl);
            }
          });
          tray.appendChild(p);
        });
      }
      build();
    }
  });
})();
