/* Сөйле · Игры — общий движок.
 * Игра = файл, который делает SoileGames.register({id, kk, ru, color, icon, mount(root, api)}).
 * Данные берутся из window.SOILE_GAME_CARDS, озвучка — из window.SOILE_VOICE_KK / SOILE_VOICE_RU
 * (тех же файлов, что использует само приложение), а если записи нет — голос браузера.
 */
(function(){
  'use strict';
  var SG = window.SoileGames = window.SoileGames || {};
  SG.base = SG.base || '../';           // где лежат icons/ относительно страницы с играми
  SG.games = SG.games || [];
  // Встроенный режим: игры открыты внутри приложения (iframe) и берут карточки/озвучку/язык у него.
  SG.api = null;
  try{ if (window.parent && window.parent !== window && window.parent.SOILE_GAMES_API) SG.api = window.parent.SOILE_GAMES_API; }catch(e){}
  SG.embedded = !!SG.api;
  SG.cards = (SG.embedded ? SG.api.cards() : window.SOILE_GAME_CARDS) || [];

  SG.register = function(g){ SG.games.push(g); };

  /* ---------- настройки (язык, звук) ---------- */
  function load(k, d){ try{ var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }catch(e){ return d; } }
  function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  SG.load = load; SG.save = save;

  var q = {};
  try{ location.search.replace(/^\?/,'').split('&').forEach(function(p){ var a = p.split('='); if (a[0]) q[a[0]] = decodeURIComponent(a[1]||''); }); }catch(e){}
  var lang = (q.lang === 'ru' || q.lang === 'kk') ? q.lang : (SG.embedded && (SG.api.lang() === 'ru' || SG.api.lang() === 'kk') ? SG.api.lang() : load('soile_games_lang', 'kk'));
  var sound = load('soile_games_sound', true);
  SG.getLang = function(){ return lang; };
  SG.setLang = function(l){ lang = l; save('soile_games_lang', l); };
  SG.getSound = function(){ return sound; };
  SG.setSound = function(v){ sound = !!v; save('soile_games_sound', sound); if (!sound) SG.stopSpeech(); };
  SG.t = function(o){ return o && typeof o === 'object' ? (o[lang] || o.ru) : o; };
  SG.name = function(card){ return lang === 'kk' ? card.kk : card.ru; };
  SG.photoURL = function(card){
    if (card.photoData) return card.photoData;
    var p = card.photo || '';
    return /^(data:|blob:|https?:|\/)/.test(p) ? p : SG.base + p;
  };
  // Лицо карточки: фото, а если фото нет — значок приложения на цветном фоне или просто слово.
  SG.face = function(card, cls){
    var f = document.createElement('div'); f.className = 'g-face ' + (cls || '');
    if (card.photo || card.photoData){
      var im = document.createElement('img'); im.src = SG.photoURL(card); im.alt = ''; im.draggable = false; f.appendChild(im);
    } else {
      f.classList.add('noimg'); f.style.background = card.color || '#8367B8';
      if (card.svg){ f.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true">' + card.svg + '</svg>'; }
      else { f.textContent = SG.name(card); }
    }
    return f;
  };

  /* ---------- темы и подбор карточек ---------- */
  SG.CATS = [
    { id:'animal',    kk:'Жануарлар',    ru:'Животные',  color:'var(--cat-animal)' },
    { id:'food',      kk:'Тағам',        ru:'Еда',       color:'var(--cat-food)' },
    { id:'transport', kk:'Көлік',        ru:'Транспорт', color:'var(--cat-transport)' },
    { id:'toys',      kk:'Ойыншықтар',   ru:'Игрушки',   color:'var(--cat-toys)' },
    { id:'clothes',   kk:'Киім',         ru:'Одежда',    color:'var(--cat-clothes)' }
  ];
  var MIX = { id:'mix', kk:'Бәрі', ru:'Всё вместе', color:'var(--cat-mix)' };
  SG.CATS_WITH_MIX = SG.CATS.concat([MIX]);

  // Не берём в одну игру похожие картинки (чтобы пары не путались) и «неигровые» карточки.
  var SIMILAR = [
    ['juice','orangejuice','applejuice','soda','water','milk'],
    ['boots','shoes','sneakers'],
    ['tshirt','shirt','tanktop','hoodie','cardigan','jacket','tracksuit','jeans','pants'],
    ['hat','cap','hood'],
    ['firetruck','policecar','ambulance','emergencytruck','truck','taxi'],
    ['yacht','sailboat','barge'],
    ['whale','dolphin','shark'],
    ['cat','tiger','lion','cheetah'],
    ['dog','wolf','fox'],
    ['sheep','deer','horse'],
    ['porridge','soup','yogurt'],
    ['candy','cookie','chocolate']
  ];
  var EXCLUDE = { clothesdirty:1, clotheswet:1, clothesdry:1, clothesclean:1, underwear:1, facemask:1, wheel:1, emergencytruck:1, barge:1, music:1, tabletdevice:1 };
  var groupOf = {};
  SIMILAR.forEach(function(g, i){ g.forEach(function(id){ groupOf[id] = i; }); });

  SG.shuffle = function(a){
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  SG.pool = function(cat){
    var base = SG.cards.filter(function(c){
      return c.photo && !EXCLUDE[c.id] && (cat === 'mix' ? SG.CATS.some(function(k){ return k.id === c.cat; }) : c.cat === cat);
    });
    return base;
  };
  // Недавно показанные карточки (чтобы «Ещё раз» не выдавал тот же набор)
  var recent = load('soile_g_recent', []);
  function remember(ids){
    ids.forEach(function(id){ var i = recent.indexOf(id); if (i >= 0) recent.splice(i, 1); recent.push(id); });
    if (recent.length > 60) recent = recent.slice(-60);
    save('soile_g_recent', recent);
  }
  // n разных, не похожих друг на друга карточек; сначала те, что давно не показывали
  SG.pick = function(cat, n, noRemember){
    var out = [], used = {};
    var sh = SG.shuffle(SG.pool(cat));
    var fresh = sh.filter(function(c){ return recent.indexOf(c.id) < 0; });
    var stale = sh.filter(function(c){ return recent.indexOf(c.id) >= 0; })
      .sort(function(a, b){ return recent.indexOf(a.id) - recent.indexOf(b.id); });   // самые старые первыми
    fresh.concat(stale).forEach(function(c){
      if (out.length >= n) return;
      var g = groupOf[c.id];
      if (g !== undefined){ if (used[g]) return; used[g] = 1; }
      out.push(c);
    });
    if (!noRemember) remember(out.map(function(c){ return c.id; }));
    return out;
  };
  SG.sameGroup = function(a, b){ return groupOf[a] !== undefined && groupOf[a] === groupOf[b]; };
  SG.maxPairs = function(cat){ return SG.pick(cat, 99, true).length; };

  /* ---------- озвучка ---------- */
  var curAudio = null;
  SG.stopSpeech = function(){
    try{ if (curAudio){ curAudio.pause(); curAudio = null; } }catch(e){}
    try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(e){}
  };
  function ttsVoice(prefix){
    try{
      var vs = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < vs.length; i++){ if ((vs[i].lang || '').toLowerCase().indexOf(prefix) === 0) return vs[i]; }
    }catch(e){}
    return null;
  }
  SG.speak = function(card, done){
    done = done || function(){};
    if (!sound){ done(); return; }
    SG.stopSpeech();
    var map = lang === 'kk' ? window.SOILE_VOICE_KK : window.SOILE_VOICE_RU;
    var src = card.audioData || (SG.embedded
      ? ((lang === 'kk' ? card.audioKk : card.audioRu) || card.audio)     // приложение уже учло правки озвучки
      : (map && map[card.id]));
    if (src){
      try{
        var a = new Audio(src); curAudio = a;
        a.addEventListener('ended', done); a.addEventListener('error', done);
        var p = a.play(); if (p && p.catch) p.catch(done);
      }catch(e){ done(); }
      return;
    }
    if (!('speechSynthesis' in window)){ done(); return; }
    try{
      var u = new SpeechSynthesisUtterance(SG.name(card));
      u.lang = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
      var v = ttsVoice(lang === 'kk' ? 'kk' : 'ru'); if (v) u.voice = v;
      u.rate = .95; u.onend = done; u.onerror = done;
      window.speechSynthesis.speak(u);
    }catch(e){ done(); }
  };

  /* ---------- мягкие звуки (без резких сигналов) ---------- */
  var ac = null;
  function ctx(){
    if (!ac){ try{ ac = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
    if (ac && ac.state === 'suspended'){ try{ ac.resume(); }catch(e){} }
    return ac;
  }
  function tone(freq, t0, dur, vol){
    var c = ctx(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    var s = c.currentTime + t0;
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol || .07, s + .03);
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    o.connect(g); g.connect(c.destination); o.start(s); o.stop(s + dur + .05);
  }
  SG.chime = function(kind){
    if (!sound) return;
    if (kind === 'match'){ tone(659.25, 0, .35); tone(880, .12, .45); }
    else if (kind === 'win'){ [523.25, 659.25, 783.99, 1046.5].forEach(function(f, i){ tone(f, i * .14, .6, .08); }); }
  };

  /* ---------- конфетти (отключается при prefers-reduced-motion через CSS) ---------- */
  SG.confetti = function(){
    var box = document.createElement('div'); box.className = 'g-confetti';
    var cols = ['#EF4C82','#FFC93C','#3FA35A','#2D6CDF','#E07A34','#8367B8'];
    for (var i = 0; i < 46; i++){
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = cols[i % cols.length];
      p.style.animationDuration = (2.4 + Math.random() * 1.8) + 's';
      p.style.animationDelay = (Math.random() * .6) + 's';
      p.style.transform = 'rotate(' + (Math.random() * 180) + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function(){ box.remove(); }, 5200);
  };

  /* ---------- общие кусочки интерфейса ---------- */
  SG.MASCOT = '<svg viewBox="0 0 768 768" aria-hidden="true"><rect width="768" height="768" rx="170" fill="#FFC83D"/><g><path fill="#fff" d="M384 136C512 136 616 240 616 368C616 496 512 600 384 600C363 600 343 597 323 592L190 617L240 551C183 510 152 442 152 368C152 240 256 136 384 136Z"/><path fill="#F26B4F" fill-rule="evenodd" d="M384 218C318 218 251 281 251 368C251 455 318 518 384 518C450 518 517 455 517 368C517 281 450 218 384 218ZM384 269C339 269 304 315 304 348L464 348C464 315 429 269 384 269ZM304 388C304 421 339 467 384 467C429 467 464 421 464 388Z"/><circle cx="596" cy="225" r="20" fill="#1FA89E"/><circle cx="632" cy="184" r="15" fill="#1FA89E"/><circle cx="660" cy="150" r="10" fill="#1FA89E"/></g></svg>';
  SG.STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
  SG.ICON_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  SG.ICON_SOUND_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 010 6M18 6.5a8 8 0 010 11"/></svg>';
  SG.ICON_SOUND_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';

  SG.el = function(tag, cls, html){
    var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e;
  };
  // Блок «язык + звук», который кладётся в шапку любой игры.
  SG.controls = function(onChange){
    var wrap = SG.el('div', ''); wrap.style.cssText = 'display:flex;gap:8px;align-items:center';
    var lg = SG.el('div', 'g-lang'); lg.setAttribute('role', 'group');
    ['kk', 'ru'].forEach(function(l){
      var b = SG.el('button', '', l === 'kk' ? 'ҚАЗ' : 'РУС'); b.type = 'button';
      b.setAttribute('aria-pressed', lang === l);
      b.addEventListener('click', function(){
        SG.setLang(l); SG.stopSpeech();
        Array.prototype.forEach.call(lg.children, function(x, i){ x.setAttribute('aria-pressed', ['kk','ru'][i] === l); });
        onChange && onChange();
      });
      lg.appendChild(b);
    });
    var sb = SG.el('button', 'g-iconbtn', sound ? SG.ICON_SOUND_ON : SG.ICON_SOUND_OFF); sb.type = 'button'; sb.setAttribute('aria-label', 'Sound');
    sb.addEventListener('click', function(){ SG.setSound(!sound); sb.innerHTML = sound ? SG.ICON_SOUND_ON : SG.ICON_SOUND_OFF; });
    wrap.appendChild(lg); wrap.appendChild(sb);
    return wrap;
  };

  SG.ICON_SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 010 6M18 6.5a8 8 0 010 11"/></svg>';

  // Экран победы: t = {win, again, other} — уже готовые строки.
  SG.win = function(root, t, onAgain, onOther){
    SG.chime('win'); SG.confetti();
    var ov = SG.el('div', 'g-overlay');
    ov.innerHTML = SG.MASCOT.replace('<svg ', '<svg class="g-mascot" ') +
      '<h2 class="g-win">' + t.win + '</h2><div class="g-stars">' + SG.STAR + SG.STAR + SG.STAR + '</div>';
    var act = SG.el('div', 'g-actions');
    var again = SG.el('button', 'g-big', '↻ ' + t.again); again.type = 'button'; again.style.marginTop = '0';
    var other = SG.el('button', 'g-big ghost', t.other); other.type = 'button'; other.style.marginTop = '0';
    again.addEventListener('click', onAgain); other.addEventListener('click', onOther);
    act.appendChild(again); act.appendChild(other); ov.appendChild(act);
    root.appendChild(ov);
  };

  // Открыть игру внутри контейнера root. api.onExit — что делать по кнопке «назад».
  SG.open = function(id, root, api){
    var g = SG.games.filter(function(x){ return x.id === id; })[0];
    if (!g) return;
    root.innerHTML = '';
    g.mount(root, api || {});
  };
})();
