// We'll Be ― Gemini API 設定ファイル
// 
// 【APIキーの設定方法（以下のいずれかで設定できます）】
// 1. 下記の GEMINI_API_KEY に直接 'AIzaSy...' を記入する
// 2. ブラウザ画面上部の「🔑 AI設定」ボタンから貼り付けて保存する（推奨：localStorageに安全に保存されます）
// 3. GitHub Pages公開時：GitHubのSecretsに GEMINI_API_KEY を登録し、GitHub Actionsで自動注入する

window.CONFIG = {
  // ここにAPIキーを直接入力しても動作します（GitHubへコミットする際は空またはプレースホルダーにしてください）
  GEMINI_API_KEY: "__GEMINI_API_KEY__",

  // 管理者設定（?admin=1）のパスワード。GitHub Secretsの ADMIN_PASSWORD から自動注入されます。
  // 未設定（プレースホルダーのまま）の場合はローカル確認用に 'wellbe2026' を使います。
  ADMIN_PASSWORD: "__ADMIN_PASSWORD__",

  // 使用するGeminiモデル（gemini-1.5-flash/gemini-2.5-flashは廃止済みのため gemini-3.8-flash を使用）
  GEMINI_MODEL: "gemini-3.8-flash",

  // Gemini API呼び出しの有効/無効（falseにすると従来のルールベースモックで動作）
  USE_GEMINI: true,

  // API呼び出しタイムアウト（ミリ秒）
  API_TIMEOUT_MS: 12000
};

// 有効なAPIキーを取得するヘルパー（localStorage優先 -> CONFIG.GEMINI_API_KEY）
window.getGeminiApiKey = function() {
  const localKey = localStorage.getItem('well_be_gemini_api_key');
  if (localKey && localKey.trim().length > 10) {
    return localKey.trim();
  }
  const configKey = window.CONFIG && window.CONFIG.GEMINI_API_KEY;
  // プレースホルダー判定は固定文字列との比較ではなく「__で始まり__で終わる」形で行う。
  // デプロイ時のsed置換（-g オプション）はファイル内の該当文字列を全て置き換えるため、
  // ここで固定のプレースホルダー文字列と比較すると、注入後にその比較自体が
  // 「実キー !== 実キー」になってしまい常にfalseとなるバグがあった。
  const isPlaceholder = (v) => typeof v === 'string' && v.startsWith('__') && v.endsWith('__');
  if (configKey && !isPlaceholder(configKey) && configKey.trim().length > 10) {
    return configKey.trim();
  }
  return "";
};
