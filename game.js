(function () {
  'use strict';

  // id 對應 justfont 嵌入碼中 _setFont 的名稱與 css class
  var FONTS = [
    { id: 'jf-handyblack-w6', name: '巧黑 HandyBlack', weight: 600 },
    { id: 'jf-albatron-w6', name: '青雲 Albatron', weight: 600 },
    { id: 'pentouch-regular', name: '隨筆 Touch', weight: 600 },
    { id: 'jf-sunday', name: '日青 Sunday', weight: 600 },
    { id: 'jf-justwriting', name: '文正 justwriting', weight: 500 },
    { id: 'naughty', name: '玩童體 naughty', weight: 600 },
    { id: 'mei-a', name: '妹阿 mei-a', weight: 600 },
    { id: 'xinli-proportional', name: '新力', weight: 600 },
    { id: 'oyeh_handwriting', name: '葉書體', weight: 600 },
    { id: 'xionggu', name: '熊谷奶奶', weight: 600 },
    { id: 'jf-liao', name: '文強手寫體', weight: 500 },
    { id: 'chungtf', name: '鍾德輝手寫體', weight: 500 },
    { id: 'jf-hornedfrog', name: '角蛙體', weight: 500 },
    { id: 'meiyifont', name: '玫怡手寫體', weight: 500 },
    { id: 'duoduofont', name: '朵朵手寫體', weight: 500 },
    { id: 'drechifont', name: '追奇手寫體', weight: 500 },
    { id: 'huangli', name: '黃隸', weight: 400 },
    { id: 'lihsianti', name: '粒線體', weight: 500 },
    { id: 'jinghong', name: '驚鴻手書', weight: 500 },
    { id: 'kolliko', name: '口力口體', weight: 500 },
    { id: 'ennofont', name: '宜農手寫體', weight: 500 },
    { id: 'loksin', name: '洛神行書', weight: 500 },
    { id: 'wenwriting', name: '彣書', weight: 400 },
    { id: 'tsuhsianti', name: '粗線體', weight: 700 },
    { id: 'lebifont', name: '樂筆手寫體', weight: 600 },
    { id: 'chalkdayfont', name: '值日生粉筆體', weight: 400 }
  ];

  var PHRASES = [
    '今天也要好好吃飯',
    '下雨天適合想念一個人',
    '咖啡涼了，故事還沒說完',
    '把快樂寫在明信片上',
    '週末一起去海邊看夕陽',
    '謝謝你一直都在',
    '早安，今天天氣真好',
    '生日快樂，願你天天開心',
    '慢慢來，比較快',
    '再見了，夏天的風',
    '這杯奶茶半糖少冰',
    '山上的星星特別亮',
    '記得帶傘出門喔',
    '貓咪在窗邊睡午覺',
    '每個字都有自己的個性',
    '見字如面，展信平安',
    '人生就像一場旅行',
    '晚上吃火鍋好不好',
    '明天的事明天再說',
    '你是我最好的朋友',
    '老闆，來一碗牛肉麵',
    '努力的人運氣不會太差',
    '風吹過稻田的聲音',
    '請勿在教室內奔跑',
    '冬天最適合喝熱湯',
    '把握當下，珍惜眼前人',
    '搭上末班車回家',
    '外婆做的菜最好吃',
    '書桌上堆滿了回憶',
    '今天的月亮好圓',
    '聽說巷口開了新的麵包店',
    '一起去看煙火吧',
    '寫一封信給十年後的自己',
    '早點睡，不要熬夜',
    '雨停了，天空出現彩虹',
    '好想放一個長假'
  ];

  var DIFFICULTIES = {
    easy: { label: '輕鬆', time: 15 },
    normal: { label: '標準', time: 10 },
    master: { label: '大師', time: 6 }
  };

  var TOTAL_ROUNDS = 10;
  var BASE_SCORE = 100;
  var MAX_TIME_BONUS = 100;
  var COMBO_BONUS = 20;
  var STORAGE_KEY = 'jf-font-master-best';
  var TITLE_TEXT = '手寫字體辨識大師';
  var RANKS = [
    { min: 0.9, title: '手寫字體辨識大師', desc: '字型的靈魂你都看得見，justfont 應該聘請你！' },
    { min: 0.7, title: '字型達人', desc: '眼力驚人！多數手寫字都逃不過你的法眼。' },
    { min: 0.5, title: '字體觀察家', desc: '已經能分辨筆畫的個性了，繼續加油！' },
    { min: 0.3, title: '字體新手', desc: '開始感受到手寫字的差異了，多玩幾次會更準喔。' },
    { min: 0, title: '字體路人', desc: '每種字都長得很像？沒關係，這正是學習的開始！' }
  ];

  var $ = function (id) { return document.getElementById(id); };

  var els = {
    screens: {
      start: $('screenStart'),
      game: $('screenGame'),
      result: $('screenResult')
    },
    startBtn: $('startBtn'),
    bestScore: $('bestScore'),
    fontCount: $('fontCount'),
    diffBtns: document.querySelectorAll('.diff-btn'),
    hudRound: $('hudRound'),
    hudScore: $('hudScore'),
    hudCombo: $('hudCombo'),
    timerBar: $('timerBar'),
    sample: $('sample'),
    options: $('options'),
    feedback: $('feedback'),
    nextBtn: $('nextBtn'),
    rankTitle: $('rankTitle'),
    rankDesc: $('rankDesc'),
    statScore: $('statScore'),
    statCorrect: $('statCorrect'),
    statSpeed: $('statSpeed'),
    statCombo: $('statCombo'),
    newBest: $('newBest'),
    retryBtn: $('retryBtn'),
    homeBtn: $('homeBtn'),
    shareBtn: $('shareBtn'),
    review: $('review'),
    toast: $('toast'),
    soundToggle: $('soundToggle')
  };

  var state = {
    difficulty: 'normal',
    questions: [],
    round: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    history: [],
    answered: false,
    questionStart: 0,
    rafId: 0,
    autoNextId: 0,
    soundOn: true,
    lastResult: null
  };

  // ---------- 字型預載 ----------

  function injectFontRules() {
    var css = FONTS.map(function (f) {
      return '.' + f.id + '{font-family:"' + f.id + '","Kaiti TC","BiauKai",serif;font-weight:' + f.weight + ';}';
    }).join('\n');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // justfont 只會下載頁面上出現過的字，所以先把所有題目與字型名稱放進隱藏區塊
  function buildPreload() {
    var allNames = FONTS.map(function (f) { return f.name; }).join('');
    var text = PHRASES.join('') + allNames + TITLE_TEXT + RANKS.map(function (r) { return r.title; }).join('');
    var box = document.createElement('div');
    box.id = 'jf-preload';
    box.setAttribute('aria-hidden', 'true');
    FONTS.forEach(function (f) {
      var span = document.createElement('span');
      span.className = f.id;
      span.textContent = text;
      box.appendChild(span);
    });
    document.body.appendChild(box);
  }

  function waitForFonts() {
    var html = document.documentElement;
    var started = Date.now();
    return new Promise(function (resolve) {
      (function check() {
        var cls = html.className;
        if (/\bjf-active\b/.test(cls) || /\bjf-inactive\b/.test(cls) || Date.now() - started > 10000) {
          var ok = /\bjf-active\b/.test(cls);
          // 給瀏覽器一點時間實際下載字型檔
          var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
          Promise.race([fontsReady, delay(4000)]).then(function () { resolve(ok); });
          return;
        }
        setTimeout(check, 150);
      })();
    });
  }

  function ensureFontLoaded(font, text) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var spec = font.weight + ' 48px "' + font.id + '"';
    return Promise.race([document.fonts.load(spec, text).catch(function () {}), delay(1500)]);
  }

  // ---------- 工具 ----------

  function delay(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function showScreen(name) {
    Object.keys(els.screens).forEach(function (k) {
      els.screens[k].classList.toggle('active', k === name);
    });
    window.scrollTo(0, 0);
  }

  function bump(el) {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { els.toast.classList.remove('show'); }, 1800);
  }

  function loadBest() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveBest(best) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
    } catch (e) { /* 無痕模式等情況忽略 */ }
  }

  function renderBest() {
    var best = loadBest()[state.difficulty];
    els.bestScore.textContent = best
      ? '【' + DIFFICULTIES[state.difficulty].label + '】最佳紀錄：' + best + ' 分'
      : '';
  }

  // ---------- 音效 ----------

  var audioCtx = null;

  function tone(freq, duration, type, when) {
    if (!state.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var t0 = audioCtx.currentTime + (when || 0);
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch (e) { /* 不支援音效就算了 */ }
  }

  var sfx = {
    correct: function () { tone(660, 0.12, 'triangle'); tone(990, 0.18, 'triangle', 0.09); },
    wrong: function () { tone(220, 0.25, 'sawtooth'); },
    tick: function () { tone(1200, 0.05, 'square'); },
    finish: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.2, 'triangle', i * 0.1); }); }
  };

  // ---------- 遊戲流程 ----------

  function buildQuestions() {
    var fonts = shuffle(FONTS).slice(0, TOTAL_ROUNDS);
    var phrases = shuffle(PHRASES);
    return fonts.map(function (font, i) {
      var distractors = shuffle(FONTS.filter(function (f) { return f.id !== font.id; })).slice(0, 3);
      return {
        font: font,
        phrase: phrases[i % phrases.length],
        options: shuffle([font].concat(distractors))
      };
    });
  }

  function startGame() {
    state.questions = buildQuestions();
    state.round = 0;
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.history = [];
    els.hudScore.textContent = '0';
    els.hudCombo.textContent = '0';
    showScreen('game');
    nextQuestion();
  }

  function nextQuestion() {
    clearTimeout(state.autoNextId);
    if (state.round >= TOTAL_ROUNDS) {
      finishGame();
      return;
    }
    var q = state.questions[state.round];
    state.answered = true; // 字型就緒前先鎖住作答

    els.hudRound.textContent = (state.round + 1) + ' / ' + TOTAL_ROUNDS;
    els.feedback.textContent = '';
    els.feedback.className = 'feedback';
    els.nextBtn.hidden = true;
    setTimerBar(1);

    els.sample.classList.add('hidden');
    els.sample.className = 'sample hidden ' + q.font.id;
    els.sample.textContent = q.phrase;

    els.options.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.dataset.id = opt.id;
      btn.disabled = true;
      btn.innerHTML = '<span class="option-key">' + (i + 1) + '</span><span class="option-name"></span>';
      btn.querySelector('.option-name').textContent = opt.name;
      btn.addEventListener('click', function () { answer(opt.id); });
      els.options.appendChild(btn);
    });

    var roundAtStart = state.round;
    ensureFontLoaded(q.font, q.phrase).then(function () {
      if (roundAtStart !== state.round || !els.screens.game.classList.contains('active')) return;
      els.sample.classList.remove('hidden');
      Array.prototype.forEach.call(els.options.children, function (b) { b.disabled = false; });
      state.answered = false;
      state.questionStart = performance.now();
      state.lastTick = Math.ceil(DIFFICULTIES[state.difficulty].time);
      loop();
    });
  }

  function setTimerBar(ratio) {
    els.timerBar.style.transform = 'scaleX(' + Math.max(0, ratio) + ')';
    els.timerBar.classList.toggle('warn', ratio <= 0.5 && ratio > 0.25);
    els.timerBar.classList.toggle('danger', ratio <= 0.25);
  }

  function loop() {
    cancelAnimationFrame(state.rafId);
    var limit = DIFFICULTIES[state.difficulty].time * 1000;
    (function frame() {
      if (state.answered) return;
      var elapsed = performance.now() - state.questionStart;
      var ratio = 1 - elapsed / limit;
      setTimerBar(ratio);

      var secLeft = Math.ceil((limit - elapsed) / 1000);
      if (secLeft < state.lastTick) {
        state.lastTick = secLeft;
        if (secLeft <= 3 && secLeft > 0) sfx.tick();
      }

      if (ratio <= 0) {
        answer(null);
        return;
      }
      state.rafId = requestAnimationFrame(frame);
    })();
  }

  function answer(chosenId) {
    if (state.answered) return;
    state.answered = true;
    cancelAnimationFrame(state.rafId);

    var q = state.questions[state.round];
    var limit = DIFFICULTIES[state.difficulty].time * 1000;
    var elapsed = Math.min(performance.now() - state.questionStart, limit);
    var correct = chosenId === q.font.id;
    var gained = 0;

    if (correct) {
      state.combo += 1;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      var timeBonus = Math.round(MAX_TIME_BONUS * (1 - elapsed / limit));
      gained = BASE_SCORE + timeBonus + COMBO_BONUS * (state.combo - 1);
      state.score += gained;
    } else {
      state.combo = 0;
    }

    state.history.push({
      font: q.font,
      phrase: q.phrase,
      chosen: chosenId ? FONTS.filter(function (f) { return f.id === chosenId; })[0] : null,
      correct: correct,
      time: elapsed / 1000,
      gained: gained
    });

    // 揭曉：每個選項都換成自己的字體，順便認識一下長相
    Array.prototype.forEach.call(els.options.children, function (btn) {
      var id = btn.dataset.id;
      btn.disabled = true;
      btn.classList.add('reveal');
      btn.querySelector('.option-name').classList.add(id);
      if (id === q.font.id) btn.classList.add('correct');
      else if (id === chosenId) btn.classList.add('wrong');
      else btn.classList.add('dim');
    });

    els.hudScore.textContent = state.score;
    els.hudCombo.textContent = state.combo;

    if (correct) {
      sfx.correct();
      bump(els.hudScore);
      if (state.combo > 1) bump(els.hudCombo);
      els.feedback.className = 'feedback good';
      els.feedback.textContent = '答對了！+' + gained + (state.combo > 1 ? '（' + state.combo + ' 連擊！）' : '');
      floatScore('+' + gained);
      state.autoNextId = setTimeout(goNext, 1300);
    } else {
      sfx.wrong();
      els.feedback.className = 'feedback bad';
      els.feedback.textContent = (chosenId ? '可惜！' : '時間到！') + '正確答案是「' + q.font.name + '」';
      els.nextBtn.hidden = false;
      els.nextBtn.textContent = state.round + 1 >= TOTAL_ROUNDS ? '看結果 ⏎' : '下一題 ⏎';
      els.nextBtn.focus({ preventScroll: true });
    }
  }

  function floatScore(text) {
    var target = els.options.querySelector('.option.correct');
    if (!target) return;
    var rect = target.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'float-score';
    el.textContent = text;
    el.style.left = rect.left + rect.width / 2 + 'px';
    el.style.top = rect.top - 10 + 'px';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 900);
  }

  function goNext() {
    if (!els.screens.game.classList.contains('active')) return;
    if (state.history.length !== state.round + 1) return;
    state.round += 1;
    nextQuestion();
  }

  function finishGame() {
    var correctCount = state.history.filter(function (h) { return h.correct; }).length;
    var ratio = correctCount / TOTAL_ROUNDS;
    var rank = RANKS.filter(function (r) { return ratio >= r.min; })[0];
    var correctTimes = state.history.filter(function (h) { return h.correct; }).map(function (h) { return h.time; });
    var avg = correctTimes.length
      ? (correctTimes.reduce(function (a, b) { return a + b; }, 0) / correctTimes.length).toFixed(1)
      : '-';

    var best = loadBest();
    var isNewBest = !best[state.difficulty] || state.score > best[state.difficulty];
    if (isNewBest && state.score > 0) {
      best[state.difficulty] = state.score;
      saveBest(best);
    }

    els.rankTitle.textContent = rank.title;
    els.rankDesc.textContent = rank.desc;
    els.statScore.textContent = state.score;
    els.statCorrect.textContent = correctCount + ' / ' + TOTAL_ROUNDS;
    els.statSpeed.textContent = avg === '-' ? '-' : avg + 's';
    els.statCombo.textContent = state.maxCombo;
    els.newBest.hidden = !(isNewBest && state.score > 0);

    els.review.innerHTML = '';
    state.history.forEach(function (h) {
      var li = document.createElement('li');
      li.className = 'review-item' + (h.correct ? '' : ' miss');

      var sample = document.createElement('div');
      sample.className = 'review-sample ' + h.font.id;
      sample.textContent = h.phrase;

      var meta = document.createElement('div');
      meta.className = 'review-meta';
      var name = document.createElement('strong');
      name.textContent = h.font.name;
      meta.appendChild(document.createTextNode(h.correct ? '✓ ' : '✗ '));
      meta.appendChild(name);
      if (!h.correct) {
        meta.appendChild(document.createTextNode(h.chosen ? '（你選了：' + h.chosen.name + '）' : '（超時未作答）'));
      }

      var time = document.createElement('div');
      time.className = 'review-time';
      time.textContent = h.time.toFixed(1) + 's' + (h.gained ? ' · +' + h.gained : '');

      li.appendChild(sample);
      li.appendChild(meta);
      li.appendChild(time);
      els.review.appendChild(li);
    });

    state.lastResult = { rank: rank.title, score: state.score, correct: correctCount };
    sfx.finish();
    showScreen('result');
  }

  function shareResult() {
    var r = state.lastResult;
    if (!r) return;
    var text = '我在「手寫字體辨識大師」【' + DIFFICULTIES[state.difficulty].label + '】模式答對 ' +
      r.correct + '/' + TOTAL_ROUNDS + ' 題，拿下 ' + r.score + ' 分，獲得稱號「' + r.rank + '」！你認得出幾款手寫字？';
    var done = function () { toast('成績已複製到剪貼簿'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
  }

  // ---------- 事件 ----------

  function bindEvents() {
    Array.prototype.forEach.call(els.diffBtns, function (btn) {
      btn.addEventListener('click', function () {
        state.difficulty = btn.dataset.diff;
        Array.prototype.forEach.call(els.diffBtns, function (b) {
          b.classList.toggle('selected', b === btn);
        });
        renderBest();
      });
    });

    els.startBtn.addEventListener('click', startGame);
    els.retryBtn.addEventListener('click', startGame);
    els.homeBtn.addEventListener('click', function () {
      renderBest();
      showScreen('start');
    });
    els.nextBtn.addEventListener('click', goNext);
    els.shareBtn.addEventListener('click', shareResult);

    els.soundToggle.addEventListener('click', function () {
      state.soundOn = !state.soundOn;
      els.soundToggle.textContent = state.soundOn ? '🔊' : '🔇';
    });

    document.addEventListener('keydown', function (e) {
      if (!els.screens.game.classList.contains('active')) return;
      if (/^[1-4]$/.test(e.key) && !state.answered) {
        var btn = els.options.children[Number(e.key) - 1];
        if (btn && !btn.disabled) btn.click();
      } else if ((e.key === 'Enter' || e.key === ' ') && !els.nextBtn.hidden) {
        e.preventDefault();
        goNext();
      }
    });
  }

  // ---------- 初始化 ----------

  injectFontRules();
  buildPreload();
  bindEvents();
  els.fontCount.textContent = FONTS.length;
  renderBest();

  waitForFonts().then(function (ok) {
    els.startBtn.disabled = false;
    els.startBtn.textContent = '開始挑戰';
    if (!ok) toast('字型服務載入失敗，可能會以預設字型顯示');
  });
})();
