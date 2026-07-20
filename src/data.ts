import { YokaiData, PhraseData } from "./types";

export const YOKAI_LIST: YokaiData[] = [
  {
    stage: 1,
    name: "猫又",
    hp: 40,
    attack: 8,
    description: "二股に分かれた尾を持つ年経た猫の妖怪。人家に忍び込み、人語を操り、妖艶な踊りを見せると言われている。",
    image: "/src/assets/images/yokai_nekomata_1784090351706.jpg"
  },
  {
    stage: 2,
    name: "一つ目小僧",
    hp: 60,
    attack: 10,
    description: "額の真ん中に大きな一つ目を持つ子供の姿をした妖怪。突然現れて人を驚かすが、それ以上の危害は滅多に加えない。",
    image: "/src/assets/images/yokai_hitotsume_1784090366369.jpg"
  },
  {
    stage: 3,
    name: "唐傘お化け",
    hp: 80,
    attack: 12,
    description: "一本足で飛び跳ねる古い唐傘の付喪神。一本きりの大きな目と、だらりと垂らした赤い舌が特徴的で愛嬌もある。",
    image: "/src/assets/images/yokai_karakasa_1784090380652.jpg"
  },
  {
    stage: 4,
    name: "ろくろ首",
    hp: 100,
    attack: 15,
    description: "夜になると首が異様に長く伸びる妖怪。昼間は普通の人間と見分けがつかず、本人が寝ている間に無意識に首を伸ばす。",
    image: "/src/assets/images/yokai_rokurokubi_1784090393698.jpg"
  },
  {
    stage: 5,
    name: "河童",
    hp: 130,
    attack: 18,
    description: "頭の上の皿と背中の甲羅、そして手の水かきが特徴の川に住む妖怪。悪戯好きだが、義理堅く、妙薬の製法を教えてくれることも。",
    image: "/src/assets/images/yokai_kappa_1784090411127.jpg"
  },
  {
    stage: 6,
    name: "口裂け女",
    hp: 160,
    attack: 20,
    description: "「私、きれい？」と問いかけ、マスクを外して耳まで裂けた口を見せる、都市伝説を起源とする極めて狂暴な妖怪。",
    image: "/src/assets/images/yokai_kuchisake_1784090425480.jpg"
  },
  {
    stage: 7,
    name: "八咫烏",
    hp: 200,
    attack: 22,
    description: "太陽の化身とされ、三本の足を持つとされる伝説の神聖な黒烏。迷える人々を正しい道へと導く不思議な霊力を持つ。",
    image: "/src/assets/images/yokai_yatagarasu_1784090437231.jpg"
  },
  {
    stage: 8,
    name: "化け狸",
    hp: 250,
    attack: 25,
    description: "木の葉を頭に乗せ、高度な変化の術を操る大狸。人を騙すのが得意だがどこか抜けており、陽気に踊る姿も目撃される。",
    image: "/src/assets/images/yokai_tanuki_1784090452606.jpg"
  },
  {
    stage: 9,
    name: "九尾",
    hp: 300,
    attack: 28,
    description: "九本の尾を持つ黄金の毛並みの狐。数千年の修行を経て極めて強大な妖力を有し、災いをもたらす神獣・妖獣とされる。",
    image: "/src/assets/images/yokai_kyubi_1784090469857.jpg"
  },
  {
    stage: 10,
    name: "鬼",
    hp: 360,
    attack: 32,
    description: "赤い肌と鋭い角、巨大な牙を持ち、トゲだらけの金棒を振るう恐るべき荒神。圧倒的な怪力で立ち塞がる者を粉砕する。",
    image: "/src/assets/images/yokai_oni_1784090482598.jpg"
  },
  {
    stage: 11,
    name: "女郎蜘蛛",
    hp: 420,
    attack: 35,
    description: "美しい美女の姿に化け、油断した人間を蜘蛛の巣に誘い込んで捕食する大蜘蛛の妖怪。執念深く、幻術と強靭な糸を操る。",
    image: "/src/assets/images/yokai_jorogumo_1784090498602.jpg"
  },
  {
    stage: 12,
    name: "餓者髑髏",
    hp: 500,
    attack: 40,
    description: "戦死者や行き倒れの人々の怨念が宿った無数の骸骨が集まり、巨大な骸骨となって彷徨う。夜道に現れ、不気味な音を立てて襲う。",
    image: "/src/assets/images/yokai_gashadokuro_1784090513027.jpg"
  },
  {
    stage: 13,
    name: "牛鬼",
    hp: 600,
    attack: 50,
    description: "牛の頭に蜘蛛の体を持つ、極めて凶暴で巨大な怪物。海辺や山深い谷底に棲息し、その姿を見た者には死と破滅をもたらすという。",
    image: "/src/assets/images/yokai_ushioni_eyes_1784090526127.jpg"
  }
];

export const STAGE_PHRASES: Record<number, PhraseData[]> = {
  1: [
    { kanji: "猫又が化ける", hiragana: "ねこまたがばける", romaji: "nekomatagabakeru" },
    { kanji: "悪霊退散", hiragana: "あくりょうたいさん", romaji: "akuryoutaisan" },
    { kanji: "赤い鳥居", hiragana: "あかいとりい", romaji: "akaitorii" },
    { kanji: "狐の嫁入り", hiragana: "きつねのよめいり", romaji: "kitsunenoyomeiri" },
    { kanji: "お守りを買う", hiragana: "おまもりをかう", romaji: "omamoriwokau" }
  ],
  2: [
    { kanji: "一つ目の視線", hiragana: "ひとつめのしせん", romaji: "hitotsumenoshisen" },
    { kanji: "神社を参拝", hiragana: "じんじゃをさんぱい", romaji: "jinjawosanpai" },
    { kanji: "柏手を打つ", hiragana: "かしわでをうつ", romaji: "kashiwadewoutsu" },
    { kanji: "小僧が笑う", hiragana: "こぞうがわらう", romaji: "kozougawarau" },
    { kanji: "お賽銭を投げる", hiragana: "おさいせんをなげる", romaji: "osaisenwonageru" }
  ],
  3: [
    { kanji: "唐傘が踊る", hiragana: "からかさがおどる", romaji: "karakasagaodoru" },
    { kanji: "御札を貼る", hiragana: "おふだをはる", romaji: "ofudawoharu" },
    { kanji: "お寺の境内", hiragana: "おてらのけいだい", romaji: "oteranokeidai" },
    { kanji: "一本足の影", hiragana: "いっぽんあしのかげ", romaji: "ipponashinokage" },
    { kanji: "線香の煙", hiragana: "せんこうのけむり", romaji: "senkounokemuri" }
  ],
  4: [
    { kanji: "ろくろ首が首を伸ばす", hiragana: "ろくろくびがくびをのばす", romaji: "rokurokubigakubiwonobasu" },
    { kanji: "急急如律令の呪文", hiragana: "きゅうきゅうにょりつりょうのじゅもん", romaji: "kyuukyuunyoritsuryounojumon" },
    { kanji: "古いお堂の鐘を鳴らす", hiragana: "ふるいおどうのかねをならす", romaji: "furuiodounokanewonarasu" },
    { kanji: "夜道に伸びる長い影", hiragana: "よみちにのびるながいかげ", romaji: "yomichininobirunagaikage" },
    { kanji: "邪気を払う清めの塩", hiragana: "じゃきをはらうきよめのしお", romaji: "jakiwoharaukiyomenoshio" }
  ],
  5: [
    { kanji: "河童の好物はキュウリ", hiragana: "かっぱのこうぶつはきゅうり", romaji: "kappanokoubutsuhakyuuri" },
    { kanji: "水神に祈りを捧げる", hiragana: "すいじんにいのりをささげる", romaji: "suijinniinoriyosasageru" },
    { kanji: "手水を使い身を清める", hiragana: "ちょうずをつかいみをきよめる", romaji: "chouzuwotsukaimiwokiyomeru" },
    { kanji: "川底に光る不思議な皿", hiragana: "かわぞこにひかるふしぎなさら", romaji: "kawazokonihikarufushiganasara" },
    { kanji: "木々の合間に建つ古い社", hiragana: "きぎのあいまにたつふるいやしろ", romaji: "kiginoaimanitatsufuruiyashiro" }
  ],
  6: [
    { kanji: "マスクの下に鋭い牙", hiragana: "ますくのしたにするいきば", romaji: "masukunoshitanisuruikiba" },
    { kanji: "護摩を焚いて邪気を払う", hiragana: "ごまをたいてじゃきをはらう", romaji: "gomawotaitejakiwoharau" },
    { kanji: "境内に漂うお香の香り", hiragana: "けいだいにただようおこうのかおり", romaji: "keidainitadayouokounokaori" },
    { kanji: "赤いマントの怪しい影", hiragana: "あかいまんとのあやしいかげ", romaji: "akaimantonoayashiikage" },
    { kanji: "本堂に響くお経の声", hiragana: "ほんどうにひびくおきょうのこえ", romaji: "hondounihibikuokyounokoe" }
  ],
  7: [
    { kanji: "三本足の導きの黒烏", hiragana: "さんぼんあしのみちびきのくろがらす", romaji: "sanbonashinomichibikinokurogarasu" },
    { kanji: "悪因を断ち切る神聖な光", hiragana: "あくいんをたちきるしんせいなひかり", romaji: "akuinwotachikirushinseinahikari" },
    { kanji: "深い山中にある秘境の神社", hiragana: "ふかいさんちゅうにあるひきょうのじんじゃ", romaji: "fukaisanchuuniaruhikyounojinja" },
    { kanji: "暗闇を切り裂く漆黒の羽", hiragana: "くらやみをきりさくしっこくのはね", romaji: "kurayamiwokirisakushikkokunohane" },
    { kanji: "邪悪な呪いを打ち破る儀式", hiragana: "じゃあくなのろいをうちやぶるぎしき", romaji: "jaakunonoroiwouchiyaburugishiki" }
  ],
  8: [
    { kanji: "葉っぱを乗せて人間に化ける", hiragana: "はっぱをのせてにんげんにばける", romaji: "happawonoseteningennibakeru" },
    { kanji: "四方八方に結界を展開する", hiragana: "しほうはっぽうにけっかいをてんかいする", romaji: "shihouhappounikekkaiwotenkaisuru" },
    { kanji: "本堂の前に置かれた信楽焼", hiragana: "ほんどうのまえにおかれたしがらきやき", romaji: "hondounomaeniokaretashigarakiyaki" },
    { kanji: "満月の夜に踊る大狸", hiragana: "まんげつのよにおどるおおだぬき", romaji: "mangetsunoyoniodoruoodanuki" },
    { kanji: "厄除けの護符を門に貼る", hiragana: "やくよけのごふをもんにはる", romaji: "yakuyokenogofuwomonniharu" }
  ],
  9: [
    { kanji: "九尾の狐が妖しい幻影で惑わす", hiragana: "きゅうびのきつねがあやしいげんえいでまどわす", romaji: "kyuubinokitsunegaayashiigeneidemadowasu" },
    { kanji: "森羅万象の妖力を込めて除霊する", hiragana: "しんらばんしょうのようりょくをこめてじょれいする", romaji: "shinrabanshounoyouryokuwokometejoreisuru" },
    { kanji: "千年の歴史を誇る古刹の拝殿", hiragana: "せんねんのれきしをほこるこさつのはいでん", romaji: "sennennorekishiwohokorukosatsunohaiden" },
    { kanji: "黄金の毛並みが妖しく夜光に輝く", hiragana: "おうごんのけなみがあやしくやこうにかがやく", romaji: "ougonnokenamigaayashikuyakounikagayaku" },
    { kanji: "邪悪な退魔の御札を十重二十重に貼る", hiragana: "じゃあくなたいまのおふだをとえはたえにはる", romaji: "jaakunataimanoofudawotoehataeniharu" }
  ],
  10: [
    { kanji: "赤い肌の鬼が巨大な金棒を振り回す", hiragana: "あかいはだのおにがきょだいなかなぼうをふりまわす", romaji: "akaihadanoonigakyodainakanabouwofurimawasu" },
    { kanji: "五臓六腑を清浄にして怨霊を退散させる", hiragana: "ごぞうろっぷをしょうじょうにしておんりょうをたいさんさせる", romaji: "gozouroppuwoshoujounishiteonryouwotaisansaseru" },
    { kanji: "朱塗りの本殿に響く厳かな太鼓の音", hiragana: "しゅぬりのほんでんにひびくおごそかなたいこのおと", romaji: "shunurinohondennihibikuogosokanataikoonoto" },
    { kanji: "羅生門の奥から聞こえる不気味な足音", hiragana: "らしょうもんのおくからきこえるぶきみなあしおと", romaji: "rashoumononookukarakikoerubukiminaashioto" },
    { kanji: "九字真言を唱えて邪念を完全に打ち払う", hiragana: "くじしんごんをとなえてじゃねんをかんぜんにうちはらう", romaji: "kujishingonwotonaetejanenwokanzenniuchiharau" }
  ],
  11: [
    { kanji: "美しい姿の女郎蜘蛛が強靭な糸を放つ", hiragana: "うつくしいすがたのじょろうぐもがきょうじんないとをはなつ", romaji: "utsukushiisugatanojorougumogakyoujinnaitowohanatsu" },
    { kanji: "阿弥陀仏の慈悲により呪縛から解放する", hiragana: "あみだぶつのじひによりじゅばくからかいほうする", romaji: "amidabutsunojihiyorijubakukarakaihousuru" },
    { kanji: "苔むした古い石段を一段ずつ静かに登る", hiragana: "こけむしたふるいいしだんをいちだんずつしずかにのぼる", romaji: "kokemushitafuruiishidanwoichidanzutsushizukaninoboru" },
    { kanji: "蜘蛛の網が朝露に濡れて怪しく光る", hiragana: "くものあみがあさつゆにぬれてあやしくひかる", romaji: "kumonoamigaasatsuyuninureteayashikuhikaru" },
    { kanji: "般若心経の功徳により怨念を鎮める", hiragana: "はんにゃしんぎょうのくどくによりおんねんをしずめる", romaji: "hannyashingyounokudokuniyorionnenwoshizumeru" }
  ],
  12: [
    { kanji: "無数の怨念が集まりし巨大な骸骨が彷徨う", hiragana: "むすうのおんねんがあつまりしきょだいながいこつがさまよう", romaji: "musuunoonnengaatsumarishikyodainagaikotsugasamayou" },
    { kanji: "南無阿弥陀仏の経文を唱えて悪霊を除霊する", hiragana: "なむあみだぶつのきょうもんをとなえてあくりょうをじょれいする", romaji: "namuamidabutsunokyoumonwotonaeteakuryouwojoreisuru" },
    { kanji: "闇夜に浮かび上がる三重の塔に霧が立ち込める", hiragana: "やみよにうかびあがるさんじゅうのとうにきりがたちこめる", romaji: "yamiyoniukabiagarusanjuunotounikirigatachikomeru" },
    { kanji: "戦場跡に転がる髑髏がカタカタと震える", hiragana: "せんじょうあとにころがるどくろがかたかたとふるえる", romaji: "senjouatonikorogarudokurogakatakatatofurueru" },
    { kanji: "不動明王の真言を唱えて魔を焼き尽くす", hiragana: "ふどうみょうおうのしんごんをとなえてまをやきつくす", romaji: "fudoumyouounoshingonwotonaetemawoyakitsukusu" }
  ],
  13: [
    { kanji: "深い海の底から現れし荒ぶる狂気の蜘蛛牛", hiragana: "ふかいうみのそこからあらわれしあらぶるきょうきのくもうし", romaji: "fukaiuminosokokaraarawareshiaraburukyoukinokumoushi" },
    { kanji: "天地神明の力を借りて強大な怪異を完全に封印する", hiragana: "てんちしんめいのちからをかりてきょうだいなかいいをかんぜんにふういんする", romaji: "tenchishinmeinochikarawokaritekyoudainakaiiwokanzennifuuinsuru" },
    { kanji: "荘厳なる神殿の奥深くに眠る伝説の宝剣を拝む", hiragana: "そうごんなるしんでんのおくふかくにねむるでんせつのほうけんをおがむ", romaji: "sougonnarushindennookufakuninemurudensetsunohoukenwoogamu" },
    { kanji: "影を落とす巨大な怪物が怨嗟の声を上げる", hiragana: "かげをおとすきょだいなかいぶつがえんさのこうえをあげる", romaji: "kagewootosukyodainakaibutsugaensanokoyewoageru" },
    { kanji: "歴代の陰陽師たちが遺した秘伝の陣を敷く", hiragana: "れきだいのおんみょうじたちがのこしたひでんのじんをしく", romaji: "rekidainoonmyoujitachiganokoshitahidennonjinwoshiku" }
  ]
};
