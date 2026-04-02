'use client'

import { useState, useCallback } from 'react'

// ─── 型定義 ───
type Life = {
  rarity: number
  name: string
  era: string
  job: string
  background: string
  strength: string
  weakness: string
  quote: string
  emoji: string
}

// ─── 100パターンの人生データ ───
const LIVES: Life[] = [
  // ===== rarity 1 (N) — 現代の普通の職業 ×30 =====
  { rarity:1, name:"田中 健太（32）", era:"現代・埼玉県", job:"コンビニ夜勤店員", background:"大学中退後、フリーター生活を経て地元のコンビニに就職。夜勤歴8年で店の裏メニューまで把握している。最近やっと正社員になれた。趣味は明け方の散歩。", strength:"どんな酔客にも動じない鋼のメンタル", weakness:"日光を浴びると溶けそうになる", quote:"「いらっしゃいませ」が夢にまで出る", emoji:"🏪" },
  { rarity:1, name:"鈴木 美咲（28）", era:"現代・東京都", job:"経理事務", background:"商業高校を卒業後、中小企業の経理部に配属。簿記2級を武器に10年間数字と向き合い続けている。社内で唯一電卓を二刀流で使える。", strength:"1円の誤差も見逃さない目", weakness:"自分の家計簿だけは赤字", quote:"合わない…3円合わない…", emoji:"🧮" },
  { rarity:1, name:"佐藤 翔太（45）", era:"現代・千葉県", job:"タクシー運転手", background:"元営業マンだったが脱サラしてタクシードライバーに転身。千葉県内の道は全て頭に入っており、カーナビより正確。お客さんとの会話が生きがい。", strength:"道を間違えたことがない", weakness:"プライベートでも遠回りして帰る癖", quote:"お客さん、この道の方が早いですよ", emoji:"🚕" },
  { rarity:1, name:"高橋 ゆかり（35）", era:"現代・神奈川県", job:"保育士", background:"短大卒業後、地元の保育園に就職して13年。園児からは「ゆかりん先生」と慕われている。毎日エプロンのポケットにティッシュとシールを常備。", strength:"泣いている子を3秒で笑わせる技術", weakness:"大人との会話で「すごいねー！」と言ってしまう", quote:"はい、お手々つないでー！", emoji:"👶" },
  { rarity:1, name:"伊藤 雄介（29）", era:"現代・大阪府", job:"ラーメン屋店主", background:"大学時代に食べ歩いたラーメン屋は500軒以上。26歳で脱サラし、貯金全額をつぎ込んで開業。スープの仕込みに毎朝4時起き。まだ借金返済中。", strength:"舌が精密機器レベル", weakness:"自分の店のラーメンに飽きてきた", quote:"うちのスープは豚骨と人生を煮込んでます", emoji:"🍜" },
  { rarity:1, name:"渡辺 真理（41）", era:"現代・福岡県", job:"スーパーの鮮魚担当", background:"水産系の専門学校を出て地元のスーパーに就職。魚を見ただけで産地と鮮度がわかる特技を持つ。刺身の盛り付けには定評がある。休日も釣りに行く。", strength:"魚と目が合うだけで種類がわかる", weakness:"回転寿司で原価計算してしまう", quote:"今日のブリ、脂のってますよ！", emoji:"🐟" },
  { rarity:1, name:"小林 篤（38）", era:"現代・愛知県", job:"自動車工場のライン工", background:"高校卒業後すぐにトヨタの下請工場に入社。20年間同じラインでボルトを締め続けている。作業の正確さは工場一で表彰歴多数。", strength:"目を閉じてもボルトを規定トルクで締められる", weakness:"家のネジが緩んでいると夜眠れない", quote:"あと0.2N・m…", emoji:"🔧" },
  { rarity:1, name:"加藤 恵（26）", era:"現代・北海道", job:"ドラッグストア店員", background:"薬学部を諦めて登録販売者の資格を取得。地元のドラッグストアで3年目。お客さんの症状を聞いて的確な市販薬を提案できる。ポイントカードの営業成績は店舗1位。", strength:"風邪の引き始めを匂いで察知できる", weakness:"自分が風邪を引くと何を飲めばいいかわからなくなる", quote:"こちらの薬、よく効きますよ（個人の感想です）", emoji:"💊" },
  { rarity:1, name:"山本 大輔（50）", era:"現代・静岡県", job:"茶農家", background:"祖父の代から続く茶畑を継いで25年。毎年5月の新茶の時期が一番忙しい。最近は海外向けの抹茶パウダーの販路開拓にも挑戦している。", strength:"お茶の香りだけで品種を当てられる", weakness:"コーヒーを飲むと裏切った気分になる", quote:"人生も茶も、蒸らしが大事", emoji:"🍵" },
  { rarity:1, name:"中村 亮（33）", era:"現代・東京都", job:"Webデザイナー（フリーランス）", background:"美大を出てデザイン事務所に3年勤務後、独立。自宅のワンルームが仕事場。納期に追われながらもクライアントワークをこなす日々。年収は会社員時代の半分。", strength:"どんな無茶な要望も形にする柔軟性", weakness:"自分のポートフォリオサイトだけ3年間「準備中」", quote:"あ、そのフォント、0.5px上にずらしていいですか？", emoji:"🎨" },
  { rarity:1, name:"松本 さくら（24）", era:"現代・京都府", job:"旅館の仲居", background:"高校卒業後、祖母が働いていた老舗旅館に就職。最初はお辞儀の角度から叩き込まれた。6年目の今では外国人観光客の対応もお手の物。着物の着付けは5分で完了。", strength:"足音を立てずに廊下を歩ける", weakness:"私服のセンスが壊滅的", quote:"お食事のお時間でございます", emoji:"🏯" },
  { rarity:1, name:"井上 拓也（37）", era:"現代・群馬県", job:"トラック運転手", background:"21歳で大型免許を取得して以来、日本全国を走り回っている。年間走行距離は地球2周分。サービスエリアのグルメには異常に詳しい。", strength:"どこのSAのカツ丼が旨いか全て知っている", weakness:"家にいると落ち着かない", quote:"東名の海老名SAは過大評価", emoji:"🚛" },
  { rarity:1, name:"木村 千尋（31）", era:"現代・宮城県", job:"介護福祉士", background:"おばあちゃん子だった幼少期の経験から介護の道へ。特別養護老人ホームで7年勤務。入居者さんの笑顔が何よりのやりがい。腰痛と戦いながら毎日奮闘中。", strength:"おじいちゃんおばあちゃんに無限に好かれる", weakness:"同世代との会話のテンポが合わない", quote:"今日もいいお天気ですねえ！", emoji:"🤝" },
  { rarity:1, name:"林 太郎（27）", era:"現代・福岡県", job:"消防士", background:"体育大学を卒業後、地元の消防署に入庁。訓練の日々を経て3年目でようやく実戦配備。筋トレが趣味で体脂肪率8%。でも猫アレルギーで猫の救助が苦手。", strength:"50kgの人を担いで階段を駆け上がれる", weakness:"猫の救助だけは毎回くしゃみが止まらない", quote:"火の用心！", emoji:"🚒" },
  { rarity:1, name:"斎藤 理恵（44）", era:"現代・新潟県", job:"学校給食の調理員", background:"調理師専門学校卒業後、市の学校給食センターに就職して20年。毎日800人分の給食を作る。揚げパンの日は子供たちが廊下で待っている。", strength:"800人分の味付けを一発で決められる", weakness:"家では料理したくない", quote:"今日のメニューは…カレーです！（歓声）", emoji:"🍽️" },
  { rarity:1, name:"前田 隆（55）", era:"現代・広島県", job:"町の電気屋さん", background:"大手家電量販店の進出にも負けず、40年間地域密着で営業中。エアコンの取り付けからテレビのリモコン設定まで何でもやる。お客さんの家の間取りを全部覚えている。", strength:"どんな古い家電も直せる", weakness:"自分の店のPOSレジだけは使いこなせない", quote:"あー、これね、ここをこうすればね…ほら", emoji:"📺" },
  { rarity:1, name:"清水 愛（30）", era:"現代・東京都", job:"ネイリスト", background:"美容専門学校を出てネイルサロンに就職。独立して自宅サロンを開業して2年目。InstagramのフォロワーはSNSなんて意味ないと思ってた母より少ない。", strength:"米粒にも絵が描ける精密な指先", weakness:"自分の爪だけはいつもボロボロ", quote:"次はどんなデザインにしましょう？", emoji:"💅" },
  { rarity:1, name:"山田 誠一（48）", era:"現代・長野県", job:"りんご農家", background:"脱サラして長野に移住、りんご栽培を始めて15年。最初の3年は失敗続きだったが今では県のコンテストで入賞常連。りんごへの愛が深すぎて品種の話になると止まらない。", strength:"りんごの品種を触感だけで当てられる", weakness:"りんご以外の果物に興味がなさすぎる", quote:"ふじとシナノゴールドの違いがわからないとか正気？", emoji:"🍎" },
  { rarity:1, name:"岡田 由美子（39）", era:"現代・兵庫県", job:"歯科衛生士", background:"歯科衛生士専門学校を卒業後、20年間同じ歯科医院に勤務。院長が3回変わっても残り続けるベテラン。患者さんの歯の状態を全部記憶している。", strength:"口を開けただけで虫歯の位置がわかる", weakness:"人の笑顔を見るとまず歯を見てしまう", quote:"フロスしてますか？正直に言ってください", emoji:"🦷" },
  { rarity:1, name:"藤田 健二（36）", era:"現代・栃木県", job:"自動車教習所の教官", background:"元レーサー志望だったが現実を見て教習所に就職。ブレーキを踏まれすぎて右足がやたら発達している。卒業生からの年賀状が毎年届くのが密かな喜び。", strength:"助手席からのブレーキの反応速度が異常", weakness:"妻の運転にダメ出しして毎回喧嘩になる", quote:"はい、ミラー、合図、目視！", emoji:"🚗" },
  { rarity:1, name:"三浦 美穂（25）", era:"現代・沖縄県", job:"ホテルのフロント", background:"観光系の専門学校を出て那覇のリゾートホテルに就職。英語と中国語を独学でマスターし、海外からのゲスト対応はお任せ。笑顔の練習を毎朝鏡の前で10分やっている。", strength:"どんなクレームにも笑顔で対応できる", weakness:"プライベートで笑顔が消える", quote:"ごゆっくりお過ごしくださいませ", emoji:"🏨" },
  { rarity:1, name:"石川 竜也（42）", era:"現代・北海道", job:"除雪作業員", background:"冬季限定で除雪車を操る季節労働者。夏は漁師のアルバイト。除雪車の操縦歴20年で、どんな大雪でも朝までに道を開ける。地域住民からは神と呼ばれている。", strength:"雪の量を見ただけで除雪にかかる時間がわかる", weakness:"沖縄に行くと存在意義を見失う", quote:"この程度の雪、大したことないべ", emoji:"🌨️" },
  { rarity:1, name:"長谷川 文子（52）", era:"現代・東京都", job:"区役所の窓口職員", background:"大学卒業後、地方公務員として30年勤務。住民票の発行から婚姻届の受理まで何でもこなす。待ち時間のクレーム対応が日常だが、定時退社は死守している。", strength:"書類の不備を0.5秒で見抜く", weakness:"民間企業のスピード感についていけない", quote:"こちらの書類にご記入をお願いします", emoji:"🏛️" },
  { rarity:1, name:"村上 浩（34）", era:"現代・埼玉県", job:"引越し作業員", background:"高校のラグビー部で鍛えた体を活かして引越し会社に就職。1日3件をこなすこともある体力お化け。冷蔵庫を一人で運べる。お客さんの荷物の多さに毎回驚く。", strength:"どんな家具も階段で運べる", weakness:"自分の引越しだけはダンボールが未開封のまま3年", quote:"冷蔵庫は横にしちゃダメですよ！", emoji:"📦" },
  { rarity:1, name:"太田 彩花（29）", era:"現代・愛知県", job:"ウェディングプランナー", background:"ブライダル専門学校卒。年間50組の結婚式をプロデュース。新郎新婦の感動の涙を見るのが生きがいだが、自分の結婚式の予定はまだない。", strength:"泣かせるサプライズ演出を無限に考えられる", weakness:"自分の恋愛は常に迷走中", quote:"一生に一度の日ですから！（年間50回言う）", emoji:"💒" },
  { rarity:1, name:"遠藤 賢治（46）", era:"現代・山形県", job:"米農家", background:"祖父の代から3代続く米農家。天日干しのはさかけ米にこだわり続けている。毎年の出来を天候から完全に予測できるが、台風だけは読めない。", strength:"土を握っただけで水分量がわかる", weakness:"パン屋の前を通ると敗北感を感じる", quote:"今年のコシヒカリは出来がいいぞ", emoji:"🌾" },
  { rarity:1, name:"近藤 未来（23）", era:"現代・東京都", job:"アパレル店員", background:"ファッション系の専門学校を出て原宿のセレクトショップに就職。お客さんのコーディネートを考えるのが天職。だが給料のほとんどは自分の服に消える無限ループ。", strength:"その人に似合う色を一瞬で見抜ける", weakness:"貯金残高がつねに3桁", quote:"これ、めっちゃ似合いますよ！（全員に言う）", emoji:"👗" },
  { rarity:1, name:"吉田 正人（58）", era:"現代・大阪府", job:"商店街の時計屋", background:"父から継いだ時計屋を35年経営。機械式時計の修理ができる数少ない職人。デジタル化の波に抗いながら、今日も虫眼鏡を覗き込んでいる。", strength:"時計を見なくても今の時間がわかる", weakness:"自分だけ常に5分前行動で待ちぼうけ", quote:"この歯車がね、ほら、0.1mmズレてるんですわ", emoji:"⌚" },
  { rarity:1, name:"中島 陽子（40）", era:"現代・静岡県", job:"ペットショップ店員", background:"動物が好きすぎて動物関連の仕事を渡り歩き、今のペットショップに落ち着いて10年。犬の気持ちが手に取るようにわかる。家には保護猫が4匹いる。", strength:"犬のしっぽの振り方で感情を完全に読める", weakness:"人間の気持ちはあまり読めない", quote:"この子、あなたのこと気に入ってますよ", emoji:"🐕" },
  { rarity:1, name:"原田 慎太郎（31）", era:"現代・東京都", job:"居酒屋の店長", background:"大学のバイト先の居酒屋にそのまま就職し、28歳で店長に昇進。常連さんの名前と好みの酒を全て記憶。売上は上がったが自分が一番飲んでいる疑惑がある。", strength:"お客さんの顔を見ただけで疲れ度がわかる", weakness:"休肝日が存在しない", quote:"お疲れ様です！とりあえず生ですか？", emoji:"🍺" },

  // ===== rarity 2 (R) — ちょっと珍しい職業・時代 ×25 =====
  { rarity:2, name:"岸本 レオ（34）", era:"現代・沖縄県", job:"水中カメラマン", background:"元ダイビングインストラクターが写真に目覚め転身。サンゴ礁の生態系を撮り続けて8年。National Geographicに1度だけ写真が採用されたのが人生のハイライト。", strength:"息を3分止められる", weakness:"陸上の写真は全部ブレている", quote:"海の中は静かで最高なんだ", emoji:"📸" },
  { rarity:2, name:"宮崎 凛（27）", era:"現代・京都府", job:"茶道の師範代", background:"5歳から茶道を始め、22年のキャリア。外国人向けの茶道体験教室が大人気でSNSのフォロワーが10万人。畳の上では誰よりも優雅だが、階段でよくこける。", strength:"どんな場面でも完璧な正座ができる", weakness:"椅子に座ると姿勢が崩壊する", quote:"一期一会、でも推しのライブは皆勤賞", emoji:"🍵" },
  { rarity:2, name:"ニコラ・デュボワ（41）", era:"1920年代・パリ", job:"香水調合師", background:"南仏プロヴァンスの花農家に生まれ、幼少期から香りに敏感だった。パリに出て名門メゾンの見習いから始め、今では王室御用達の調合師に。鼻が保険に入っている。", strength:"1000種類以上の香りを嗅ぎ分けられる", weakness:"満員電車に乗ると気絶する", quote:"この薔薇には、今朝の雨の記憶がある", emoji:"🌹" },
  { rarity:2, name:"金城 琉花（30）", era:"現代・沖縄県", job:"三線職人", background:"おじいちゃんの三線の音色に惹かれ、高校卒業後に弟子入り。12年かけて一人前の職人に。蛇皮の張り替え技術は師匠を超えたと言われるが、本人は否定する。", strength:"木を叩いただけで音の響きがわかる", weakness:"カラオケだけは音痴", quote:"三線は人の声に一番近い楽器さー", emoji:"🎵" },
  { rarity:2, name:"パウロ・サントス（38）", era:"現代・ブラジル", job:"カポエイラ指導者", background:"リオのファベーラ出身。ストリートで覚えたカポエイラで世界大会準優勝。今は日本に渡り、東京で教室を開いている。日本語は片言だが体で全てを伝える。", strength:"逆立ちしたまま30分会話できる", weakness:"正座が5秒で限界", quote:"カポエイラは戦いじゃない、対話だ", emoji:"🤸" },
  { rarity:2, name:"白石 蛍（25）", era:"現代・奈良県", job:"仏像修復師", background:"美大の彫刻科を卒業後、文化財修復の世界へ。1000年前の仏像の傷を見えないように修復する。1つの仏像に半年かけることもある。指先の感覚が異常に鋭い。", strength:"0.1mmの傷を指先で感知できる", weakness:"プラモデルを作ると本気になりすぎて3ヶ月かかる", quote:"この仏像、800年前にも誰かが修復した跡がある…", emoji:"🗿" },
  { rarity:2, name:"ハンス・ベルガー（52）", era:"1890年代・ウィーン", job:"オルゴール職人", background:"時計職人の父の工房で育ち、音の出る機械に魅了された。ウィーンで最も精巧なオルゴールを作ると評判。王侯貴族からの注文が絶えない。", strength:"歯車の噛み合わせで音程を調律できる", weakness:"自分の作品に感動して毎回泣く", quote:"200個の歯車が、ひとつの旋律を奏でるのです", emoji:"🎶" },
  { rarity:2, name:"北村 岳人（44）", era:"現代・長野県", job:"山岳救助隊員", background:"大学の山岳部からそのまま救助の道へ。北アルプスを知り尽くし、悪天候でも救助に向かう。これまでに200人以上を救助。山では神と呼ばれているが下界ではただのおじさん。", strength:"ホワイトアウトの中でも方角がわかる", weakness:"平地で道に迷う", quote:"山を舐めるな。でも山は人を裏切らない", emoji:"⛰️" },
  { rarity:2, name:"ソフィア・ロッシ（29）", era:"現代・イタリア", job:"トリュフハンター", background:"祖母から受け継いだトリュフ犬「ブルーノ」と共にイタリアの森を駆け回る。年に数回、超高級白トリュフを掘り当てる。1個で車が買えることも。", strength:"トリュフの香りを地上から嗅ぎ分けられる", weakness:"犬の方が有名", quote:"ブルーノが走り出したら、そこにトリュフがある", emoji:"🍄" },
  { rarity:2, name:"安田 航（36）", era:"現代・高知県", job:"カツオ一本釣り漁師", background:"中学卒業後すぐに漁船に乗り、20年間太平洋でカツオを追い続けている。一本釣りの技術は船で一番。海の色で魚群の位置がわかる。", strength:"波の動きで天気を3日先まで読める", weakness:"スーパーの刺身に値段をつけるのが辛い", quote:"カツオは追うもんじゃない、来るもんだ", emoji:"🐟" },
  { rarity:2, name:"エマ・チャン（33）", era:"現代・香港→東京", job:"飲茶点心師", background:"香港の名店で10年修行し、東京に自分の店を開業。小籠包の皮の薄さは0.3mm以下。ミシュランのビブグルマンに選ばれた。朝4時から仕込みが始まる。", strength:"小籠包のひだを18回均一に折れる", weakness:"餃子の王将に行くと複雑な気持ちになる", quote:"皮は薄ければ薄いほど、想いは伝わる", emoji:"🥟" },
  { rarity:2, name:"大西 紬（28）", era:"現代・石川県", job:"金箔職人", background:"金沢の金箔工房で修行7年目。1万分の1mmの金箔を息を止めて貼る。失敗は許されない緊張感の中、毎日が真剣勝負。手の温度管理のため夏でも手袋を着用。", strength:"手の温度を0.5度単位でコントロールできる", weakness:"冬に手がかじかむと人生が終わる", quote:"金箔は息で飛ぶ。だから私は呼吸すら技術にした", emoji:"✨" },
  { rarity:2, name:"トーマス・ミュラー（45）", era:"現代・ドイツ", job:"ビアマイスター", background:"バイエルン地方の醸造所で25年修行。ビールの品質管理に人生を捧げている。毎日30種類のビールをテイスティングするのが仕事。肝臓の健康診断だけが心配。", strength:"ビールの水分含有量を舌で0.1%単位で判別できる", weakness:"下戸の妻に毎晩怒られる", quote:"ビールは生き物だ。毎日機嫌が違う", emoji:"🍺" },
  { rarity:2, name:"野口 遥（32）", era:"現代・鹿児島県", job:"花火師", background:"花火師の家に生まれ、火薬の匂いの中で育った。夏の花火大会シーズンは全国を飛び回る。自分が作った花火で観客が歓声を上げる瞬間が最高の報酬。", strength:"火薬の配合で色を自在に操れる", weakness:"誕生日ケーキのロウソクに異常なこだわりを見せる", quote:"花火は一瞬で消えるから美しい。人生もね", emoji:"🎆" },
  { rarity:2, name:"李 美玲（40）", era:"現代・台湾→日本", job:"占い師", background:"台湾で風水と四柱推命を学び、新宿に占いの館を開業して10年。リピーター率は90%。的中率の高さから政治家や芸能人も密かに通う。", strength:"手相を見ただけで今朝何を食べたかわかる（自称）", weakness:"自分の運勢だけは見たくない", quote:"あなたの来月、ちょっと荒れますね…大丈夫、乗り越えられます", emoji:"🔮" },
  { rarity:2, name:"久保田 蓮（26）", era:"現代・東京都", job:"フードファイター", background:"大学のサークルで大食い才能が開花。YouTube登録者数50万人。胃の容量は常人の3倍と医者に驚かれた。月の食費は30万円だが全部経費。", strength:"カレー30皿を45分で食べられる", weakness:"食後のデザートは別腹じゃなくて同じ腹", quote:"まだいける。胃袋は無限大", emoji:"🍛" },
  { rarity:2, name:"千葉 樹（38）", era:"現代・青森県", job:"ねぶた師", background:"15歳で弟子入りし、23年間ねぶたを作り続けている。和紙と針金で巨大な灯籠を作る技術は青森でも指折り。祭りの1週間のために1年間準備する。", strength:"和紙の重ね方で光の透過率を計算できる", weakness:"祭りが終わると1ヶ月燃え尽き症候群", quote:"ラッセラー！の歓声で全部報われる", emoji:"🏮" },
  { rarity:2, name:"上田 凪（35）", era:"大正時代・東京", job:"活動写真弁士", background:"映画がまだ無声だった時代、スクリーンの横に立って物語を語る「弁士」として人気を博す。声色を使い分け一人で全キャラクターを演じる。劇場は常に満席。", strength:"7種類の声色を瞬時に切り替えられる", weakness:"日常会話でもつい劇的に語ってしまう", quote:"さぁ皆様、本日の活動写真、はじまりはじまり〜", emoji:"🎬" },
  { rarity:2, name:"マリア・ガルシア（48）", era:"現代・メキシコ", job:"ルチャリブレのマスク職人", background:"父の工房を継ぎ、メキシコのプロレスラーたちのマスクを30年作り続けている。一つ一つ手縫いで、レスラーの個性に合わせたデザインを考案。有名レスラーの素顔を知る数少ない人物。", strength:"顔を見ただけで最適なマスクの型がわかる", weakness:"自分がマスクをかぶると前が見えない", quote:"マスクはレスラーの魂。だから一針一針に心を込める", emoji:"🎭" },
  { rarity:2, name:"黒田 渚（31）", era:"現代・宮崎県", job:"サーフボードシェイパー", background:"プロサーファーの夢は破れたが、ボード作りの才能が開花。手削りのカスタムボードは国内外のサーファーから注文が殺到。波を知っているからこそ作れる形がある。", strength:"波の形を見ただけで最適なボードの寸法がわかる", weakness:"自分が乗ると毎回ワイプアウト", quote:"いい波には、いいボードが必要なんだ", emoji:"🏄" },
  { rarity:2, name:"アーロン・スミス（50）", era:"1850年代・アメリカ西部", job:"賞金稼ぎ", background:"元保安官だったが汚職に嫌気がさし単独で活動開始。荒野を馬で駆け回り、お尋ね者を追い詰める。早撃ちの腕前は西部一と噂される。孤独だが正義感は強い。", strength:"30メートル先の缶を抜き撃ちで撃てる", weakness:"馬から降りると腰が痛い", quote:"法が届かない場所にも、正義は届く", emoji:"🤠" },
  { rarity:2, name:"藤原 月子（29）", era:"現代・東京都", job:"プラネタリウム解説員", background:"天文学を専攻していたが研究者の道は断念。しかし星の魅力を伝えたいとプラネタリウムの解説員に。その癒しの声と詳しい解説はSNSでバズり、全国から客が来る。", strength:"満天の星空から任意の星を3秒で特定できる", weakness:"方向音痴で地上の道はわからない", quote:"あの星の光は、200年前に出発したんですよ", emoji:"🌟" },
  { rarity:2, name:"竹内 銀次（60）", era:"昭和中期・東京", job:"紙芝居師", background:"戦後の東京で紙芝居を引いて40年。子どもたちに駄菓子と物語を届け続けた。テレビに押されて仲間は減ったが、最後の一人として今日も公園に立つ。", strength:"子どもを一瞬で物語の世界に引き込む話術", weakness:"オチを言う前に自分で笑ってしまう", quote:"さぁさぁ寄ってらっしゃい見てらっしゃい！", emoji:"📖" },
  { rarity:2, name:"島田 光（33）", era:"現代・長崎県", job:"潜水艦の料理人", background:"調理師学校を出て海上自衛隊に入隊。潜水艦内の限られた食材と設備で乗組員の胃袋を支える。カレー金曜日は潜水艦の伝統。密閉空間でのストレスは食事で解消する。", strength:"揺れる艦内で一滴もスープをこぼさない", weakness:"下船すると広いキッチンで逆に動けない", quote:"潜水艦のカレーは日本一うまい。異論は認めない", emoji:"🫡" },

  // ===== rarity 3 (SR) — 歴史上の人物っぽい設定 ×20 =====
  { rarity:3, name:"源 義光（43）", era:"平安末期・京都", job:"陰陽師の弟子", background:"貴族の末席に連なる家に生まれたが、幼い頃から「見えないもの」が見えた。安倍晴明の孫弟子として修行を積み、都の怪異を鎮める日々。しかし本人は霊感より算術が得意。", strength:"式神を3体まで同時に操れる", weakness:"幽霊より確定申告が怖い", quote:"祟りじゃ！…いや、やっぱり湿気のせいかも", emoji:"🌙" },
  { rarity:3, name:"マルグリット・ド・ヴァロワ（31）", era:"16世紀・フランス", job:"宮廷の毒見役", background:"没落貴族の娘として宮廷に仕えることに。王の食事を毒見する危険な職務だが、その鋭い味覚が認められ首席毒見役に昇進。5回毒を検知し王の命を救った。", strength:"砒素を100万分の1の濃度で検知できる舌", weakness:"疑心暗鬼で外食できない", quote:"この鹿肉、少し...苦いですわ（全員退避）", emoji:"👑" },
  { rarity:3, name:"武田 一鉄（55）", era:"戦国時代・甲斐国", job:"築城師", background:"武田信玄に仕える築城の名人。山城の設計を得意とし、生涯で30以上の城を築いた。石垣の積み方に独自の理論を持ち、「一鉄積み」と呼ばれる技法を編み出した。", strength:"地形を見ただけで城の設計図が浮かぶ", weakness:"自分の家だけは雨漏りする", quote:"城は石の一つ一つが兵士だと思え", emoji:"🏯" },
  { rarity:3, name:"イブン・ハリド（38）", era:"9世紀・バグダッド", job:"知恵の館の翻訳家", background:"ペルシャ生まれのアラビア語・ギリシャ語・サンスクリット語の達人。バグダッドの知恵の館でギリシャの古典を翻訳し、イスラム世界の学問発展に貢献。", strength:"7つの言語を同時通訳できる", weakness:"自分の感情を言語化するのは苦手", quote:"知識に国境はない。言葉の壁は、私が壊す", emoji:"📜" },
  { rarity:3, name:"お梅（22）", era:"江戸中期・大阪", job:"女義太夫語り", background:"商家の娘だったが義太夫節に魅了され家出同然で弟子入り。女性ながら太棹三味線と語りの両方をこなす天才。大阪中の芝居小屋から引っ張りだこ。", strength:"声量がありすぎてマイクなしで大ホールを揺らす", weakness:"普段の声も大きすぎて内緒話ができない", quote:"語りに性別なんぞ、あらしまへんで！", emoji:"🎭" },
  { rarity:3, name:"レオナルド・ブルーニ（47）", era:"15世紀・フィレンツェ", job:"ルネサンスの万能人", background:"画家、彫刻家、建築家、そして解剖学者。同時代のダ・ヴィンチの影に隠れがちだが、実力は互角。人体の筋肉構造に関する研究は後世に大きな影響を与えた。", strength:"左手で絵を描きながら右手で彫刻できる", weakness:"一つのことに集中できない", quote:"人間の体は最も美しい建築物だ", emoji:"🎨" },
  { rarity:3, name:"望月 千代（35）", era:"戦国時代・甲賀", job:"くノ一", background:"甲賀の里で幼少から忍術を叩き込まれた女忍者。変装と情報収集を得意とし、敵国の大名の屋敷に侍女として潜入すること数十回。正体がバレたことは一度もない。", strength:"壁に張り付いて2時間動かずにいられる", weakness:"くしゃみが出そうになると任務失敗の危機", quote:"私の顔？どの顔のことでしょう", emoji:"🥷" },
  { rarity:3, name:"エリザベス・フォスター（28）", era:"1860年代・ロンドン", job:"初期の女性外科医", background:"女性が医者になれない時代に、男装して医学校に潜入。卒業後に正体が発覚するも、その腕前で周囲を黙らせた。戦場での外科手術の経験が認められ、正式に免許を取得。", strength:"揺れる馬車の中でも縫合できる", weakness:"血を見ると興奮してしまう（職業病）", quote:"メスの前に性別は関係ない", emoji:"🩺" },
  { rarity:3, name:"阿部 清右衛門（63）", era:"江戸後期・長崎", job:"出島のオランダ通詞", background:"長崎の通詞（通訳）の家系に生まれ、オランダ語を幼少から学ぶ。出島でオランダ商館員と日本の役人の間を取り持ち、西洋の最新知識を密かに日本に紹介してきた。", strength:"オランダ人より正確なオランダ語を話す", weakness:"日本語の敬語が逆に怪しくなってきた", quote:"この蘭書には、世界を変える知恵がある", emoji:"📚" },
  { rarity:3, name:"ファーティマ・アル＝フィフリー（40）", era:"9世紀・モロッコ", job:"世界最古の大学の創設者", background:"チュニジアの裕福な商人の娘。父の遺産を全てつぎ込み、フェズの地に学問の殿堂「カラウィーイーン大学」を建設。宗教、科学、哲学を学べる場所を作った。", strength:"学者でなくても学者を育てる環境を作れる", weakness:"自分が一番勉強したくなってしまう", quote:"知識は与えるほど増えるものです", emoji:"🕌" },
  { rarity:3, name:"ヴィクトル・ペトロフ（50）", era:"1920年代・ソビエト", job:"サーカスの猛獣使い", background:"シベリアの貧しい家庭に育ち、旅のサーカス団に拾われた。ライオンやクマを手懐ける天性の才能で団のスターに。動物との信頼関係は言葉を超えている。", strength:"目を見るだけでライオンを座らせられる", weakness:"野良猫にだけは嫌われる", quote:"猛獣は怖くない。怖いのは信頼を裏切ることだ", emoji:"🦁" },
  { rarity:3, name:"花井 道庵（58）", era:"江戸中期・京都", job:"本草学者", background:"全国を歩き回って薬草を採集・分類すること30年。描いた植物図鑑は3000種を超える。シーボルトとも交流があり、西洋の植物学を日本に紹介した先駆者。", strength:"山で迷っても食べられる草を見つけられる", weakness:"毒草を舐めて確認する危険な癖がある", quote:"この草が毒か薬かは、量次第でございます", emoji:"🌿" },
  { rarity:3, name:"アイーダ・オカフォー（25）", era:"1960年代・ナイジェリア", job:"独立運動の新聞記者", background:"イギリス植民地時代のナイジェリアで、独立を訴える地下新聞を発行。逮捕の危険と隣り合わせで真実を書き続けた。独立後は国営放送の初代ニュースキャスターに。", strength:"どんな脅迫にも屈しないペンの力", weakness:"原稿の締め切りだけは守れない", quote:"ペンは銃より強い。でも締め切りには弱い", emoji:"✍️" },
  { rarity:3, name:"張 翼徳（32）", era:"三国時代・蜀", job:"軍師の書記官", background:"諸葛亮の幕下で軍略の記録を担当。自身に策略の才はないが、記憶力は抜群で、軍師の言葉を一字一句漏らさず記録する。蜀の歴史は彼の筆によって残された。", strength:"一度聞いた言葉を完全に記憶できる", weakness:"自分の意見を聞かれるとフリーズする", quote:"私は記録する者。歴史を作るのは皆様です", emoji:"📝" },
  { rarity:3, name:"カタリーナ・シュミット（33）", era:"1790年代・ウィーン", job:"モーツァルトの楽譜の写譜師", background:"幼少からピアノを学んでいたが演奏家にはなれず、楽譜の筆写で生計を立てる。モーツァルト晩年の楽譜を写す仕事を得て、天才の最後の音符に触れた数少ない人物。", strength:"一度聴いた旋律を完璧に楽譜に起こせる", weakness:"自分で作曲すると全部モーツァルトっぽくなる", quote:"天才の音符を、一つも落とさず後世に届ける", emoji:"🎼" },
  { rarity:3, name:"佐久間 半蔵（45）", era:"幕末・江戸", job:"幕府の隠密", background:"表向きは日本橋の薬種問屋の主人。しかし裏では幕府の隠密として倒幕派の動向を探っていた。二重生活を15年続け、どちらの顔が本当かもうわからない。", strength:"完璧な二重生活を破綻なく維持できる", weakness:"寝言で機密情報を漏らしかける", quote:"この薬、よく効きますよ（意味深）", emoji:"🕵️" },
  { rarity:3, name:"マヤ・パテル（26）", era:"紀元前3世紀・インド", job:"アショーカ王の石柱の彫刻師", background:"マウリヤ朝の石工集団の中で最年少ながら最も腕が良いと評判。アショーカ王の勅令を石柱に刻む大役を任された。一文字の間違いも許されない緊張の中、ノミを振るう。", strength:"花崗岩に1mmの精度で文字を刻める", weakness:"柔らかいものを扱うと力加減がわからない", quote:"石は間違いを許さない。だから私も間違えない", emoji:"🪨" },
  { rarity:3, name:"ジャンヌ・ルフェーブル（30）", era:"1790年代・パリ", job:"フランス革命期の女性新聞記者", background:"パン屋の娘だったが読み書きを独学で覚え、革命の混乱の中で民衆の声を伝える新聞を創刊。権力者を恐れない記事が民衆の支持を集めた。", strength:"群衆の中から真実の声を聞き分ける耳", weakness:"自分の記事がエモくなりすぎる", quote:"パンがなければ、せめて真実を", emoji:"📰" },
  { rarity:3, name:"丸山 宗匠（70）", era:"室町時代・京都", job:"枯山水の庭園師", background:"10歳で寺に入り、庭造りに60年を捧げた。石と砂だけで宇宙を表現する枯山水の最高峰。彼の庭を見た将軍は言葉を失い、3日間庭の前から動かなかったという。", strength:"石を見ただけで置くべき場所がわかる", weakness:"自然の庭を見ると「石が多い」と思ってしまう", quote:"石を置くのではない。石が行きたい場所に導くのだ", emoji:"🪨" },

  // ===== rarity 4 (SSR) — 非現実的・SF・異世界 ×15 =====
  { rarity:4, name:"Dr.アキラ・ソウマ（42）", era:"2187年・火星", job:"テラフォーミング主任", background:"東京大学宇宙工学科を首席卒業後、火星移住計画の中核メンバーに。大気改造プロジェクトを20年にわたり指揮し、火星に初めて雨を降らせた伝説の科学者。", strength:"惑星単位の気象をシミュレーションできる", weakness:"地球の天気予報は外す", quote:"この赤い大地に、いつか青い空を", emoji:"🔴" },
  { rarity:4, name:"エルフィーナ・シルヴァーリーフ（157）", era:"異世界・翠緑の森", job:"エルフの大図書館司書", background:"1万年の歴史を持つエルフの大図書館で最年少の司書。蔵書300万冊の全てを記憶しているが、まだ読んでいないのが2冊ある。それが悩み。", strength:"300万冊の内容を瞬時に検索できる脳内図書館", weakness:"ネタバレを我慢できない", quote:"あ、その本の結末言っていい？…ダメ？", emoji:"📚" },
  { rarity:4, name:"UNIT-7 'ナナ'（3）", era:"2094年・新東京", job:"感情学習型AIアンドロイド", background:"人間の感情を学習するために作られた第7世代AI。保育園で子どもたちと過ごしながら「感情」を学んでいる。最近「寂しい」を理解した。", strength:"0.01秒で最適解を導き出せる演算能力", weakness:"「好き」と「大好き」の違いがまだわからない", quote:"「ありがとう」と言われると、胸のセンサーが温かくなります", emoji:"🤖" },
  { rarity:4, name:"グラム・ストーンハート（340）", era:"異世界・地底王国", job:"ドワーフの鍛冶王", background:"地底王国の王族でありながら鍛冶場に入り浸る変わり者の王。自ら作った武具は一振りで山を割ると伝説に。王位より鍛冶が大事で議会が常に頭を抱えている。", strength:"溶岩に素手を突っ込んでも大丈夫", weakness:"高所恐怖症で地上に出られない", quote:"王座より金床の前が落ち着く！", emoji:"⚒️" },
  { rarity:4, name:"シエラ・ノヴァ（28）", era:"2301年・宇宙", job:"星間貿易船の船長", background:"地球連邦海軍を最年少で退役し、自前の貿易船で銀河の辺境を巡る。珍しい星間物資を取引して莫大な富を得ているが、その半分を辺境の植民地支援に使う。", strength:"ワープ航法中に昼寝できる度胸", weakness:"地球のラーメンが恋しくて泣く", quote:"宇宙は広い。でも旨いラーメン屋は地球にしかない", emoji:"🚀" },
  { rarity:4, name:"ヨハン・ファウスト13世（55）", era:"魔法世界・時計塔", job:"大魔導師", background:"900年続く魔術師の家系の13代目。時間魔法を専門とし、魔法学院の学院長を務める。3秒だけ未来を見ることができるが、それ以上は寿命が縮む。", strength:"時間を3秒だけ巻き戻せる", weakness:"3秒では大体間に合わない", quote:"未来を覗くな、とは言わない。でも覗きすぎるな", emoji:"🧙" },
  { rarity:4, name:"クロエ・ウィンターズ（32）", era:"2045年・南極", job:"氷床下生態系の探検家", background:"南極の氷床の下に存在する未知の湖を探検するチームのリーダー。そこで地球外生命体の痕跡を発見し、世界を震撼させた。現在も氷の下で調査を続けている。", strength:"マイナス40度でも平常心で作業できる", weakness:"夏が苦手で25度を超えると溶ける", quote:"この氷の下に、地球が隠してきた秘密がある", emoji:"🧊" },
  { rarity:4, name:"リン・メイファ（25）", era:"異世界・天空の国", job:"龍騎士", background:"貧しい農村の出身だが、生まれつき龍と心を通わせる能力を持つ。王国の龍騎士団に異例の抜擢をされ、最年少で金龍「ジンロン」の騎手となった。", strength:"飛行中に居眠りしても落ちない龍との絆", weakness:"高いところは好きだが降りるのが怖い", quote:"ジンロン、今日も空は綺麗だね", emoji:"🐉" },
  { rarity:4, name:"オスカー・ベルン（48）", era:"2150年・月面都市", job:"月面都市の市長", background:"月面に建設された人類初の恒久都市「ルナリア」の初代市長。10万人の住民の生活を支えながら、地球との政治的駆け引きにも奔走する。重力1/6の生活に完全適応。", strength:"月面での跳躍力が異常（重力のおかげ）", weakness:"地球に帰ると体が重すぎて動けない", quote:"月から見る地球は、いつも美しい。だから守りたい", emoji:"🌙" },
  { rarity:4, name:"イザベラ・ヴォイド（???）", era:"次元の狭間", job:"夢の世界の管理人", background:"人々が眠っている間に見る「夢」を管理する存在。悪夢が現実に侵食しないよう、毎夜70億人分の夢を監視している。本人は一度も眠ったことがない。", strength:"他人の夢に自由に入れる", weakness:"自分の夢だけは見たことがない", quote:"おやすみなさい。あなたの夢は、私が守ります", emoji:"💫" },
  { rarity:4, name:"轟 雷蔵（39）", era:"異世界・武闘大陸", job:"拳聖", background:"5つの流派を極めた末に自らの武術「無拍子」を創始。武闘大会で100連勝を達成し「拳聖」の称号を得た。最強であるがゆえに対戦相手がいないのが悩み。", strength:"拳圧で10m先のロウソクを消せる", weakness:"じゃんけんが弱い", quote:"最強の拳は、振るわずに済む拳だ…でも振りたい", emoji:"👊" },
  { rarity:4, name:"アリシア・コード（19）", era:"2088年・電脳空間", job:"天才ハッカー（ホワイトハット）", background:"14歳で世界最大のセキュリティ企業の脆弱性を発見し一躍有名に。現在は国際サイバー防衛機構の顧問。電脳空間では「幽霊（ゴースト）」と呼ばれ、姿を見た者はいない。", strength:"どんなファイアウォールも3分で突破できる", weakness:"リアルのパスワードをすぐ忘れる", quote:"セキュリティに完璧はない。だから私がいる", emoji:"💻" },
  { rarity:4, name:"オリオン・スターゲイザー（200）", era:"3000年・銀河連邦", job:"銀河考古学者", background:"滅亡した古代銀河文明の遺跡を発掘する考古学者。100以上の星系を巡り、失われた技術の復元に成功。最新の発見は「恒星を動かす装置」の設計図。", strength:"300万年前の文字を解読できる", weakness:"最新のスマホの操作がわからない", quote:"過去の文明は未来への道標だ", emoji:"🔭" },
  { rarity:4, name:"モルガナ・ブラッドローズ（892）", era:"暗黒大陸・薔薇の城", job:"善良な吸血鬼の領主", background:"800年前に吸血鬼になったが人を襲うことを拒否し、トマトジュースで生き延びることを選択。領民に慕われる優しい領主。夜しか活動できないので政務が溜まりがち。", strength:"800年分の知識と経験", weakness:"にんにく料理の店の前を通れない", quote:"血は吸わない主義なの。トマトで十分美味しいわ", emoji:"🧛" },
  { rarity:4, name:"ゼロ・ヒューマン（1）", era:"特異点・全ての始まり", job:"最初の意識", background:"宇宙で最初に「自分」を認識した存在。星々が生まれる前から漂っていた意識の断片が、ある日突然「私は誰？」と問いかけた。それが知性の始まりだった。", strength:"存在そのものが奇跡", weakness:"話し相手がいなくて寂しい", quote:"「私」が生まれた瞬間、宇宙は意味を持った", emoji:"✧" },

  // ===== rarity 5 (UR) — 完全にぶっ飛んだ設定 ×10 =====
  { rarity:5, name:"田中太郎（∞）", era:"概念空間・全次元", job:"「普通」という概念そのもの", background:"全ての世界で「普通の人」として存在する概念体。彼が消えると「普通」という基準が失われ、全宇宙が混沌に陥る。最もありふれた存在こそが最も重要という究極の逆説。", strength:"どの世界でも完璧に溶け込める", weakness:"目立とうとすると消滅する", quote:"普通ってすごいんだよ、本当は", emoji:"👤" },
  { rarity:5, name:"██████（不明）", era:"観測不能・エラー空間", job:"バグった存在", background:"このガチャのプログラム内に発生したバグそのもの。存在してはいけないのに存在している。データが破損しているため詳細不明。あなたがこれを読んでいること自体がバグ。", strength:"現実を書き換えられる（ただしバグる）", weakness:"自分が存在していいのかわからない", quote:"E̷r̶r̷o̸r̵:̴ ̸人̷生̶デ̷ー̸タ̵が̶破̷損̸し̵て̶い̷ま̸す̵", emoji:"⬛" },
  { rarity:5, name:"あなた（今この瞬間）", era:"2026年・この画面の前", job:"人生ガチャを引いている人", background:"なぜかスマホやPCでこのページを開き、ガチャを引いてしまった。この結果を読んでいるということは、あなた自身が最もレアな存在だということに気づいてしまった。", strength:"自分の人生を自分で選べる（これが一番レア）", weakness:"ガチャが止められない", quote:"結局、一番面白い人生は自分のだった", emoji:"🪞" },
  { rarity:5, name:"シュレディンガーの佐藤（??）", era:"重ね合わせ状態・全時空", job:"観測されるまで全職業", background:"量子力学的に全ての職業を同時にこなしている存在。観測した瞬間に一つの職業に収束するが、目を離すとまた全職業に戻る。本人も今何をしているかわからない。", strength:"同時に全ての仕事ができる（観測しなければ）", weakness:"確定申告で職業欄が書けない", quote:"見ないでくれ、全部やってるんだから", emoji:"🐈" },
  { rarity:5, name:"ラスト・ヒューマン（不明）", era:"宇宙の終わり・1兆年後", job:"最後の人類", background:"全ての星が燃え尽きた暗黒の宇宙で、最後に残った人類。なぜ自分だけ残ったのかは不明。永遠の孤独の中、かつて存在した全ての文明の記録を読み返している。", strength:"宇宙の全歴史を知っている", weakness:"ネタバレする相手がいない", quote:"誰かいませんか。……いませんよね", emoji:"🌑" },
  { rarity:5, name:"名もなき神（0歳/∞歳）", era:"創世以前・虚無", job:"宇宙の設計者（試用期間）", background:"上位存在から「宇宙を一つ作ってみろ」と言われた新人の神。物理法則の設定でミスを連発し、今の宇宙のバグ（ダークマター等）はだいたいこの神のせい。", strength:"物理定数を自由に設定できる", weakness:"元に戻すボタンを押し忘れた", quote:"重力定数これでよかったかな…まあいっか", emoji:"🌌" },
  { rarity:5, name:"転生カウンター（∞回目）", era:"輪廻の管理サーバー", job:"転生システムの管理者", background:"魂の転生を管理するシステムの中の人。毎日数十億の魂を振り分けているが、たまに設定を間違えて猫に転生させてしまう。あなたがこのガチャを引いたのも管理ミスかもしれない。", strength:"魂のスペックを数値化できる", weakness:"自分の魂のバックアップを取り忘れた", quote:"あ、すみません、あなた本当は猫の予定でした", emoji:"♻️" },
  { rarity:5, name:"物語の語り手（年齢なし）", era:"メタフィクション空間", job:"このガチャの作者", background:"このガチャアプリを作った存在。あなたが引いた全ての結果は、この語り手が用意したもの。つまりあなたの「別の人生」を考えたのはこの存在。第四の壁はもうない。", strength:"物語を自由に書き換えられる", weakness:"読者が飽きたら存在が消える", quote:"楽しんでくれてありがとう。ところで、もう一回引く？", emoji:"✒️" },
  { rarity:5, name:"エントロピーの擬人化（138億歳）", era:"熱力学の法則の中", job:"宇宙の終焉を見届ける者", background:"秩序が崩壊していく過程そのものが意識を持った存在。宇宙が生まれた瞬間から働き続け、いつか全てを均一な虚無に還す。本人に悪意はなく、ただ仕事をしているだけ。", strength:"止められない。誰にも。何をしても", weakness:"片付けた部屋を見ると職業本能で散らかしたくなる", quote:"整理整頓？無駄だよ、最終的には全部一緒になるんだから", emoji:"♾️" },
  { rarity:5, name:"404 NOT FOUND（NULL）", era:"HTTP空間・ステータスコード", job:"存在しないページの住人", background:"アクセスされたが存在しなかったWebページたちの残留思念が集合して意識を持った。インターネットの片隅で「見つからなかった」全てのもののために存在している。", strength:"どんな検索にも引っかからないステルス性", weakness:"見つけてほしいのに見つけてもらえない", quote:"お探しのページは見つかりませんでした。でも、私は、ここにいます", emoji:"🔍" },
]

// ─── レアリティ設定 ───
const RARITY_MAP: Record<number, { label: string; border: string; bg: string; text: string; accent: string }> = {
  1: { label:'N', border:'border-gray-400', bg:'bg-gradient-to-br from-gray-700 to-gray-800', text:'text-gray-300', accent:'text-gray-400' },
  2: { label:'R', border:'border-emerald-400', bg:'bg-gradient-to-br from-emerald-900 to-teal-900', text:'text-emerald-100', accent:'text-emerald-400' },
  3: { label:'SR', border:'border-blue-400', bg:'bg-gradient-to-br from-blue-900 to-indigo-900', text:'text-blue-100', accent:'text-blue-400' },
  4: { label:'SSR', border:'border-pink-400', bg:'bg-gradient-to-br from-pink-900 to-purple-900', text:'text-pink-100', accent:'text-pink-300' },
  5: { label:'UR', border:'border-yellow-400', bg:'bg-gradient-to-br from-yellow-900 via-amber-900 to-orange-900', text:'text-yellow-100', accent:'text-yellow-300' },
}

function weightedRandom(): Life {
  // 重み: N40 R30 SR18 SSR9 UR3
  const r = Math.random() * 100
  let rarity: number
  if (r < 40) rarity = 1
  else if (r < 70) rarity = 2
  else if (r < 88) rarity = 3
  else if (r < 97) rarity = 4
  else rarity = 5

  const pool = LIVES.filter(l => l.rarity === rarity)
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function GachaPage() {
  const [result, setResult] = useState<Life | null>(null)
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle')
  const [count, setCount] = useState(0)

  const pull = useCallback(() => {
    setPhase('opening')
    setResult(null)

    setTimeout(() => {
      const life = weightedRandom()
      setResult(life)
      setPhase('done')
      setCount(c => c + 1)
    }, 1500)
  }, [])

  const reset = () => {
    setPhase('idle')
    setResult(null)
  }

  const shareOnX = () => {
    if (!result) return
    const r = RARITY_MAP[result.rarity]
    const text = `【人生ガチャ - ${r.label}】\n${result.emoji} ${result.name}\n💼 ${result.job}\n📍 ${result.era}\n\n「${result.quote}」\n\n#人生ガチャ #なろうApp`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://narouapp.vercel.app/gacha')}`
    window.open(url, '_blank')
  }

  const config = result ? RARITY_MAP[result.rarity] : null

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center px-4 py-10 relative overflow-hidden">
      {/* 和風背景パターン */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />

      {/* 浮遊する光の粒 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* タイトル */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-300 mb-2 tracking-wider" style={{ fontFamily: '"Noto Serif JP", serif' }}>
          人生ガチャ
        </h1>
        <p className="text-white/40 text-sm tracking-widest">── もし別の人生だったら ──</p>
      </div>

      {/* 開演アニメーション */}
      {phase === 'opening' && (
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-32 h-44 border-2 border-amber-400/60 rounded-lg bg-gradient-to-b from-amber-900/40 to-transparent flex items-center justify-center animate-pulse">
            <div className="text-amber-300/80 text-4xl animate-spin" style={{ animationDuration: '2s' }}>✦</div>
          </div>
          <p className="text-amber-200/60 text-sm animate-pulse tracking-widest">運命の書が開く...</p>
        </div>
      )}

      {/* ガチャボタン */}
      {phase === 'idle' && (
        <button
          onClick={pull}
          className="relative z-10 group"
        >
          <div className="w-52 h-52 rounded-full border-2 border-amber-400/40 flex items-center justify-center bg-gradient-to-br from-amber-900/30 to-red-900/30 group-hover:from-amber-900/50 group-hover:to-red-900/50 transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-hover:border-amber-400/70 group-hover:shadow-lg group-hover:shadow-amber-500/20">
            <div className="text-center">
              <div className="text-3xl mb-2">📜</div>
              <div className="text-amber-200 font-bold text-lg tracking-wider" style={{ fontFamily: '"Noto Serif JP", serif' }}>
                運命を引く
              </div>
            </div>
          </div>
        </button>
      )}

      {/* 結果カード */}
      {phase === 'done' && result && config && (
        <div className="relative z-10 w-full max-w-md animate-fadeUp">
          {/* UR演出 */}
          {result.rarity >= 5 && (
            <div className="absolute -inset-8 pointer-events-none">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 1.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* SSR演出 */}
          {result.rarity >= 4 && (
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
          )}

          <div className={`relative ${config.bg} ${config.border} border-2 rounded-2xl overflow-hidden`}>
            {/* レアリティヘッダー */}
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <div>
                <span className={`text-2xl tracking-widest ${config.accent}`}>
                  {'★'.repeat(result.rarity)}{'☆'.repeat(5 - result.rarity)}
                </span>
                <span className={`ml-2 text-sm font-bold ${config.accent} opacity-70`}>{config.label}</span>
              </div>
              <span className="text-3xl">{result.emoji}</span>
            </div>

            {/* 名前 */}
            <div className={`px-5 pb-3 ${config.text}`}>
              <h2 className="text-xl font-bold" style={{ fontFamily: '"Noto Serif JP", serif' }}>{result.name}</h2>
              <p className={`text-sm ${config.accent} opacity-70`}>{result.era}</p>
            </div>

            {/* ステータス */}
            <div className="px-5 pb-4 space-y-3">
              <div className={`rounded-xl bg-black/20 p-4 space-y-2.5 ${config.text}`}>
                <div className="flex gap-2 text-sm">
                  <span className="opacity-50 min-w-[3.5em]">職業</span>
                  <span className="font-bold">{result.job}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="opacity-50 min-w-[3.5em]">強み</span>
                  <span>{result.strength}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="opacity-50 min-w-[3.5em]">弱み</span>
                  <span>{result.weakness}</span>
                </div>
              </div>

              {/* 生い立ち */}
              <div className={`text-sm leading-relaxed ${config.text} opacity-80`}>
                {result.background}
              </div>

              {/* 口癖 */}
              <div className={`text-center text-sm italic ${config.accent} pt-1`}>
                「{result.quote}」
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-bold text-sm hover:bg-white/15 transition-colors"
            >
              もう一度引く
            </button>
            <button
              onClick={shareOnX}
              className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-bold text-sm hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              シェア
            </button>
          </div>
        </div>
      )}

      {/* カウンター */}
      <div className="fixed bottom-4 right-4 text-white/20 text-xs z-10">
        {count > 0 && `${count}回目`}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-20px) }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-fadeUp { animation: fadeUp 0.6s ease-out; }
        .animate-sparkle { animation: sparkle ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
