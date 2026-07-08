import React, { useState } from "react";
import { ArrowLeft, Skull, Heart, Shield, HelpCircle, Eye } from "lucide-react";
import { YOKAI_LIST } from "../data";

interface YokaiEncyclopediaProps {
  stageCleared: boolean[];
  onBack: () => void;
}

export const YokaiEncyclopedia: React.FC<YokaiEncyclopediaProps> = ({
  stageCleared,
  onBack
}) => {
  const [selectedYokaiIndex, setSelectedYokaiIndex] = useState<number>(0);

  // 撃破（クリア）されているか判定
  const isDefeated = (stageNum: number): boolean => {
    return stageCleared[stageNum - 1] === true;
  };

  const currentYokai = YOKAI_LIST[selectedYokaiIndex];
  const currentUnlocked = isDefeated(currentYokai.stage);

  return (
    <div className="flex flex-col h-full bg-stone-950 text-stone-100 py-6 md:py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.05),transparent_80%)] pointer-events-none"></div>

      {/* 画面ヘッダー */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10" id="encyclopedia-header">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md font-serif"
          id="btn-back-to-modes"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 tracking-widest border-b border-amber-800/40 pb-2 pr-6">
          妖怪図鑑
        </h1>
        <span className="text-amber-600/60 text-xs font-mono tracking-widest hidden sm:inline" id="encyclopedia-nav-hint">
          YOKAI ENCYCLOPEDIA
        </span>
      </div>

      {/* メインレイアウト（2カラム） */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 z-10 flex-grow items-stretch overflow-hidden mb-4" id="encyclopedia-main">
        {/* 左側：妖怪リスト */}
        <div className="w-full md:w-1/3 bg-stone-900/40 border border-stone-900 rounded p-4 flex flex-col gap-2 h-full overflow-y-auto scrollbar-thin" id="encyclopedia-list">
          <span className="text-xs text-stone-500 font-serif tracking-widest mb-2 px-1">
            妖怪百選
          </span>
          {YOKAI_LIST.map((yokai, idx) => {
            const unlocked = isDefeated(yokai.stage);
            const active = idx === selectedYokaiIndex;

            return (
              <button
                key={yokai.stage}
                onClick={() => setSelectedYokaiIndex(idx)}
                className={`w-full text-left py-3 px-4 rounded border font-serif text-sm transition-all flex items-center justify-between cursor-pointer ${
                  active
                    ? "bg-amber-950/30 border-amber-600 text-amber-200"
                    : "bg-stone-950/40 border-stone-900/80 text-stone-400 hover:text-stone-200 hover:border-stone-800"
                }`}
                id={`btn-encyclopedia-item-${yokai.stage}`}
              >
                <span>
                  <span className="font-mono text-[10px] text-amber-600/60 mr-2">
                    {String(yokai.stage).padStart(2, "0")}
                  </span>
                  {unlocked ? yokai.name : "？？？？？"}
                </span>

                {unlocked ? (
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Skull className="w-3.5 h-3.5 text-stone-700" />
                )}
              </button>
            );
          })}
        </div>

        {/* 右側：詳細表示 */}
        <div className="flex-grow md:w-2/3 bg-stone-900/40 border border-stone-900 rounded p-6 flex flex-col justify-between overflow-y-auto scrollbar-thin h-full" id="encyclopedia-detail">
          {currentUnlocked ? (
            <div className="flex flex-col h-full justify-between" id="encyclopedia-detail-unlocked">
              {/* 妖怪の和風おしゃれグラフィックプレースホルダー */}
              <div className="relative w-full h-48 bg-stone-950 border border-stone-900 rounded mb-6 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,100,20,0.1),transparent_70%)]"></div>
                
                {/* 妖怪名の巨大漢字影絵 */}
                <div className="absolute font-serif text-9xl text-stone-900/60 select-none pointer-events-none font-bold">
                  {currentYokai.name[0]}
                </div>

                {/* 妖怪の姿のシンボリック表示 */}
                <div className="z-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-amber-800 flex items-center justify-center mb-3 bg-stone-900/80 shadow-lg text-amber-500 text-2xl font-serif">
                    {currentYokai.name[0]}
                  </div>
                  <span className="text-[10px] text-amber-600 font-serif tracking-[0.2em] uppercase">
                    第{currentYokai.stage}幕の妖怪
                  </span>
                </div>
              </div>

              {/* 名前と説明 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 border-b border-stone-800 pb-3 mb-4">
                  <h2 className="text-3xl font-bold font-serif text-amber-500">
                    {currentYokai.name}
                  </h2>
                </div>

                {/* パラメータ */}
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 bg-stone-950/60 border border-stone-900 px-3 py-1.5 rounded text-sm font-mono text-stone-300 shadow-inner">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span>体力: {currentYokai.hp}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-950/60 border border-stone-900 px-3 py-1.5 rounded text-sm font-mono text-stone-300 shadow-inner">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>基準攻撃力: {currentYokai.attack}</span>
                  </div>
                </div>

                {/* 生態・伝承 */}
                <h4 className="text-xs text-stone-500 font-serif mb-2 tracking-wide uppercase">
                  伝承
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed font-serif pl-1 border-l-2 border-amber-800/40">
                  {currentYokai.description}
                </p>
              </div>

              <div className="text-[10px] text-stone-500 font-mono text-right mt-auto border-t border-stone-900/60 pt-4">
                除霊済
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12" id="encyclopedia-detail-locked">
              <HelpCircle className="w-16 h-16 text-stone-800 mb-4" />
              <h3 className="text-xl font-bold font-serif text-stone-600 mb-2">
                未除霊の妖怪
              </h3>
              <p className="text-sm text-stone-500 font-serif max-w-sm leading-relaxed">
                この妖怪はまだ除霊（撃破）されていません。
                該当のステージモードをクリアすると、情報が解放されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
