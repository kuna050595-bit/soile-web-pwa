/* Игра №3 — «Сұрыпта / Сортировка»: положи картинку в нужную корзину (перетащить или нажать на корзину). */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var PAIRS = [
    { v:'animal|food',      label:{ kk:'Жануар · Тағам',     ru:'Животные · Еда' } },
    { v:'animal|transport', label:{ kk:'Жануар · Көлік',     ru:'Животные · Транспорт' } },
    { v:'food|clothes',     label:{ kk:'Тағам · Киім',       ru:'Еда · Одежда' } },
    { v:'transport|toys',   label:{ kk:'Көлік · Ойыншық',    ru:'Транспорт · Игрушки' } },
    { v:'clothes|toys',     label:{ kk:'Киім · Ойыншық',     ru:'Одежда · Игрушки' } }
  ];
  function cat(id){ return SG.CATS.filter(function(c){ return c.id === id; })[0]; }

  SG.defineGame({
    id:'sort', kk:'Сұрыпта', ru:'Сортировка', color:'#E07A34', color2:'#FFAA6B', themes:false,
    sub:{ kk:'Суретті өз себетіне сал', ru:'Положи картинку в нужную корзину' },
    options:[
      { key:'pair', title:{ kk:'Не неден?', ru:'Что с чем' }, default:'animal|food', values: PAIRS },
      { key:'per',  title:{ kk:'Суреттер саны', ru:'Сколько картинок' }, big:true, default:3,
        values:[ { v:2, label:'4', sub:{ kk:'сурет', ru:'картинки' } }, { v:3, label:'6', sub:{ kk:'сурет', ru:'картинок' } }, { v:4, label:'8', sub:{ kk:'сурет', ru:'картинок' } } ] }
    ],
    rounds:function(s){ return s.per * 2; },
    start:function(ctx){
      var s = ctx.settings, cs = s.pair.split('|'), A = cat(cs[0]), B = cat(cs[1]);
      var items = SG.shuffle(SG.pick(cs[0], s.per).map(function(c){ return { card:c, cat:cs[0] }; })
        .concat(SG.pick(cs[1], s.per).map(function(c){ return { card:c, cat:cs[1] }; })));
      var idx = 0, locked = false, itemEl = null, sample = {};
      sample[cs[0]] = SG.pool(cs[0])[0]; sample[cs[1]] = SG.pool(cs[1])[0];

      var stage = SG.el('div', 'g-sortstage'); ctx.board.appendChild(stage);
      var slot = SG.el('div', 'g-sortslot'); stage.appendChild(slot);
      var bins = SG.el('div', 'g-bins'); stage.appendChild(bins);
      var binEls = {};
      [[cs[0], A], [cs[1], B]].forEach(function(p){
        var b = SG.el('button', 'g-bin'); b.type = 'button'; b.setAttribute('data-cat', p[0]); b.style.setProperty('--bin', p[1].color);
        var img = SG.el('img'); img.src = SG.photoURL(sample[p[0]]); img.alt = ''; img.draggable = false;
        var lab = SG.el('span', 'g-binlabel', SG.t(p[1]));
        b.appendChild(img); b.appendChild(lab);
        b.addEventListener('click', function(){ attempt(p[0]); });
        bins.appendChild(b); binEls[p[0]] = { el: b, lab: lab, cat: p[1] };
      });
      ctx.onLang(function(){ Object.keys(binEls).forEach(function(k){ binEls[k].lab.textContent = SG.t(binEls[k].cat); }); });

      function show(){
        if (idx >= items.length){ ctx.win(); return; }
        locked = false; slot.innerHTML = '';
        var it = items[idx];
        itemEl = SG.el('div', 'g-sortitem'); itemEl.setAttribute('data-cat', it.cat); itemEl.setAttribute('data-id', it.card.id);
        var img = SG.el('img'); img.src = SG.photoURL(it.card); img.alt = ''; img.draggable = false; itemEl.appendChild(img);
        slot.appendChild(itemEl);
        SG.makeDraggable(itemEl, {
          disabled: function(){ return locked; },
          onTap: function(){ SG.speak(it.card); },
          onDrop: function(x, y){
            var el = document.elementFromPoint(x, y), b = el && el.closest && el.closest('.g-bin');
            if (b) attempt(b.getAttribute('data-cat'));
          }
        });
        ctx.later(function(){ SG.speak(it.card); }, 300);
      }
      function attempt(c){
        if (locked) return;
        var it = items[idx], bin = binEls[c].el;
        if (c === it.cat){
          locked = true; SG.chime('match'); ctx.star(idx);
          itemEl.classList.add('drop'); bin.classList.add('good');
          ctx.later(function(){ bin.classList.remove('good'); }, 700);
          idx++; ctx.later(show, 900);
        } else {
          itemEl.classList.remove('nope'); void itemEl.offsetWidth; itemEl.classList.add('nope');
          bin.classList.add('bad'); ctx.later(function(){ bin.classList.remove('bad'); }, 500);
          ctx.later(function(){ SG.speak(it.card); }, 350);
        }
      }
      show();
    }
  });
})();
