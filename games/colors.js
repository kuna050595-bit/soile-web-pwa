/* Игра №14 — «Түсі қайсы? / Какого цвета?»: две чашки разных цветов, предмет нужно положить в чашку его цвета
 * (перетащить или нажать на чашку). Без таймера и штрафов: ошибка = чашка слегка трясётся, слово проговаривается снова. */
(function(){
  'use strict';
  var SG = window.SoileGames;

  var COLORS = {
    red:    { hex:'#E5484D', dark:'#B92F34', kk:'Қызыл', ru:'Красный', card:'colorred',
              items:['apple','hat','heart','circle','toyshovel','crab','toycar','firetruck'] },
    blue:   { hex:'#2D6CDF', dark:'#1E4FB0', kk:'Көк',    ru:'Синий',   card:'colorblue',
              items:['tshirt','sofa','backpack','bucket','blanket','cap','cup','sneakers','truck','dolphin','square','jacket','gloves'] },
    yellow: { hex:'#F2B01E', dark:'#C98A00', kk:'Сары',   ru:'Жёлтый',  card:'coloryellow',
              items:['banana','juice','hoodie','taxi','cheetah','star','triangle'] }
  };
  var PAIRS = [
    { v:'red|blue',    label:{ kk:'Қызыл · Көк',  ru:'Красный · Синий' } },
    { v:'red|yellow',  label:{ kk:'Қызыл · Сары', ru:'Красный · Жёлтый' } },
    { v:'yellow|blue', label:{ kk:'Сары · Көк',   ru:'Жёлтый · Синий' } }
  ];

  function byId(id){ for (var i = 0; i < SG.cards.length; i++) if (SG.cards[i].id === id) return SG.cards[i]; return null; }
  function itemsOf(col){ return COLORS[col].items.map(byId).filter(function(c){ return c && c.photo; }); }
  function cupSVG(col){
    var c = COLORS[col];
    return '<svg viewBox="0 0 100 92" aria-hidden="true"><ellipse cx="50" cy="86" rx="34" ry="5" fill="rgba(0,0,0,.14)"/>' +
      '<path d="M13 14h74l-8.500 62a11 11 0 0 1-10.900 9.500H32.400A11 11 0 0 1 21.500 76z" fill="' + c.hex + '"/>' +
      '<path d="M13 14h74l-1.500 11H14.500z" fill="' + c.dark + '" opacity=".35"/>' +
      '<rect x="8" y="6" width="84" height="13" rx="6.500" fill="' + c.dark + '"/>' +
      '<path d="M27 32l4.500 40" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round" fill="none"/></svg>';
  }

  SG.defineGame({
    id:'colors', kk:'Түсі қайсы?', ru:'Какого цвета?', color:'#2D6CDF', color2:'#FF7A7A', themes:false,
    sub:{ kk:'Затты өз түсті кесесіне сал', ru:'Положи предмет в чашку его цвета' },
    options:[
      { key:'pair', title:{ kk:'Қандай түстер', ru:'Какие цвета' }, default:'red|blue', values: PAIRS },
      { key:'n', title:{ kk:'Қанша сурет', ru:'Сколько картинок' }, big:true, default:6,
        values:[ { v:6, label:'6' }, { v:8, label:'8' }, { v:10, label:'10' } ] }
    ],
    rounds:function(s){ return s.n; },
    start:function(ctx){
      var s = ctx.settings, cs = s.pair.split('|'), n = s.n;
      var half = n / 2, items = [];
      cs.forEach(function(col){
        SG.shuffle(itemsOf(col)).slice(0, half).forEach(function(c){ items.push({ card:c, col:col }); });
      });
      items = SG.shuffle(items);
      // не больше двух подряд одного цвета — так интереснее и нельзя «угадать» всегда одну чашку
      for (var i = 2; i < items.length; i++){
        if (items[i].col === items[i-1].col && items[i].col === items[i-2].col){
          for (var j = i + 1; j < items.length; j++){ if (items[j].col !== items[i].col){ var t = items[i]; items[i] = items[j]; items[j] = t; break; } }
        }
      }
      var idx = 0, locked = false, itemEl = null;

      var stage = SG.el('div', 'g-sortstage'); ctx.board.appendChild(stage);
      var slot = SG.el('div', 'g-sortslot'); stage.appendChild(slot);
      var bins = SG.el('div', 'g-bins'); stage.appendChild(bins);
      var binEls = {};
      cs.forEach(function(col){
        var b = SG.el('button', 'g-bin g-cupbin'); b.type = 'button'; b.setAttribute('data-cat', col); b.style.setProperty('--bin', COLORS[col].hex);
        b.innerHTML = cupSVG(col);
        var lab = SG.el('span', 'g-binlabel', SG.t(COLORS[col]));
        b.appendChild(lab);
        b.addEventListener('click', function(){ attempt(col); });
        bins.appendChild(b); binEls[col] = { el:b, lab:lab };
      });
      ctx.onLang(function(){ cs.forEach(function(col){ binEls[col].lab.textContent = SG.t(COLORS[col]); }); });

      function show(){
        if (idx >= items.length){ ctx.win(); return; }
        locked = false; slot.innerHTML = '';
        var it = items[idx];
        itemEl = SG.el('div', 'g-sortitem'); itemEl.setAttribute('data-cat', it.col); itemEl.setAttribute('data-id', it.card.id);
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
      function attempt(col){
        if (locked) return;
        var it = items[idx], bin = binEls[col].el;
        if (col === it.col){
          locked = true; SG.chime('match'); ctx.star(idx);
          itemEl.classList.add('drop'); bin.classList.add('good');
          var cc = byId(COLORS[col].card);
          ctx.later(function(){ SG.speak(it.card, function(){ if (cc) SG.speak(cc); }); }, 250);
          ctx.later(function(){ bin.classList.remove('good'); }, 700);
          idx++; ctx.later(show, 2300);
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
