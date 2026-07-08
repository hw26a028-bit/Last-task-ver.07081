import React, { useState } from "react";
import { ArrowLeft, Lock, Skull, CheckCircle } from "lucide-react";
import { YOKAI_LIST } from "../data";
import { ConfirmDialog } from "./ConfirmDialog";

interface StageSelectScreenProps {
  stageCleared: boolean[];
  onStartStage: (stageNum: number) => void;
  onBack: () => void;
}

export const StageSelectScreen: React.FC<StageSelectScreenProps> = ({
  stageCleared,
  onStartStage,
  onBack
}) => {
  const [selectedStageNum, setSelectedStageNum] = useState<number | null>(null);

  // 特定のステージが解放されているか判定
  const isStageUnlocked = (stageNum: number): boolean => {
    if (stageNum === 1) return true;
    // 1つ前のステージ（インデックス stageNum - 2）がクリアされているか
    return stageCleared[stageNum - 2] === true;
  };

  return (
    <div className="flex flex-col h-full bg-stone-950 text-stone-100 py-6 md:py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.05),transparent_80%)] pointer-events-none"></div>

      {/* 画面ヘッダー */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-10 z-10" id="stage-select-header">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md font-serif"
          id="btn-back-to-modes"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 tracking-widest border-b border-amber-800/40 pb-2 pr-6">
          ステージ選択
        </h1>
        <span className="text-amber-600/60 text-xs font-mono tracking-widest hidden sm:inline" id="stage-select-nav-hint">
          STAGE SELECT
        </span>
      </div>

      {/* ステージグリッド */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 pb-4 z-10 overflow-y-auto flex-grow pr-1 scrollbar-thin" id="stage-grid">
        {YOKAI_LIST.map((yokai) => {
          const unlocked = isStageUnlocked(yokai.stage);
          const cleared = stageCleared[yokai.stage - 1] === true;

          return (
            <div key={yokai.stage} className="relative">
              {unlocked ? (
                <button
                  onClick={() => setSelectedStageNum(yokai.stage)}
                  className={`w-full h-full text-left p-5 rounded bg-stone-900/80 hover:bg-amber-950/20 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative shadow-md group ${
                    cleared 
                      ? "border-amber-900/40 hover:border-amber-600/80" 
                      : "border-stone-800 hover:border-amber-800"
                  }`}
                  id={`btn-stage-${yokai.stage}`}
                >
                  <div className="flex justify-between items-start w-full mb-3">
                    <span className="text-xs font-mono font-medium text-amber-600 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">
                      第{yokai.stage}幕
                    </span>
                    {cleared && (
                      <span className="flex items-center gap-1 text-xs text-emerald-500 font-serif" id={`cleared-stage-${yokai.stage}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        除霊
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-serif text-stone-100 group-hover:text-amber-400 transition-colors mb-1">
                      {yokai.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      体力: {yokai.hp} / 攻撃: {yokai.attack}
                    </p>
                  </div>
                </button>
              ) : (
                <div
                  className="w-full h-full p-5 rounded bg-stone-950/40 border-2 border-stone-900/60 opacity-60 flex flex-col justify-between select-none shadow-sm relative"
                  id={`stage-locked-${yokai.stage}`}
                >
                  <div className="flex justify-between items-start w-full mb-3">
                    <span className="text-xs font-mono text-stone-600">
                      第{yokai.stage}幕
                    </span>
                    <Lock className="w-4 h-4 text-stone-700" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-serif text-stone-600">
                      封印中
                    </h3>
                    <p className="text-xs text-stone-700 font-mono mt-1">
                      ???
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 開始意思確認ダイアログ */}
      <ConfirmDialog
        isOpen={selectedStageNum !== null}
        title="除霊の開始"
        message={`「第${selectedStageNum}幕：${
          selectedStageNum ? YOKAI_LIST.find(y => y.stage === selectedStageNum)?.name : ""
        }」の除霊を開始します。よろしいですか？`}
        onConfirm={() => {
          if (selectedStageNum) {
            onStartStage(selectedStageNum);
          }
          setSelectedStageNum(null);
        }}
        onCancel={() => setSelectedStageNum(null)}
      />
    </div>
  );
};
