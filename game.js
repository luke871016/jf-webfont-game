(function () {
  'use strict';

  // id 對應 justfont 嵌入碼中 _setFont 的名稱與 css class；
  // justfont 以 alias 當作 font-family 註冊，alias 與 id 不同時要填 family
  // tier 決定出現在哪個難度的題庫：1 熱銷字體、2 近年新作與作家系列、未填則只在大師難度出現
  var HANDWRITING_FONTS = [
    { id: 'jf-handyblack-w6', name: '巧黑 HandyBlack', weight: 600 },
    { id: 'jf-albatron-w6', name: '青雲 Albatron', weight: 600 },
    { id: 'pentouch-regular', name: '隨筆 Touch', weight: 600 },
    { id: 'jf-sunday', name: '日青 Sunday', weight: 600 },
    { id: 'jf-justwriting', name: '文正 justwriting', weight: 500 },
    { id: 'naughty', name: '玩童體 naughty', weight: 600 },
    { id: 'mei-a', name: '妹阿 mei-a', weight: 600 },
    { id: 'xinli-proportional', name: '新力', weight: 600 },
    { id: 'oyeh_handwriting', name: '葉書體', weight: 600, tier: 2 },
    { id: 'xionggu', name: '熊谷奶奶', weight: 600 },
    { id: 'jf-liao', name: '文強手寫體', weight: 500 },
    { id: 'chungtf', name: '鍾德輝手寫體', weight: 500 },
    { id: 'jf-hornedfrog', name: '角蛙體', weight: 500 },
    { id: 'meiyifont', name: '玫怡手寫體', weight: 500, tier: 2 },
    { id: 'duoduofont', name: '朵朵手寫體', weight: 500 },
    { id: 'drechifont', name: '追奇手寫體', weight: 500, tier: 1 },
    { id: 'huangli', name: '黃隸', weight: 400 },
    { id: 'lihsianti', name: '粒線體', weight: 500, tier: 1 },
    { id: 'jinghong', name: '驚鴻手書', weight: 500, tier: 2 },
    { id: 'kolliko', name: '口力口體', weight: 500, tier: 1 },
    { id: 'ennofont', name: '宜農手寫體', weight: 500, tier: 2 },
    { id: 'loksin', name: '洛神行書', weight: 500, tier: 1 },
    { id: 'wenwriting', name: '彣書', weight: 400, tier: 2 },
    { id: 'tsuhsianti', name: '粗線體', weight: 700, tier: 1 },
    { id: 'lebifont', name: '樂筆手寫體', weight: 600, tier: 2 },
    { id: 'amafont', name: '阿瑪手寫體', weight: 700, tier: 2 },
    { id: 'justinbeaverfont-fluffy', family: 'justinbeaverfont', name: '胖西手寫體—蓬蓬', weight: 700, tier: 1 },
    { id: 'justinbeaverfont-slim', family: 'justinbeaverfont', name: '胖西手寫體—瘦瘦', weight: 400, tier: 1 }
  ];

  var HANDWRITING_TIERS = { easy: 1, normal: 2, master: 3 };

  function handwritingPool(difficulty) {
    return HANDWRITING_FONTS.filter(function (f) { return (f.tier || 3) <= HANDWRITING_TIERS[difficulty]; });
  }

  var FALLBACKS = {
    hand: '"Kaiti TC","BiauKai",serif',
    sans: '"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif',
    serif: '"Songti TC","Noto Serif TC","PMingLiU",serif'
  };

  // 每一列為 [id 後綴, 字重名稱, CSS 字重]，需由細到粗排列；masterOnly 的字體只在大師難度出題
  function weightFamily(family, title, prefix, fallback, list, masterOnly) {
    return {
      family: family,
      title: title,
      masterOnly: !!masterOnly,
      fonts: list.map(function (w) {
        return { id: family + '-' + w[0], family: family, name: prefix + w[1], weight: w[2], fallback: fallback };
      })
    };
  }

  var SUGAR = [
    ['ultralight', '一分糖', 100], ['light', '二分糖', 200], ['book', '三分糖', 300],
    ['regular', '四分糖', 400], ['medium', '半糖', 500], ['semibold', '六分糖', 600],
    ['bold', '七分糖', 700], ['extrabold', '八分糖', 800], ['heavy', '九分糖', 900]
  ];

  var WEIGHT_FAMILIES = [
    weightFamily('xingothic-tc', '信黑體', '信黑體繁體', 'sans', [
      ['w1', 'W1', 100], ['w2', 'W2', 200], ['w3', 'W3', 300], ['w4', 'W4', 400], ['w5', 'W5', 500],
      ['w6', 'W6', 600], ['w7', 'W7', 700], ['w8', 'W8', 800], ['w10', 'W10', 950]
    ], true),
    weightFamily('jf-jinxuan', '金萱', '金萱', 'sans', SUGAR),
    weightFamily('jf-jinxuanlatte', '金萱那提', '金萱那提', 'sans', SUGAR),
    weightFamily('jf-lanyangming', '蘭陽明體', '蘭陽明體', 'serif', [
      ['light', 'W2', 200], ['book', 'W3', 300], ['regular', 'W4', 400],
      ['medium', 'W5', 500], ['semibold', 'W6', 600], ['bold', 'W7', 700]
    ]),
    weightFamily('jf-lanyanghei', '蘭陽黑體', '蘭陽黑體', 'sans', [
      ['bold', 'W7', 700], ['extrabold', 'W8', 800], ['heavy', 'W9', 900],
      ['extraheavy', 'W10', 920], ['black', 'W11', 940]
    ])
  ];

  var WEIGHT_FONTS = WEIGHT_FAMILIES.reduce(function (all, fam) { return all.concat(fam.fonts); }, []);

  function weightFamiliesFor(difficulty) {
    return WEIGHT_FAMILIES.filter(function (fam) { return difficulty === 'master' || !fam.masterOnly; });
  }

  // 精選與台文模式額外用到、其他模式沒有的字體
  var EXTRA_FONTS = [
    { id: 'jf-bunguan', name: 'jf 文源楷書', weight: 400 },
    { id: 'jf-kamabit', name: '柑仔蜜', weight: 700, fallback: 'sans' },
    { id: 'matsunoha-tc', name: '松韻', weight: 300, fallback: 'serif' },
    { id: 'tearsfont', name: '淚體', weight: 300 },
    { id: 'creamfont', name: '凝書體', weight: 400 },
    { id: 'twroadfont', name: '臺灣道路體', weight: 400, fallback: 'sans' },
    { id: 'burnfont', name: '激燃正體', weight: 900, fallback: 'sans' },
    // justfont 原始嵌入碼中斜體的 alias 也是 burnfont，會與正體互相覆蓋，index.html 已改為 burnfont-italic
    { id: 'burnfont_italic', family: 'burnfont-italic', name: '激燃斜體', weight: 900, fallback: 'sans' },
    { id: 'lithue', name: '日花', weight: 400, fallback: 'sans' }
  ];

  var ALL_FONTS = HANDWRITING_FONTS.concat(WEIGHT_FONTS, EXTRA_FONTS);

  function findFont(id) {
    return ALL_FONTS.filter(function (f) { return f.id === id; })[0];
  }

  function weightFamilyIds(family) {
    return WEIGHT_FAMILIES.filter(function (fam) { return fam.family === family; })[0]
      .fonts.map(function (f) { return f.id; });
  }

  // standardId 是輕鬆難度使用的標準字重，未填則用第一個
  function fontFamily(name, ids, standardId) {
    return {
      id: 'family-' + ids[0],
      name: name,
      fonts: ids.map(findFont),
      standard: findFont(standardId || ids[0])
    };
  }

  var FEATURED_FAMILIES = [
    fontFamily('蘭陽黑體', weightFamilyIds('jf-lanyanghei'), 'jf-lanyanghei-bold'),
    fontFamily('蘭陽明體', weightFamilyIds('jf-lanyangming'), 'jf-lanyangming-regular'),
    fontFamily('金萱', weightFamilyIds('jf-jinxuan'), 'jf-jinxuan-regular'),
    fontFamily('金萱那提', weightFamilyIds('jf-jinxuanlatte'), 'jf-jinxuanlatte-regular'),
    fontFamily('柑仔蜜', ['jf-kamabit']),
    fontFamily('松韻', ['matsunoha-tc']),
    fontFamily('淚體', ['tearsfont']),
    fontFamily('凝書體', ['creamfont']),
    fontFamily('臺灣道路體', ['twroadfont']),
    fontFamily('激燃體', ['burnfont', 'burnfont_italic']),
    fontFamily('粗線體', ['tsuhsianti']),
    fontFamily('粒線體', ['lihsianti']),
    fontFamily('胖西手寫體', ['justinbeaverfont-slim', 'justinbeaverfont-fluffy']),
    fontFamily('日花', ['lithue'])
  ];

  var TAIWANESE_FAMILIES = [
    fontFamily('jf 蘭陽明體', weightFamilyIds('jf-lanyangming'), 'jf-lanyangming-regular'),
    fontFamily('jf 蘭陽黑體', weightFamilyIds('jf-lanyanghei'), 'jf-lanyanghei-bold'),
    fontFamily('jf 金萱', weightFamilyIds('jf-jinxuan'), 'jf-jinxuan-regular'),
    fontFamily('jf 金萱那提', weightFamilyIds('jf-jinxuanlatte'), 'jf-jinxuanlatte-regular'),
    fontFamily('jf 文源楷書', ['jf-bunguan']),
    fontFamily('jf 柑仔蜜', ['jf-kamabit']),
    fontFamily('淚體', ['tearsfont']),
    fontFamily('凝書體', ['creamfont']),
    fontFamily('臺灣道路體', ['twroadfont']),
    fontFamily('日花', ['lithue']),
    fontFamily('粗線體', ['tsuhsianti']),
    fontFamily('胖西手寫體', ['justinbeaverfont-slim', 'justinbeaverfont-fluffy']),
    fontFamily('阿瑪手寫體', ['amafont']),
    fontFamily('宜農手寫體', ['ennofont']),
    fontFamily('樂筆手寫體', ['lebifont']),
    fontFamily('玫怡手寫體', ['meiyifont']),
    fontFamily('追奇手寫體', ['drechifont']),
    fontFamily('朵朵手寫體', ['duoduofont'])
  ];

  // 含組合附加符號（如 o͘、a̍）與擴充區漢字（如 𬦰、𠢕），修改時請保留原字元
  var TAIWANESE_PHRASES = [
    '好--ah，súi--ah，咱Tâi-oân！',
    '我會當kā玻璃吞--lo̍h-khì而且bē傷身體',
    '請手扞好勢，跤徛予在',
    'TÂI-OÂN HÚ-SIÂᴺ KÀU-HŌE-PÒ',
    '買賣算分，相請無論',
    'Âng súi, o͘ tōa-pān',
    'Ba̍k-tsiu khuànn-kuân, bô khuànn-kē.',
    '無通生食，哪有通曝乾',
    '教囝學泅，毋通教囝𬦰樹',
    '人𠢕，天咧做對頭',
    '扭掠 hô͘-lî 跳過 pîn-tōaⁿ ê 狗仔',
    '收瀾收 hōo 焦，hōo 你生一 ê 有𡳞脬',
    'Bē-hiáu thì-thâu, tú-tio̍h hô͘-chhiu.'
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

  var DIFFICULTY_LABELS = { easy: '輕鬆', normal: '標準', master: '大師' };

  var MODES = {
    featured: {
      label: '精選字體辨識',
      hint: '這是哪一款字體？',
      masterHint: '這是哪一款字體、哪一個字重？',
      times: { easy: 10, normal: 10, master: 10 },
      diffDesc: { easy: '標準字重・選字體', normal: '多種字重・選字體', master: '多種字重・選字體與字重' },
      rules: [
        '【精選字體辨識】題庫收錄 {featured} 款 justfont 精選字體，涵蓋黑體、明體、手寫與標題字，請選出句子是用哪一款字體寫成，每題限時 10 秒。',
        '輕鬆難度只會以標準字重出題；標準難度會出現各種字重，但只要答出字體名稱；大師難度的選項會細分到字重，同一套字體的不同字重也可能同時出現！'
      ],
      shareTail: '你認得出幾款 justfont 字體？',
      ranks: [
        { min: 0.9, title: '精選字體辨識大師', desc: 'justfont 的招牌字體你全都認得，根本是字型圈的老朋友！' },
        { min: 0.7, title: '字型達人', desc: '黑體、明體、手寫字通通難不倒你，眼力相當可靠。' },
        { min: 0.5, title: '字體觀察家', desc: '已經抓到各款字體的特徵了，再多看幾次就能更上一層樓。' },
        { min: 0.3, title: '字體新手', desc: '開始分得出字體之間的差異了，多玩幾次會更準喔。' },
        { min: 0, title: '字體路人', desc: '每款字都長得很像？沒關係，這正是認識字體的開始！' }
      ]
    },
    taiwanese: {
      label: '台文字體辨識',
      hint: '這是哪一款字體？',
      masterHint: '這是哪一款字體、哪一個字重？',
      times: { easy: 10, normal: 10, master: 10 },
      diffDesc: { easy: '標準字重・選字體', normal: '多種字重・選字體', master: '多種字重・選字體與字重' },
      rules: [
        '【台文字體辨識】題庫收錄 {taiwanese} 款支援台文的 justfont 字體，題目是台語漢字與羅馬字混寫的句子，請選出是用哪一款字體寫成，每題限時 10 秒。',
        '輕鬆難度只會以標準字重出題；標準難度會出現各種字重，但只要答出字體名稱；大師難度的選項會細分到字重，同一套字體的不同字重也可能同時出現！'
      ],
      shareTail: '你認得出幾款台文字體？',
      ranks: [
        { min: 0.9, title: '台文字體辨識大師', desc: '漢字、白話字、台羅混寫都難不倒你，眼力 tsiok 好！' },
        { min: 0.7, title: '台文字體達人', desc: '連羅馬字的聲調符號都看得仔細，字體細節逃不過你的法眼。' },
        { min: 0.5, title: '台文字體觀察家', desc: '已經抓到各款字體寫台文時的個性了，繼續加油！' },
        { min: 0.3, title: '台文字體新手', desc: '開始分得出字體之間的差異了，多玩幾次會更準喔。' },
        { min: 0, title: '台文字體路人', desc: '每款字都長得很像？沒關係，這正是認識台文字體的開始！' }
      ]
    },
    handwriting: {
      label: '手寫字體辨識',
      hint: '這是哪一款字體？',
      times: { easy: 10, normal: 10, master: 10 },
      diffDesc: { easy: '熱銷手寫字・{easy} 款', normal: '加入新作與作家系列・{normal} 款', master: '全部手寫字・{master} 款' },
      rules: [
        '【手寫字體辨識】每題會出現一句由某款 justfont 手寫字體寫成的句子，請選出正確的字體名稱，每題限時 10 秒。',
        '難度決定題庫範圍：輕鬆只出 {easy} 款熱銷手寫字；標準再加入近年新作與作家系列，共 {normal} 款；大師則包含全部 {master} 款。'
      ],
      shareTail: '你認得出幾款手寫字？',
      ranks: [
        { min: 0.9, title: '手寫字體辨識大師', desc: '字型的靈魂你都看得見，justfont 應該聘請你！' },
        { min: 0.7, title: '字型達人', desc: '眼力驚人！多數手寫字都逃不過你的法眼。' },
        { min: 0.5, title: '字體觀察家', desc: '已經能分辨筆畫的個性了，繼續加油！' },
        { min: 0.3, title: '字體新手', desc: '開始感受到手寫字的差異了，多玩幾次會更準喔。' },
        { min: 0, title: '字體路人', desc: '每種字都長得很像？沒關係，這正是學習的開始！' }
      ]
    },
    weight: {
      label: '字重辨識大師',
      hint: '這是「{family}」的哪一個字重？',
      times: { easy: 20, normal: 12, master: 8 },
      diffDesc: { easy: '每題 20 秒・字重差距大', normal: '每題 12 秒・隨機字重', master: '每題 8 秒・相鄰字重' },
      rules: [
        '【字重辨識大師】題庫收錄{weightBasic}，大師難度再加入{weightMasterOnly}，共 {families} 套、{weights} 個字重。題目會告訴你是哪一套字體，請判斷句子是用哪一個字重寫成，選項由細到粗排列。',
        '難度越高，時間越短、四個選項的字重也越接近；大師難度會出現四個相鄰的字重！'
      ],
      shareTail: '你分得出一分糖和二分糖嗎？',
      ranks: [
        { min: 0.9, title: '字重辨識大師', desc: '差一級字重都逃不過你的眼睛，簡直是人體字重計！' },
        { min: 0.7, title: '字重達人', desc: '粗細拿捏精準，排版時的字重搭配一定很講究。' },
        { min: 0.5, title: '字重觀察家', desc: '已經抓到筆畫粗細的感覺了，多看幾套字會更準。' },
        { min: 0.3, title: '字重新手', desc: '相鄰字重真的很難分，多玩幾次眼睛會越來越敏銳。' },
        { min: 0, title: '字重路人', desc: '每個字重看起來都差不多？沒關係，這正是學習的開始！' }
      ]
    }
  };

  MODES.featured.build = function (difficulty) {
    return buildFamilyQuestions(FEATURED_FAMILIES, PHRASES, MODES.featured, difficulty);
  };
  MODES.taiwanese.build = function (difficulty) {
    return buildFamilyQuestions(TAIWANESE_FAMILIES, TAIWANESE_PHRASES, MODES.taiwanese, difficulty);
  };
  MODES.handwriting.build = buildHandwritingQuestions;
  MODES.weight.build = buildWeightQuestions;

  var TOTAL_ROUNDS = 10;
  var BASE_SCORE = 100;
  var MAX_TIME_BONUS = 100;
  var COMBO_BONUS = 20;
  var STORAGE_KEY = 'jf-font-master-best';
  var TITLE_TEXT = 'justfont字體辨識大師';
  var UI_FONT = 'matsunoha-tc';
  // 由 JS 動態產生的介面文字，需先預載介面字體的字符
  var UI_DYNAMIC_TEXT = '【】・最佳紀錄：分答對了！+（連擊！）可惜！時間到！正確答案是「」看結果下一題⏎✓✗你選了超時未作答' +
    '挑戰結束成績已複製到剪貼簿字型服務載入失敗，可能會以預設字型顯示開始挑戰0123456789/s·';

  var $ = function (id) { return document.getElementById(id); };

  var els = {
    app: $('app'),
    screens: {
      loading: $('screenLoading'),
      start: $('screenStart'),
      game: $('screenGame'),
      result: $('screenResult')
    },
    startBtn: $('startBtn'),
    bestScore: $('bestScore'),
    rulesList: $('rulesList'),
    modeCards: document.querySelectorAll('.mode-card[data-mode]'),
    diffBtns: document.querySelectorAll('.diff-btn'),
    hudRound: $('hudRound'),
    hudScore: $('hudScore'),
    hudCombo: $('hudCombo'),
    timerBar: $('timerBar'),
    paperHint: $('paperHint'),
    sample: $('sample'),
    options: $('options'),
    feedback: $('feedback'),
    nextBtn: $('nextBtn'),
    resultMode: $('resultMode'),
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
    soundToggle: $('soundToggle'),
    titleText: $('titleText')
  };

  var state = {
    mode: 'featured',
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

  function currentMode() {
    return MODES[state.mode];
  }

  function timeLimit() {
    return currentMode().times[state.difficulty];
  }

  // ---------- 字型預載 ----------

  function familyOf(font) {
    return font.family || font.id;
  }

  function injectFontRules() {
    var css = ALL_FONTS.map(function (f) {
      return '.' + f.id + '{font-family:"' + familyOf(f) + '",' + FALLBACKS[f.fallback || 'hand'] +
        ';font-weight:' + f.weight + ';}';
    }).join('\n');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function collectStrings(value) {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    return Object.keys(value).map(function (k) { return collectStrings(value[k]); }).join('');
  }

  // justfont 只會下載頁面上出現過的字，所以先把所有題目與字型名稱放進隱藏區塊
  function buildPreload() {
    var names = function (fonts) { return fonts.map(function (f) { return f.name; }).join(''); };
    var rankTitles = Object.keys(MODES).map(function (k) {
      return MODES[k].ranks.map(function (r) { return r.title; }).join('');
    }).join('');
    var handText = PHRASES.join('') + names(HANDWRITING_FONTS) + TITLE_TEXT + rankTitles + '字';

    var box = document.createElement('div');
    box.id = 'jf-preload';
    box.setAttribute('aria-hidden', 'true');
    box.style.cssText = 'position:absolute;left:-99999px;top:0;width:1px;overflow:hidden;opacity:0;pointer-events:none;white-space:nowrap;';
    var addSpan = function (className, text) {
      var span = document.createElement('span');
      span.className = className;
      span.textContent = text;
      box.appendChild(span);
    };

    HANDWRITING_FONTS.forEach(function (f) { addSpan(f.id, handText); });
    WEIGHT_FAMILIES.forEach(function (fam) {
      var text = PHRASES.join('') + names(fam.fonts) + TITLE_TEXT + '字';
      fam.fonts.forEach(function (f) { addSpan(f.id, text); });
    });
    EXTRA_FONTS.forEach(function (f) { addSpan(f.id, PHRASES.join('') + f.name + TITLE_TEXT + '字'); });
    var taiwaneseText = TAIWANESE_PHRASES.join('') + names(TAIWANESE_FAMILIES) + '台文';
    TAIWANESE_FAMILIES.forEach(function (fam) {
      fam.fonts.forEach(function (f) { addSpan(f.id, taiwaneseText); });
    });

    addSpan(UI_FONT, document.querySelector('.app').textContent.replace(/\s+/g, '') +
      document.title + names(ALL_FONTS) + UI_DYNAMIC_TEXT +
      collectStrings(MODES) + collectStrings(DIFFICULTY_LABELS) +
      WEIGHT_FAMILIES.map(function (fam) { return fam.title; }).join('') +
      names(FEATURED_FAMILIES) + names(TAIWANESE_FAMILIES));

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
          waitHomeFonts().then(function () { resolve(ok); });
          return;
        }
        setTimeout(check, 150);
      })();
    });
  }

  // 首頁會立刻看到的字：介面字、標題六字、模式卡片示意字
  function waitHomeFonts() {
    var loads = [ensureFontLoaded({ id: UI_FONT, family: UI_FONT, weight: 300 }, '字體辨識大師選擇模式開始挑戰輕鬆標準大師')];
    var nodes = document.querySelectorAll('#titleText span, .mode-glyphs span');
    Array.prototype.forEach.call(nodes, function (node) {
      var font = findFont(node.className.trim().split(/\s+/)[0]);
      if (font) loads.push(ensureFontLoaded(font, node.textContent));
    });
    return Promise.race([Promise.all(loads), delay(4000)]);
  }

  function ensureFontLoaded(font, text) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var spec = font.weight + ' 48px "' + familyOf(font) + '"';
    return Promise.race([document.fonts.load(spec, text).catch(function () {}), delay(2500)]);
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

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (m, key) { return key in values ? values[key] : m; });
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
    var best;
    try {
      best = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      best = {};
    }
    // 舊版只有手寫模式，紀錄直接以難度為 key
    if (typeof best.easy === 'number' || typeof best.normal === 'number' || typeof best.master === 'number') {
      best = { handwriting: { easy: best.easy, normal: best.normal, master: best.master } };
    }
    return best;
  }

  function saveBest(best) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
    } catch (e) { /* 無痕模式等情況忽略 */ }
  }

  function modeTag() {
    return currentMode().label + '・' + DIFFICULTY_LABELS[state.difficulty];
  }

  function renderBest() {
    var best = (loadBest()[state.mode] || {})[state.difficulty];
    els.bestScore.textContent = best ? '【' + modeTag() + '】最佳紀錄：' + best + ' 分' : '';
  }

  function titles(families) {
    return families.map(function (fam) { return fam.title; }).join('、');
  }

  function renderModeInfo() {
    var mode = currentMode();
    Array.prototype.forEach.call(els.modeCards, function (card) {
      var on = card.dataset.mode === state.mode;
      card.classList.toggle('selected', on);
      card.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    var values = {
      easy: handwritingPool('easy').length,
      normal: handwritingPool('normal').length,
      master: handwritingPool('master').length,
      families: WEIGHT_FAMILIES.length,
      weights: WEIGHT_FONTS.length,
      weightBasic: titles(weightFamiliesFor('normal')),
      weightMasterOnly: titles(WEIGHT_FAMILIES.filter(function (fam) { return fam.masterOnly; })),
      featured: FEATURED_FAMILIES.length,
      taiwanese: TAIWANESE_FAMILIES.length
    };
    Array.prototype.forEach.call(els.diffBtns, function (btn) {
      btn.querySelector('.diff-desc').textContent = fill(mode.diffDesc[btn.dataset.diff], values);
    });

    Array.prototype.forEach.call(els.rulesList.querySelectorAll('.rule-mode'), function (li) { li.remove(); });
    var anchor = els.rulesList.querySelector('.rule-shared');
    mode.rules.forEach(function (rule) {
      var li = document.createElement('li');
      li.className = 'rule-mode';
      li.textContent = fill(rule, values);
      els.rulesList.insertBefore(li, anchor);
    });
    renderBest();
  }

  // 標題每個字隨機套用不同字體家族，同家族的多個字重只會抽中其中一個
  function randomizeTitle() {
    var byFamily = {};
    ALL_FONTS.forEach(function (f) {
      var key = familyOf(f);
      (byFamily[key] = byFamily[key] || []).push(f);
    });
    var picks = shuffle(Object.keys(byFamily)).map(function (key) { return pick(byFamily[key]); });
    var chars = els.titleText.textContent.split('');
    els.titleText.textContent = '';
    chars.forEach(function (ch, i) {
      var span = document.createElement('span');
      span.className = picks[i].id;
      span.title = picks[i].name;
      span.textContent = ch;
      els.titleText.appendChild(span);
    });
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

  // ---------- 出題 ----------

  function buildHandwritingQuestions(difficulty) {
    var pool = handwritingPool(difficulty);
    // 題庫少於題數時字體會重複出現，但避免同一款連續出題
    var fonts = [];
    while (fonts.length < TOTAL_ROUNDS) {
      var batch = shuffle(pool);
      if (fonts.length && batch[0] === fonts[fonts.length - 1]) batch.push(batch.shift());
      fonts = fonts.concat(batch);
    }
    fonts = fonts.slice(0, TOTAL_ROUNDS);
    var phrases = shuffle(PHRASES);
    return fonts.map(function (font, i) {
      var distractors = shuffle(pool.filter(function (f) { return f.id !== font.id; })).slice(0, 3);
      return {
        font: font,
        answer: font,
        note: '',
        phrase: phrases[i % phrases.length],
        hint: MODES.handwriting.hint,
        options: shuffle([font].concat(distractors))
      };
    });
  }

  // 輕鬆、標準的選項是字體家族名稱，揭曉時以該家族的標準字重（答案則用題目的字重）顯示；
  // 大師的選項是個別字重，並混入同家族的其他字重；單一字重的家族在選項中一律顯示家族名稱
  function buildFamilyQuestions(allFamilies, allPhrases, mode, difficulty) {
    var families = shuffle(allFamilies).slice(0, TOTAL_ROUNDS);
    var phrases = shuffle(allPhrases);
    var fontOption = function (fam, font) {
      return { id: font.id, name: fam.fonts.length > 1 ? font.name : fam.name };
    };
    return families.map(function (fam, i) {
      var font = difficulty === 'easy' ? fam.standard : pick(fam.fonts);
      var others = shuffle(allFamilies.filter(function (f) { return f !== fam; }));
      var answer, options;

      if (difficulty === 'master') {
        var siblingCount = Math.min(fam.fonts.length - 1, pick([1, 2]));
        var siblings = shuffle(fam.fonts.filter(function (f) { return f !== font; })).slice(0, siblingCount);
        var rest = others.slice(0, 3 - siblings.length).map(function (f) { return fontOption(f, pick(f.fonts)); });
        answer = fontOption(fam, font);
        options = [answer].concat(siblings.map(function (f) { return fontOption(fam, f); }), rest);
      } else {
        options = [fam].concat(others.slice(0, 3)).map(function (f) {
          return { id: f.id, name: f.name, cls: f === fam ? font.id : f.standard.id };
        });
        answer = options[0];
      }

      return {
        font: font,
        answer: answer,
        note: difficulty !== 'master' && fam.fonts.length > 1 ? '（' + font.name + '）' : '',
        phrase: phrases[i % phrases.length],
        hint: difficulty === 'master' ? mode.masterHint : mode.hint,
        options: shuffle(options)
      };
    });
  }

  function combinations(items, k) {
    if (k === 0) return [[]];
    var out = [];
    items.forEach(function (item, i) {
      combinations(items.slice(i + 1), k - 1).forEach(function (rest) { out.push([item].concat(rest)); });
    });
    return out;
  }

  // 回傳 4 個由小到大的字重索引（含答案 answer），難度決定彼此的距離
  function pickWeightIndexes(count, answer, difficulty) {
    var others = [];
    for (var i = 0; i < count; i++) if (i !== answer) others.push(i);

    if (difficulty === 'master') {
      var starts = [];
      for (var s = Math.max(0, answer - 3); s <= Math.min(answer, count - 4); s++) starts.push(s);
      var start = pick(starts);
      return [start, start + 1, start + 2, start + 3];
    }

    var sortNum = function (a, b) { return a - b; };
    if (difficulty === 'normal') {
      return shuffle(others).slice(0, 3).concat(answer).sort(sortNum);
    }

    // 輕鬆：在所有組合中挑「最小間距」最大的，讓字重盡量拉開
    var minGap = function (idx) {
      var gap = Infinity;
      for (var j = 1; j < idx.length; j++) gap = Math.min(gap, idx[j] - idx[j - 1]);
      return gap;
    };
    var combos = combinations(others, 3).map(function (c) { return c.concat(answer).sort(sortNum); });
    var widest = Math.max.apply(null, combos.map(minGap));
    return pick(combos.filter(function (c) { return minGap(c) === widest; }));
  }

  function buildWeightQuestions(difficulty) {
    var pool = weightFamiliesFor(difficulty);
    var families = [];
    while (families.length < TOTAL_ROUNDS) families = families.concat(shuffle(pool));
    families = families.slice(0, TOTAL_ROUNDS);
    // 盡量避免同一套字體連續出現
    for (var tries = 0; tries < 30 && families.some(function (f, i) { return i > 0 && f === families[i - 1]; }); tries++) {
      families = shuffle(families);
    }

    var used = {};
    var phrases = shuffle(PHRASES);
    return families.map(function (fam, i) {
      var pool = fam.fonts.filter(function (f) { return !used[f.id]; });
      var font = pick(pool.length ? pool : fam.fonts);
      used[font.id] = true;
      var indexes = pickWeightIndexes(fam.fonts.length, fam.fonts.indexOf(font), difficulty);
      return {
        font: font,
        answer: font,
        note: '',
        phrase: phrases[i % phrases.length],
        hint: fill(MODES.weight.hint, { family: fam.title }),
        options: indexes.map(function (idx) { return fam.fonts[idx]; })
      };
    });
  }

  // ---------- 遊戲流程 ----------

  function startGame() {
    state.questions = currentMode().build(state.difficulty);
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
    els.paperHint.textContent = q.hint;
    els.feedback.textContent = '';
    els.feedback.className = 'feedback';
    els.nextBtn.hidden = true;
    setTimerBar(1);

    els.sample.className = 'sample hidden ' + q.font.id;
    els.sample.textContent = q.phrase;

    els.options.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.dataset.id = opt.id;
      btn.dataset.cls = opt.cls || opt.id;
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
      state.lastTick = Math.ceil(timeLimit());
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
    var limit = timeLimit() * 1000;
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
    var limit = timeLimit() * 1000;
    var elapsed = Math.min(performance.now() - state.questionStart, limit);
    var correct = chosenId === q.answer.id;
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
      answer: q.answer,
      note: q.note,
      phrase: q.phrase,
      chosen: chosenId ? q.options.filter(function (f) { return f.id === chosenId; })[0] : null,
      correct: correct,
      time: elapsed / 1000,
      gained: gained
    });

    // 揭曉：每個選項都換成自己的字體，順便認識一下長相
    Array.prototype.forEach.call(els.options.children, function (btn) {
      var id = btn.dataset.id;
      btn.disabled = true;
      btn.classList.add('reveal');
      btn.querySelector('.option-name').classList.add(btn.dataset.cls);
      if (id === q.answer.id) btn.classList.add('correct');
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
      els.feedback.textContent = (chosenId ? '可惜！' : '時間到！') + '正確答案是「' + q.answer.name + '」' + q.note;
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
    var mode = currentMode();
    var correctCount = state.history.filter(function (h) { return h.correct; }).length;
    var ratio = correctCount / TOTAL_ROUNDS;
    var rank = mode.ranks.filter(function (r) { return ratio >= r.min; })[0];
    var correctTimes = state.history.filter(function (h) { return h.correct; }).map(function (h) { return h.time; });
    var avg = correctTimes.length
      ? (correctTimes.reduce(function (a, b) { return a + b; }, 0) / correctTimes.length).toFixed(1)
      : '-';

    var best = loadBest();
    var modeBest = best[state.mode] || {};
    var isNewBest = !modeBest[state.difficulty] || state.score > modeBest[state.difficulty];
    if (isNewBest && state.score > 0) {
      modeBest[state.difficulty] = state.score;
      best[state.mode] = modeBest;
      saveBest(best);
    }

    els.resultMode.textContent = '【' + modeTag() + '】挑戰結束';
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
      name.textContent = h.answer.name;
      meta.appendChild(document.createTextNode(h.correct ? '✓ ' : '✗ '));
      meta.appendChild(name);
      meta.appendChild(document.createTextNode(h.note));
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
    var text = '我在「justfont 字體辨識大師」的【' + modeTag() + '】模式答對 ' +
      r.correct + '/' + TOTAL_ROUNDS + ' 題，拿下 ' + r.score + ' 分，獲得稱號「' + r.rank + '」！' + currentMode().shareTail;
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
    Array.prototype.forEach.call(els.modeCards, function (card) {
      card.addEventListener('click', function () {
        state.mode = card.dataset.mode;
        renderModeInfo();
      });
    });

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
  randomizeTitle();
  renderModeInfo();
  buildPreload();
  bindEvents();

  waitForFonts().then(function (ok) {
    els.app.classList.remove('is-loading');
    showScreen('start');
    if (!ok) toast('字型服務載入失敗，可能會以預設字型顯示');
  });
})();
