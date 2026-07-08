// ひらがなからローマ字へのマッピング定義
const ROMAJI_MAP: Record<string, string[]> = {
  "あ": ["a"], "い": ["i"], "う": ["u"], "え": ["e"], "お": ["o"],
  "か": ["ka"], "き": ["ki"], "く": ["ku"], "け": ["ke"], "こ": ["ko"],
  "さ": ["sa"], "し": ["shi", "si"], "す": ["su"], "せ": ["se", "ce"], "そ": ["so"],
  "た": ["ta"], "ち": ["chi", "ti"], "つ": ["tsu", "tu"], "て": ["te"], "と": ["to"],
  "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
  "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
  "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
  "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
  "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
  "わ": ["wa"], "を": ["wo", "o"], "ん": ["nn", "xn"],
  "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
  "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
  "だ": ["da"], "ぢ": ["di", "zi"], "づ": ["du"], "で": ["de"], "ど": ["do"],
  "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
  "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],
  "きゃ": ["kya"], "きゅ": ["kyu"], "きょ": ["kyo"],
  "しゃ": ["sha", "sya"], "しゅ": ["shu", "syu"], "しょ": ["sho", "syo"],
  "ちゃ": ["cha", "tya"], "ちゅ": ["chu", "tyu"], "ちょ": ["cho", "tyo"],
  "にゃ": ["nya"], "にゅ": ["nyu"], "にょ": ["nyo"],
  "ひゃ": ["hya"], "ひゅ": ["hyu"], "ひょ": ["hyo"],
  "みゃ": ["mya"], "みゅ": ["myu"], "みょ": ["myo"],
  "りゃ": ["rya"], "りゅ": ["ryu"], "りょ": ["ryo"],
  "ぎゃ": ["gya"], "ぎゅ": ["gyu"], "ぎょ": ["gyo"],
  "じゃ": ["ja", "zya"], "じゅ": ["ju", "zyu"], "じょ": ["jo", "zyo"],
  "びゃ": ["bya"], "びゅ": ["byu"], "びょ": ["byo"],
  "ぴゃ": ["pya"], "ぴゅ": ["pyu"], "ぴょ": ["pyo"],
  "ふぁ": ["fa"], "ふぃ": ["fi"], "ふぇ": ["fe"], "ふぉ": ["fo"],
  "でぃ": ["dyi", "di"], "どぅ": ["dwu"],
  "てぃ": ["tyi"], "とぅ": ["twu"],
  "うぇ": ["we"], "うぃ": ["wi"],
  "ヴ": ["vu"],
  "ー": ["-"],
  "、": [","], "。": ["."], " ": [" "],
  "ぁ": ["la", "xa"], "ぃ": ["li", "xi"], "ぅ": ["lu", "xu"], "ぇ": ["le", "xe"], "ぉ": ["lo", "xo"],
  "ゃ": ["lya", "xya"], "ゅ": ["lyu", "xyu"], "ょ": ["lyo", "xyo"],
  "っ": ["ltu", "xtu", "tsu"]
};

// 特殊文字や2文字でのパースを優先するためのリスト
const DOUBLE_HIRAGANA = [
  "きゃ", "きゅ", "きょ",
  "しゃ", "しゅ", "しょ",
  "ちゃ", "ちゅ", "ちょ",
  "にゃ", "にゅ", "にょ",
  "ひゃ", "ひゅ", "ひょ",
  "みゃ", "みゅ", "みょ",
  "りゃ", "りゅ", "りょ",
  "ぎゃ", "ぎゅ", "ぎょ",
  "じゃ", "じゅ", "じょ",
  "びゃ", "びゅ", "びょ",
  "ぴゃ", "ぴゅ", "ぴょ",
  "ふぁ", "ふぃ", "ふぇ", "ふぉ",
  "でぃ", "どぅ", "てぃ", "とぅ",
  "うぇ", "うぃ"
];

export interface TypingState {
  hiragana: string;
  tokens: {
    hiragana: string;
    romajiOptions: string[];
  }[];
  currentTokenIndex: number;
  currentRomajiInput: string; // 現在のトークンに対して入力されたローマ字
  typedRomaji: string; // すでに入力を完了したローマ字
  remainingRomajiGuide: string; // まだ入力していないローマ字のガイド（動的書き換え）
}

// ひらがなを一連のトークンに分割
export function parseHiraganaToTokens(hiragana: string): { hiragana: string; romajiOptions: string[] }[] {
  const tokens: { hiragana: string; romajiOptions: string[] }[] = [];
  let i = 0;

  while (i < hiragana.length) {
    // 1. 2文字のひらがなをチェック
    if (i + 1 < hiragana.length) {
      const doubleStr = hiragana.substring(i, i + 2);
      if (DOUBLE_HIRAGANA.includes(doubleStr)) {
        tokens.push({
          hiragana: doubleStr,
          romajiOptions: ROMAJI_MAP[doubleStr] || [doubleStr]
        });
        i += 2;
        continue;
      }
    }

    // 2. 「っ」＋子音 の特殊処理（促音）
    if (hiragana[i] === "っ" && i + 1 < hiragana.length) {
      const nextChar = hiragana[i + 1];
      // 次の文字のローマ字を取得
      const nextDouble = i + 2 < hiragana.length ? hiragana.substring(i + 1, i + 3) : "";
      let nextRomajiFirstChars: string[] = [];

      if (DOUBLE_HIRAGANA.includes(nextDouble)) {
        const options = ROMAJI_MAP[nextDouble] || [];
        nextRomajiFirstChars = options.map(o => o[0]);
      } else {
        const options = ROMAJI_MAP[nextChar] || [];
        nextRomajiFirstChars = options.map(o => o[0]);
      }

      if (nextRomajiFirstChars.length > 0) {
        // 次の文字の先頭子音を重ねるパターン
        const sokuonOptions = nextRomajiFirstChars.map(char => char);
        // 重ねる子音をオプションとする
        tokens.push({
          hiragana: "っ",
          // 次の文字の最初の子音を頭につけるオプション、および "ltu", "xtu" も念のため許容
          romajiOptions: [...new Set([...sokuonOptions, "ltu", "xtu"])]
        });
        i += 1;
        continue;
      }
    }

    // 3. 「ん」の特殊処理 (次の文字が「あいうえおやゆよ」以外なら「n」でもOKにする)
    if (hiragana[i] === "ん" && i + 1 < hiragana.length) {
      const nextChar = hiragana[i + 1];
      const vowelsAndY = ["あ", "い", "う", "え", "お", "や", "ゆ", "よ", "な", "に", "ぬ", "ね", "の", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ"];
      if (!vowelsAndY.includes(nextChar)) {
        // 「n」を許容する
        tokens.push({
          hiragana: "ん",
          romajiOptions: ["n", "nn", "xn"]
        });
        i += 1;
        continue;
      }
    } else if (hiragana[i] === "ん" && i + 1 === hiragana.length) {
      // 文末の「ん」は "nn" または "xn"
      tokens.push({
        hiragana: "ん",
        romajiOptions: ["nn", "xn"]
      });
      i += 1;
      continue;
    }

    // 4. 通常の1文字処理
    const singleStr = hiragana[i];
    tokens.push({
      hiragana: singleStr,
      romajiOptions: ROMAJI_MAP[singleStr] || [singleStr]
    });
    i += 1;
  }

  return tokens;
}

// 初期タイピングステートを構築
export function createTypingState(hiragana: string): TypingState {
  const tokens = parseHiraganaToTokens(hiragana);
  
  // 初期ガイドを生成（各トークンの最初のローマ字オプションを連結）
  let guide = "";
  tokens.forEach((token, index) => {
    // 促音「っ」の処理
    if (token.hiragana === "っ" && index + 1 < tokens.length) {
      // 次のトークンの最初のローマ字オプションの最初の文字を取得
      const nextToken = tokens[index + 1];
      const nextOption = nextToken.romajiOptions[0] || "";
      const sokuonChar = nextOption[0] || "t";
      guide += sokuonChar;
    } else {
      guide += token.romajiOptions[0] || "";
    }
  });

  return {
    hiragana,
    tokens,
    currentTokenIndex: 0,
    currentRomajiInput: "",
    typedRomaji: "",
    remainingRomajiGuide: guide
  };
}

// キー入力を受け取ってステートを更新。成功ならtrue、失敗（ミス）ならfalse
export function handleKeyInput(
  state: TypingState,
  key: string
): { success: boolean; isComplete: boolean; newState: TypingState } {
  const lowerKey = key.toLowerCase();
  
  // もし既に入力が完了しているなら
  if (state.currentTokenIndex >= state.tokens.length) {
    return { success: false, isComplete: true, newState: state };
  }

  const currentToken = state.tokens[state.currentTokenIndex];
  const nextInput = state.currentRomajiInput + lowerKey;

  // 促音「っ」のとき、後ろの文字との組み合わせで動的に「後ろの文字の最初の子音」に一致するかを判定する
  let validOptions = [...currentToken.romajiOptions];
  if (currentToken.hiragana === "っ" && state.currentTokenIndex + 1 < state.tokens.length) {
    const nextToken = state.tokens[state.currentTokenIndex + 1];
    // 次のトークンの全ローマ字の最初の1文字を、促音の許容文字とする
    const validSokuonChars = nextToken.romajiOptions.map(opt => opt[0]).filter(Boolean);
    validOptions = [...new Set([...validSokuonChars, "ltu", "xtu"])];
  }

  // 入力された部分文字列 `nextInput` が、このトークンのいずれかのローマ字オプションの先頭部分と一致するかチェック
  const matchedOption = validOptions.find(opt => opt.startsWith(nextInput));

  if (matchedOption) {
    // マッチした！
    const isTokenComplete = nextInput === matchedOption;
    const updatedState = { ...state };

    if (isTokenComplete) {
      // このトークン（ひらがな文字）の入力が完了した
      updatedState.typedRomaji += nextInput;
      updatedState.currentTokenIndex += 1;
      updatedState.currentRomajiInput = "";
    } else {
      // 途中までマッチ
      updatedState.currentRomajiInput = nextInput;
    }

    // 残りのガイドを動的に再計算する
    // 現在のトークンの未入力部分 ＋ 後続のトークンのガイド
    let guide = "";
    
    // 現在のトークンが途中まで打たれている場合、マッチしたオプションの残りの部分を追加
    if (updatedState.currentRomajiInput.length > 0) {
      const remainingOfCurrent = matchedOption.substring(updatedState.currentRomajiInput.length);
      guide += remainingOfCurrent;
    }

    // 後続のトークンを連結
    for (let tIdx = updatedState.currentTokenIndex + (updatedState.currentRomajiInput.length > 0 ? 1 : 0); tIdx < updatedState.tokens.length; tIdx++) {
      const t = updatedState.tokens[tIdx];
      if (t.hiragana === "っ" && tIdx + 1 < updatedState.tokens.length) {
        // 次のトークンの決定されている/あるいは最初のオプションの先頭
        const nextT = updatedState.tokens[tIdx + 1];
        const nextOption = nextT.romajiOptions[0] || "";
        const sokuonChar = nextOption[0] || "t";
        guide += sokuonChar;
      } else {
        guide += t.romajiOptions[0] || "";
      }
    }

    updatedState.remainingRomajiGuide = guide;

    const isAllComplete = updatedState.currentTokenIndex >= updatedState.tokens.length;
    return {
      success: true,
      isComplete: isAllComplete,
      newState: updatedState
    };
  } else {
    // ミス
    return {
      success: false,
      isComplete: false,
      newState: state
    };
  }
}
