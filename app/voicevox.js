// We'll Be ― VOICEVOX 音声合成モジュール
// ローカル起動（localhost:50021）および クラウドWEB API（tts.quest）の両対応

(function() {
  let currentAudio = null;
  let playToken = 0;
  const audioCache = new Map();

  // 利用可能なVOICEVOX話者（表示名はキャラクター名を伏せた声質表現。クレジット表記はcreditNameに保持）
  const SPEAKERS = [
    { id: 20, name: '落ち着いた女性の声', desc: 'おすすめ・デフォルト', creditName: 'もち子さん' },
    { id: 74, name: 'クールで聞き取りやすい声', desc: '', creditName: '琴詠ニア' },
    { id: 52, name: 'さわやかな青年の声', desc: '', creditName: '雀松朱司' },
    { id: 21, name: '力強く頼れる声', desc: '', creditName: '剣崎雌雄' },
    { id: 11, name: '明るく元気な男性の声', desc: '', creditName: '玄野武宏' },
    { id: 10, name: 'やわらかく優しい声', desc: '', creditName: '雨晴はう' },
    { id: 16, name: '親しみやすい女性の声', desc: '', creditName: '九州そら' },
    { id: 51, name: '威厳のある男性の声', desc: '', creditName: '†聖騎士 紅桜†' }
  ];

  function stopVoicevox() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  function cleanSpeechText(text) {
    return String(text || '')
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
  }

  // 1. ローカルVOICEVOX (localhost:50021)
  async function synthesizeLocalVoicevox(text, speakerId) {
    const queryUrl = `http://localhost:50021/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`;
    const queryRes = await fetch(queryUrl, { method: 'POST', signal: AbortSignal.timeout(1500) });
    if (!queryRes.ok) throw new Error('Local query failed');
    const queryJson = await queryRes.json();

    const synthUrl = `http://localhost:50021/synthesis?speaker=${speakerId}`;
    const synthRes = await fetch(synthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryJson),
      signal: AbortSignal.timeout(5000)
    });
    if (!synthRes.ok) throw new Error('Local synth failed');
    const blob = await synthRes.blob();
    return URL.createObjectURL(blob);
  }

  // 2. クラウドWEB API (tts.quest)
  async function synthesizeWebVoicevox(text, speakerId) {
    const url = `https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(text)}&speaker=${speakerId}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) throw new Error(`Web API HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success) throw new Error('Web API returned success:false');

    const statusUrl = data.audioStatusUrl;
    const downloadUrl = data.mp3DownloadUrl;

    if (!statusUrl) {
      return downloadUrl;
    }

    // 生成完了をポーリング（最大20回 = 約8秒）。準備できないまま終わったら失敗として扱う
    // （未完成のURLをそのまま返すと、再生が途中で止まる／遅れて再生されるなど不安定になるため）
    for (let i = 0; i < 20; i++) {
      try {
        const sRes = await fetch(statusUrl, { signal: AbortSignal.timeout(2000) });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.isAudioReady) {
            return downloadUrl;
          }
        }
      } catch (e) {
        // 次のポーリングへ
      }
      await new Promise(r => setTimeout(r, 400));
    }

    throw new Error('Web API audio not ready in time');
  }

  /**
   * VOICEVOXで音声を合成して再生する
   */
  async function speakVoicevox(rawText, speakerId = 2, onStart, onEnd, onPrepare) {
    stopVoicevox();
    const myToken = ++playToken;
    const text = cleanSpeechText(rawText);
    if (!text) return false;

    if (typeof onPrepare === 'function') onPrepare();

    const cacheKey = `${speakerId}:${text}`;
    let audioUrl = audioCache.get(cacheKey);

    if (!audioUrl) {
      try {
        // まずPCローカルで起動中のVOICEVOX（約50ms・超高速）を試行
        audioUrl = await synthesizeLocalVoicevox(text, speakerId);
      } catch (localErr) {
        // ローカルが動いていない場合はクラウドWEB APIを使用（ゼロインストールで動作）
        try {
          audioUrl = await synthesizeWebVoicevox(text, speakerId);
        } catch (webErr) {
          console.warn('VOICEVOX Web API failed:', webErr);
          throw webErr;
        }
      }
      if (audioUrl) {
        audioCache.set(cacheKey, audioUrl);
      }
    }

    // 待っている間に別の再生リクエストが入っていたら、この古いリクエストは再生しない（二重再生防止）
    if (myToken !== playToken) return false;
    if (!audioUrl) return false;

    const audio = new Audio(audioUrl);
    currentAudio = audio;

    return new Promise((resolve, reject) => {
      audio.onplay = () => {
        if (typeof onStart === 'function') onStart();
      };
      audio.onended = () => {
        currentAudio = null;
        if (typeof onEnd === 'function') onEnd();
        resolve(true);
      };
      audio.onerror = (e) => {
        console.warn('Audio playback error:', e);
        currentAudio = null;
        if (typeof onEnd === 'function') onEnd();
        reject(e);
      };

      audio.play().catch(reject);
    });
  }

  window.VOICEVOX_SPEAKERS = SPEAKERS;
  window.speakVoicevox = speakVoicevox;
  window.stopVoicevox = stopVoicevox;
})();
