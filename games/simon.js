/* Игра №12 — «Қайтала / Повтори»: картинки загораются по очереди и называются, ребёнок повторяет порядок. Ошибка = просто послушать ещё раз. */
(function(){
  'use strict';
  var SG = window.SoileGames;
  var LENGTHS = [2, 3, 4, 5];
  var PADCOL = ['#EF4C82', '#2D6CDF', '#E8A93B', '#3FA35A'];

  SG.defineGame({
    id:'simon', kk:'Қайтала', ru:'Повтори', color:'#E8A93B', color2:'#FFD27A',
    sub:{ kk:'Тыңда да, сол ретпен қайтала', ru:'Послушай и повтори в том же порядке' },
    options:[
      { key:'pads', title:{ kk:'Қанша сурет', ru:'Сколько картинок' }, big:true, default:4,
        values:[ { v:3, label:'3' }, { v:4, label:'4' } ] }
    ],
    rounds:function(){ return LENGTHS.length; },
    start:function(ctx){
      var cards = SG.pick(ctx.settings.cat, ctx.settings.pads), round = 0, seq = [], pos = 0, accept = false, gen = 0;
      var status = SG.el('div', 'g-word', ''); ctx.top.appendChild(status);
      var mode = 'listen';
      function T(kk, ru){ return SG.t({ kk:kk, ru:ru }); }
      function setStatus(){
        status.textContent = mode === 'listen' ? T('Тыңда…', 'Слушай…') : mode === 'go' ? T('Енді сен!', 'Теперь ты!') : T('Тағы тыңда', 'Послушай ещё раз');
      }
      ctx.onLang(setStatus);
      var pads = SG.el('div', 'g-pads'); pads.style.setProperty('--n', cards.length); ctx.board.appendChild(pads);
      var padEls = cards.map(function(c, i){
        var b = SG.el('button', 'g-pad'); b.type = 'button'; b.setAttribute('data-id', c.id); b.style.setProperty('--pad', PADCOL[i % PADCOL.length]);
        var im = SG.el('img'); im.src = SG.photoURL(c); im.alt = ''; im.draggable = false; b.appendChild(im);
        b.addEventListener('click', function(){ tap(i); });
        pads.appendChild(b); return b;
      });
      function light(i, ms){ padEls[i].classList.add('lit'); ctx.later(function(){ padEls[i].classList.remove('lit'); }, ms || 700); }

      function newRound(){
        if (round >= LENGTHS.length){ ctx.win(); return; }
        seq = []; for (var k = 0; k < LENGTHS[round]; k++){ var v; do { v = Math.floor(Math.random() * cards.length); } while (cards.length > 1 && v === seq[seq.length - 1]); seq.push(v); }
        ctx.main.setAttribute('data-seq', JSON.stringify(seq.map(function(i){ return cards[i].id; })));
        ctx.later(playSeq, 700);
      }
      function playSeq(){
        accept = false; pos = 0; mode = 'listen'; setStatus(); var my = ++gen, k = 0;
        (function step(){
          if (my !== gen) return;
          if (k >= seq.length){ ctx.later(function(){ if (my !== gen) return; mode = 'go'; setStatus(); accept = true; }, 300); return; }
          var i = seq[k++]; light(i, 800); ctx.say(cards[i], 900, function(){ ctx.later(step, 200); });
        })();
      }
      function tap(i){
        if (!accept) return;
        light(i, 500); SG.speak(cards[i]);
        if (i === seq[pos]){
          pos++;
          if (pos >= seq.length){ accept = false; SG.chime('match'); ctx.star(round); round++; ctx.later(newRound, 1400); }
        } else {
          accept = false; mode = 'again'; setStatus(); ctx.later(playSeq, 1300);
        }
      }
      newRound();
    }
  });
})();
