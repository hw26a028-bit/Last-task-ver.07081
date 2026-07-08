import React, { useState } from "react";
import { ArrowLeft, BookOpen, Key } from "lucide-react";
import { STAGE_PHRASES, YOKAI_LIST } from "../data";

interface PhraseListScreenProps {
  onBack: () => void;
  stageCleared: boolean[];
}

export const PhraseListScreen: React.FC<PhraseListScreenProps> = ({
  onBack,
  stageCleared
}) => {
  const firstClearedStage = YOKAI_LIST.find(y => stageCleared[y.stage - 1])?.stage || null;
  const [selectedStage, setSelectedStage] = useState<number | null>(firstClearedStage);

  const currentPhrases = selectedStage ? (STAGE_PHRASES[selectedStage] || []) : [];
  const currentYokaiName = selectedStage ? (YOKAI_LIST.find(y => y.stage === selectedStage)?.name || "") : "";

  return (
    <div className="flex flex-col h-full bg-stone-950 text-stone-100 py-6 md:py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.05),transparent_80%)] pointer-events-none"></div>

      {/* 画面ヘッダー */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10" id="phrases-header">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md font-serif"
          id="btn-back-to-title"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 tracking-widest border-b border-amber-800/40 pb-2 pr-6">
          文章一覧
        </h1>
        <span className="text-amber-600/60 text-xs font-mono tracking-widest hidden sm:inline" id="phrases-nav-hint">
          PHRASE LIST
        </span>
      </div>

      {/* メインレイアウト（2カラム） */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 z-10 flex-grow items-stretch overflow-hidden mb-4" id="phrases-main">
        {/* 左側：ステージ選択 */}
        <div className="w-full md:w-1/4 bg-stone-900/40 border border-stone-900 rounded p-4 flex flex-col gap-1.5 h-full overflow-y-auto scrollbar-thin" id="phrases-stage-list">
          <span className="text-xs text-stone-500 font-serif tracking-widest mb-2 px-1">
            妖怪
          </span>
          {YOKAI_LIST.map((yokai) => {
            const isCleared = stageCleared[yokai.stage - 1];
            const active = yokai.stage === selectedStage;

            return (
              <button
                key={yokai.stage}
                disabled={!isCleared}
                onClick={() => setSelectedStage(yokai.stage)}
                className={`w-full text-left py-2.5 px-3.5 rounded border font-serif text-xs transition-all flex items-center justify-between ${
                  !isCleared
                    ? "bg-stone-950/20 border-stone-950/40 text-stone-600 cursor-not-allowed"
                    : active
                    ? "bg-amber-950/30 border-amber-600 text-amber-200 cursor-pointer"
                    : "bg-stone-950/40 border-stone-900/80 text-stone-400 hover:text-stone-200 hover:border-stone-800 cursor-pointer"
                }`}
                id={`btn-phrase-stage-${yokai.stage}`}
              >
                <span>
                  第{yokai.stage}幕 : {isCleared ? yokai.name : "???"}
                </span>
                {!isCleared && <Key className="w-3.5 h-3.5 text-stone-800 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* 右側：文章リスト */}
        <div className="flex-grow md:w-3/4 bg-stone-900/40 border border-stone-900 rounded p-6 flex flex-col h-full overflow-hidden" id="phrases-detail-list">
          {selectedStage ? (
            <>
              <div className="border-b border-stone-800 pb-3 mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-amber-500">
                  第{selectedStage}幕 : {currentYokaiName} の文章
                </h2>
                <span className="text-xs text-stone-500 font-mono">計 {currentPhrases.length} 文</span>
              </div>

              <div className="flex flex-col gap-6 overflow-y-auto flex-grow pr-2 scrollbar-thin" id="phrases-scroller">
                {currentPhrases.map((phrase, idx) => (
                  <div 
                    key={idx} 
                    className="bg-stone-950/60 border border-stone-900 p-5 rounded relative group hover:border-amber-900/40 transition-all shadow-inner"
                    id={`phrase-card-${selectedStage}-${idx}`}
                  >
                    {/* 章数字マーク */}
                    <div className="absolute top-4 right-4 text-stone-800 font-mono text-sm group-hover:text-amber-900/40 transition-colors select-none">
                      #{idx + 1}
                    </div>

                    {/* ひらがな（ルビ） */}
                    <div className="text-[11px] sm:text-xs text-amber-600 font-serif mb-1 pl-1 tracking-wide whitespace-nowrap overflow-x-auto scrollbar-none max-w-full">
                      {phrase.hiragana}
                    </div>

                    {/* 漢字かな（メイン） */}
                    <div className="text-sm sm:text-base md:text-lg font-bold font-serif text-stone-200 mb-3 pl-1 tracking-wide whitespace-nowrap overflow-x-auto scrollbar-none max-w-full">
                      {phrase.kanji}
                    </div>

                    {/* ローマ字表記 */}
                    <div className="flex items-center gap-2 pl-1.5 py-1 px-2.5 bg-stone-950 border border-stone-900 rounded w-full max-w-full text-[10px] sm:text-xs font-mono text-stone-500 shadow-sm overflow-x-auto scrollbar-none whitespace-nowrap">
                      <BookOpen className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                      <span>{phrase.romaji}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6" id="phrases-locked-placeholder">
              <Key className="w-16 h-16 text-stone-800 mb-4 animate-pulse" />
              <h3 className="text-lg font-serif font-bold text-stone-400 mb-2">文章が封印されています</h3>
              <p className="text-xs text-stone-500 font-serif leading-relaxed max-w-sm">
                ステージモードで妖怪を除霊すると、その妖怪に紐づく「文章」が解放され、ここに記録されます。
                <br />
                まずは妖怪を退治して文章を解き放ちましょう。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
