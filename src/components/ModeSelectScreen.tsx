import React from "react";
import { Lock, ArrowLeft, BookOpen, Skull, Zap } from "lucide-react";

interface ModeSelectScreenProps {
  onSelectStageMode: () => void;
  onSelectRandomMode: () => void;
  onSelectEncyclopedia: () => void;
  onSelectPhrases: () => void;
  onBackToTitle: () => void;
  isRandomModeUnlocked: boolean;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onSelectStageMode,
  onSelectRandomMode,
  onSelectEncyclopedia,
  onSelectPhrases,
  onBackToTitle,
  isRandomModeUnlocked
}) => {
  return (
    <div className="flex flex-col items-center justify-between h-full py-8 md:py-12 px-4 bg-radial from-stone-900 to-black text-stone-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.08),transparent_70%)] pointer-events-none"></div>

      {/* 画面上部：ヘッダーと戻るボタン */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 z-10" id="mode-select-header">
        <button
          onClick={onBackToTitle}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md font-serif"
          id="btn-back-to-title"
        >
          <ArrowLeft className="w-4 h-4" />
          タイトルへ戻る
        </button>
        <span className="text-amber-600/60 text-xs font-mono tracking-widest hidden sm:inline" id="mode-select-nav-hint">
          SELECT MODE
        </span>
      </div>

      {/* 画面中央：モード選択（横並び） */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl my-auto z-10" id="mode-select-cards">
        {/* ステージモード */}
        <button
          onClick={onSelectStageMode}
          className="flex-1 group bg-stone-950/80 hover:bg-amber-950/20 border-2 border-amber-900/40 hover:border-amber-700/80 p-8 rounded-lg text-left transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]"
          id="btn-mode-stage"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
            <Skull className="w-24 h-24 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded bg-red-950/50 border border-red-900/80">
                <Skull className="w-5 h-5 text-red-500" />
              </span>
              <h2 className="text-2xl font-bold font-serif text-stone-100 group-hover:text-amber-400 transition-colors">
                ステージモード
              </h2>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed font-sans">
              全13ステージの妖怪たちに立ち向かうメインモード。
              1つずつ順番に妖怪を除霊し、深淵へと進みます。
            </p>
          </div>
          <div className="text-xs text-amber-600 font-serif tracking-widest mt-6 group-hover:translate-x-1 transition-transform">
            参る ➔
          </div>
        </button>

        {/* 時間制限モード（ランダムモード） */}
        {isRandomModeUnlocked ? (
          <button
            onClick={onSelectRandomMode}
            className="flex-1 group bg-stone-950/80 hover:bg-amber-950/20 border-2 border-amber-900/40 hover:border-amber-700/80 p-8 rounded-lg text-left transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]"
            id="btn-mode-random"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
              <Zap className="w-24 h-24 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded bg-amber-950/50 border border-amber-900/80">
                  <Zap className="w-5 h-5 text-amber-500" />
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-100 group-hover:text-amber-400 transition-colors">
                  時間制限モード
                </h2>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed font-sans">
                制限時間3分間のランダム戦闘。
                次々と出現する妖怪を討ち倒し、己の極限（ハイスコア）に挑戦します。
              </p>
            </div>
            <div className="text-xs text-amber-600 font-serif tracking-widest mt-6 group-hover:translate-x-1 transition-transform">
              挑戦する ➔
            </div>
          </button>
        ) : (
          <div
            className="flex-1 bg-stone-950/40 border-2 border-stone-900 p-8 rounded-lg text-left shadow-xl relative flex flex-col justify-between min-h-[220px] opacity-65 select-none"
            id="btn-mode-random-locked"
          >
            <div className="absolute top-4 right-4 text-stone-700">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded bg-stone-900 border border-stone-800">
                  <Lock className="w-5 h-5 text-stone-500" />
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-500">
                  時間制限モード
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed font-sans">
                制限時間3分間のハイスコア挑戦モード（ランダム戦闘）。
              </p>
            </div>
            <div className="text-xs text-red-700/90 font-serif mt-6">
              ※全13ステージをすべてクリアすると解放されます。
            </div>
          </div>
        )}
      </div>

      {/* 画面下部中央：妖怪図鑑と文章一覧 */}
      <div className="w-full max-w-lg flex flex-row gap-4 justify-center mt-12 z-10" id="mode-select-footer-btn">
        <button
          onClick={onSelectEncyclopedia}
          className="flex-1 group flex items-center justify-center gap-3 px-6 py-4 bg-stone-950/80 hover:bg-stone-900 border border-amber-900/60 hover:border-amber-700 rounded-lg text-stone-200 transition-all duration-300 shadow-md cursor-pointer"
          id="btn-go-encyclopedia"
        >
          <BookOpen className="w-5 h-5 text-amber-600 group-hover:text-amber-400 transition-colors shrink-0" />
          <span className="font-serif tracking-widest text-sm sm:text-base">妖怪図鑑</span>
        </button>

        <button
          onClick={onSelectPhrases}
          className="flex-1 group flex items-center justify-center gap-3 px-6 py-4 bg-stone-950/80 hover:bg-stone-900 border border-amber-900/60 hover:border-amber-700 rounded-lg text-stone-200 transition-all duration-300 shadow-md cursor-pointer"
          id="btn-go-phrases"
        >
          <BookOpen className="w-5 h-5 text-amber-600 group-hover:text-amber-400 transition-colors shrink-0" />
          <span className="font-serif tracking-widest text-sm sm:text-base">文章一覧</span>
        </button>
      </div>
    </div>
  );
};
