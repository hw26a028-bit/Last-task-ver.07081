import React, { useState } from "react";
import { ArrowLeft, Clock, History, Calendar, Trophy, Percent, Keyboard, FileText } from "lucide-react";
import { PlayLog } from "../types";
import { ConfirmDialog } from "./ConfirmDialog";

interface RandomModeScreenProps {
  logs: PlayLog[];
  onStartRandomTyping: () => void;
  onBack: () => void;
}

export const RandomModeScreen: React.FC<RandomModeScreenProps> = ({
  logs,
  onStartRandomTyping,
  onBack
}) => {
  const [currentView, setCurrentView] = useState<"hub" | "logs">("hub");
  const [isStartConfirmOpen, setIsStartConfirmOpen] = useState(false);

  // ハブ画面（選択カード）
  if (currentView === "hub") {
    return (
      <div className="flex flex-col items-center justify-between h-full py-8 px-4 bg-radial from-stone-900 to-black text-stone-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.06),transparent_70%)] pointer-events-none"></div>

        {/* 画面ヘッダー */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-8 z-10" id="random-hub-header">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md font-serif"
            id="btn-back-to-modes"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
          <span className="text-amber-600/60 text-xs font-mono tracking-widest hidden sm:inline" id="random-hub-nav-hint">
            LIMITLESS MODE
          </span>
        </div>

        {/* 選択カード（横並び） */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl my-auto z-10" id="random-hub-cards">
          {/* タイピングモード */}
          <button
            onClick={() => setIsStartConfirmOpen(true)}
            className="flex-1 group bg-stone-950/80 hover:bg-amber-950/10 border-2 border-amber-900/40 hover:border-amber-600 p-8 rounded-lg text-left transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]"
            id="btn-random-typing"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
              <Clock className="w-24 h-24 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded bg-amber-950/50 border border-amber-900/80">
                  <Clock className="w-5 h-5 text-amber-500" />
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-100 group-hover:text-amber-400 transition-colors">
                  タイピングモード
                </h2>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed font-sans">
                3分間、次々とランダムで襲いかかる妖怪を退治するサバイバルタイピング。
                自己最高の入力速度と正確さに挑みます。
              </p>
            </div>
            <div className="text-xs text-amber-600 font-serif tracking-widest mt-6 group-hover:translate-x-1 transition-transform">
              除霊開始 ➔
            </div>
          </button>

          {/* 回顧録 */}
          <button
            onClick={() => setCurrentView("logs")}
            className="flex-1 group bg-stone-950/80 hover:bg-amber-950/10 border-2 border-amber-900/40 hover:border-amber-600 p-8 rounded-lg text-left transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]"
            id="btn-random-logs"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
              <History className="w-24 h-24 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded bg-amber-950/50 border border-amber-900/80">
                  <History className="w-5 h-5 text-amber-500" />
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-100 group-hover:text-amber-400 transition-colors">
                  回顧録 (ログ)
                </h2>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed font-sans">
                過去の挑戦記録（直近25件まで）を閲覧します。
                平均打鍵速度、正確さ、苦手な特定キーなどを確認できます。
              </p>
            </div>
            <div className="text-xs text-amber-600 font-serif tracking-widest mt-6 group-hover:translate-x-1 transition-transform">
              記録を紐解く ➔
            </div>
          </button>
        </div>

        {/* 余白埋め（見栄えのため） */}
        <div className="h-10"></div>

        {/* 開始意思確認ダイアログ */}
        <ConfirmDialog
          isOpen={isStartConfirmOpen}
          title="時間制限モードの開始"
          message="制限時間3分間のランダムタイピングを開始します。よろしいですか？"
          onConfirm={() => {
            setIsStartConfirmOpen(false);
            onStartRandomTyping();
          }}
          onCancel={() => setIsStartConfirmOpen(false)}
        />
      </div>
    );
  }

  // 回顧録（ログ一覧）
  return (
    <div className="flex flex-col h-full bg-stone-950 text-stone-100 py-6 md:py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.05),transparent_80%)] pointer-events-none"></div>

      {/* 画面ヘッダー */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10" id="random-logs-header">
        <button
          onClick={() => setCurrentView("hub")}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md font-serif"
          id="btn-back-to-hub"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 tracking-widest border-b border-amber-800/40 pb-2 pr-6">
          回顧録
        </h1>
        <span className="text-amber-600/60 text-xs font-mono tracking-widest hidden sm:inline" id="random-logs-nav-hint">
          MEMOIR LOGS
        </span>
      </div>

      {/* メインエリア：ログ一覧 */}
      <div className="w-full max-w-5xl mx-auto z-10 flex-grow overflow-y-auto scrollbar-thin mb-4" id="logs-container">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-stone-900/40 border border-stone-900 rounded-lg shadow-inner text-center">
            <FileText className="w-16 h-16 text-stone-700 mb-4" />
            <p className="text-lg text-stone-500 font-serif">過去の挑戦記録は未だ白紙です。</p>
            <p className="text-xs text-stone-600 mt-2 font-sans">
              時間制限モードの「タイピングモード」をプレイすると、自動的にここに記録されます。
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 各ログアイテム */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="logs-table">
                <thead>
                  <tr className="border-b border-amber-900/40 text-stone-500 text-xs tracking-wider font-serif pb-2">
                    <th className="py-3 px-4">日時</th>
                    <th className="py-3 px-4 text-center">総合スコア</th>
                    <th className="py-3 px-4 text-right">平均速度 (CPM)</th>
                    <th className="py-3 px-4 text-right">正確さ</th>
                    <th className="py-3 px-4 text-right">総打鍵 / ミス</th>
                    <th className="py-3 px-4 text-center">最頻ミスキー</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900">
                  {logs.map((log) => (
                    <tr 
                      key={log.id} 
                      className="hover:bg-amber-950/10 transition-colors text-sm text-stone-300"
                      id={`log-row-${log.id}`}
                    >
                      <td className="py-4 px-4 font-mono text-stone-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-600" />
                          {log.date}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-mono text-base font-bold text-amber-500 flex items-center justify-center gap-1">
                          <Trophy className="w-4 h-4 text-amber-600" />
                          {log.score}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-stone-200">
                        {log.cpm} <span className="text-[10px] text-stone-500">字/分</span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-stone-200">
                        <span className="inline-flex items-center gap-0.5">
                          {log.accuracy.toFixed(1)}
                          <Percent className="w-3 h-3 text-stone-500" />
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-stone-400 text-xs">
                        <span className="flex items-center justify-end gap-1">
                          <Keyboard className="w-3 h-3 text-stone-600" />
                          {log.totalKeys} / <span className="text-red-700 font-bold">{log.missKeys}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {log.mostMissedKey ? (
                          <span className="px-2 py-1 bg-red-950/30 border border-red-900/30 rounded text-red-400 font-mono text-xs uppercase font-bold shadow-sm">
                            {log.mostMissedKey}
                          </span>
                        ) : (
                          <span className="text-stone-600 font-mono text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-stone-600 text-right mt-2 font-mono">
              ※最新順、最大25件まで記録を保存。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
