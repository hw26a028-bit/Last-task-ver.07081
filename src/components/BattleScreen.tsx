import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock, Heart, Shield, Award, AlertCircle, RefreshCw } from "lucide-react";
import { YOKAI_LIST, STAGE_PHRASES } from "../data";
import { YokaiData, PhraseData, PlayLog } from "../types";
import { createTypingState, handleKeyInput, TypingState } from "../lib/typing";
import { audio } from "../lib/audio";

interface BattleScreenProps {
  mode: "stage" | "random";
  stageNum?: number; // stageモード時のステージ
  onWinStage?: (stageNum: number) => void;
  onBackToSelect: () => void;
  onSaveRandomResult?: (result: Omit<PlayLog, "id" | "date">) => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  mode,
  stageNum = 1,
  onWinStage,
  onBackToSelect,
  onSaveRandomResult
}) => {
  // --- 妖怪の設定 ---
  const getEnemyByStage = (sNum: number): YokaiData => {
    return YOKAI_LIST.find(y => y.stage === sNum) || YOKAI_LIST[0];
  };

  const getPhrasesByStage = (sNum: number): PhraseData[] => {
    return STAGE_PHRASES[sNum] || STAGE_PHRASES[1];
  };

  // --- 状態変数 ---
  const [enemy, setEnemy] = useState<YokaiData>(() => {
    if (mode === "stage") {
      return getEnemyByStage(stageNum);
    } else {
      // ランダムモード時は最初にランダムな妖怪を選択
      const randIdx = Math.floor(Math.random() * YOKAI_LIST.length);
      return YOKAI_LIST[randIdx];
    }
  });

  const [enemyHp, setEnemyHp] = useState<number>(() => enemy.hp);
  const [playerHp, setPlayerHp] = useState<number>(100);

  // タイピング関連
  const [currentPhrase, setCurrentPhrase] = useState<PhraseData>(() => {
    const pool = getPhrasesByStage(enemy.stage);
    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
  });

  const [typingState, setTypingState] = useState<TypingState>(() => 
    createTypingState(currentPhrase.hiragana)
  );

  // 1行内のミスカウント
  const [phraseMissCount, setPhraseMissCount] = useState<number>(0);

  // 統計データ（ランダムモードのリザルト用）
  const [totalKeys, setTotalKeys] = useState<number>(0);
  const [totalMisses, setTotalMisses] = useState<number>(0);
  const [missedKeysMap, setMissedKeysMap] = useState<Record<string, number>>({});
  const [totalTypedCorrectly, setTotalTypedCorrectly] = useState<number>(0);

  // 与えた総ダメージ、倒した数（ランダム用）
  const [defeatedCount, setDefeatedCount] = useState<number>(0);

  // 時間計測関連
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3分間 (180秒)
  const [startTime, setStartTime] = useState<number | null>(null);

  // 状態フラグ
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isStageCleared, setIsStageCleared] = useState<boolean>(false);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // フィードバック表示（「大ダメージ！」「ガード！」など）
  const [combatFeedbacks, setCombatFeedbacks] = useState<{
    playerDamage?: number;
    playerRating?: "大" | "中" | "通常";
    enemyDamage?: number;
    shieldStatus?: "完全ガード" | "半減" | "直撃";
  } | null>(null);

  // 赤点滅エフェクト
  const [isEnemyDamaged, setIsEnemyDamaged] = useState<boolean>(false);
  const [isPlayerDamaged, setIsPlayerDamaged] = useState<boolean>(false);

  const keyInputRef = useRef<HTMLInputElement>(null);

  // --- 新しいタイピング文章のロード ---
  const loadNextPhrase = (nextEnemy: YokaiData) => {
    const pool = getPhrasesByStage(nextEnemy.stage);
    const randIdx = Math.floor(Math.random() * pool.length);
    const nextPhrase = pool[randIdx];
    setCurrentPhrase(nextPhrase);
    setTypingState(createTypingState(nextPhrase.hiragana));
    setPhraseMissCount(0);
    setStartTime(null);
  };

  // --- ランダムモードのカウントダウンタイマー ---
  useEffect(() => {
    if (mode !== "random" || isGameOver || isResultOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerRandomResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isGameOver, isResultOpen]);

  // フォーカスを常に保持
  useEffect(() => {
    if (!isGameOver && !isStageCleared && !isResultOpen) {
      keyInputRef.current?.focus();
    }
  }, [isGameOver, isStageCleared, isResultOpen, typingState]);

  // --- ランダムモードの結果表示 ---
  const triggerRandomResult = () => {
    setIsResultOpen(true);
    
    // スコア計算
    // 平均CPM = (総文字入力数 / 3分間) * 60
    // もしくは、入力完了ごとの実測CPMの平均とするか、総打鍵数から計算する
    // 仕様書：1分間に何文字入力できたか（字/分）※3分間全体の平均値
    // 総文字入力数 (totalTypedCorrectly) / 3分(または経過した実時間) * 60
    const elapsedMinutes = (180 - timeLeft) / 60 || 0.01;
    const finalCpm = Math.round(totalTypedCorrectly / elapsedMinutes) || 0;
    
    const accuracy = totalKeys > 0 ? (totalTypedCorrectly / totalKeys) * 100 : 100;
    const finalScore = Math.round(finalCpm * (accuracy / 100)) || 0;

    // 最頻ミスキー
    let mostMissedKey = "";
    let maxMissCount = 0;
    Object.entries(missedKeysMap).forEach(([k, count]) => {
      const val = count as number;
      if (val > maxMissCount) {
        maxMissCount = val;
        mostMissedKey = k;
      }
    });

    // 親にセーブデータを要求
    if (onSaveRandomResult) {
      onSaveRandomResult({
        cpm: finalCpm,
        accuracy: parseFloat(accuracy.toFixed(1)),
        totalKeys,
        missKeys: totalMisses,
        mostMissedKey,
        score: finalScore
      });
    }
  };

  // --- キー入力の処理 ---
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGameOver || isStageCleared || isResultOpen || isProcessing) return;

    const key = e.key;

    // 特殊キー（Shift, Control, Altなど）や1文字以外のキーは無視
    if (key.length !== 1) return;

    // 時間計測開始（最初の一打）
    if (!startTime) {
      setStartTime(Date.now());
    }

    setTotalKeys(prev => prev + 1);

    const { success, isComplete, newState } = handleKeyInput(typingState, key);

    if (success) {
      audio.playKatakata();
      setTotalTypedCorrectly(prev => prev + 1);
      setTypingState(newState);

      if (isComplete) {
        setIsProcessing(true); // キー入力を一時無効化
        // --- 1行すべて打ち切った！ 攻防の解決 ---
        const endTime = Date.now();
        const durationSeconds = (endTime - (startTime || endTime)) / 1000 || 0.1;
        
        // 1. プレイヤーの攻撃ダメージ算出 (CPM判定)
        // 完打文字数 = ひらがなの総文字数（ここでは、ローマ字入力ガイドの全長を使用）
        const typedLen = newState.typedRomaji.length;
        const cpm = Math.round((typedLen / Math.max(durationSeconds, 0.2)) * 60);

        let rating: "大" | "中" | "通常" = "通常";
        let playerDamage = Math.ceil(enemy.hp * 0.10); // 通常ダメージ (10%)

        if (cpm >= 300) {
          rating = "大";
          playerDamage = Math.ceil(enemy.hp * 0.35); // 35%
        } else if (cpm >= 150) {
          rating = "中";
          playerDamage = Math.ceil(enemy.hp * 0.20); // 20%
        }

        // 敵へのダメージ適用
        audio.playAttack();
        const nextEnemyHp = Math.max(0, enemyHp - playerDamage);
        setEnemyHp(nextEnemyHp);
        setIsEnemyDamaged(true);
        setTimeout(() => setIsEnemyDamaged(false), 200);

        // まずプレイヤーの攻撃のみを戦闘ログへフィードバック
        setCombatFeedbacks({
          playerDamage,
          playerRating: rating,
        });

        // プレイヤーの攻撃後、一拍開けて（800ms）妖怪の反撃
        setTimeout(() => {
          if (isGameOver || isResultOpen || isStageCleared) {
            setIsProcessing(false);
            return;
          }

          // 2. 敵からの反撃ダメージ算出 (被ダメージ)
          let shieldStatus: "完全ガード" | "半減" | "直撃" = "直撃";
          let enemyDamage = enemy.attack;

          if (phraseMissCount === 0) {
            shieldStatus = "完全ガード";
            enemyDamage = 0;
          } else if (phraseMissCount <= 2) {
            shieldStatus = "半減";
            enemyDamage = Math.floor(enemy.attack * 0.5);
          }

          // プレイヤーへのダメージ適用
          const nextPlayerHp = Math.max(0, playerHp - enemyDamage);
          setPlayerHp(nextPlayerHp);
          if (enemyDamage > 0) {
            audio.playDamage();
            setIsPlayerDamaged(true);
            setTimeout(() => setIsPlayerDamaged(false), 200);
          } else if (shieldStatus === "完全ガード") {
            audio.playGuard();
          }

          // 攻防両方の解決結果を戦闘ログへ反映
          setCombatFeedbacks({
            playerDamage,
            playerRating: rating,
            enemyDamage,
            shieldStatus
          });

          // さらに少し待ってから（600ms）決着を判定し、次のステップに進む
          setTimeout(() => {
            if (isGameOver || isResultOpen || isStageCleared) {
              setIsProcessing(false);
              return;
            }

            // 3. 決着判定（プレイヤーのHPが0になった瞬間にタイピングモードを終了するように最優先でチェック）
            if (nextPlayerHp <= 0) {
              // プレイヤーのHPが0になった瞬間にタイピングモードを終了
              if (mode === "stage") {
                setIsGameOver(true);
              } else {
                // ランダムモード時は即結果画面
                triggerRandomResult();
              }
              setIsProcessing(false);
            } else if (nextEnemyHp <= 0) {
              // 敵を撃破！
              if (mode === "stage") {
                setIsStageCleared(true);
              } else {
                // ランダムモード時は次の敵へ
                setDefeatedCount(prev => prev + 1);
                // 敵を再選択
                const randIdx = Math.floor(Math.random() * YOKAI_LIST.length);
                const nextEnemy = YOKAI_LIST[randIdx];
                setEnemy(nextEnemy);
                setEnemyHp(nextEnemy.hp);
                loadNextPhrase(nextEnemy);
              }
              setIsProcessing(false);
            } else {
              // 継続：次の文章をロード
              loadNextPhrase(enemy);
              setIsProcessing(false);
            }
          }, 600);

        }, 800);
      }
    } else {
      // ミス入力
      audio.playMiss();
      setPhraseMissCount(prev => prev + 1);
      setTotalMisses(prev => prev + 1);

      // ミスしたキーを記録（すべて大文字で記録）
      const upperKey = key.toUpperCase();
      setMissedKeysMap(prev => ({
        ...prev,
        [upperKey]: (prev[upperKey] || 0) + 1
      }));
    }
  };

  // --- 再戦を最初からやり直す (即時再戦) ---
  const handleRetry = () => {
    setPlayerHp(100);
    setEnemyHp(enemy.hp);
    setIsGameOver(false);
    setIsProcessing(false);
    setPhraseMissCount(0);
    setStartTime(null);
    setCombatFeedbacks(null);
    loadNextPhrase(enemy);
  };

  // 諦める/いいえの時の遷移
  const handleExit = () => {
    onBackToSelect();
  };

  // 通常モードの除霊成功ボタン
  const handleWinConfirm = () => {
    if (onWinStage) {
      onWinStage(stageNum);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-stone-950 text-stone-100 py-4 md:py-6 px-4 relative overflow-hidden select-none">
      {/* 隠しインプット（タイピング入力イベント用） */}
      <input
        ref={keyInputRef}
        type="text"
        className="absolute -top-40 opacity-0 pointer-events-none"
        onKeyDown={onKeyDown}
        value=""
        onChange={() => {}}
      />

      {/* 画面ヘッダー：諦めて戻るボタン / 時間制限 */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-4 z-10" id="battle-header">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-600 rounded text-red-400 text-xs cursor-pointer shadow-md font-serif"
          id="btn-give-up"
        >
          諦めて戻る
        </button>

        {mode === "random" ? (
          <div className="flex items-center gap-2 bg-stone-900 border border-amber-900/40 px-4 py-1.5 rounded-full font-mono text-sm shadow-md" id="random-timer">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-stone-300">残り時間: </span>
            <span className={`font-bold ${timeLeft <= 30 ? "text-red-500 animate-bounce" : "text-amber-500"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-amber-600 font-serif tracking-widest" id="stage-badge">
            第{stageNum}幕 : {enemy.name}除霊戦
          </div>
        )}

        <div className="text-stone-500 font-mono text-[10px]" id="click-focus-hint">
          ※打てない場合は画面をクリック
        </div>
      </div>

      {/* 画面中央：戦闘ビジュアルエリア */}
      <div 
        className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between z-10 my-auto flex-grow"
        onClick={() => keyInputRef.current?.focus()}
        id="battle-arena"
      >
        {/* 妖怪：左側 */}
        <div 
          className={`flex-grow md:w-3/5 border-2 p-4 md:p-6 rounded-lg bg-stone-900/30 shadow-2xl relative transition-all duration-150 flex flex-col items-center justify-center min-h-[220px] md:min-h-[280px] ${
            isEnemyDamaged 
              ? "border-red-600 bg-red-950/10 scale-95" 
              : "border-amber-900/30"
          }`}
          id="enemy-panel"
        >
          {/* 妖怪名とHPバー */}
          <div className="w-full mb-4 text-center">
            <h2 className="text-xl md:text-3xl font-bold font-serif text-stone-100 tracking-wider mb-1.5">
              {enemy.name}
            </h2>
            <div className="w-full bg-stone-950 h-4 border border-stone-800 rounded overflow-hidden relative shadow-inner">
              <div 
                className="bg-red-700 h-full transition-all duration-300" 
                style={{ width: `${(enemyHp / enemy.hp) * 100}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-stone-300">
                HP {enemyHp} / {enemy.hp}
              </span>
            </div>
          </div>

          {/* 妖怪のシンボリックなビジュアル / 立ち絵 */}
          {enemy.image ? (
            <div className="relative w-64 md:w-80 aspect-video bg-stone-950 border border-amber-900/40 rounded-lg overflow-hidden shadow-2xl mb-4 flex items-center justify-center">
              <img 
                src={enemy.image} 
                alt={enemy.name} 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300 filter brightness-90 contrast-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 to-transparent h-16"></div>
              {/* 薄暗い和風の霧のような妖気エフェクト */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(180,50,50,0.06),transparent_80%)] animate-pulse"></div>
            </div>
          ) : (
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-stone-950 border border-stone-800 rounded-full flex items-center justify-center shadow-lg mb-3 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,100,50,0.1),transparent_70%)] animate-pulse"></div>
              {/* 巨大な漢字影絵 */}
              <div className="absolute font-serif text-6xl md:text-8xl text-stone-900/60 font-bold select-none">
                {enemy.name[0]}
              </div>
              {/* 動的なシンボル */}
              <div className="z-10 text-stone-300 font-serif text-xl md:text-2xl">
                {enemy.name[0]}
              </div>
            </div>
          )}

          {/* 敵の基準ステータス */}
          <div className="flex gap-4 text-stone-500 font-mono text-[10px]">
            <span>最大体力: {enemy.hp}</span>
            <span>基準攻撃力: {enemy.attack}</span>
          </div>
        </div>

        {/* プレイヤー：右側 */}
        <div 
          className={`w-full md:w-1/3 border-2 p-4 md:p-6 rounded-lg bg-stone-900/30 shadow-2xl relative transition-all duration-150 flex flex-col justify-between min-h-[220px] md:min-h-[280px] ${
            isPlayerDamaged 
              ? "border-red-600 bg-red-950/20 scale-95" 
              : "border-stone-800/60"
          }`}
          id="player-panel"
        >
          <div className="text-center md:text-left border-b border-stone-800/50 pb-4">
            <span className="text-xs text-stone-500 font-serif tracking-widest uppercase block mb-1">
              陰陽師 (プレイヤー)
            </span>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
              <span className="font-mono text-2xl font-bold tracking-wider">
                {playerHp} <span className="text-xs text-stone-500">/ 100</span>
              </span>
            </div>
            {/* HPバー */}
            <div className="w-full bg-stone-950 h-2 border border-stone-800 rounded overflow-hidden mt-3 shadow-inner">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300" 
                style={{ width: `${playerHp}%` }}
              ></div>
            </div>
          </div>

          {/* 戦闘ログ・攻防フィードバック */}
          <div className="my-6 flex-grow flex flex-col justify-center items-center text-center font-serif h-24" id="combat-feedback">
            {combatFeedbacks ? (
              <div className="animate-fade-in space-y-2">
                {/* プレイヤーの攻撃評価 */}
                <div>
                  <span className={`text-xs px-1.5 py-0.5 rounded border mr-1.5 ${
                    combatFeedbacks.playerRating === "大" 
                      ? "bg-red-950/40 border-red-900 text-red-400" 
                      : combatFeedbacks.playerRating === "中"
                      ? "bg-amber-950/40 border-amber-900 text-amber-400"
                      : "bg-stone-950 border-stone-800 text-stone-400"
                  }`}>
                    {combatFeedbacks.playerRating}ダメージ
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    妖怪へ <span className="text-red-500">{combatFeedbacks.playerDamage}</span> ダメージ！
                  </span>
                </div>

                {/* 被ダメージ・シールド評価 */}
                <div className="pt-2 border-t border-stone-900/60 text-xs">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border mr-1.5 ${
                    combatFeedbacks.shieldStatus === "完全ガード" 
                      ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" 
                      : combatFeedbacks.shieldStatus === "半減"
                      ? "bg-amber-950/40 border-amber-900 text-amber-500"
                      : "bg-red-950/40 border-red-900 text-red-500"
                  }`}>
                    {combatFeedbacks.shieldStatus}
                  </span>
                  <span className="text-stone-400">
                    {combatFeedbacks.shieldStatus === "完全ガード" 
                      ? "攻撃を受け流した！" 
                      : `妖怪から ${combatFeedbacks.enemyDamage} ダメージを受けた。`}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-stone-500 text-xs tracking-wide">
                タイピングを開始すると、ここに攻防の結果が表示されます。
              </span>
            )}
          </div>

          <div className="text-center font-mono text-[10px] text-stone-600 border-t border-stone-900/60 pt-3">
            {mode === "random" ? `除霊数: ${defeatedCount}` : "完全除霊を目指せ"}
          </div>
        </div>
      </div>

      {/* 画面下部：タイピング文章表示エリア */}
      <div 
        className="w-full max-w-4xl mx-auto bg-stone-950 border-2 border-amber-900/30 hover:border-amber-800/60 p-6 md:p-8 rounded-lg shadow-2xl relative z-10 mb-4 transition-all"
        onClick={() => keyInputRef.current?.focus()}
        id="typing-field"
      >
        {/* 和風の四隅の飾り */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40"></div>

        <div className="flex flex-col items-center justify-center text-center w-full overflow-hidden">
          {/* 1. ひらがな（ルビ） */}
          <div className="text-xs sm:text-sm text-amber-600/90 font-serif tracking-widest mb-1.5 min-h-[24px] whitespace-nowrap overflow-x-auto scrollbar-none max-w-full text-center">
            {currentPhrase.hiragana}
          </div>

          {/* 2. 漢字かな交じり文 */}
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-serif text-stone-100 tracking-wide mb-6 select-text whitespace-nowrap overflow-x-auto scrollbar-none max-w-full text-center">
            {currentPhrase.kanji}
          </div>

          {/* 3. ローマ字ガイド */}
          <div className="font-mono text-[11px] sm:text-xs md:text-sm lg:text-base tracking-wider bg-stone-900/60 border border-stone-900 px-4 py-3 rounded-md w-full max-w-2xl shadow-inner min-h-[52px] flex justify-center items-center overflow-x-auto scrollbar-none">
            <div className="whitespace-nowrap">
              {/* 入力済みの文字 */}
              <span className="text-stone-500 bg-stone-950/40 rounded-sm px-0.5 py-0.2">
                {typingState.typedRomaji}
                {typingState.currentRomajiInput}
              </span>
              {/* 未入力の文字 */}
              <span className="text-stone-100 font-bold px-0.5 py-0.2">
                {typingState.remainingRomajiGuide}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 敗北時（ゲームオーバー）の挙動ダイアログ */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 border-2 border-red-950 text-stone-100 p-8 rounded-lg max-w-sm w-full shadow-2xl relative text-center">
            {/* 警告アイコン */}
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-3xl font-bold font-serif text-red-500 tracking-widest mb-4">
              あなたは気を失った
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed mb-8 font-serif">
              もう一度挑戦しますか？
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-red-800 hover:bg-red-700 border border-red-600 rounded text-red-100 font-medium transition-all text-sm cursor-pointer shadow-md min-w-[100px]"
                id="btn-retry-yes"
              >
                <RefreshCw className="w-4 h-4" />
                はい
              </button>
              <button
                onClick={handleExit}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-stone-300 font-medium transition-all text-sm cursor-pointer shadow-md min-w-[100px]"
                id="btn-retry-no"
              >
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ステージモードクリア時ダイアログ */}
      {isStageCleared && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 border-2 border-amber-800 text-stone-100 p-8 rounded-lg max-w-sm w-full shadow-2xl relative text-center">
            {/* 成功アイコン */}
            <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-600 flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-3xl font-bold font-serif text-amber-500 tracking-widest mb-4">
              除霊成功
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed mb-8 font-serif">
              見事に「{enemy.name}」を除霊いたしました。
              <br />
              お見事でございます。
            </p>

            <button
              onClick={handleWinConfirm}
              className="w-full py-3 bg-amber-800 hover:bg-amber-700 border border-amber-600 rounded text-amber-100 font-medium transition-all text-sm cursor-pointer shadow-md"
              id="btn-win-confirm"
            >
              次へ進む
            </button>
          </div>
        </div>
      )}

      {/* ランダムモード・リザルト表示画面 */}
      {isResultOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-stone-950 border-2 border-amber-800 text-stone-100 p-8 rounded-lg max-w-lg w-full shadow-2xl relative my-8">
            {/* 和風の四隅の飾り */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40"></div>

            <div className="text-center mb-6 border-b border-stone-800 pb-4">
              <h2 className="text-3xl font-bold font-serif text-amber-500 tracking-widest mb-1">
                除霊回顧結果
              </h2>
              <span className="text-[10px] text-stone-500 font-mono">THREE MINUTES LIMIT RESULTS</span>
            </div>

            {/* スコア・主要項目 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-stone-900/60 border border-stone-900 p-4 rounded text-center">
                <span className="text-xs text-stone-500 font-serif block mb-1">総合スコア</span>
                <span className="text-4xl font-mono font-bold text-amber-500">
                  {Math.round((totalTypedCorrectly / (((180 - timeLeft) / 60) || 0.01)) * ((totalKeys > 0 ? (totalTypedCorrectly / totalKeys) : 100) / 100)) || 0}
                </span>
              </div>
              <div className="bg-stone-900/60 border border-stone-900 p-4 rounded text-center">
                <span className="text-xs text-stone-500 font-serif block mb-1">討伐妖怪数</span>
                <span className="text-4xl font-mono font-bold text-stone-100">
                  {defeatedCount} <span className="text-xs text-stone-500">体</span>
                </span>
              </div>
            </div>

            {/* 詳細ステータス */}
            <div className="space-y-3 mb-8 border-b border-stone-800/50 pb-6 text-sm">
              <div className="flex justify-between items-center font-serif text-stone-400">
                <span>平均入力速度 (CPM)</span>
                <span className="font-mono text-stone-200">
                  {Math.round(totalTypedCorrectly / (((180 - timeLeft) / 60) || 0.01)) || 0} 字/分
                </span>
              </div>
              <div className="flex justify-between items-center font-serif text-stone-400">
                <span>入力精度 (%)</span>
                <span className="font-mono text-stone-200">
                  {(totalKeys > 0 ? (totalTypedCorrectly / totalKeys) * 100 : 100).toFixed(1)} %
                </span>
              </div>
              <div className="flex justify-between items-center font-serif text-stone-400">
                <span>総文字入力数</span>
                <span className="font-mono text-stone-200">
                  {totalTypedCorrectly} 字
                </span>
              </div>
              <div className="flex justify-between items-center font-serif text-stone-400">
                <span>入力ミス数</span>
                <span className="font-mono text-red-500 font-bold">
                  {totalMisses} 字
                </span>
              </div>
              <div className="flex justify-between items-center font-serif text-stone-400">
                <span>最頻ミスキー</span>
                <span className="font-mono text-stone-200 uppercase font-bold">
                  {(() => {
                    let key = "";
                    let max = 0;
                    Object.entries(missedKeysMap).forEach(([k, count]) => {
                      const val = count as number;
                      if (val > max) {
                        max = val;
                        key = k;
                      }
                    });
                    return key ? (
                      <span className="px-1.5 py-0.5 bg-red-950/40 border border-red-900/30 rounded text-red-400 text-xs">
                        {key}
                      </span>
                    ) : (
                      "—"
                    );
                  })()}
                </span>
              </div>
            </div>

            <button
              onClick={handleExit}
              className="w-full py-3 bg-amber-800 hover:bg-amber-700 border border-amber-600 rounded text-amber-100 font-medium transition-all text-sm cursor-pointer shadow-md font-serif tracking-widest"
              id="btn-result-close"
            >
              回顧録に記録し、退出
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
