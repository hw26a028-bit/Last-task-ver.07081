import { useState, useEffect } from "react";
import { TitleScreen } from "./components/TitleScreen";
import { ModeSelectScreen } from "./components/ModeSelectScreen";
import { StageSelectScreen } from "./components/StageSelectScreen";
import { RandomModeScreen } from "./components/RandomModeScreen";
import { YokaiEncyclopedia } from "./components/YokaiEncyclopedia";
import { PhraseListScreen } from "./components/PhraseListScreen";
import { BattleScreen } from "./components/BattleScreen";
import { PlayLog } from "./types";
import { audio } from "./lib/audio";

type ScreenState = 
  | "title" 
  | "modes" 
  | "stages" 
  | "randomHub" 
  | "encyclopedia" 
  | "phrases" 
  | "battle";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("title");
  const [stageCleared, setStageCleared] = useState<boolean[]>(() => {
    const saved = localStorage.getItem("yokai_stage_cleared");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // エラー時は初期値
      }
    }
    return Array(13).fill(false);
  });

  const [logs, setLogs] = useState<PlayLog[]>(() => {
    const saved = localStorage.getItem("yokai_play_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // エラー時は初期値
      }
    }
    return [];
  });

  const [activeStageNum, setActiveStageNum] = useState<number>(1);
  const [activeBattleMode, setActiveBattleMode] = useState<"stage" | "random">("stage");

  // セーブ処理の永続化
  useEffect(() => {
    localStorage.setItem("yokai_stage_cleared", JSON.stringify(stageCleared));
  }, [stageCleared]);

  useEffect(() => {
    localStorage.setItem("yokai_play_logs", JSON.stringify(logs));
  }, [logs]);

  // 全13ステージクリア状況の確認（時間制限モードのアンロック）
  const isRandomModeUnlocked = stageCleared.every(cleared => cleared === true);

  // 画面遷移に合わせたBGMの自動切り替え
  useEffect(() => {
    if (currentScreen === "battle") {
      audio.playBgm("battle");
    } else {
      audio.playBgm("normal");
    }
  }, [currentScreen]);

  // グローバルクリックでのオーディオレジューム ＆ ボタンクリック音適用
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      audio.resume();
      
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("[role='button']") || target.id.startsWith("btn-")) {
        audio.playClick();
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // --- 各アクション処理 ---

  // 通常ステージモード開始
  const handleStartStage = (stageNum: number) => {
    setActiveStageNum(stageNum);
    setActiveBattleMode("stage");
    setCurrentScreen("battle");
  };

  // ランダムモード（タイピングモード）開始
  const handleStartRandomTyping = () => {
    setActiveBattleMode("random");
    setCurrentScreen("battle");
  };

  // 通常ステージ除霊成功時の処理
  const handleWinStage = (stageNum: number) => {
    setStageCleared(prev => {
      const updated = [...prev];
      updated[stageNum - 1] = true;
      return updated;
    });
    // ステージセレクト画面へ戻る
    setCurrentScreen("stages");
  };

  // ランダムモード終了時のログ保存
  const handleSaveRandomResult = (result: Omit<PlayLog, "id" | "date">) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newLog: PlayLog = {
      ...result,
      id: Math.random().toString(36).substring(2, 11),
      date: dateStr
    };

    setLogs(prev => {
      // 最新のログを先頭に挿入
      const updated = [newLog, ...prev];
      // 直近25件までを保存（それを超えたら古いものを削除）
      if (updated.length > 25) {
        return updated.slice(0, 25);
      }
      return updated;
    });
  };

  // データ初期化
  const handleResetData = () => {
    setStageCleared(Array(13).fill(false));
    setLogs([]);
    localStorage.removeItem("yokai_stage_cleared");
    localStorage.removeItem("yokai_play_logs");
    setCurrentScreen("title");
  };

  // --- 画面レンダリング ---
  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-stone-100 flex flex-col" id="app-root">
      {currentScreen === "title" && (
        <TitleScreen
          onStart={() => setCurrentScreen("modes")}
          onResetData={handleResetData}
        />
      )}

      {currentScreen === "modes" && (
        <ModeSelectScreen
          onSelectStageMode={() => setCurrentScreen("stages")}
          onSelectRandomMode={() => setCurrentScreen("randomHub")}
          onSelectEncyclopedia={() => setCurrentScreen("encyclopedia")}
          onSelectPhrases={() => setCurrentScreen("phrases")}
          onBackToTitle={() => setCurrentScreen("title")}
          isRandomModeUnlocked={isRandomModeUnlocked}
        />
      )}

      {currentScreen === "stages" && (
        <StageSelectScreen
          stageCleared={stageCleared}
          onStartStage={handleStartStage}
          onBack={() => setCurrentScreen("modes")}
        />
      )}

      {currentScreen === "randomHub" && (
        <RandomModeScreen
          logs={logs}
          onStartRandomTyping={handleStartRandomTyping}
          onBack={() => setCurrentScreen("modes")}
        />
      )}

      {currentScreen === "encyclopedia" && (
        <YokaiEncyclopedia
          stageCleared={stageCleared}
          onBack={() => setCurrentScreen("modes")}
        />
      )}

      {currentScreen === "phrases" && (
        <PhraseListScreen
          stageCleared={stageCleared}
          onBack={() => setCurrentScreen("modes")}
        />
      )}

      {currentScreen === "battle" && (
        <BattleScreen
          mode={activeBattleMode}
          stageNum={activeStageNum}
          onWinStage={handleWinStage}
          onBackToSelect={() => {
            if (activeBattleMode === "stage") {
              setCurrentScreen("stages");
            } else {
              setCurrentScreen("randomHub");
            }
          }}
          onSaveRandomResult={handleSaveRandomResult}
        />
      )}
    </div>
  );
}
