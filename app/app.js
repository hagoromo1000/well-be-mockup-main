// We'll Be ― 家族とAIがそばにいる通院支援アプリ モックアップ ロジック（音声対話・TTS読み上げ対応版）

const STORAGE_KEY = 'well_be_mockup_state_v4';

const MIC_SVG = `<svg viewBox="0 0 512 512" fill="var(--ai)"><path d="M383.788,206.98v51.113c-0.013,35.266-14.301,67.108-37.475,90.318 c-23.212,23.176-55.042,37.464-90.307,37.464c-35.267,0-67.108-14.288-90.32-37.464c-23.174-23.211-37.462-55.052-37.474-90.318 V206.98H90.503v51.113c0.036,84.93,64.21,154.935,146.649,164.337V512h37.709v-89.57c82.426-9.402,146.599-79.407,146.636-164.337 V206.98H383.788z"/><path d="M256.006,344.41c47.589,0,86.305-38.728,86.305-86.318V86.318C342.311,38.728,303.596,0,256.006,0 c-47.59,0-86.318,38.728-86.318,86.318v171.775C169.688,305.682,208.416,344.41,256.006,344.41z"/></svg>`;
const CHECK_SVG = `<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></svg>`;

// ==================== 絵文字の代わりに使う線画アイコン（AI感を減らすため） ====================
function _ic(path) {
  return `<svg class="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}
const ICONS = {
  mic: _ic('<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>'),
  speaker: _ic('<polygon points="4,9 8,9 12,5 12,19 8,15 4,15"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 7a7 7 0 0 1 0 10"/>'),
  mute: _ic('<polygon points="4,9 8,9 12,5 12,19 8,15 4,15"/><line x1="16" y1="9" x2="21" y2="14"/><line x1="21" y1="9" x2="16" y2="14"/>'),
  pill: _ic('<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><line x1="12" y1="7.5" x2="12" y2="16.5" transform="rotate(-45 12 12)"/>'),
  chat: _ic('<path d="M21 11.5a8.4 8.4 0 0 1-1.1 4.2L21 20l-4.3-1.1A8.5 8.5 0 1 1 21 11.5z"/>'),
  memo: _ic('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>'),
  calendar: _ic('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
  bag: _ic('<path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>'),
  bell: _ic('<path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
  sparkle: _ic('<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>'),
  warning: _ic('<path d="M12 3 2 20h20z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17" r="0.3" fill="currentColor"/>'),
  check: _ic('<polyline points="4,12 9,17 20,6"/>'),
  eye: _ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'),
  idea: _ic('<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a6 6 0 0 0-4 10.5c.6.5 1 1.2 1 2V15h6v-.5c0-.8.4-1.5 1-2A6 6 0 0 0 12 2z"/>'),
  ai: _ic('<rect x="5" y="7" width="14" height="12" rx="2"/><path d="M12 2v5"/><circle cx="9" cy="13" r="1.3" fill="currentColor"/><circle cx="15" cy="13" r="1.3" fill="currentColor"/><line x1="9" y1="17" x2="15" y2="17"/>'),
  gear: _ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  camera: _ic('<path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),
  lock: _ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  folder: _ic('<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>'),
  close: _ic('<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>'),
  refresh: _ic('<path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.5"/><path d="M20 20v-4.5h-4.5"/>'),
  sync: _ic('<path d="M4 9h13l-3-3"/><path d="M20 15H7l3 3"/>'),
  mail: _ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  user: _ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  family: _ic('<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M1 21a6 6 0 0 1 12 0"/><path d="M11 21a6 6 0 0 1 12 0"/>'),
  phone: _ic('<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
};
// 絵文字→アイコンの対応表（長い絵文字から先にマッチさせる）
const EMOJI_ICON_MAP = [
  ['👨‍👩‍👧', 'family'],
  ['🎙️', 'mic'], ['🎤', 'mic'],
  ['🔊', 'speaker'], ['🔇', 'mute'],
  ['💊', 'pill'],
  ['💬', 'chat'], ['💌', 'mail'],
  ['📝', 'memo'], ['📁', 'folder'],
  ['📅', 'calendar'],
  ['🎒', 'bag'],
  ['🔔', 'bell'],
  ['✨', 'sparkle'],
  ['⚠️', 'warning'],
  ['✅', 'check'],
  ['👀', 'eye'],
  ['💡', 'idea'],
  ['🤖', 'ai'],
  ['⚙️', 'gear'],
  ['📷', 'camera'],
  ['🔒', 'lock'],
  ['❌', 'close'],
  ['↺', 'refresh'], ['🔄', 'refresh'],
  ['⇄', 'sync'],
  ['👨', 'user'], ['👩', 'user'],
  ['📞', 'phone'],
];
// 文字列先頭の絵文字をアイコンSVGに差し替えて返す（残りの文字列はHTMLエスケープ済み）
function iconize(str) {
  if (!str) return '';
  for (const [emo, name] of EMOJI_ICON_MAP) {
    if (str.startsWith(emo)) {
      const rest = str.slice(emo.length).replace(/^\s+/, '');
      return `<span class="ic-wrap">${ICONS[name]}<span>${escapeHtml(rest)}</span></span>`;
    }
  }
  return escapeHtml(str);
}

function getDefaultState() {
  return {
    patientScreen: 'home',          // 左：患者本人スマホに表示中の画面
    familyScreen: 'family-dash',    // 右：見守り家族スマホに表示中の画面
    visibleRole: 'patient',         // 狭い画面で表示するスマホ
    homeSubTab: 'card',
    familyNotices: [
      { time: '前日 15:00', text: '📅 明日10月1日（木）9:30 内科の予約があります。' },
      { time: '前日 18:00', text: '🎒 まだ用意できていない持ち物があります（採血の検査結果の紙）。声かけをお願いします。' }
    ],
    ttsEnabled: true,
    voiceEngine: 'voicevox', // 'voicevox' | 'browser'
    voicevoxSpeaker: 20,     // 20: もち子さん（ノーマル）をデフォルトに
    ttsVoiceName: '',
    ttsRate: 0.95,
    ttsPitch: 1.0,
    familyRegistered: true,
    inviteCode: ['4', '7', '2', '9', '1', '5'],
    nightMedTaken: false,
    medChat: [
      { sender: 'ai', text: '夜のお薬の時間です。飲んだら「飲んだよ」と教えてくださいね。' },
      { sender: 'me', time: '20:02', text: '飲んだよ。そういえば今朝、ちょっとふらついた。' },
      { sender: 'ai', text: 'ふらつきも記録しました。次の診察で伝えられるようにしますね。', actionLabel: '📝 診察前のメモを見る', actionScreen: 'memo' }
    ],
    symptomChat: [
      { sender: 'me', time: '14:10', text: '今、胸がどきどきしてる' },
      { sender: 'ai', text: '14時10分から記録します。強い胸の痛みや息苦しさはありますか？' },
      { sender: 'me', time: '14:12', text: 'それはない。座ってたら急になった' },
      { sender: 'ai', text: '14時10分、座っているときに急に、と記録しました。' },
      { sender: 'me', time: '14:25', text: '今は収まってきた' }
    ],
    pendingSymptom: null, // マルチターン症状聞き取り用 { symptom, time, situation }
    latestRecSummary: {
      date: '9月23日（水）',
      timeRange: '14:10〜14:25　胸のどきどき',
      detail: '座っているときに急に／痛み・息苦しさなし'
    },
    memoSymptoms: [
      { id: 1, date: '9/12 朝', text: '立ち上がったときにふらついた（1回）' },
      { id: 2, date: '9/23', text: '14:10〜14:25 胸のどきどき。座っているときに急に。痛み・息苦しさなし' },
      { id: 3, date: 'お薬', text: '夜の分の飲み忘れ 2回' }
    ],
    memoQuestions: [
      '夜の薬を飲み忘れやすい。飲む時間を相談したい'
    ],
    checklist: [
      { id: 'ins', title: '保険証', note: '', checked: true },
      { id: 'paper', title: '採血の検査結果の紙', note: '前回の診察後に「次は検査結果の紙を持ってきてと言われた」と話した内容から登録', checked: false },
      { id: 'notebook', title: 'お薬手帳', note: '前回の診察後に「次はお薬手帳を忘れずに」と話した内容から登録', checked: true },
      { id: 'card', title: '診察券', note: '', checked: true }
    ],
    savedPhotoNote: false,
    omakaseEnabled: true,
    omakaseAlways: true,
    timelineStep: 3, // 0:朝受付, 1:9:05到着, 2:9:25採血済, 3:10:05まもなく診察, 4:会計・お薬完了
    familyMessages: [
      { time: '18:05', text: '明日の内科、気をつけて行ってきてね！検査結果の紙とお薬手帳も忘れずにね。' }
    ]
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return Object.assign(getDefaultState(), JSON.parse(raw));
    }
  } catch (e) {
    console.warn('localStorage load failed:', e);
  }
  return getDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore quota errors
  }
}

function resetDemoState() {
  stopAiSpeech();
  state = getDefaultState();
  saveState();
  dismissIncomingToast();
  closeCommonModal();
  closeDoctorLargeView();
  dismissFamToast();
  navigateTo('family-dash');
  navigateTo('home');
}

// ==================== AI音声読み上げ（TTS: Web Speech Synthesis 改良版） ====================
let availableVoices = [];

function updateAvailableVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}

if ('speechSynthesis' in window) {
  updateAvailableVoices();
  window.speechSynthesis.onvoiceschanged = updateAvailableVoices;
}

function getBestJapaneseVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const jpVoices = voices.filter(v => v.lang && (v.lang.includes('ja') || v.lang.includes('JP')));
  if (jpVoices.length === 0) return null;

  // ユーザーが明示的に選択した声がある場合
  if (state.ttsVoiceName) {
    const chosen = jpVoices.find(v => v.name === state.ttsVoiceName);
    if (chosen) return chosen;
  }

  // 音声の品質スコアリング（高音質なNatural/Neural/Online/Google音声を最優先、古いDesktop機械音声を排除）
  function scoreVoice(v) {
    const name = v.name.toLowerCase();
    let score = 0;
    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 100;
    if (name.includes('nanami')) score += 60;
    if (name.includes('google')) score += 50;
    if (name.includes('keita') || name.includes('aoi') || name.includes('shiori')) score += 40;
    if (name.includes('kyoko') || name.includes('otoya') || name.includes('siri')) score += 30;
    if (name.includes('ayumi')) score += 10;
    // 古いSAPIデスクトップ音声（Haruka Desktopなど機械的な声）は減点
    if (name.includes('desktop')) score -= 50;
    if (name.includes('haruka') && !name.includes('natural') && !name.includes('online')) score -= 40;
    if (name.includes('ichiro') && !name.includes('natural') && !name.includes('online')) score -= 40;
    return score;
  }

  jpVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return jpVoices[0];
}

function speakAiText(text, forceSpeak = false, callbacks) {
  if (!state.ttsEnabled && !forceSpeak) return;
  playVoice(text, { engine: state.voiceEngine, speaker: state.voicevoxSpeaker }, forceSpeak, callbacks);
}

// VOICEVOX→（失敗時）ブラウザ音声、の再生ロジック本体。
// settingsを明示的に渡すので、設定画面の「試聴」でも本番のstateを一切書き換えずに使える。
function playVoice(text, settings, forceSpeak, callbacks) {
  const onPrepare = callbacks && callbacks.onPrepare;
  const onStart = callbacks && callbacks.onStart;
  const onEnd = callbacks && callbacks.onEnd;
  const onFallback = callbacks && callbacks.onFallback;

  const engine = settings && settings.engine;
  const speaker = (settings && settings.speaker) || 20;

  // 1. VOICEVOX が有効な場合（デフォルト）
  if ((!engine || engine === 'voicevox') && typeof window.speakVoicevox === 'function') {
    setSpeakingIndicator(true);
    window.speakVoicevox(text, speaker, () => {
      setSpeakingIndicator(true);
      if (onStart) onStart();
    }, () => {
      setSpeakingIndicator(false);
      if (onEnd) onEnd();
    }, onPrepare).catch(err => {
      console.warn('VOICEVOX error, fallback to browser speech synthesis:', err);
      if (onFallback) onFallback();
      speakBrowserTts(text, forceSpeak, { onStart, onEnd });
    });
    return;
  }

  // 2. ブラウザ標準TTS
  speakBrowserTts(text, forceSpeak, { onStart, onEnd });
}

function speakBrowserTts(text, forceSpeak = false, callbacks) {
  const onStart = callbacks && callbacks.onStart;
  const onEnd = callbacks && callbacks.onEnd;
  if (!('speechSynthesis' in window)) {
    setSpeakingIndicator(false);
    if (onEnd) onEnd();
    return;
  }
  if (!state.ttsEnabled && !forceSpeak) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // 自然な発音・滑らかな抑揚のためのクリーンアップ
    let cleanText = String(text || '')
      .replace(/[⚠️📞🚑💊💬📝🎒📅👨‍👩‍👧📷✅💡🔄🤖💌👀📱⚙️✨]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/（.*?）/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/(\d{1,2}):(\d{2})/g, '$1時$2分')
      .replace(/119番/g, 'ひゃくじゅうきゅうばん')
      .replace(/…/g, '、')
      .replace(/~/g, '')
      .replace(/〜/g, '')
      .replace(/[「」『』]/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'ja-JP';
    utter.rate = state.ttsRate || 0.95; // 高齢者にも聞き取りやすい自然な速度
    utter.pitch = state.ttsPitch || 1.0;

    const jpVoice = getBestJapaneseVoice();
    if (jpVoice) utter.voice = jpVoice;

    utter.onstart = () => {
      setSpeakingIndicator(true);
      if (onStart) onStart();
    };
    utter.onend = () => {
      setSpeakingIndicator(false);
      if (onEnd) onEnd();
    };
    utter.onerror = () => {
      setSpeakingIndicator(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.warn('TTS error:', e);
    setSpeakingIndicator(false);
    if (onEnd) onEnd();
  }
}

function stopAiSpeech() {
  if (typeof window.stopVoicevox === 'function') {
    window.stopVoicevox();
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  setSpeakingIndicator(false);
}

function setSpeakingIndicator(isSpeaking) {
  const medBar = document.getElementById('medSpeakingBar');
  const symBar = document.getElementById('symptomSpeakingBar');
  if (medBar) medBar.style.display = isSpeaking ? 'flex' : 'none';
  if (symBar) symBar.style.display = isSpeaking ? 'flex' : 'none';
}

function toggleTtsEnabled() {
  state.ttsEnabled = !state.ttsEnabled;
  if (!state.ttsEnabled) {
    stopAiSpeech();
  }
  saveState();
  renderTtsButtons();
}

function renderTtsButtons() {
  document.querySelectorAll('.tts-toggle-btn').forEach(btn => {
    btn.innerHTML = state.ttsEnabled ? `${ICONS.speaker} 音声ON` : `${ICONS.mute} 音声OFF`;
    btn.style.opacity = state.ttsEnabled ? '1' : '0.75';
  });
}

// 画面ごとのメタ情報
const SCREEN_META = {
  'home': {
    role: 'patient',
    theme: 'orange',
    tab: 'home',
    time: '9:12',
    batt: '100',
    tag: '全体・ホーム（新設フッター搭載）',
    title: '① ホーム画面（診察券）',
    desc: '今のホーム画面に<b>「AIコンシェルジュに話しかける」ボタン</b>と、服薬サポート・体調記録・持ち物・見守り家族を追加。どの画面からでも下部フッターで1タップ移動できます。'
  },
  'med': {
    role: 'patient',
    theme: 'ai',
    tab: 'ai',
    time: '20:02',
    batt: '76',
    tag: '軸2：AI通院コンシェルジュ（音声対話・服薬）',
    title: '②-A 服薬サポート（AI音声対応）',
    desc: '薬を飲む時間にAIが<b>声で呼びかけ</b>、「飲んだよ」と話すだけで記録できます。下の入力欄やマイクから自由に話しかけると、AIが声で返答します。'
  },
  'symptom': {
    role: 'patient',
    theme: 'ai',
    tab: 'ai',
    time: '14:26',
    batt: '58',
    tag: '軸2：AI通院コンシェルジュ（音声対話・症状・操作支援）',
    title: '②-B AIコンシェルジュ（症状記録＆操作案内）',
    desc: '体調や症状、アプリの操作（「明日の受付をして」「持ち物は何？」など）を自由に話しかけられます。AIが<b>声で返答して記録・案内</b>し、危険ワード検知時は119番等を最優先案内します。'
  },
  'memo': {
    role: 'patient',
    theme: 'ai',
    tab: 'ai',
    time: '10:02',
    batt: '64',
    tag: '軸2：AI通院コンシェルジュ（診察支援）',
    title: '③ 診察前のメモ',
    desc: '受診の数日前に、<b>症状の記録と飲み忘れ回数</b>をAIが「前回から気になったこと」として自動要約します。「診察で先生に見せる（大きな文字で表示）」で言い忘れを防ぎます。'
  },
  'checklist': {
    role: 'patient',
    theme: 'orange',
    tab: 'home',
    time: '18:00',
    batt: '71',
    tag: '軸1 × 軸2：持ち物リマインド＆家族連携',
    title: '⑥ 持ち物チェック',
    desc: '「次回持ってくるもの」を数日前・前日・当日の朝にお知らせ。<b>用意できていなければ見守り家族にも通知</b>が届き、本人と家族の二重で忘れ物を防ぎます。'
  },
  'omakase': {
    role: 'patient',
    theme: 'orange',
    tab: 'home',
    time: '15:00',
    batt: '58',
    tag: '軸3：おまかせ受付（操作の壁へ）',
    title: '④ おまかせ受付（予約情報）',
    desc: '前日の予約通知に<b>「明日の受付をしておく」</b>スイッチを設置。1タップで当日は自動で受付が済み、次回からも毎回自動にできるため、当日朝の操作忘れがなくなります。'
  },
  'patient-family': {
    role: 'patient',
    theme: 'fam',
    tab: 'fam',
    time: '10:06',
    batt: '98',
    tag: '軸1：見守り家族（本人スマホ・家族一覧）',
    title: '⑤-C 見守り家族（本人スマホ）',
    desc: '連携している家族の一覧から選ぶと、<b>「見守る」「見守られる」をお互いに確認</b>できます。長女とは会話・共有が中心、長男は共有前の状態もあわせて見せています。'
  },
  'family-invite': {
    role: 'family',
    theme: 'fam',
    tab: 'fam',
    time: '21:40',
    batt: '88',
    tag: '軸1：見守り家族（登録の壁へ）',
    title: '⑤-A 家族の登録（家族のスマホ）',
    desc: '本人が来院時に同意して発行した<b>6桁の招待コード</b>を入れるだけで登録完了。離れて暮らす家族も、病院の窓口に同席せず自分のスマホから登録できます。'
  },
  'family-dash': {
    role: 'family',
    theme: 'fam',
    tab: 'fam',
    time: '10:05',
    batt: '90',
    tag: '軸1：見守り家族（リアルタイム共有）',
    title: '⑤-B 見守り家族（家族のスマホ）',
    desc: '離れて暮らす家族が、<b>親の通院の進み具合・持ち物・今週の服薬状況</b>を自分のスマホで確認できます。ひとことメッセージ送信や受付の代行も可能です。'
  }
};

// 画面遷移
// 画面遷移：画面IDの role に応じて「左：本人スマホ」か「右：家族スマホ」だけを切り替える
function navigateTo(screenId, options = {}) {
  closeWebview();
  if (!SCREEN_META[screenId]) screenId = 'home';
  const meta = SCREEN_META[screenId];
  const isFamily = meta.role === 'family';

  if (isFamily) {
    state.familyScreen = screenId;
  } else {
    state.patientScreen = screenId;
  }
  saveState();

  // 対象のスマホ内のビューだけを切り替え（もう一方のスマホはそのまま）
  const screenRoot = document.getElementById(isFamily ? 'familyScreen' : 'patientScreen');
  screenRoot.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`view-${screenId}`);
  if (targetView) targetView.classList.add('active');

  const examplePanel = document.getElementById('demoExamplePanel');
  if (examplePanel) examplePanel.style.display = (screenId === 'symptom') ? 'flex' : 'none';
  const medExamplePanel = document.getElementById('demoExamplePanelMed');
  if (medExamplePanel) medExamplePanel.style.display = (screenId === 'med') ? 'flex' : 'none';
  if (screenId === 'patient-family' && typeof backToFamilyList === 'function') backToFamilyList();

  if (isFamily) {
    document.getElementById('famStatusTime').textContent = meta.time;
    document.getElementById('famStatusBatt').textContent = meta.batt;
    const famTabBar = document.getElementById('famTabBar');
    if (famTabBar) famTabBar.className = 'tabbar' + (meta.theme === 'ai' ? ' bar-ai' : meta.theme === 'fam' ? ' bar-fam' : '');
    const famTabHome = document.getElementById('famTabHome');
    const famTabFam = document.getElementById('famTabFam');
    if (famTabHome) famTabHome.classList.toggle('active', screenId === 'family-dash');
    if (famTabFam) famTabFam.classList.toggle('active', screenId === 'family-invite');
  } else {
    const statusBar = document.getElementById('statusBar');
    statusBar.className = 'status' + (meta.theme === 'ai' ? ' ai' : meta.theme === 'fam' ? ' fam' : '');
    document.getElementById('statusTime').textContent = meta.time;
    document.getElementById('statusBatt').textContent = meta.batt;

    const tabBar = document.getElementById('bottomTabBar');
    tabBar.className = 'tabbar' + (meta.theme === 'ai' ? ' bar-ai' : meta.theme === 'fam' ? ' bar-fam' : '');
    document.getElementById('tabHome').classList.toggle('active', meta.tab === 'home');
    document.getElementById('tabAi').classList.toggle('active', meta.tab === 'ai');
    document.getElementById('tabFam').classList.toggle('active', meta.tab === 'fam');
  }

  // 画面ジャンプのセレクト
  const selectEl = document.getElementById('screenSelect');
  if (selectEl && selectEl.value !== screenId) {
    selectEl.value = screenId;
  }

  // 狭い画面（1台表示）のときは、操作したスマホ側を表示する
  if (!options.keepVisible) {
    setVisibleRole(meta.role);
  }

  // 中央ガイドパネル更新
  updateGuidePanel(meta);

  renderAll();
}

function updateGuidePanel(meta) {
  const guideTag = document.getElementById('guideAxisTag');
  if (!guideTag) return;
  const who = meta.role === 'family' ? '右：家族のスマホ ／ ' : '左：本人のスマホ ／ ';
  guideTag.textContent = who + meta.tag;
  guideTag.className = 'guide-tag' + (meta.theme === 'ai' ? ' ai' : meta.theme === 'fam' ? ' fam' : '');
  document.getElementById('guideTitle').textContent = meta.title;
  document.getElementById('guideDesc').innerHTML = meta.desc;
}

// 狭い画面用：どちらのスマホを表示するか
function setVisibleRole(role) {
  state.visibleRole = role;
  document.body.classList.toggle('show-patient', role === 'patient');
  document.body.classList.toggle('show-family', role === 'family');
  document.getElementById('modePatientBtn').classList.toggle('active', role === 'patient');
  document.getElementById('modeFamilyBtn').classList.toggle('active', role === 'family');
}

function switchRole(role) {
  setVisibleRole(role);
  saveState();
}

function switchHomeSubTab(tab) {
  state.homeSubTab = tab;
  saveState();
  document.getElementById('homeTabCard').classList.toggle('on', tab === 'card');
  document.getElementById('homeTabMsg').classList.toggle('on', tab === 'msg');
  document.getElementById('homeSubCard').style.display = tab === 'card' ? 'flex' : 'none';
  document.getElementById('homeSubMsg').style.display = tab === 'msg' ? 'flex' : 'none';
}

// ==================== 本人 ⇄ 家族 のスマホ間通知 ====================
let famToastTimer = null;

// 本人スマホでの出来事を、右の家族スマホに通知する
function notifyFamily(text, isDanger = false) {
  const nowStr = new Date().toTimeString().slice(0, 5);
  state.familyNotices.push({ time: nowStr, text, danger: isDanger });
  if (state.familyNotices.length > 8) state.familyNotices.shift();
  saveState();

  const toast = document.getElementById('famToast');
  const toastText = document.getElementById('famToastText');
  if (toast && toastText) {
    toastText.innerHTML = iconize(text);
    toast.classList.toggle('danger', isDanger);
    toast.style.display = 'block';
    clearTimeout(famToastTimer);
    famToastTimer = setTimeout(dismissFamToast, isDanger ? 12000 : 6000);
  }

  flashColumn('familyColumn');
  pulseSyncArrow('to-family');
  renderFamilyNotices();
}

function dismissFamToast() {
  const toast = document.getElementById('famToast');
  if (toast) toast.style.display = 'none';
}

function flashColumn(id) {
  const col = document.getElementById(id);
  if (!col) return;
  col.classList.remove('flash');
  void col.offsetWidth; // アニメーション再始動
  col.classList.add('flash');
}

function flashFamilyRow(id) {
  const row = document.getElementById(id);
  if (!row) return;
  row.classList.remove('updated');
  void row.offsetWidth;
  row.classList.add('updated');
}

function pulseSyncArrow(direction) {
  const el = document.getElementById('syncPulse');
  if (!el) return;
  el.classList.remove('pulse-to-family', 'pulse-to-patient');
  void el.offsetWidth;
  el.classList.add(direction === 'to-family' ? 'pulse-to-family' : 'pulse-to-patient');
  el.textContent = direction === 'to-family' ? '→' : '←';
  setTimeout(() => {
    el.classList.remove('pulse-to-family', 'pulse-to-patient');
    el.textContent = '⇄';
  }, 1400);
}

function renderFamilyNotices() {
  const listEl = document.getElementById('famNoticeList');
  if (!listEl) return;
  listEl.innerHTML = state.familyNotices.slice().reverse().slice(0, 5).map(n => `
    <div class="fam-notice-item ${n.danger ? 'danger' : ''}">
      <span class="t">${escapeHtml(n.time)}</span>${iconize(n.text)}
    </div>
  `).join('');
}

// 全体再描画
function renderAll() {
  renderTtsButtons();
  renderAiStatusButton();
  renderAiConnStatus();
  renderHomeMessages();
  renderMedScreen();
  renderSymptomScreen();
  renderMemoScreen();
  renderChecklistScreen();
  renderOmakaseScreen();
  renderPatientFamilyScreen();
  renderFamilyInviteScreen();
  renderFamilyDashScreen();
  renderFamilyNotices();
  renderSyncSidePanel();
}

// AIコンシェルジュの接続状態（管理者・一般どちらの閲覧者にも表示）
// window.lastGeminiStatus: null(未試行) | 'ok' | 'error'
function renderAiConnStatus() {
  const hasKey = typeof window.getGeminiApiKey === 'function' && Boolean(window.getGeminiApiKey());
  const status = window.lastGeminiStatus || null;

  let cls = 'pending';
  let text = 'AI接続：未設定（ルールベースで応答中）';
  if (hasKey) {
    if (status === 'ok') {
      cls = 'ok';
      text = 'AI接続：Gemini正常応答中';
    } else if (status === 'error') {
      cls = 'error';
      text = 'AI接続：Gemini応答エラー（ルールベースに切替中）';
    } else {
      cls = 'pending';
      text = 'AI接続：Gemini設定済み（応答待ち）';
    }
  }

  const el = document.getElementById('aiConnStatusHeader');
  if (el) {
    el.innerHTML = `<span class="dot"></span>${text}`;
    el.className = `ai-conn-status ${cls}`;
  }
}

// AI設定ボタンの状態更新（接続中／未設定）
function renderAiStatusButton() {
  const btn = document.getElementById('aiConfigBtn');
  const label = document.getElementById('aiConfigLabel');
  if (!btn || !label) return;

  const hasKey = typeof window.getGeminiApiKey === 'function' && Boolean(window.getGeminiApiKey());
  if (hasKey) {
    btn.classList.add('active');
    label.innerHTML = `${ICONS.sparkle} Gemini接続中`;
  } else {
    btn.classList.remove('active');
    label.innerHTML = `${ICONS.gear} AI設定`;
  }
}

// AI吹き出しHTML生成（🔊読み上げボタン＋画面遷移アクションボタン付き）
function renderChatBubble(m, idx, listName) {
  if (m.thinking) {
    return `
      <div class="msg ai thinking">
        <span class="who"><span>AIコンシェルジュ</span></span>
        <div class="thinking-dots">考え中<span>.</span><span>.</span><span>.</span></div>
      </div>
    `;
  }
  if (m.sender === 'ai') {
    const encodedText = encodeURIComponent(m.text || '');
    const actionBtn = m.actionScreen && m.actionLabel
      ? `<div><button type="button" class="ai-action-btn" onclick="navigateTo('${escapeHtml(m.actionScreen)}')">${iconize(m.actionLabel)}</button></div>`
      : '';
    return `
      <div class="msg ai">
        <span class="who">
          <span>AIコンシェルジュ</span>
          <button type="button" class="speak-msg-btn" onclick="speakAiText(decodeURIComponent('${encodedText}'), true)" title="音声で読み上げる">${ICONS.speaker} 聞く</button>
        </span>
        <div>${escapeHtml(m.text)}</div>
        ${actionBtn}
      </div>
    `;
  } else {
    return `
      <div class="msgrow">
        <span class="meta">${MIC_SVG}<span>${escapeHtml(m.time || '20:02')}</span></span>
        <div class="msg me">${escapeHtml(m.text)}</div>
      </div>
    `;
  }
}

// ① ホーム画面のメッセージ＆家族バナー描画
function renderHomeMessages() {
  const badge = document.getElementById('homeMsgBadge');
  const totalMsgs = 2 + state.familyMessages.length;
  if (badge) badge.textContent = totalMsgs;

  const banner = document.getElementById('homeFamilyBanner');
  const bannerText = document.getElementById('homeFamilyBannerText');
  if (state.familyMessages.length > 0) {
    const latest = state.familyMessages[state.familyMessages.length - 1];
    banner.style.display = 'flex';
    bannerText.textContent = `「${latest.text}」`;
  } else {
    banner.style.display = 'none';
  }

  const listEl = document.getElementById('homeMsgFamilyList');
  if (listEl) {
    listEl.innerHTML = state.familyMessages.slice().reverse().map(m => `
      <div class="card msg-item fam" style="margin-bottom:5px;" onclick="openFamilyMemberWatched('musume')">
        <div class="msg-item-head">
          <span class="pill p1">見守り家族（娘）</span>
          <span class="muted">${escapeHtml(m.time)}</span>
        </div>
        <h4>ひとことメッセージが届いています</h4>
        <div style="font-weight:700;color:var(--family);margin-top:2px;">「${escapeHtml(m.text)}」</div>
      </div>
    `).join('');
  }
}

// ==================== ② AIコンシェルジュ 対話エンジン ====================
const DANGER_KEYWORDS = ['強い痛み', '強く痛', '息苦し', 'くるしい', '意識', '動けない', '激しい胸', '胸が痛'];
const SYMPTOM_KEYWORDS = [
  'どきどき', 'ドキドキ', 'ふらつ', 'めまい', '立ちくらみ', '頭が痛', '頭痛', '胃が', 'お腹', '吐き気', '吐いた',
  'しびれ', 'だるい', '熱', '咳', '息切れ', '息苦し', '眠れない', 'むくみ', '痛い', '調子が悪', '気持ち悪',
  '疲れた', 'しんどい', '苦しい', '動悸', '血が出', '倒れ', '飲みすぎ', '飲み過ぎ', 'オーバードーズ', 'OD', '食欲がない',
  '食欲ない', '不安', '眠い', 'かゆい', '腫れ', '発疹', '下痢', '便秘', '血圧'
];

function containsDangerKeyword(text) {
  return DANGER_KEYWORDS.some(k => text.includes(k));
}

function containsSymptomKeyword(text) {
  return SYMPTOM_KEYWORDS.some(k => text.includes(k));
}

// 「あー」「うー」「ヤッホー」のような、記録する意味のない掛け声・感嘆詞だけの発話を判定
function isMeaninglessUtterance(text) {
  const normalized = text
    .replace(/[!！?？。、,\.\s]/g, '')
    .replace(/ー+/g, 'ー');
  if (!normalized) return true;
  // 母音・感嘆詞の繰り返しだけ（あー、うー、おー、えー 等）
  if (/^[あいうえおんー]+$/.test(normalized)) return true;
  // 定型の掛け声・挨拶的フィラー
  const fillers = ['ヤッホー', 'やっほー', 'おーい', 'よいしょ', 'うんしょ', 'どっこいしょ', 'あはは', 'ふふふ', 'えへへ'];
  if (fillers.some(f => normalized.includes(f))) return true;
  return false;
}

// ユーザーの発話に対するAIコンシェルジュの返答生成＆状態連動（Gemini API ＋ ルールベースフォールバック）
async function processAiConversation(userText, mode) {
  const text = userText.trim();
  const nowStr = new Date().toTimeString().slice(0, 5);
  const chatList = mode === 'med' ? state.medChat : state.symptomChat;

  chatList.push({ sender: 'me', time: nowStr, text });
  saveState();
  renderAll();
  scrollToBottom(mode === 'med' ? 'medBody' : 'symptomBody');

  const alertCard = document.getElementById('dangerAlertCard');
  if (alertCard) alertCard.classList.remove('highlight-danger');

  // Gemini APIの利用可否を判定
  const hasGemini = typeof window.callGeminiApi === 'function' &&
                    (!window.CONFIG || window.CONFIG.USE_GEMINI) &&
                    typeof window.getGeminiApiKey === 'function' &&
                    Boolean(window.getGeminiApiKey());

  let geminiResult = null;

  if (hasGemini) {
    const thinkingMsg = { sender: 'ai', text: '考え中…', thinking: true };
    chatList.push(thinkingMsg);
    renderAll();
    scrollToBottom(mode === 'med' ? 'medBody' : 'symptomBody');

    try {
      const history = chatList.filter(c => !c.thinking);
      geminiResult = await window.callGeminiApi(text, history);
      window.lastGeminiStatus = 'ok';
    } catch (err) {
      console.warn('Gemini API call failed, falling back to rule engine:', err);
      window.lastGeminiStatus = 'error';
    } finally {
      renderAiConnStatus();
      const thinkIdx = chatList.indexOf(thinkingMsg);
      if (thinkIdx !== -1) chatList.splice(thinkIdx, 1);
    }
  }

  let reply = '';
  let actionLabel = '';
  let actionScreen = '';
  let famNotice = '';        // 右の家族スマホへ送る通知
  let famNoticeDanger = false;
  let famRow = '';           // 家族スマホで光らせる行

  if (geminiResult) {
    // ==================== Gemini API 返答連動 ====================
    reply = geminiResult.reply;
    actionLabel = geminiResult.actionLabel || '';
    actionScreen = geminiResult.actionScreen || '';
    famNotice = geminiResult.familyNotify || '';
    famNoticeDanger = Boolean(geminiResult.danger);

    if (geminiResult.danger) {
      if (alertCard) alertCard.classList.add('highlight-danger');
      if (!famNotice) {
        famNotice = `⚠️ お父さんが「${text}」とAIに話しました。AIが病院・119番への連絡を案内しています。すぐに連絡を取ってください。`;
      }
    }

    if (geminiResult.action === 'take_med' || geminiResult.action === 'take_med_and_symptom') {
      state.nightMedTaken = true;
      famRow = 'famMedRow';
      if (!famNotice) {
        famNotice = '💊 お父さんが夜のお薬を飲みました。';
      }
    }

    if (geminiResult.action === 'omakase_guide' || text.includes('受付')) {
      state.omakaseEnabled = true;
    }

    if (geminiResult.symptomSummary) {
      const exists = state.memoSymptoms.some(s => s.text.includes(geminiResult.symptomSummary));
      if (!exists) {
        state.memoSymptoms.splice(1, 0, {
          id: Date.now(),
          date: '本日',
          text: `${geminiResult.symptomSummary}（AI対話から記録）`
        });
      }
      state.latestRecSummary = {
        date: '本日（AI記録）',
        timeRange: `${nowStr}　${geminiResult.symptomSummary}`,
        detail: 'AIコンシェルジュとの会話から自動要約'
      };
      if (!actionLabel) {
        actionLabel = '📝 診察前のメモを見る';
        actionScreen = 'memo';
      }
    }

    if (geminiResult.memoQuestion) {
      if (!state.memoQuestions.includes(geminiResult.memoQuestion)) {
        state.memoQuestions.push(geminiResult.memoQuestion);
      }
      if (!actionLabel) {
        actionLabel = '📝 診察前のメモを確認する';
        actionScreen = 'memo';
      }
    }
  } else {
    // ==================== ルールベース・フォールバック ====================
    // 1. 危険キーワード検知（最優先・ルールベース）
    if (containsDangerKeyword(text)) {
      reply = '強い胸の痛みや息苦しさがある場合は、記録より先にすぐ病院へ電話するか、119番へ連絡してください！下の赤いボタンからすぐに発信できます。';
      if (alertCard) alertCard.classList.add('highlight-danger');
      state.pendingSymptom = null;
      famNotice = `⚠️ お父さんが「${text}」とAIに話しました。AIが病院・119番への連絡を案内しています。すぐに連絡を取ってください。`;
      famNoticeDanger = true;
    }
  // 2. 服薬完了＋体調の同時発話（例：「飲んだよ。そういえば今朝、ちょっとふらついた。」）
  else if ((text.includes('飲んだ') || text.includes('のんだ') || text.includes('服用')) && containsSymptomKeyword(text)) {
    state.nightMedTaken = true;
    reply = '夜のお薬の服用と、体調の記録の両方を残しました。次の診察で先生に伝えられるよう「診察前のメモ」にまとめておきますね。';
    actionLabel = '📝 診察前のメモを見る';
    actionScreen = 'memo';
    famNotice = '💊 お父さんが夜のお薬を飲みました。体調の記録も追加されています（本人が共有を選択）。';
    famRow = 'famMedRow';

    const exists = state.memoSymptoms.some(s => s.text.includes(text));
    if (!exists) {
      state.memoSymptoms.splice(1, 0, {
        id: Date.now(),
        date: '本日',
        text: `${text}（服薬確認時の会話から記録）`
      });
    }
  }
  // 3. 服薬完了の発話（例：「飲んだよ」「夜の分飲んだ」）
  else if (text.includes('飲んだ') || text.includes('のんだ') || text.includes('飲みました')) {
    state.nightMedTaken = true;
    reply = '夜のお薬の服用を記録しました！今日のお薬はすべてバッチリですね。変わった体調などはありませんか？';
    famNotice = '💊 お父さんが夜のお薬を飲みました（今日の分はすべて服用済み）。';
    famRow = 'famMedRow';
  }
  // 4. 薬の飲み忘れ相談（例：「飲み忘れやすい」「飲み忘れた」）
  else if (text.includes('飲み忘れ') || text.includes('忘れる')) {
    reply = '夜のお薬が飲み忘れやすいのですね。次回の診察で先生に飲む時間帯を相談できるよう、「診察前のメモ」の質問リストに残しておきました。';
    if (!state.memoQuestions.some(q => q.includes('飲み忘れ'))) {
      state.memoQuestions.push('夜の薬を飲み忘れやすい。飲む時間を相談したい');
    }
    actionLabel = '📝 診察前のメモを確認する';
    actionScreen = 'memo';
  }
  // 5. おまかせ受付・予約操作サポート（例：「明日の受付をして」「受付お願い」）
  else if (text.includes('受付') || text.includes('おまかせ')) {
    state.omakaseEnabled = true;
    reply = '明日の「おまかせ受付」をオンに設定しました！当日の朝に自動で受付が完了し、ご家族にも通知が届きますのでご安心ください。';
    actionLabel = '📅 予約情報・おまかせ受付を見る';
    actionScreen = 'omakase';
    famNotice = '✅ お父さんが明日の受付を「おまかせ受付」に設定しました。当日の朝に自動で受付されます。';
  }
  // 6. 持ち物の確認（例：「明日の持ち物は何？」「何持っていけばいい？」）
  else if (text.includes('持ち物') || text.includes('持っていく') || text.includes('準備')) {
    const unchecked = state.checklist.filter(i => !i.checked).map(i => i.title);
    if (unchecked.length === 0) {
      reply = '明日の持ち物（保険証・採血の検査結果の紙・お薬手帳・診察券）は、すべて準備完了になっています！';
    } else {
      reply = `明日は内科の受診です。まだ「${unchecked.join('・')}」にチェックが入っていません。カバンに入れたら教えてくださいね。`;
    }
    actionLabel = '🎒 持ち物チェック画面を開く';
    actionScreen = 'checklist';
  }
  // 7. 診察前のメモ確認（例：「メモを見せて」「先生に何を話すんだっけ」）
  else if (text.includes('メモ') || text.includes('先生')) {
    reply = `現在、前回からの症状や服薬の記録が${state.memoSymptoms.length}件まとまっています。診察室で先生にそのまま見せられる大文字画面も開けますよ。`;
    actionLabel = '📝 診察前のメモを開く';
    actionScreen = 'memo';
  }
  // 8. 家族・見守りについて（例：「家族」「娘に連絡」）
  else if (text.includes('家族') || text.includes('見守り') || text.includes('娘')) {
    reply = '見守り家族には、おまかせ受付の状況や持ち物の準備状況が自動で共有されています。見守り家族の画面を確認しますか？';
    actionLabel = '👨‍👩‍👧 見守り家族画面を見る';
    actionScreen = 'family-dash';
  }
  // 9. 院内案内・フロアマップ・会計などの質問
  else if (text.includes('どこ') || text.includes('何階') || text.includes('採血') || text.includes('会計') || text.includes('場所')) {
    reply = '明日の流れをご案内しますね。まず1階の総合受付で保険証を確認し、次に1階の採血室へ進みます。そのあと2階の内科外来へお越しください。順番が近づいたら「まもなくコール」でお知らせします。';
  }
  // 10. マルチターン症状記録：おさまった報告（「今は収まってきた」「おさまった」「治った」など）
  // ※11番より先に判定しないと、聞き取り中はずっと状況説明として処理されてしまうため、ここで先に判定する
  else if (state.pendingSymptom && (text.includes('収まって') || text.includes('おさまっ') || text.includes('落ち着いた') || text.includes('治った') || text.includes('大丈夫'))) {
    const symName = state.pendingSymptom ? state.pendingSymptom.symptom : '胸のどきどき';
    const startTime = state.pendingSymptom ? state.pendingSymptom.time : '14:10';
    const sitText = state.pendingSymptom && state.pendingSymptom.situation
      ? state.pendingSymptom.situation
      : '座っているときに急に／痛み・息苦しさなし';

    state.latestRecSummary = {
      date: '本日（記録完了）',
      timeRange: `${startTime}〜${nowStr}　${symName}`,
      detail: `${sitText}`
    };

    const memoEntry = `${startTime}〜${nowStr} ${symName}（${sitText}）`;
    if (!state.memoSymptoms.some(s => s.text === memoEntry)) {
      state.memoSymptoms.push({
        id: Date.now(),
        date: '本日',
        text: memoEntry
      });
    }
    state.pendingSymptom = null;
    reply = `おさまってよかったです。「${startTime}〜${nowStr} ${symName}」として記録し、診察前のメモにも追加しました。`;
    actionLabel = '📝 診察前のメモを見る';
    actionScreen = 'memo';
    famNotice = `📝 お父さんの体調記録が追加されました：${startTime}〜${nowStr} ${symName}（現在はおさまっています）`;
  }
  // 11. マルチターン症状記録：状況の返答
  // 症状を聞き取り中（pendingSymptomあり）で、上の「おさまった」報告に当てはまらない場合は、
  // 決め打ちキーワードに関わらず、意味のある発言を基本的に「状況の説明」として受け取り対話を続ける。
  else if (state.pendingSymptom && !isMeaninglessUtterance(text)) {
    state.pendingSymptom.situation = text;
    reply = `${state.pendingSymptom.time}から、「${text}」という状況ですね。記録しました。今はおさまっていますか？おさまったら教えてくださいね。`;
  }
  // 12. 新しい症状の申告（「胸がどきどきしてる」「頭が痛い」「めまいがする」など）
  else if (containsSymptomKeyword(text)) {
    state.pendingSymptom = {
      symptom: text,
      time: nowStr,
      situation: ''
    };
    state.latestRecSummary = {
      date: '本日（記録中）',
      timeRange: `${nowStr}〜　${text}`,
      detail: '状況を聞き取り中'
    };
    reply = `${nowStr}から「${text}」ですね、記録します。強い胸の痛みや息苦しさはありますか？また、何をしていたときになりましたか？`;
  }
  // 13. あいさつ
  else if (text.includes('こんにちは') || text.includes('おはよう') || text.includes('こんばんは')) {
    reply = 'こんにちは、近大太郎さん！いつもそばにいるAIコンシェルジュです。お薬の記録や体調のメモ、明日の受付や持ち物の確認など、なんでも気軽にお話しくださいね。';
  }
  // 14. お礼
  else if (text.includes('ありがとう') || text.includes('助かる') || text.includes('感謝')) {
    reply = 'どういたしまして！いつでもそばにいますので、気になることがあればまた声をかけてくださいね。';
  }
  // 15. 調子・雑談（日常会話サポート）
  else if (text.includes('元気') || text.includes('調子はどう') || text.includes('調子どう') || text.includes('天気') || text.includes('暇') || text.includes('ひま') || text.includes('雑談') || text.includes('おしゃべり') || text.includes('世間話')) {
    reply = 'お話できて嬉しいです。何か気になることがあれば、体調のことでもそれ以外の世間話でも、いつでも話しかけてくださいね。';
  }
  // 16. 別れの挨拶
  else if (text.includes('またね') || text.includes('さようなら') || text.includes('バイバイ') || text.includes('じゃあね') || text.includes('おやすみ')) {
    reply = 'はい、また何かあればいつでも呼んでくださいね。お大事にどうぞ。';
  }
  // 17. アプリの操作サポート（使い方が分からない時の案内）
  else if (text.includes('使い方') || text.includes('やり方') || text.includes('操作') || text.includes('わからない') || text.includes('分からない') || text.includes('困った') || text.includes('どうやって') || text.includes('設定')) {
    if (text.includes('持ち物') || text.includes('荷物') || text.includes('忘れ物')) {
      reply = '持ち物の確認でしたら、持ち物チェック画面でご案内できます。こちらから開けますよ。';
      actionLabel = '🎒 持ち物チェック画面を開く';
      actionScreen = 'checklist';
    } else if (text.includes('受付') || text.includes('予約')) {
      reply = '明日の受付のことでしたら、おまかせ受付の画面でご案内できます。こちらから開けますよ。';
      actionLabel = '📅 予約情報・おまかせ受付を見る';
      actionScreen = 'omakase';
    } else if (text.includes('見守り') || text.includes('家族') || text.includes('招待')) {
      reply = '見守り家族の登録や様子の確認でしたら、見守り家族の画面でご案内できます。こちらから開けますよ。';
      actionLabel = '👨‍👩‍👧 見守り家族画面を見る';
      actionScreen = 'family-dash';
    } else if (text.includes('メモ') || text.includes('記録')) {
      reply = '診察前のメモの確認でしたら、メモ画面でご案内できます。こちらから開けますよ。';
      actionLabel = '📝 診察前のメモを見る';
      actionScreen = 'memo';
    } else {
      reply = '画面下の「ホーム」「コンシェルジュ」「見守り家族」のボタンでいつでも移動できます。どの画面を開きたいか教えていただければ、私がそこへご案内しますね。';
      actionLabel = 'ホームに戻る';
      actionScreen = 'home';
    }
  }
  else if (isMeaninglessUtterance(text)) {
    // 「あー」「うー」「ヤッホー」などの意味のない発話・掛け声は記録しない
    reply = 'お呼びですか？お薬のことや体調のこと、明日の受付や持ち物など、何でも話しかけてくださいね。';
  }
  // 体調・症状に関するキーワードを含む、または本人が明示的に記録を求めた場合のみ記録する
  else if (containsSymptomKeyword(text) || text.includes('記録して') || text.includes('メモして')) {
    state.memoSymptoms.push({
      id: Date.now(),
      date: '本日',
      text: `${nowStr} ${text}`
    });
    state.latestRecSummary = {
      date: '本日（会話記録）',
      timeRange: `${nowStr}　${text}`,
      detail: 'AIコンシェルジュとの会話から自動記録'
    };
    reply = `「${text}」ですね。${nowStr}の記録として診察前のメモに残しました。ほかにも気になることや、先生に聞いておきたいことはありますか？`;
    actionLabel = '📝 診察前のメモを見る';
    actionScreen = 'memo';
  } else {
    // それ以外の雑談・自由な発言は記録せず、聞き役として自然に応答する
    reply = 'そうなんですね。お話を聞かせてくださってありがとうございます。体調のことや困りごとがあれば、いつでも遠慮なく話しかけてくださいね。';
  }
  } // end of rule-based fallback else

  // Geminiに接続しようとして失敗した場合、応答の質がルールベースに急に落ちて
  // 周りの人が「おかしくなった？」と困惑しないよう、一言だけ自然な言い訳を添える
  if (hasGemini && !geminiResult) {
    reply = `少し考えるのに時間がかかってしまいました。${reply}`;
  }

  chatList.push({
    sender: 'ai',
    text: reply,
    actionLabel: actionLabel || undefined,
    actionScreen: actionScreen || undefined
  });

  saveState();
  renderAll();
  scrollToBottom(mode === 'med' ? 'medBody' : 'symptomBody');
  speakAiText(reply);

  if (famNotice) {
    notifyFamily(famNotice, famNoticeDanger);
    if (famRow) flashFamilyRow(famRow);
  }
}

// ②-A 服薬サポート描画・操作
function renderMedScreen() {
  const dot = document.getElementById('nightMedDot');
  const st = document.getElementById('nightMedStatus');
  const btn = document.getElementById('btnTakeNightMed');

  if (state.nightMedTaken) {
    dot.className = 'dot on';
    dot.innerHTML = `<svg width="9" height="7" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></svg>`;
    st.className = 'st done';
    st.textContent = '飲んだ';
    btn.textContent = '記録済み（タップで戻す）';
  } else {
    dot.className = 'dot off';
    dot.innerHTML = '';
    st.className = 'st wait';
    st.textContent = '今の時間です';
    btn.textContent = '飲んだ';
  }

  const chatEl = document.getElementById('medChatList');
  chatEl.innerHTML = state.medChat.map((m, i) => renderChatBubble(m, i, 'med')).join('');
}

function markNightMedTaken(fromVoice) {
  if (!fromVoice && state.nightMedTaken) {
    state.nightMedTaken = false;
    saveState();
    renderAll();
    return;
  }
  processAiConversation('夜の薬を飲んだよ', 'med');
}

function triggerMedVoice(phrase) {
  processAiConversation(phrase, 'med');
}

function submitMedFreeChat() {
  const input = document.getElementById('medChatInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  input.value = '';
  processAiConversation(val, 'med');
}

function remindLaterMed() {
  const msg = 'わかりました。30分後にまたお薬のお声がけをしますね。';
  state.medChat.push({ sender: 'ai', text: msg });
  saveState();
  renderAll();
  scrollToBottom('medBody');
  speakAiText(msg);
}

// ②-B 症状記録＆自由対話
function renderSymptomScreen() {
  const chatEl = document.getElementById('symptomChatList');
  chatEl.innerHTML = state.symptomChat.map((m, i) => renderChatBubble(m, i, 'symptom')).join('');

  const recEl = document.getElementById('latestSymptomRec');
  if (recEl && state.latestRecSummary) {
    recEl.innerHTML = `<b>記録しました</b>　${escapeHtml(state.latestRecSummary.date)}<br>${escapeHtml(state.latestRecSummary.timeRange)}<br>${escapeHtml(state.latestRecSummary.detail)}`;
  }
}

function sendSymptomPreset(type) {
  if (type === 'doki') {
    state.pendingSymptom = { symptom: '胸のどきどき', time: '14:10', situation: '' };
    processAiConversation('今、胸がどきどきしてる', 'symptom');
  } else if (type === 'sit') {
    if (!state.pendingSymptom) {
      state.pendingSymptom = { symptom: '胸のどきどき', time: '14:10', situation: '' };
    }
    processAiConversation('それはない。座ってたら急になった', 'symptom');
  } else if (type === 'calm') {
    processAiConversation('今は収まってきた', 'symptom');
  } else if (type === 'danger') {
    processAiConversation('胸が強く痛んで息苦しい', 'symptom');
  }
}

function handleUserSymptomSpeech(text) {
  processAiConversation(text, 'symptom');
}

function submitSymptomFreeChat() {
  const input = document.getElementById('symptomChatInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  input.value = '';
  processAiConversation(val, 'symptom');
}

// ブラウザ音声認識（Web Speech API）＋フォールバックモーダル
let activeRecognitionMode = 'symptom';

function startVoiceRecognition(mode = 'symptom') {
  activeRecognitionMode = mode;
  stopAiSpeech();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = mode === 'med' ? document.getElementById('medMicBtn') : document.getElementById('micRecordBtn');
  const fullBtn = document.getElementById('micFullBtn');
  const label = document.getElementById('micRecordLabel');

  if (SpeechRecognition) {
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (micBtn) micBtn.classList.add('recording');
      if (fullBtn) fullBtn.classList.add('recording');
      if (label) label.textContent = '聞いています…お話ください';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (micBtn) micBtn.classList.remove('recording');
        if (fullBtn) fullBtn.classList.remove('recording');
        if (label) label.textContent = '声で話しかける';
        if (transcript) {
          processAiConversation(transcript, activeRecognitionMode);
        }
      };

      recognition.onerror = () => {
        if (micBtn) micBtn.classList.remove('recording');
        if (fullBtn) fullBtn.classList.remove('recording');
        if (label) label.textContent = '声で話しかける';
        openVoiceFallbackModal(activeRecognitionMode);
      };

      recognition.onend = () => {
        if (micBtn) micBtn.classList.remove('recording');
        if (fullBtn) fullBtn.classList.remove('recording');
        if (label) label.textContent = '声で話しかける';
      };

      recognition.start();
      return;
    } catch (e) {
      // Fallback below
    }
  }
  openVoiceFallbackModal(mode);
}

function openVoiceFallbackModal(mode = 'symptom') {
  activeRecognitionMode = mode;
  const html = `
    <h4 style="color:var(--ai);">${ICONS.mic} AIコンシェルジュと会話する</h4>
    <p class="muted" style="margin-bottom:6px;">話したい内容を入力するか、下のフレーズを選ぶとAIが<b>音声付きで返答</b>します。</p>
    <input type="text" id="voiceModalInput" placeholder="例：薬飲んだよ／頭が痛い／明日の持ち物は？" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px;font-size:10.5px;margin-bottom:6px;">
    <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px;">
      <button type="button" class="chip-btn" onclick="document.getElementById('voiceModalInput').value='階段を上ったときに少し息切れがした'">「階段を上ったときに少し息切れがした」</button>
      <button type="button" class="chip-btn" onclick="document.getElementById('voiceModalInput').value='明日の受付をしておいて'">「明日の受付をしておいて」</button>
      <button type="button" class="chip-btn" onclick="document.getElementById('voiceModalInput').value='明日の持ち物は何だっけ？'">「明日の持ち物は何だっけ？」</button>
      <button type="button" class="chip-btn danger" onclick="document.getElementById('voiceModalInput').value='胸が強く痛んで息苦しい'">${ICONS.warning}「胸が強く痛んで息苦しい」（危険検知テスト）</button>
    </div>
    <div style="display:flex;gap:6px;">
      <div class="btn out ai" style="flex:1;" onclick="closeCommonModal()">キャンセル</div>
      <div class="btn ai" style="flex:1;" onclick="submitVoiceModalInput()">話す（AIが返答）</div>
    </div>
  `;
  showCommonModal(html);
}

function submitVoiceModalInput() {
  const input = document.getElementById('voiceModalInput');
  const val = input ? input.value.trim() : '';
  closeCommonModal();
  if (val) {
    processAiConversation(val, activeRecognitionMode);
  }
}

function showEmergencyCall(targetName) {
  const html = `
    <h4 style="color:#C62828;">${ICONS.phone} 緊急連絡の発信確認（デモ）</h4>
    <p style="margin-bottom:8px;line-height:1.5;">
      <b>${escapeHtml(targetName)}</b> へ電話を発信します。<br>
      <span class="muted">※AIは診断を行わず、強い痛み・息苦しさ等の危険キーワード検知時は記録より先に緊急連絡を案内します。</span>
    </p>
    <div class="btn" style="background:#E05252;color:#fff;" onclick="closeCommonModal()">閉じる</div>
  `;
  showCommonModal(html);
}

// ③ 診察前のメモ描画
function renderMemoScreen() {
  const symEl = document.getElementById('memoSymptomList');
  if (symEl) {
    symEl.innerHTML = state.memoSymptoms.map(item => `
      <div class="memo-li">
        <span class="d">${escapeHtml(item.date)}</span>
        <span style="flex:1;">${escapeHtml(item.text)}</span>
      </div>
    `).join('');
  }

  const qEl = document.getElementById('memoQuestionList');
  if (qEl) {
    qEl.innerHTML = state.memoQuestions.map((q, idx) => `
      <div style="padding:3px 0;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;gap:4px;">
        <span>・${escapeHtml(q)}</span>
        <button type="button" onclick="removeMemoQuestion(${idx})" style="border:none;background:none;color:#999;font-size:10px;cursor:pointer;" title="削除">×</button>
      </div>
    `).join('');
  }
}

function removeMemoQuestion(idx) {
  state.memoQuestions.splice(idx, 1);
  saveState();
  renderAll();
}

function openAddQuestionModal() {
  const html = `
    <h4 style="color:var(--ai);">＋ 先生に聞きたいことを追加</h4>
    <p class="muted" style="margin-bottom:6px;">診察時に聞き忘れないよう、話してメモに残せます（修正も可能）。</p>
    <input type="text" id="memoQInput" placeholder="先生に聞きたいことを入力" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px;font-size:10.5px;margin-bottom:6px;">
    <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px;">
      <button type="button" class="chip-btn" onclick="document.getElementById('memoQInput').value='朝に立ちくらみがすることがあるので相談したい'">${ICONS.mic}「朝に立ちくらみがすることがあるので相談したい」</button>
      <button type="button" class="chip-btn" onclick="document.getElementById('memoQInput').value='次回の採血結果がいつ出るか確認したい'">${ICONS.mic}「次回の採血結果がいつ出るか確認したい」</button>
    </div>
    <div style="display:flex;gap:6px;">
      <div class="btn out ai" style="flex:1;" onclick="closeCommonModal()">キャンセル</div>
      <div class="btn ai" style="flex:1;" onclick="submitMemoQuestion()">追加する</div>
    </div>
  `;
  showCommonModal(html);
}

function submitMemoQuestion() {
  const input = document.getElementById('memoQInput');
  const val = input ? input.value.trim() : '';
  closeCommonModal();
  if (val) {
    state.memoQuestions.push(val);
    saveState();
    renderAll();
    speakAiText(`「${val}」を先生に聞きたいことに追加しました。`);
  }
}

function openDoctorLargeView() {
  const symEl = document.getElementById('doctorLargeSymptoms');
  const qEl = document.getElementById('doctorLargeQuestions');

  symEl.innerHTML = state.memoSymptoms.map(s => `
    <div class="doctor-large-item">
      <div style="color:var(--ai);font-size:11px;">${escapeHtml(s.date)}</div>
      <div>${escapeHtml(s.text)}</div>
    </div>
  `).join('');

  qEl.innerHTML = state.memoQuestions.map(q => `
    <div class="doctor-large-item">${escapeHtml(q)}</div>
  `).join('');

  document.getElementById('doctorLargeModal').style.display = 'flex';
}

function closeDoctorLargeView() {
  const modal = document.getElementById('doctorLargeModal');
  if (modal) modal.style.display = 'none';
}

// ⑥ 持ち物チェック描画
function renderChecklistScreen() {
  const container = document.getElementById('checklistContainer');
  if (!container) return;

  container.innerHTML = state.checklist.map((item, idx) => `
    <div class="chk ${!item.checked ? 'warn' : ''}" onclick="toggleChecklistItem(${idx})">
      <div class="box ${item.checked ? 'on' : ''}">
        ${item.checked ? CHECK_SVG : ''}
      </div>
      <div>
        <div style="${!item.checked ? 'font-weight:700;' : ''}">${escapeHtml(item.title)}</div>
        ${item.note ? `<span class="muted">${escapeHtml(item.note)}</span>` : ''}
      </div>
    </div>
  `).join('') + (state.savedPhotoNote ? `
    <div style="margin-top:5px;padding:4px 6px;background:var(--orange-l);border-radius:5px;font-size:9px;color:var(--orange-d);font-weight:700;">
      ${ICONS.camera} 検査結果の紙の写真（スマホ保存済み）
    </div>
  ` : '');

  const unchecked = state.checklist.filter(i => !i.checked).map(i => i.title);
  const preview = document.getElementById('checklistFamilyPreview');
  if (preview) {
    if (unchecked.length === 0) {
      preview.innerHTML = `<b>見守り家族</b>　18:05<br>お父さんの明日の受診の持ち物は<b>すべて用意できました</b>（カバンに入れました）。`;
    } else {
      preview.innerHTML = `<b>見守り家族</b>　18:00<br>お父さんの明日の受診で、まだ用意できていない持ち物があります（<b>${escapeHtml(unchecked.join('・'))}</b>）。声かけをお願いします。`;
    }
  }
}

function toggleChecklistItem(idx) {
  state.checklist[idx].checked = !state.checklist[idx].checked;
  saveState();
  renderAll();
  const uncheckedCount = state.checklist.filter(i => !i.checked).length;
  if (uncheckedCount === 0) {
    notifyFamily('🎒 持ち物がすべて揃いました。');
  } else {
    notifyFamily(`🎒 持ち物チェックが更新されました（残り未準備 ${uncheckedCount}点）`);
  }
}

function markAllItemsReady() {
  state.checklist.forEach(item => { item.checked = true; });
  saveState();
  renderAll();
  notifyFamily('🎒 持ち物がすべて準備完了になりました。');
  speakAiText('明日の持ち物がすべて揃いましたね。ご家族にも用意できたことをお知らせしました。');
}

function openPhotoSaveModal() {
  state.savedPhotoNote = true;
  const paperItem = state.checklist.find(i => i.id === 'paper');
  if (paperItem) paperItem.checked = true;
  saveState();
  renderAll();
  notifyFamily('📷 採血の検査結果の紙を写真で保存しました。');

  const html = `
    <h4 style="color:var(--orange-d);">${ICONS.camera} 検査結果の紙を写真で保存しました</h4>
    <p style="margin-bottom:8px;line-height:1.5;">
      当日もし紙が見当たらなくても、アプリ内に保存した写真データを診察室で先生にお見せできます。<br>
      <span class="muted">（「採血の検査結果の紙」をチェック済みに更新しました）</span>
    </p>
    <div class="btn pri" onclick="closeCommonModal()">OK</div>
  `;
  showCommonModal(html);
}

// ④ おまかせ受付描画
function renderOmakaseScreen() {
  const box = document.getElementById('omakaseBox');
  const toggle = document.getElementById('omakaseToggle');
  const alwaysBox = document.getElementById('omakaseAlwaysBox');
  const desc = document.getElementById('omakaseDesc');

  if (state.omakaseEnabled) {
    box.classList.remove('off-mode');
    toggle.classList.remove('off');
    desc.innerHTML = `当日は<b>自動で受付</b>します。家族にもお知らせします。`;
  } else {
    box.classList.add('off-mode');
    toggle.classList.add('off');
    desc.innerHTML = `<span class="muted">現在オフです。オンにすると当日の朝に自動で受付が完了します。</span>`;
  }

  if (state.omakaseAlways) {
    alwaysBox.className = 'box on';
    alwaysBox.innerHTML = `<svg width="8" height="6" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></svg>`;
  } else {
    alwaysBox.className = 'box';
    alwaysBox.innerHTML = '';
  }
}

function toggleOmakase() {
  state.omakaseEnabled = !state.omakaseEnabled;
  saveState();
  renderAll();
  if (state.omakaseEnabled) {
    notifyFamily('🤖 明日の自動受付がオンになりました。');
    speakAiText('明日の自動受付をオンにしました。当日の朝に自動で受付いたします。');
  } else {
    notifyFamily('⚠️ 明日の自動受付がオフになりました。');
  }
}

function toggleOmakaseAlways() {
  state.omakaseAlways = !state.omakaseAlways;
  saveState();
  renderAll();
}

// ⑤-C 患者側：見守り家族画面（メッセージ・共有確認）
// 本人と家族が「お互いに見守り合える」仕組みのデモ。
// 「長女」は双方向のデータを用意し、「長男」は未共有の状態を見せるための切り替えだけ実装。
const FAMILY_MEMBERS = {
  musume: { name: '長女（美咲さん）', shortName: '美咲さん', relation: '長女', shared: true },
  musuko: { name: '長男（健太さん）', shortName: '健太さん', relation: '長男', shared: false }
};
let selectedFamilyMember = null;

function renderFamilyMemberList() {
  const listEl = document.getElementById('famMemberList');
  if (!listEl) return;
  listEl.innerHTML = Object.keys(FAMILY_MEMBERS).map(id => {
    const m = FAMILY_MEMBERS[id];
    // 「見守る」方向（本人が相手を見る）は今回のデモでは全員分未実装のため、
    // sharedがtrueの相手も「見守り合い」ではなく「見守られ中」（相手が本人を見ている）と表示する
    const statusLabel = m.shared ? '見守られ中' : '未共有';
    const statusClass = m.shared ? 'on' : 'off';
    return `
      <div class="fam-member-row" onclick="showFamilyMemberDetail('${id}')">
        <span class="fam-member-row-icon">${ICONS.user}</span>
        <div class="fam-member-row-info">
          <div class="fam-member-row-name">${escapeHtml(m.name)}</div>
          <div class="fam-member-row-status ${statusClass}">${statusLabel}</div>
        </div>
        <span class="fam-member-row-arrow">›</span>
      </div>
    `;
  }).join('');
}

let selectedFamilyDirection = null; // null | 'watching' | 'watched'

function showFamilyMemberDetail(memberId) {
  if (!FAMILY_MEMBERS[memberId]) return;
  selectedFamilyMember = memberId;
  selectedFamilyDirection = null;
  document.getElementById('famListView').style.display = 'none';
  document.getElementById('famDetailView').style.display = '';
  renderFamilyMemberDetail();
}

function backToFamilyList() {
  selectedFamilyMember = null;
  selectedFamilyDirection = null;
  document.getElementById('famDetailView').style.display = 'none';
  document.getElementById('famListView').style.display = '';
}

function backToFamilyChoice() {
  selectedFamilyDirection = null;
  document.getElementById('famContentView').style.display = 'none';
  document.getElementById('famChoiceView').style.display = '';
}

// 見守る／見守られる の大きなボタンを押したときの内容表示
// 「見守る」側（本人が相手の様子を見る）は今回デモでは未実装のため、
// 長女であっても常に「共有していません」の表示にする
function notSharedPlaceholderHtml(who) {
  return `
    <div style="text-align:center;padding:14px 4px;">
      <svg class="ic" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px;"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <div style="font-weight:700;font-size:10.5px;color:#475569;">${escapeHtml(who)}はあなたに共有していません</div>
      <div style="font-size:8.5px;color:var(--sub);margin-top:4px;line-height:1.5;">共有を始めるには、招待コードの発行からお願いします。</div>
    </div>
  `;
}

function showFamilyDirection(direction) {
  if (!selectedFamilyMember) return;
  selectedFamilyDirection = direction;
  document.getElementById('famChoiceView').style.display = 'none';
  document.getElementById('famContentView').style.display = '';
  renderFamilyContent();
}

// ホーム画面の「家族からのひとこと」通知など、特定の家族の「見守られる」ページへ直接ジャンプしたい場合に使う
function openFamilyMemberWatched(memberId) {
  navigateTo('patient-family');
  showFamilyMemberDetail(memberId);
  showFamilyDirection('watched');
}

function renderFamilyContent() {
  if (!selectedFamilyMember || !selectedFamilyDirection) return;
  const member = FAMILY_MEMBERS[selectedFamilyMember];
  const titleEl = document.getElementById('famContentTitle');
  const bodyEl = document.getElementById('famContentBody');

  if (selectedFamilyDirection === 'watching') {
    // 「見守る」側は今回のデモでは未実装のため、常に共有していません表示
    titleEl.innerHTML = `${ICONS.user} ${member.relation}さんを見守る`;
    bodyEl.innerHTML = notSharedPlaceholderHtml(member.shortName);
    return;
  }

  // 「見守られる」側
  titleEl.innerHTML = `${ICONS.user} ${member.relation}さんに見守られる`;

  if (!member.shared) {
    bodyEl.innerHTML = notSharedPlaceholderHtml(member.shortName);
    return;
  }

  const msgs = state.familyMessages || [];
  const chatHtml = msgs.length === 0
    ? `<div class="muted" style="text-align:center;padding:10px 0;font-size:9.5px;">まだメッセージはありません</div>`
    : msgs.map(m => {
        const isMe = m.sender === 'me';
        const encoded = encodeURIComponent(m.text || '');
        return `
          <div class="msg fam ${isMe ? 'me' : 'in'}">
            <div class="who"><span>${isMe ? '太郎さん' : '娘さん'}</span><span class="time">${escapeHtml(m.time)}</span></div>
            <div>${escapeHtml(m.text)}</div>
            ${isMe ? '' : `<button type="button" class="speak-msg-btn" style="margin-top:4px;" onclick="speakAiText(decodeURIComponent('${encoded}'), true)">${ICONS.speaker} 声で聞く</button>`}
          </div>
        `;
      }).join('');

  bodyEl.innerHTML = `
    <div style="font-size:9px;font-weight:700;color:var(--sub);margin-bottom:4px;">娘さんとのやりとり</div>
    <div class="chat fam-chat" id="famChatThread" style="margin-bottom:8px;">${chatHtml}</div>

    <form class="chat-input-bar fam" onsubmit="event.preventDefault(); submitFamilyChatInput();">
      <input type="text" id="famChatInput" placeholder="娘さんに返信する（自由入力）" autocomplete="off">
      <button type="submit" class="chat-send-btn fam">送信</button>
    </form>

    <div class="chips-label fam" style="margin-top:6px;">返信の候補：</div>
    <div class="chip-list">
      <button type="button" class="chip-btn fam" onclick="replyToFamily('ありがとう！気をつけて病院向かうね')">「ありがとう！気をつけて病院向かうね」</button>
      <button type="button" class="chip-btn fam" onclick="replyToFamily('薬はちゃんと飲んだよ、安心してね')">「薬はちゃんと飲んだよ、安心してね」</button>
      <button type="button" class="chip-btn fam" onclick="replyToFamily('いま内科の前に着いたよ')">「いま内科の前に着いたよ」</button>
    </div>

    <div style="font-size:9px;font-weight:700;color:var(--sub);margin:10px 0 4px;">現在共有している項目</div>
    <div class="fam-share-row">
      <span>今日の予約・通院の進み具合</span>
      <span class="fam-share-tag">共有中</span>
    </div>
    <div class="fam-share-row">
      <span>持ち物チェックの準備状況</span>
      <span class="fam-share-tag">共有中</span>
    </div>
    <div class="fam-share-row">
      <span>夜のお薬の服用記録</span>
      <span class="fam-share-tag">共有中</span>
    </div>
    <div class="fam-share-row">
      <span>診察前メモ（本人が共有選択）</span>
      <span class="fam-share-tag">共有中</span>
    </div>
  `;
}

function renderFamilyMemberDetail() {
  if (!selectedFamilyMember) return;
  const member = FAMILY_MEMBERS[selectedFamilyMember];

  document.getElementById('famMemberNameTitle').innerHTML = `${ICONS.user} ${escapeHtml(member.name)}`;
  document.getElementById('famMemberShortLabel').textContent = member.shortName;
  document.getElementById('famDirBtnWatchingLabel').textContent = `${member.relation}さんを見守る`;
  document.getElementById('famDirBtnWatchingSub').textContent = `${member.shortName}はあなたに共有していません`;
  document.getElementById('famDirBtnWatchedLabel').textContent = `${member.relation}さんに見守られる`;

  document.getElementById('famChoiceView').style.display = '';
  document.getElementById('famContentView').style.display = 'none';

  if (selectedFamilyDirection) renderFamilyContent();
}

function renderPatientFamilyScreen() {
  if (!document.getElementById('famMemberList')) return;
  renderFamilyMemberList();
  if (selectedFamilyMember) {
    if (selectedFamilyDirection) renderFamilyContent();
    else renderFamilyMemberDetail();
  }
}

function replyToFamily(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return;
  const now = new Date();
  const nowStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  state.familyMessages.push({ time: nowStr, text: trimmed, sender: 'me' });
  saveState();
  notifyFamily(`お父さんからお返事: 「${trimmed}」`);
  speakAiText(`娘さんに「${trimmed}」とお返事を送りました。`);
  if (selectedFamilyMember && selectedFamilyDirection === 'watched') renderFamilyContent();
}

function submitFamilyChatInput() {
  const input = document.getElementById('famChatInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  input.value = '';
  replyToFamily(val);
}

// ⑤-A 見守り家族 招待コード画面
function renderFamilyInviteScreen() {
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById(`code${i}`);
    if (el) el.textContent = state.inviteCode[i] || '';
  }
}

function clearInviteCode() {
  state.inviteCode = ['', '', '', '', '', ''];
  saveState();
  renderFamilyInviteScreen();
}

function fillSampleInviteCode() {
  state.inviteCode = ['4', '7', '2', '9', '1', '5'];
  saveState();
  renderFamilyInviteScreen();
}

function completeFamilyRegistration() {
  if (state.inviteCode.join('').length < 6) {
    fillSampleInviteCode();
  }
  state.familyRegistered = true;
  saveState();
  navigateTo('family-dash');
}

// ⑤-B 見守り家族 ダッシュボード描画
function renderFamilyDashScreen() {
  const tlEl = document.getElementById('familyTimeline');
  if (tlEl) {
    const step0Label = state.omakaseEnabled
      ? '受付済み（おまかせ受付）'
      : `未受付 <button type="button" onclick="familyProxyCheckIn()" style="border:none;background:var(--family);color:#fff;font-size:8.5px;font-weight:700;padding:2px 6px;border-radius:8px;margin-left:4px;cursor:pointer;">代わりに受付する</button>`;

    const steps = [
      { tm: '朝', label: step0Label },
      { tm: '9:05', label: '病院に到着' },
      { tm: '9:25', label: '採血が終わりました' },
      { tm: '10:05', label: '内科　まもなく診察です' },
      { tm: '10:35', label: '会計・お薬（完了）' }
    ];

    tlEl.innerHTML = steps.map((s, idx) => {
      let cls = 'tli';
      if (idx === state.timelineStep) cls += ' now';
      else if (idx > state.timelineStep) cls += ' todo';

      const content = idx === state.timelineStep
        ? `<span class="st">${s.label}</span>`
        : s.label;

      return `<div class="${cls}"><span class="tm">${idx > state.timelineStep && idx === 4 ? '' : s.tm}</span>${content}</div>`;
    }).join('');
  }

  // 持ち物ステータス連動
  const famItems = document.getElementById('famItemsStatus');
  const unchecked = state.checklist.filter(i => !i.checked).map(i => i.title);
  if (famItems) {
    if (unchecked.length === 0) {
      famItems.textContent = 'すべて用意できました';
      famItems.style.color = 'var(--ai)';
    } else {
      famItems.textContent = `未準備あり（${unchecked[0]}）`;
      famItems.style.color = 'var(--family)';
    }
  }

  // 今週のお薬ステータス連動
  const famMed = document.getElementById('famMedStatus');
  if (famMed) {
    if (state.nightMedTaken) {
      famMed.textContent = '今日の分すべて服用済（今週の飲み忘れ 1回）';
      famMed.style.color = 'var(--ai)';
    } else {
      famMed.textContent = '飲み忘れ 1回（夜の薬：今の時間です）';
      famMed.style.color = 'var(--family)';
    }
  }
}

function familyProxyCheckIn() {
  state.omakaseEnabled = true;
  saveState();
  renderAll();
}

function advanceTimelineStep() {
  state.timelineStep = (state.timelineStep + 1) % 5;
  saveState();
  renderAll();
}

// 家族から「ひとことメッセージを送る」モーダル
function openSendFamilyMsgModal() {
  const html = `
    <h4 style="color:var(--family);">${ICONS.mail} お父さんへひとことメッセージを送る</h4>
    <p class="muted" style="margin-bottom:6px;">送ったメッセージは、お父さん（近大 太郎さん）のホーム画面にすぐ届きます。</p>
    <input type="text" id="famMsgInput" placeholder="ひとことメッセージを入力" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px;font-size:10.5px;margin-bottom:6px;" value="気をつけて行ってきてね！検査結果の紙、持った？">
    <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px;">
      <button type="button" class="chip-btn" style="border-color:var(--family);background:var(--family-l);color:var(--family);" onclick="document.getElementById('famMsgInput').value='気をつけて行ってきてね！検査結果の紙、持った？'">「気をつけて行ってきてね！検査結果の紙、持った？」</button>
      <button type="button" class="chip-btn" style="border-color:var(--family);background:var(--family-l);color:var(--family);" onclick="document.getElementById('famMsgInput').value='夜のお薬、飲む時間だよ〜！'">「夜のお薬、飲む時間だよ〜！」</button>
      <button type="button" class="chip-btn" style="border-color:var(--family);background:var(--family-l);color:var(--family);" onclick="document.getElementById('famMsgInput').value='もうすぐ診察だね。先生にメモ見せてね！'">「もうすぐ診察だね。先生にメモ見せてね！」</button>
    </div>
    <div style="display:flex;gap:6px;">
      <div class="btn out" style="flex:1;border-color:var(--family);color:var(--family);background:var(--family-l);" onclick="closeFamModal()">キャンセル</div>
      <div class="btn fam" style="flex:1;" onclick="sendFamilyMessage()">送る（本人画面で確認）</div>
    </div>
  `;
  showFamModal(html);
}

function sendFamilyMessage() {
  const input = document.getElementById('famMsgInput');
  const text = input ? input.value.trim() : '';
  closeFamModal();
  if (!text) return;

  const nowStr = new Date().toTimeString().slice(0, 5);
  state.familyMessages.push({ time: nowStr, text });
  saveState();
  renderAll();

  // 患者スマホにメッセージ通知トーストを表示＆左スマホを光らせる
  pulseSyncArrow('to-patient');
  flashColumn('patientColumn');
  const toast = document.getElementById('incomingToast');
  const toastText = document.getElementById('incomingToastText');
  if (toast && toastText) {
    toastText.textContent = `「${text}」`;
    toast.style.display = 'block';
  }
  flashFamilyRow('famRowMsg');
  speakAiText(`見守り家族からメッセージが届きました。「${text}」`);
}

function dismissIncomingToast() {
  const toast = document.getElementById('incomingToast');
  if (toast) toast.style.display = 'none';
}

function openPatientFamilyModal() {
  const html = `
    <h4 style="color:var(--family);">${ICONS.family} 見守り家族の設定・招待コード</h4>
    <p style="margin-bottom:6px;line-height:1.45;">
      来院時に窓口で同意して発行された招待コードです。家族のスマホで入力すると見守り連携ができます。
    </p>
    <div style="background:var(--family-l);border:1.5px solid var(--family);border-radius:8px;padding:8px;text-align:center;margin-bottom:8px;">
      <div class="muted">招待コード（有効期限：24時間・1回使い切り）</div>
      <div style="font-size:18px;font-weight:800;color:var(--family);letter-spacing:4px;margin:2px 0;">472915</div>
      <div class="muted">現在の連携状況：長女（登録済み）</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <div class="btn fam" onclick="closeCommonModal();openFamilyMemberWatched('musume');">${ICONS.chat} 届いたメッセージ一覧を見る</div>
      <div class="btn out" style="border-color:var(--family);color:var(--family);background:var(--family-l);" onclick="closeCommonModal();navigateTo('family-dash');">${ICONS.eye} 家族のスマホ（見守り画面）を見る</div>
      <div class="btn out" onclick="closeCommonModal()">閉じる</div>
    </div>
  `;
  showCommonModal(html);
}

// PC横のリアルタイム連動ステータスパネル更新
function renderSyncSidePanel() {
  const omakaseEl = document.getElementById('syncOmakase');
  const nightMedEl = document.getElementById('syncNightMed');
  const itemsEl = document.getElementById('syncItems');
  const memoCountEl = document.getElementById('syncMemoCount');

  if (omakaseEl) {
    omakaseEl.textContent = state.omakaseEnabled ? 'ON（自動受付済）' : 'OFF（未受付）';
    omakaseEl.style.color = state.omakaseEnabled ? 'var(--orange-d)' : '#94a3b8';
  }
  if (nightMedEl) {
    nightMedEl.innerHTML = state.nightMedTaken ? `服用済み（${ICONS.check}飲んだ）` : '未服用（今の時間です）';
    nightMedEl.style.color = state.nightMedTaken ? 'var(--ai)' : 'var(--orange-d)';
  }
  if (itemsEl) {
    const uncheckedCount = state.checklist.filter(i => !i.checked).length;
    itemsEl.innerHTML = uncheckedCount === 0 ? `すべて準備完了（${ICONS.check}）` : `未完了（残り${uncheckedCount}点）`;
    itemsEl.style.color = uncheckedCount === 0 ? 'var(--ai)' : 'var(--family)';
  }
  if (memoCountEl) {
    memoCountEl.textContent = `${state.memoSymptoms.length}件（質問 ${state.memoQuestions.length}件）`;
  }
}

// 汎用モーダル表示
function showInfoModal(title, message) {
  const html = `
    <h4 style="color:var(--orange-d);">${escapeHtml(title)}</h4>
    <p style="margin-bottom:10px;line-height:1.55;">${escapeHtml(message)}</p>
    <div class="btn pri" onclick="closeCommonModal()">閉じる</div>
  `;
  showCommonModal(html);
}

function showPageModal(innerHtml) {
  const modal = document.getElementById('pageModal');
  const content = document.getElementById('pageModalContent');
  if (modal && content) {
    content.innerHTML = innerHtml;
    modal.style.display = 'flex';
  }
}

function closePageModal() {
  const modal = document.getElementById('pageModal');
  if (modal) modal.style.display = 'none';
}

function showCommonModal(innerHtml) {
  const modal = document.getElementById('commonModal');
  const content = document.getElementById('commonModalContent');
  if (modal && content) {
    content.innerHTML = innerHtml;
    modal.style.display = 'flex';
  }
}

function closeCommonModal() {
  const modal = document.getElementById('commonModal');
  if (modal) modal.style.display = 'none';
  const famModal = document.getElementById('famCommonModal');
  if (famModal) famModal.style.display = 'none';
}

// 外部サイトをアプリ内に埋め込み表示（Webview）
function openWebview(title, url) {
  const modal = document.getElementById('webviewModal');
  const frame = document.getElementById('webviewFrame');
  const titleEl = document.getElementById('webviewTitle');
  const fallback = document.getElementById('webviewFallbackLink');
  if (!modal || !frame) return;
  if (titleEl) titleEl.textContent = title;
  if (fallback) fallback.href = url;
  frame.src = url;
  modal.style.display = 'flex';
}

function closeWebview() {
  const modal = document.getElementById('webviewModal');
  const frame = document.getElementById('webviewFrame');
  if (modal) modal.style.display = 'none';
  if (frame) frame.src = 'about:blank';
}

// 家族スマホの「コンシェルジュ」タブ：本人専用機能のため案内のみ表示
function showFamilyAiNotice() {
  const html = `
    <h4 style="color:var(--family);">${ICONS.mic} AIコンシェルジュについて</h4>
    <p style="margin-bottom:8px;line-height:1.55;">
      AIコンシェルジュは、どなたでも使える想定の機能です。<br>
      ただし、このモックアップでは会話記録の実装がご本人のスマホ側のみのため、見守り家族のこの画面からは進めません。
    </p>
    <div class="btn fam" onclick="closeFamModal()">閉じる</div>
  `;
  showFamModal(html);
}

// 家族スマホ用モーダル
function showFamModal(innerHtml) {
  const modal = document.getElementById('famCommonModal');
  const content = document.getElementById('famCommonModalContent');
  if (modal && content) {
    content.innerHTML = innerHtml;
    modal.style.display = 'flex';
  }
}

function closeFamModal() {
  const modal = document.getElementById('famCommonModal');
  if (modal) modal.style.display = 'none';
}

// ==================== Gemini API & 音声設定モーダル ====================
function openAiConfigModal() {
  if (!checkAdminAuth()) return;

  const currentKey = typeof window.getGeminiApiKey === 'function' ? window.getGeminiApiKey() : '';
  const isConnected = Boolean(currentKey);

  const html = `
    <h4 style="color:var(--ai);">${ICONS.gear} Gemini API設定（管理者用）</h4>
    <div class="ai-status-card ${isConnected ? 'active' : ''}" id="modalAiStatusCard">
      <span class="status-dot ${isConnected ? 'on' : ''}"></span>${isConnected ? 'Gemini 3.8 Flash 接続中' : 'APIキー未設定（ルールベース応答で動作中）'}
    </div>
    <p class="muted" style="margin-bottom:14px;line-height:1.6;">
      Google AI StudioのAPIキーを入力すると、Gemini 3.8 Flashと連携します。未設定の場合はルールベースの応答で動作します。
    </p>

    <div style="font-weight:700;margin-bottom:6px;">Gemini APIキー</div>
    <div class="ai-key-input-row">
      <input type="password" id="modalApiKeyInput" placeholder="AIzaSy... から始まるキーを入力" value="${escapeHtml(currentKey)}">
      <button type="button" class="btn out" onclick="toggleApiKeyVisibility()">表示</button>
    </div>
    <div id="modalTestResult" style="font-size:12px;min-height:18px;margin-bottom:10px;font-weight:700;"></div>

    <div style="display:flex;gap:8px;margin-bottom:14px;">
      <button type="button" class="btn pri" style="flex:2;" onclick="saveAndTestModalApiKey()">接続テストして保存</button>
      <button type="button" class="btn out" style="flex:1;" onclick="clearModalApiKey()">消去</button>
    </div>

    <div style="border-top:1px solid #e2e8f0;padding-top:10px;">
      <div class="muted" style="font-size:11.5px;line-height:1.6;">
        設定はこの端末のブラウザ内にのみ保存されます。<br>
        プロンプト文面は <code>prompt.js</code> で調整できます。
      </div>
    </div>
    <div style="margin-top:14px;">
      <div class="btn out" onclick="closePageModal()">閉じる</div>
    </div>
  `;
  showPageModal(html);
}

// コンシェルジュの声の設定（誰でも開ける公開モーダル。Geminiキーは含まない）
// 「試聴」は voiceDraft（下書き）だけを操作し、本番のstateには触れない。
// 「この声に決定」ボタンを押した時だけ state に確定・保存される。
let voiceDraft = null;

const VOICEVOX_SPEAKER_LABELS = {
  20: '落ち着いた女性の声',
  74: 'クールで聞き取りやすい声',
  52: 'さわやかな青年の声',
  21: '力強く頼れる声',
  11: '明るく元気な男性の声',
  10: 'やわらかく優しい声',
  16: '親しみやすい女性の声',
  51: '威厳のある男性の声'
};

function getCurrentVoiceLabel() {
  if (!state.voiceEngine || state.voiceEngine === 'voicevox') {
    return VOICEVOX_SPEAKER_LABELS[state.voicevoxSpeaker || 20] || '標準の声';
  }
  return state.ttsVoiceName ? `ブラウザ音声（${state.ttsVoiceName}）` : '端末の標準ブラウザ音声';
}

function openVoiceConfigModal() {
  voiceDraft = {
    engine: state.voiceEngine || 'voicevox',
    speaker: state.voicevoxSpeaker || 20,
    browserVoice: state.ttsVoiceName || '',
    rate: state.ttsRate || 0.95,
    pitch: state.ttsPitch || 1.0
  };
  renderVoiceConfigModal();
}

function renderVoiceConfigModal() {
  const allVoices = ('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : [];
  const jpVoices = allVoices.filter(v => v.lang && (v.lang.includes('ja') || v.lang.includes('JP')));
  const bestVoice = getBestJapaneseVoice();
  const currentVoiceName = voiceDraft.browserVoice || (bestVoice ? bestVoice.name : '');

  const voiceOptions = jpVoices.length > 0
    ? jpVoices.map(v => {
        const isRec = v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Nanami');
        const badge = isRec ? ' ★推奨(自然)' : (v.name.includes('Desktop') ? '（機械的）' : '');
        const isSelected = v.name === currentVoiceName ? 'selected' : '';
        return `<option value="${escapeHtml(v.name)}" ${isSelected}>${escapeHtml(v.name)}${badge}</option>`;
      }).join('')
    : '<option value="">端末の標準日本語音声</option>';

  const isDirty = voiceDraft.engine !== (state.voiceEngine || 'voicevox')
    || voiceDraft.speaker !== (state.voicevoxSpeaker || 20)
    || voiceDraft.browserVoice !== (state.ttsVoiceName || '')
    || voiceDraft.rate !== (state.ttsRate || 0.95)
    || voiceDraft.pitch !== (state.ttsPitch || 1.0);

  const html = `
    <h4 style="color:var(--ai);">${ICONS.mic} AIコンシェルジュの声の設定</h4>

    <div class="voice-status-line ${isDirty ? 'pending' : 'decided'}">
      ${isDirty ? 'まだ声が決定されていません（試聴中）' : `現在の声は「${getCurrentVoiceLabel()}」です`}
    </div>

    <div style="display:flex;gap:8px;margin-bottom:14px;">
      <button type="button" class="btn ${(!voiceDraft.engine || voiceDraft.engine === 'voicevox') ? 'pri' : 'out'}" style="flex:1;" onclick="switchVoiceEngine('voicevox')">
        VOICEVOX
      </button>
      <button type="button" class="btn ${voiceDraft.engine === 'browser' ? 'pri' : 'out'}" style="flex:1;" onclick="switchVoiceEngine('browser')">
        標準ブラウザ音声
      </button>
    </div>

    <div id="voicevoxConfigArea" style="display:${(!voiceDraft.engine || voiceDraft.engine === 'voicevox') ? 'block' : 'none'};">
      <div style="font-weight:700;margin-bottom:6px;">キャラクター・話者を選択</div>
      <select id="modalVoicevoxSpeaker" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;margin-bottom:10px;" onchange="updateVoicevoxSpeaker(this.value)">
        <option value="20" ${voiceDraft.speaker === 20 ? 'selected' : ''}>落ち着いた女性の声（おすすめ）</option>
        <option value="74" ${voiceDraft.speaker === 74 ? 'selected' : ''}>クールで聞き取りやすい声</option>
        <option value="52" ${voiceDraft.speaker === 52 ? 'selected' : ''}>さわやかな青年の声</option>
        <option value="21" ${voiceDraft.speaker === 21 ? 'selected' : ''}>力強く頼れる声</option>
        <option value="11" ${voiceDraft.speaker === 11 ? 'selected' : ''}>明るく元気な男性の声</option>
        <option value="10" ${voiceDraft.speaker === 10 ? 'selected' : ''}>やわらかく優しい声</option>
        <option value="16" ${voiceDraft.speaker === 16 ? 'selected' : ''}>親しみやすい女性の声</option>
        <option value="51" ${voiceDraft.speaker === 51 ? 'selected' : ''}>威厳のある男性の声</option>
      </select>
      <p class="muted" style="font-size:11.5px;line-height:1.6;margin-bottom:10px;">
        クラウドAPIで再生されるため、インストールは不要です。PCでVOICEVOXアプリが起動している場合は自動でローカル通信に切り替わります。<br>
        VOICEVOX：もち子、琴詠ニア、雀松朱司、剣崎雌雄、玄野武宏、雨晴はう、九州そら、†聖騎士 紅桜†
      </p>
    </div>

    <div id="browserTtsConfigArea" style="display:${voiceDraft.engine === 'browser' ? 'block' : 'none'};">
      <div style="font-weight:700;margin-bottom:6px;">ブラウザ音声モデル</div>
      <select id="modalVoiceSelect" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;margin-bottom:10px;" onchange="updateModalTtsSettings()">
        ${voiceOptions}
      </select>
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:10px;">
        <div style="flex:1;">
          <div style="font-size:11.5px;color:var(--sub);margin-bottom:3px;">話す速度: <span id="labelTtsRate">${voiceDraft.rate.toFixed(2)}x</span></div>
          <input type="range" id="inputTtsRate" min="0.8" max="1.2" step="0.05" value="${voiceDraft.rate}" style="width:100%;" oninput="updateModalTtsSettings()">
        </div>
        <div style="flex:1;">
          <div style="font-size:11.5px;color:var(--sub);margin-bottom:3px;">声の高さ: <span id="labelTtsPitch">${voiceDraft.pitch.toFixed(2)}</span></div>
          <input type="range" id="inputTtsPitch" min="0.8" max="1.2" step="0.05" value="${voiceDraft.pitch}" style="width:100%;" oninput="updateModalTtsSettings()">
        </div>
      </div>
    </div>

    <button type="button" class="btn out" id="btnTestVoice" style="width:100%;margin-bottom:6px;" onclick="testSampleAiVoice()">
      ${ICONS.speaker} サンプル音声を再生（試聴・保存されません）
    </button>
    <div id="voiceFallbackNotice" style="font-size:11.5px;min-height:16px;margin-bottom:10px;color:#b45309;font-weight:700;"></div>

    <button type="button" class="btn pri" style="width:100%;margin-bottom:10px;" onclick="confirmVoiceChoice()">
      ${ICONS.check} この声に決定する
    </button>

    <div style="margin-top:4px;">
      <div class="btn out" onclick="closePageModal()">閉じる</div>
    </div>
  `;
  showPageModal(html);
}

function confirmVoiceChoice() {
  state.voiceEngine = voiceDraft.engine;
  state.voicevoxSpeaker = voiceDraft.speaker;
  state.ttsVoiceName = voiceDraft.browserVoice;
  state.ttsRate = voiceDraft.rate;
  state.ttsPitch = voiceDraft.pitch;
  saveState();
  renderVoiceConfigModal();
}

function updateModalTtsSettings() {
  if (!voiceDraft) return;
  const sel = document.getElementById('modalVoiceSelect');
  const rateInput = document.getElementById('inputTtsRate');
  const pitchInput = document.getElementById('inputTtsPitch');
  const rateLabel = document.getElementById('labelTtsRate');
  const pitchLabel = document.getElementById('labelTtsPitch');

  if (sel) voiceDraft.browserVoice = sel.value;
  if (rateInput) {
    voiceDraft.rate = parseFloat(rateInput.value) || 0.95;
    if (rateLabel) rateLabel.textContent = `${voiceDraft.rate.toFixed(2)}x`;
  }
  if (pitchInput) {
    voiceDraft.pitch = parseFloat(pitchInput.value) || 1.0;
    if (pitchLabel) pitchLabel.textContent = voiceDraft.pitch.toFixed(2);
  }
  // 決定前の下書き状態なので、保存ではなくステータス表示だけ更新する
  const statusLine = document.querySelector('.page-modal-card .voice-status-line');
  if (statusLine) {
    statusLine.className = 'voice-status-line pending';
    statusLine.textContent = 'まだ声が決定されていません（試聴中）';
  }
}

function testSampleAiVoice() {
  if (!voiceDraft) return;
  const btn = document.getElementById('btnTestVoice');
  const notice = document.getElementById('voiceFallbackNotice');
  if (notice) notice.textContent = '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `${ICONS.speaker} 再生準備中…`;
  }
  const reset = () => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${ICONS.speaker} サンプル音声を再生（試聴・保存されません）`;
    }
  };
  playVoice('私はAIコンシェルジュです。あなたのそばにいつでもいます。', { engine: voiceDraft.engine, speaker: voiceDraft.speaker }, true, {
    onPrepare: () => { if (btn) btn.innerHTML = `${ICONS.speaker} 再生準備中…`; },
    onStart: () => { if (btn) btn.innerHTML = `${ICONS.speaker} 再生中…`; },
    onEnd: reset,
    onFallback: () => { if (notice) notice.textContent = '音声サーバーに接続できなかったため、ブラウザ標準音声で再生しました。'; }
  });
}

function switchVoiceEngine(engine) {
  if (!voiceDraft) return;
  voiceDraft.engine = engine;
  renderVoiceConfigModal();
}

function updateVoicevoxSpeaker(speakerId) {
  if (!voiceDraft) return;
  voiceDraft.speaker = parseInt(speakerId, 10) || 20;
  const statusLine = document.querySelector('.page-modal-card .voice-status-line');
  if (statusLine) {
    statusLine.className = 'voice-status-line pending';
    statusLine.textContent = 'まだ声が決定されていません（試聴中）';
  }
}

function toggleApiKeyVisibility() {
  const input = document.getElementById('modalApiKeyInput');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

async function saveAndTestModalApiKey() {
  const input = document.getElementById('modalApiKeyInput');
  const resEl = document.getElementById('modalTestResult');
  const key = input ? input.value.trim() : '';

  if (!key) {
    if (resEl) {
      resEl.style.color = '#ef4444';
      resEl.textContent = 'APIキーを入力してください。';
    }
    return;
  }

  if (resEl) {
    resEl.style.color = 'var(--ai)';
    resEl.textContent = '接続テスト中…';
  }

  if (typeof window.testGeminiApiKey !== 'function') {
    if (resEl) {
      resEl.style.color = '#ef4444';
      resEl.textContent = 'エラー: gemini.js が読み込まれていません。';
    }
    return;
  }

  const result = await window.testGeminiApiKey(key);
  if (result.ok) {
    localStorage.setItem('well_be_gemini_api_key', key);
    if (resEl) {
      resEl.style.color = '#16a34a';
      resEl.innerHTML = `${ICONS.check} 接続成功！Gemini APIキーを保存しました。`;
    }
    const card = document.getElementById('modalAiStatusCard');
    if (card) {
      card.className = 'ai-status-card active';
      card.innerHTML = '<span class="status-dot on"></span>Gemini 3.8 Flash 接続中（リアルタイム対話有効）';
    }
    renderAiStatusButton();
  } else {
    if (resEl) {
      resEl.style.color = '#ef4444';
      resEl.innerHTML = `${ICONS.close} 接続失敗: ${escapeHtml(result.error)}`;
    }
  }
}

function clearModalApiKey() {
  localStorage.removeItem('well_be_gemini_api_key');
  const input = document.getElementById('modalApiKeyInput');
  const resEl = document.getElementById('modalTestResult');
  const card = document.getElementById('modalAiStatusCard');
  if (input) input.value = '';
  if (resEl) {
    resEl.style.color = '#64748b';
    resEl.textContent = 'APIキーを消去しました（モック応答モードになります）。';
  }
  if (card) {
    card.className = 'ai-status-card';
    card.innerHTML = '<span class="status-dot"></span>APIキー未設定（ルールベース応答で動作中）';
  }
  renderAiStatusButton();
}

function scrollToBottom(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 50);
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 初期化＆ホイールスクロール補助
document.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
  // 左：患者スマホ、右：家族スマホの初期画面をそれぞれ初期化
  navigateTo(state.familyScreen || 'family-dash', { keepVisible: true });
  navigateTo(state.patientScreen || 'home', { keepVisible: true });
  setVisibleRole(state.visibleRole || 'patient');

  document.querySelectorAll('.grid, .body').forEach(el => {
    el.addEventListener('wheel', e => {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  });

  // 管理者用Gemini設定ボタン：URLに ?admin=1 がある時のみ表示（審査員が通常閲覧する画面には出さない）
  if (new URLSearchParams(location.search).get('admin') === '1') {
    const adminBtn = document.getElementById('aiConfigBtn');
    if (adminBtn) adminBtn.style.display = '';
  }
});

// 管理者用パスワード認証（簡易・このデモ限定。sessionStorageに保持し再入力を省略）
// 本番ではGitHub Secrets（ADMIN_PASSWORD）から自動注入される値を使う。未設定時はローカル確認用の既定値。
function getAdminPassword() {
  const configVal = window.CONFIG && window.CONFIG.ADMIN_PASSWORD;
  if (configVal && configVal !== "__ADMIN_PASSWORD__") return configVal;
  return 'wellbe2026';
}
function checkAdminAuth() {
  if (sessionStorage.getItem('well_be_admin_ok') === '1') return true;
  const input = prompt('管理者パスワードを入力してください');
  if (input === getAdminPassword()) {
    sessionStorage.setItem('well_be_admin_ok', '1');
    return true;
  }
  if (input !== null) alert('パスワードが違います。');
  return false;
}
