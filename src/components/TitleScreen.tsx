import React, { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface TitleScreenProps {
  onStart: () => void;
  onResetData: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onResetData
}) => {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isRestOpen, setIsRestOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between h-full py-8 md:py-12 px-4 bg-radial from-stone-900 to-black text-stone-100 relative overflow-hidden">
      {/* 背景の和風かすすれ・ノイズ風陰影 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,40,0.15),transparent_70%)] pointer-events-none"></div>

      {/* 画面上部：タイトルロゴ */}
      <div className="flex flex-col items-center mt-4 md:mt-8 z-10" id="title-logo-container">
        {/* 和風のフレーム */}
        <div className="border border-amber-800/40 p-1 rounded-sm mb-2">
          <div className="border-2 border-amber-800 p-6 md:p-8 bg-stone-950/90 shadow-2xl relative">
            {/* 角の細工飾り */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-[0.25em] text-center text-stone-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] select-none font-serif" id="game-title">
              除霊
            </h1>
          </div>
        </div>
        <p className="text-amber-600/80 tracking-[0.4em] text-xs uppercase font-mono mt-2" id="game-subtitle">
          Exorcism Typing Game
        </p>
      </div>

      {/* 画面中央：縦一列に配置されたボタン群 */}
      <div className="flex flex-col gap-5 w-full max-w-xs z-10" id="title-menu-buttons">
        <button
          onClick={onStart}
          className="group relative px-6 py-4 bg-stone-950/80 hover:bg-amber-950/40 border border-amber-800 hover:border-amber-500 rounded text-stone-200 hover:text-amber-200 transition-all duration-300 font-serif text-lg tracking-widest shadow-lg cursor-pointer flex items-center justify-center overflow-hidden"
          id="btn-go-exorcism"
        >
          {/* 左側の赤い丸いアクセント */}
          <span className="absolute left-4 w-1.5 h-1.5 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors"></span>
          除霊に赴く
        </button>

        <button
          onClick={() => setIsRestOpen(true)}
          className="group relative px-6 py-4 bg-stone-950/80 hover:bg-stone-900 border border-amber-900/60 hover:border-amber-700 rounded text-stone-300 hover:text-amber-200 transition-all duration-300 font-serif text-lg tracking-widest shadow-md cursor-pointer flex items-center justify-center overflow-hidden"
          id="btn-take-rest"
        >
          <span className="absolute left-4 w-1.5 h-1.5 rounded-full bg-stone-600 group-hover:bg-stone-400 transition-colors"></span>
          休息を取る
        </button>

        <button
          onClick={() => setIsRulesOpen(true)}
          className="group relative px-6 py-4 bg-stone-950/80 hover:bg-stone-900 border border-amber-900/60 hover:border-amber-700 rounded text-stone-300 hover:text-amber-200 transition-all duration-300 font-serif text-lg tracking-widest shadow-md cursor-pointer flex items-center justify-center overflow-hidden"
          id="btn-view-rules"
        >
          <span className="absolute left-4 w-1.5 h-1.5 rounded-full bg-amber-600 group-hover:bg-amber-400 transition-colors"></span>
          内容説明
        </button>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="group relative px-6 py-3 bg-stone-950/40 hover:bg-red-950/20 border border-stone-800 hover:border-red-900 rounded text-stone-500 hover:text-red-400 transition-all duration-300 font-serif text-sm tracking-widest cursor-pointer flex items-center justify-center overflow-hidden"
          id="btn-clear-records"
        >
          記録を白紙にする
        </button>
      </div>

      {/* 画面下部：コピーライト・メタ情報（シンプルに） */}
      <div className="z-10 text-stone-600 font-mono text-xs select-none" id="copyright">
        © 2026 EXORCISM TYPING
      </div>

      {/* 休息を取るダイアログ */}
      {isRestOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 border border-amber-900 text-stone-100 p-8 rounded max-w-sm w-full shadow-2xl relative text-center">
            <h3 className="text-xl font-medium text-amber-500 mb-4 font-serif tracking-widest">
              休息
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-6 font-serif">
              お疲れ様でした。
              <br />
              静かなお寺の縁側で、
              <br />
              暖かいお茶を飲みながら一息ついています。
            </p>
            <button
              onClick={() => setIsRestOpen(false)}
              className="px-6 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-stone-300 transition-all duration-200 text-sm cursor-pointer shadow-md"
              id="btn-close-rest"
            >
              戻る
            </button>
          </div>
        </div>
      )}

      {/* 内容説明ダイアログ */}
      {isRulesOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-stone-950 border-2 border-amber-800 text-stone-100 p-6 md:p-8 rounded max-w-lg w-full shadow-2xl relative my-8">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40"></div>

            <h3 className="text-2xl font-bold text-amber-500 mb-6 font-serif tracking-widest text-center border-b border-stone-800 pb-3">
              タイピング除霊・内容説明
            </h3>
            
            <div className="text-xs md:text-sm text-stone-300 space-y-4 font-serif leading-relaxed text-left overflow-y-auto max-h-[350px] pr-2 scrollbar-thin">
              <p>
                本作は、画面上に現れる様々な「お祓いの言葉（言霊）」を正確にタイピングすることで、襲いかかる妖怪を撃破（除霊）する和風タイピングゲームです。
              </p>

              <div className="border-l-2 border-amber-800 pl-3 py-1 bg-stone-900/30">
                <h4 className="font-bold text-amber-400 mb-1">【基本規則：除霊と守護】</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-400">
                  <li><strong className="text-stone-200">除霊 (攻撃)</strong>: 画面下部に表示されるお祓いの言葉をローマ字で入力。1文すべて入力し終えると、妖怪にダメージを与えます。</li>
                  <li><strong className="text-stone-200">守護 (反撃防止)</strong>: 攻撃をした後、妖怪が反撃します。ミスなく入力し続けることが自身の身を守る盾となります。</li>
                  <li><strong className="text-stone-200">勝利と敗北</strong>: 妖怪の体力を 0 にすれば除霊成功（ステージクリア）となります。逆に、自身の体力が 0 になると気を失い敗北となります。</li>
                </ul>
              </div>

              <div className="border-l-2 border-amber-800 pl-3 py-1 bg-stone-900/30">
                <h4 className="font-bold text-amber-400 mb-1">【二つの遊戯モード】</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-400">
                  <li><strong className="text-stone-200">ステージモード (全13幕)</strong>: 個性豊かな全13体の妖怪に順番に立ち向かう物語。第1幕から徐々に強力な妖怪が現れます。</li>
                  <li><strong className="text-stone-200">時間制限モード (ランダム)</strong>: ステージモードの全クリア後に解放されるエンドコンテンツ。3分間の制限時間内で次々に現れる妖怪を除霊し続け、自己記録（スコア）に挑戦します。</li>
                </ul>
              </div>

              <div className="border-l-2 border-amber-800 pl-3 py-1 bg-stone-900/30">
                <h4 className="font-bold text-amber-400 mb-1">【記録と収集】</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-400">
                  <li><strong className="text-stone-200">妖怪図鑑</strong>: 一度除霊した妖怪の姿や、背景にある伝承の記録をいつでも閲覧できます。</li>
                  <li><strong className="text-stone-200">文章一覧</strong>: 除霊済みのステージに紐づくタイピング文章の記録です。苦手な文章の事前確認や、お祓いの言葉の復習に役立てられます。</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsRulesOpen(false)}
                className="px-8 py-2.5 bg-amber-900/80 hover:bg-amber-800 border border-amber-700 rounded text-amber-100 font-serif tracking-widest text-sm cursor-pointer shadow-md transition-colors"
                id="btn-close-rules"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* データリセット確認ダイアログ */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="記録の初期化"
        message="すべての記録を初期化します。よろしいですか？"
        onConfirm={() => {
          setIsResetConfirmOpen(false);
          onResetData();
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
