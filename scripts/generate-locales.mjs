// Generates localized pages (zh-Hans / ja / ko) from the English source index.html,
// plus a sitemap with hreflang alternates. Mirrors the snorz-site pipeline:
// exact-match curated copy, per-locale head (title/description/OG/canonical/
// alternates/JSON-LD), localized accessibility labels, and a language switcher.
// Run: node scripts/generate-locales.mjs

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://moodsk.ajigu.com";

const locales = [
  {
    code: "en-GB",
    route: "",
    label: "English",
    chooseLanguage: "Choose language",
    ogLocale: "en_GB",
    source: true,
    title: "Moodsk — Custom Icons for Mac &amp; Finder",
    description:
      "Moodsk is a focused icon editor for macOS. Design file and folder icons from images, SF Symbols or text, apply them one by one or in batches, and restore defaults from Finder.",
    ogDescription:
      "Design file and folder icons from images, SF Symbols or text, apply them one by one or in batches, and restore defaults from Finder.",
    faq: [
      ["Which Macs does Moodsk support?", "Moodsk runs on macOS 14 or later, including Apple Silicon Macs."],
      [
        "What can I use to create icons?",
        "Import your own images (PNG, JPG, HEIC or SVG), pick from thousands of SF Symbols, or compose icons from text and emoji. Curated icon packs are included.",
      ],
      [
        "How do I restore an original icon?",
        "Drop the files back into Moodsk to restore them, or right-click any file in Finder and choose restore with the bundled Finder extension. Batch restore is supported.",
      ],
      [
        "Does Moodsk upload my files anywhere?",
        "No. Rendering and icon application happen entirely on your Mac; Moodsk works offline and never uploads your data.",
      ],
    ],
  },
  {
    code: "zh-Hans",
    "Privacy Policy": "隐私政策",
    Support: "用户支持",
    Contact: "联系我们",
    route: "zh-hans",
    label: "简体中文",
    chooseLanguage: "选择语言",
    ogLocale: "zh_Hans",
    title: "Moodsk — 让你的 Mac 桌面与众不同",
    description:
      "Moodsk 是一款 macOS 文件与文件夹图标编辑工具。用图片、SF Symbols 或文字创作图标，拖入即换、批量应用，还能在访达中一键恢复默认图标。",
    ogDescription: "用图片、SF Symbols 或文字设计文件与文件夹图标，单个或批量应用，并可在访达中一键恢复默认图标。",
    faq: [
      ["Moodsk 支持哪些 Mac？", "Moodsk 支持 macOS 14 及以上版本，兼容 Apple Silicon 芯片的 Mac。"],
      [
        "可以用哪些素材创作图标？",
        "可以导入自己的图片（PNG、JPG、HEIC 或 SVG），从数千个 SF Symbols 中挑选，或用文字与 Emoji 组合创作，还内置精选图标包。",
      ],
      [
        "如何恢复默认图标？",
        "把文件重新拖入 Moodsk 即可还原；也可以在访达中右键文件，通过内置的访达扩展一键恢复，支持多选批量还原。",
      ],
      ["Moodsk 会上传我的文件吗？", "不会。渲染与图标应用全部在你的 Mac 上完成，Moodsk 可离线使用，从不上传你的数据。"],
    ],
  },
  {
    code: "ja",
    route: "ja",
    label: "日本語",
    chooseLanguage: "言語を選択",
    ogLocale: "ja_JP",
    title: "Moodsk — Mac のファイルとフォルダを自分らしく",
    description:
      "Moodsk は、Mac のファイルやフォルダのアイコンに特化したエディタです。画像・SF Symbols・文字からアイコンを作り、ドラッグしてすぐ交換、一括適用にも対応。Finder からいつでもデフォルトに戻せます。",
    ogDescription:
      "画像・SF Symbols・文字からファイルやフォルダのアイコンをデザインし、単体でも一括でも適用。Finder からデフォルトに戻せます。",
    faq: [
      ["どの Mac で使えますか？", "Moodsk は macOS 14 以降で動作します。Apple Silicon Mac にも対応しています。"],
      [
        "アイコンは何で作れますか？",
        "自分の画像（PNG・JPG・HEIC・SVG）の読み込み、数千の SF Symbols からの選択、文字と絵文字での作成が可能です。厳選アイコンパックも内蔵しています。",
      ],
      [
        "元のアイコンに戻すには？",
        "ファイルを Moodsk にドラッグし直せば復元できます。内蔵の Finder 拡張を使えば、Finder で右クリックしてワンクリックで復元。複数選択の一括復元にも対応しています。",
      ],
      [
        "ファイルはどこかにアップロードされますか？",
        "いいえ。レンダリングもアイコンの適用もすべてあなたの Mac 上で行われます。Moodsk はオフラインで動作し、データをアップロードすることはありません。",
      ],
    ],
  },
  {
    code: "ko",
    route: "ko",
    label: "한국어",
    chooseLanguage: "언어 선택",
    ogLocale: "ko_KR",
    title: "Moodsk — Mac 파일과 폴더를 나답게",
    description:
      "Moodsk는 Mac 파일·폴더 아이콘 전용 편집기입니다. 이미지, SF Symbols, 텍스트로 아이콘을 만들고 드래그로 바로 교체하고 일괄 적용하며, Finder에서 언제든 기본 아이콘으로 복원할 수 있습니다.",
    ogDescription:
      "이미지, SF Symbols, 텍스트로 파일·폴더 아이콘을 디자인하고 하나씩 또는 한꺼번에 적용하며, Finder에서 기본 아이콘으로 복원하세요.",
    faq: [
      ["어떤 Mac에서 사용할 수 있나요?", "Moodsk는 macOS 14 이상에서 작동하며 Apple Silicon Mac도 지원합니다."],
      [
        "아이콘은 무엇으로 만들 수 있나요?",
        "내 이미지(PNG, JPG, HEIC, SVG)를 가져오거나 수천 개의 SF Symbols에서 고르거나 텍스트와 이모지로 구성할 수 있습니다. 엄선된 아이콘 팩도 포함되어 있습니다.",
      ],
      [
        "원래 아이콘으로 되돌리려면?",
        "파일을 Moodsk에 다시 드래그하면 복원됩니다. 내장 Finder 확장을 사용하면 Finder에서 오른쪽 클릭 한 번으로 복원되며, 다중 선택 일괄 복원도 지원합니다.",
      ],
      [
        "파일이 어딘가로 업로드되나요?",
        "아니요. 렌더링과 아이콘 적용은 모두 당신의 Mac에서 처리됩니다. Moodsk는 오프라인으로 작동하며 데이터를 절대 업로드하지 않습니다.",
      ],
    ],
  },
];

// Curated translations, keyed by the exact (whitespace-normalised) English text node.
const copy = {
  "zh-Hans": {
    Features: "功能",
    Editor: "编辑器",
    "Batch replace": "批量替换",
    "Icon packs": "图标包",
    FAQ: "常见问题",
    "Download on the App Store": "App Store 下载",
    "Make your Mac,": "让你的 Mac，",
    "unmistakably yours.": "与众不同。",
    "Moodsk is a focused icon editor for files and folders. Create icons from images, SF Symbols or text, apply them one by one or in batches, and restore defaults from Finder whenever you like.":
      "Moodsk 是一款专注于文件与文件夹图标的编辑工具。用图片、SF Symbols 或文字创作图标，拖入即换、批量应用，随时可以在访达中一键恢复默认。",
    "See what it can do": "看看它能做什么",
    "macOS 14+ &nbsp;·&nbsp; 简体中文 / English / 日本語 / 한국어 &nbsp;·&nbsp; On-device, privacy first":
      "macOS 14+ &nbsp;·&nbsp; 简体中文 / English / 日本語 / 한국어 &nbsp;·&nbsp; 本地处理，隐私优先",
    "Moodsk — Discover": "Moodsk — 发现",
    "Your own images": "自己的图片",
    "Text &amp; emoji": "文字与 Emoji",
    "Curated icon packs": "精选图标包",
    "Five style effects": "五种样式特效",
    "Batch apply &amp; restore": "批量应用与还原",
    "Create, apply, restore —": "创作、应用、还原，",
    "all in one place": "一套搞定",
    "From desktop styling to bulk organising, Moodsk makes changing icons quick and fun.":
      "从灵感桌搭到批量整理，Moodsk 把改图标这件小事做到顺手又有趣。",
    "A what-you-see-is-what-you-get layer editor": "所见即所得的图层编辑器",
    "Template plus layers: position, scale, rotation, 3D perspective, opacity and corner radius, combined however you like. Every change shows up instantly.":
      "模板 + 图层式编辑：位置、缩放、旋转、3D 透视、透明度、圆角，随心组合。所见即所得，改完立刻看到效果。",
    "Icon Pack Editor": "图标包编辑器",
    "Rich sources": "丰富素材",
    "Import your own pictures, pick SF Symbols from the built-in browser, or express things with text and emoji.":
      "导入自己的图片，从内置选择器挑选 SF Symbols，或用文字与 Emoji 表达个性。",
    "Style effects": "样式特效",
    "Normal, Embossed, Shadow, Sticker and Neon styles, with tinting, filters and a white outline.":
      "普通、浮雕、阴影、贴纸、霓虹五种风格，配合着色、滤镜与白色描边，一键换装。",
    Embossed: "浮雕",
    Shadow: "阴影",
    Sticker: "贴纸",
    Neon: "霓虹",
    "Pack-wide editing": "整包同步",
    "Edit once and the whole icon pack updates. Ten folders of text and colour, consistent in one step.":
      "编辑一次，整个图标包同步更新。十个文件夹的文字与配色，一步到位保持统一。",
    "Batch apply / restore": "批量应用 / 一键还原",
    "Queue multiple items and apply one design in bulk, or restore default icons in batches with visible progress.":
      "把多个对象加入待应用列表，批量套用同一设计；也可以批量还原默认图标，全程进度可见。",
    "Build icons like building blocks": "像搭积木一样做图标",
    "Layer images, symbols and text freely. Font families and weights, automatic sizing, outlines and effects — every detail is yours to decide.":
      "图片、符号、文字自由叠加。字体家族与字重、自动字号、描边与特效——每个细节都由你决定。",
    "Work — Icon Pack Editor": "Work — 图标包编辑器",
    "Live preview": "实时预览",
    "The selected layer is highlighted; border and radius guides appear as you scale.":
      "选中图层高亮显示，边框与圆角参考随缩放出现。",
    "Automatic sizing": "自动字号",
    "Text adapts to its container, so titles and monograms always fit.": "文字随容器自适应大小，标题与字母组合都恰到好处。",
    "Undo / redo": "撤销 / 重做",
    "Both edits and layer order can be reverted, so experiment freely.": "编辑与图层顺序均可回退，大胆尝试不怕改坏。",
    "Sharp export": "高清导出",
    "Icons render at 4×, staying crisp in Finder and on the desktop.": "4× 渲染输出，图标在访达与桌面上都锐利清晰。",
    "Fresh folders in three steps": "三步，让文件夹焕然一新",
    "Pick a source": "挑选素材",
    "Open a curated icon pack, or import your own images, SF Symbols and text.": "打开精选图标包，或导入自己的图片、SF Symbols 与文字。",
    "Polish the style": "打磨样式",
    "Adjust colour, scale, corner radius and effects, tuning every layer live.": "调整颜色、缩放、圆角与特效，所见即所得地微调每个图层。",
    "Apply or restore": "应用或还原",
    "Replace a single icon by drag and drop, apply in batches, or restore defaults in one click.":
      "拖入即换单个图标，或批量应用；改错了随时一键恢复默认。",
    "Drop it in, it's swapped": "拖进来，就换了",
    "Drag files or folders into the window and the icon is replaced the moment you let go. You can also export a brand-new folder with its icon already set.":
      "把文件或文件夹拖入窗口，松手立即替换图标；也可以新建一个“自带图标”的文件夹直接导出。",
    "Single or multi-file drops, plus the system open panel": "单选、多选拖放均可，支持系统文件面板选择",
    "White outline switch for light wallpapers": "白色描边开关，搭配浅色壁纸更清晰",
    "Old icons are cleared before replacing, so nothing lingers": "覆盖前自动清理旧图标，避免残影",
    "Bundled Finder extension: right-click files in Finder to restore default icons in one click, with multi-select support.":
      "内置访达扩展：在 Finder 中选中文件右键，即可一键恢复默认图标，支持多选批量还原。",
    "Colors — Instant replace": "颜色 — 立即替换",
    "Curated packs, picked for your desktop": "精选图标包，为桌面精心挑选",
    "Open any icon and make it yours — change the text, the colour, add a badge. It's up to you.":
      "打开任意图标即可定制成你的专属样式——换字、换色、加徽章，都随你。",
    Basic: "基本",
    "Essentials · Free": "必备精选 · 免费",
    Placard: "铭牌",
    Typography: "字体排版",
    "Cartoon Doodle Zoo": "卡通涂鸦动物园",
    Illustration: "插画系列",
    Colors: "颜色",
    "Colour series · Free": "色彩系列 · 免费",
    "On-device only": "本地处理",
    "Rendering and icon application happen locally. No network, no uploads.":
      "图像渲染与图标应用全部在本机完成，不联网、不上传。",
    "Light &amp; dark": "深浅色自适应",
    "Follows the system appearance with frosted materials and motion.": "跟随系统外观，毛玻璃质感与动效浑然一体。",
    "Four languages": "多语言界面",
    "简体中文, English, 日本語 and 한국어 out of the box.": "简体中文、English、日本語、한국어 开箱即用。",
    "Questions, answered": "常见问题，一一解答",
    "Which Macs does Moodsk support?": "Moodsk 支持哪些 Mac？",
    "Moodsk runs on macOS 14 or later, including Apple Silicon Macs.": "Moodsk 支持 macOS 14 及以上版本，兼容 Apple Silicon 芯片的 Mac。",
    "What can I use to create icons?": "可以用哪些素材创作图标？",
    "Import your own images (PNG, JPG, HEIC or SVG), pick from thousands of SF Symbols, or compose icons from text and emoji. Curated icon packs are included.":
      "可以导入自己的图片（PNG、JPG、HEIC 或 SVG），从数千个 SF Symbols 中挑选，或用文字与 Emoji 组合创作，还内置精选图标包。",
    "How do I restore an original icon?": "如何恢复默认图标？",
    "Drop the files back into Moodsk to restore them, or right-click any file in Finder and choose restore with the bundled Finder extension. Batch restore is supported.":
      "把文件重新拖入 Moodsk 即可还原；也可以在访达中右键文件，通过内置的访达扩展一键恢复，支持多选批量还原。",
    "Does Moodsk upload my files anywhere?": "Moodsk 会上传我的文件吗？",
    "No. Rendering and icon application happen entirely on your Mac; Moodsk works offline and never uploads your data.":
      "不会。渲染与图标应用全部在你的 Mac 上完成，Moodsk 可离线使用，从不上传你的数据。",
    "Make your desktop stand out, today": "现在，就让桌面与众不同",
    "Download Moodsk for free and give every folder a little personality.": "免费下载 Moodsk，给每个文件夹一点个性。",
    "macOS 14+ · Apple Silicon supported": "macOS 14+ · 支持 Apple Silicon",
    "© 2026 Moodsk. All rights reserved.": "© 2026 Moodsk. 保留所有权利。",
  },
  ja: {
    "Privacy Policy": "プライバシーポリシー",
    Support: "サポート",
    Contact: "お問い合わせ",
    Features: "機能",
    Editor: "エディタ",
    "Batch replace": "一括入れ替え",
    "Icon packs": "アイコンパック",
    FAQ: "よくある質問",
    "Download on the App Store": "App Store でダウンロード",
    "Make your Mac,": "あなたの Mac を、",
    "unmistakably yours.": "自分らしく。",
    "Moodsk is a focused icon editor for files and folders. Create icons from images, SF Symbols or text, apply them one by one or in batches, and restore defaults from Finder whenever you like.":
      "Moodsk はファイルやフォルダのアイコンに特化したエディタです。画像・SF Symbols・文字からアイコンを作成し、単体でも一括でも適用。いつでも Finder からデフォルトに戻せます。",
    "See what it can do": "できることを見る",
    "macOS 14+ &nbsp;·&nbsp; 简体中文 / English / 日本語 / 한국어 &nbsp;·&nbsp; On-device, privacy first":
      "macOS 14+ &nbsp;·&nbsp; 简体中文 / English / 日本語 / 한국어 &nbsp;·&nbsp; オンデバイス処理でプライバシーを保護",
    "Moodsk — Discover": "Moodsk — 見つける",
    "Your own images": "自分の画像",
    "Text &amp; emoji": "文字と絵文字",
    "Curated icon packs": "厳選アイコンパック",
    "Five style effects": "5 つのスタイル効果",
    "Batch apply &amp; restore": "一括適用と復元",
    "Create, apply, restore —": "アイコンの作成も適用も復元も、",
    "all in one place": "これひとつで。",
    "From desktop styling to bulk organising, Moodsk makes changing icons quick and fun.":
      "デスクトップの個性付けから一括整理まで、アイコンの交換を Moodsk なら手軽に楽しく。",
    "A what-you-see-is-what-you-get layer editor": "見たままを編集できるレイヤーエディタ",
    "Template plus layers: position, scale, rotation, 3D perspective, opacity and corner radius, combined however you like. Every change shows up instantly.":
      "テンプレート＋レイヤー方式で、位置・拡大縮小・回転・3D パース・不透明度・角丸を自由に組み合わせ。変更はすぐに画面に反映されます。",
    "Icon Pack Editor": "アイコンパックエディタ",
    "Rich sources": "豊かな素材",
    "Import your own pictures, pick SF Symbols from the built-in browser, or express things with text and emoji.":
      "自分の画像を読み込み、内蔵ブラウザから SF Symbols を選び、文字や絵文字で個性を表現できます。",
    "Style effects": "スタイル効果",
    "Normal, Embossed, Shadow, Sticker and Neon styles, with tinting, filters and a white outline.":
      "ノーマル・エンボス・シャドウ・ステッカー・ネオンの 5 スタイルに、着色・フィルター・白フチを組み合わせられます。",
    Embossed: "エンボス",
    Shadow: "シャドウ",
    Sticker: "ステッカー",
    Neon: "ネオン",
    "Pack-wide editing": "パック全体をまとめて編集",
    "Edit once and the whole icon pack updates. Ten folders of text and colour, consistent in one step.":
      "一度の編集でアイコンパック全体が更新されます。10 個のフォルダの文字と色味を、ひとまとめに。",
    "Batch apply / restore": "一括適用 / 一括復元",
    "Queue multiple items and apply one design in bulk, or restore default icons in batches with visible progress.":
      "複数の項目をキューに入れて同じデザインを一括適用。デフォルトアイコンの一括復元も、進行状況を見ながら行えます。",
    "Build icons like building blocks": "積み木のようにアイコンを組み立てる",
    "Layer images, symbols and text freely. Font families and weights, automatic sizing, outlines and effects — every detail is yours to decide.":
      "画像・記号・文字を自由に重ねて、フォントファミリーとウェイト、自動サイズ調整、フチやエフェクトまで、細部はすべてあなた次第。",
    "Work — Icon Pack Editor": "Work — アイコンパックエディタ",
    "Live preview": "ライブプレビュー",
    "The selected layer is highlighted; border and radius guides appear as you scale.":
      "選択中のレイヤーはハイライト表示。拡大縮小に合わせて枠線や角丸のガイドが現れます。",
    "Automatic sizing": "自動サイズ調整",
    "Text adapts to its container, so titles and monograms always fit.": "テキストはコンテナに合わせて自動調整。タイトルもモノグラムも常に収まります。",
    "Undo / redo": "取り消す / やり直す",
    "Both edits and layer order can be reverted, so experiment freely.": "編集もレイヤー順序も元に戻せるので、思い切って試せます。",
    "Sharp export": "精細な書き出し",
    "Icons render at 4×, staying crisp in Finder and on the desktop.": "アイコンは 4 倍率でレンダリングされ、Finder やデスクトップでもくっきり。",
    "Fresh folders in three steps": "3 ステップでフォルダを新鮮に",
    "Pick a source": "素材を選ぶ",
    "Open a curated icon pack, or import your own images, SF Symbols and text.": "厳選アイコンパックを開くか、自分の画像・SF Symbols・文字を読み込みます。",
    "Polish the style": "スタイルを磨く",
    "Adjust colour, scale, corner radius and effects, tuning every layer live.": "色・拡大縮小・角丸・エフェクトを調整しながら、各レイヤーをその場で仕上げます。",
    "Apply or restore": "適用 or 復元",
    "Replace a single icon by drag and drop, apply in batches, or restore defaults in one click.":
      "ドラッグ＆ドロップで 1 つずつ入れ替え、一括適用、ワンクリックでデフォルトに復元。",
    "Drop it in, it's swapped": "ドロップしたら、すぐ入れ替わり",
    "Drag files or folders into the window and the icon is replaced the moment you let go. You can also export a brand-new folder with its icon already set.":
      "ファイルやフォルダをウィンドウにドラッグすれば、手を離した瞬間にアイコンを置き換え。アイコン付きの新規フォルダを書き出すこともできます。",
    "Single or multi-file drops, plus the system open panel": "単体・複数のドロップに対応、システムの「開く」パネルも利用可能",
    "White outline switch for light wallpapers": "白フチスイッチで明るい壁紙にもよく映える",
    "Old icons are cleared before replacing, so nothing lingers": "置き換え前に古いアイコンを消去するので、残像なし",
    "Bundled Finder extension: right-click files in Finder to restore default icons in one click, with multi-select support.":
      "内蔵 Finder 拡張：Finder でファイルを右クリックして、ワンクリックでデフォルトアイコンに復元。複数選択の一括復元にも対応します。",
    "Colors — Instant replace": "カラー — すぐに置き換え",
    "Curated packs, picked for your desktop": "デスクトップのために厳選したアイコンパック",
    "Open any icon and make it yours — change the text, the colour, add a badge. It's up to you.":
      "どのアイコンを開いても自分好みに — 文字を変え、色を変え、バッジを足す。すべて自由。",
    Basic: "基本",
    "Essentials · Free": "厳選コレクション · 無料",
    Placard: "プラカード",
    Typography: "タイポグラフィ",
    "Cartoon Doodle Zoo": "漫画の落書き動物園",
    Illustration: "イラストシリーズ",
    Colors: "カラー",
    "Colour series · Free": "カラーシリーズ · 無料",
    "On-device only": "オンデバイス処理",
    "Rendering and icon application happen locally. No network, no uploads.":
      "レンダリングもアイコンの適用もすべてローカルで完結。ネットワークもアップロードも一切ありません。",
    "Light &amp; dark": "ライト / ダーク対応",
    "Follows the system appearance with frosted materials and motion.": "システムの外観に合わせて、すりガラス素材とモーションで切り替わります。",
    "Four languages": "4 つの言語",
    "简体中文, English, 日本語 and 한국어 out of the box.": "簡体字中国語・English・日本語・한국어に最初から対応。",
    "Questions, answered": "よくあるご質問",
    "Which Macs does Moodsk support?": "どの Mac で使えますか？",
    "Moodsk runs on macOS 14 or later, including Apple Silicon Macs.": "Moodsk は macOS 14 以降で動作します。Apple Silicon Mac にも対応しています。",
    "What can I use to create icons?": "アイコンは何で作れますか？",
    "Import your own images (PNG, JPG, HEIC or SVG), pick from thousands of SF Symbols, or compose icons from text and emoji. Curated icon packs are included.":
      "自分の画像（PNG・JPG・HEIC・SVG）の読み込み、数千の SF Symbols からの選択、文字と絵文字での作成が可能です。厳選アイコンパックも内蔵しています。",
    "How do I restore an original icon?": "元のアイコンに戻すには？",
    "Drop the files back into Moodsk to restore them, or right-click any file in Finder and choose restore with the bundled Finder extension. Batch restore is supported.":
      "ファイルを Moodsk にドラッグし直せば復元できます。内蔵の Finder 拡張を使えば、Finder で右クリックしてワンクリックで復元。複数選択の一括復元にも対応しています。",
    "Does Moodsk upload my files anywhere?": "ファイルはどこかにアップロードされますか？",
    "No. Rendering and icon application happen entirely on your Mac; Moodsk works offline and never uploads your data.":
      "いいえ。レンダリングもアイコンの適用もすべてあなたの Mac 上で行われます。Moodsk はオフラインで動作し、データをアップロードすることはありません。",
    "Make your desktop stand out, today": "今日から、デスクトップを自分色に",
    "Download Moodsk for free and give every folder a little personality.": "Moodsk を無料でダウンロードして、フォルダひとつひとつに個性を。",
    "macOS 14+ · Apple Silicon supported": "macOS 14+ · Apple Silicon 対応",
  },
  ko: {
    "Privacy Policy": "개인정보 처리방침",
    Support: "사용자 지원",
    Contact: "문의",
    Features: "기능",
    Editor: "편집기",
    "Batch replace": "일괄 교체",
    "Icon packs": "아이콘 팩",
    FAQ: "자주 묻는 질문",
    "Download on the App Store": "App Store에서 다운로드",
    "Make your Mac,": "당신의 Mac을,",
    "unmistakably yours.": "당신답게.",
    "Moodsk is a focused icon editor for files and folders. Create icons from images, SF Symbols or text, apply them one by one or in batches, and restore defaults from Finder whenever you like.":
      "Moodsk는 파일과 폴더 아이콘에 특화된 편집기입니다. 이미지, SF Symbols, 텍스트로 아이콘을 만들고 하나씩 또는 한꺼번에 적용하고, 언제든 Finder에서 기본 아이콘으로 되돌릴 수 있습니다.",
    "See what it can do": "무엇을 할 수 있는지 보기",
    "macOS 14+ &nbsp;·&nbsp; 简体中文 / English / 日本語 / 한국어 &nbsp;·&nbsp; On-device, privacy first":
      "macOS 14+ &nbsp;·&nbsp; 简体中文 / English / 日本語 / 한국어 &nbsp;·&nbsp; 온디바이스 처리, 프라이버시 우선",
    "Moodsk — Discover": "Moodsk — 둘러보기",
    "Your own images": "내 이미지",
    "Text &amp; emoji": "텍스트와 이모지",
    "Curated icon packs": "엄선된 아이콘 팩",
    "Five style effects": "다섯 가지 스타일 효과",
    "Batch apply &amp; restore": "일괄 적용 및 복원",
    "Create, apply, restore —": "만들고, 적용하고, 복원하는",
    "all in one place": "모든 것을 한곳에서",
    "From desktop styling to bulk organising, Moodsk makes changing icons quick and fun.":
      "데스크탑 꾸미기부터 대량 정리까지, Moodsk는 아이콘 교체를 빠르고 즐겁게 만듭니다.",
    "A what-you-see-is-what-you-get layer editor": "보이는 대로 편집하는 레이어 에디터",
    "Template plus layers: position, scale, rotation, 3D perspective, opacity and corner radius, combined however you like. Every change shows up instantly.":
      "템플릿 + 레이어 방식으로 위치, 크기, 회전, 3D 원근, 불투명도, 모서리 반경을 자유롭게 조합하세요. 변경 사항은 즉시 화면에 반영됩니다.",
    "Icon Pack Editor": "아이콘 팩 편집기",
    "Rich sources": "풍부한 소재",
    "Import your own pictures, pick SF Symbols from the built-in browser, or express things with text and emoji.":
      "내 이미지를 가져오고, 내장 브라우저에서 SF Symbols를 고르고, 텍스트와 이모지로 개성을 표현할 수 있습니다.",
    "Style effects": "스타일 효과",
    "Normal, Embossed, Shadow, Sticker and Neon styles, with tinting, filters and a white outline.":
      "일반, 엠보스, 섀도, 스티커, 네온 다섯 가지 스타일에 색조, 필터, 흰 테두리까지 더했습니다.",
    Embossed: "엠보스",
    Shadow: "섀도",
    Sticker: "스티커",
    Neon: "네온",
    "Pack-wide editing": "팩 전체 한 번에 편집",
    "Edit once and the whole icon pack updates. Ten folders of text and colour, consistent in one step.":
      "한 번 편집하면 아이콘 팩 전체가 업데이트됩니다. 열 개 폴더의 텍스트와 색을 한 번에 통일하세요.",
    "Batch apply / restore": "일괄 적용 / 복원",
    "Queue multiple items and apply one design in bulk, or restore default icons in batches with visible progress.":
      "여러 항목을 대기열에 넣어 하나의 디자인을 한꺼번에 적용하거나, 진행 상황을 보며 기본 아이콘을 일괄 복원할 수 있습니다.",
    "Build icons like building blocks": "블록 쌓듯 아이콘 만들기",
    "Layer images, symbols and text freely. Font families and weights, automatic sizing, outlines and effects — every detail is yours to decide.":
      "이미지, 심볼, 텍스트를 자유롭게 겹쳐 보세요. 글꼴 종류와 굵기, 자동 크기, 테두리와 효과까지 — 모든 디테일은 당신의 몫입니다.",
    "Work — Icon Pack Editor": "Work — 아이콘 팩 편집기",
    "Live preview": "실시간 미리보기",
    "The selected layer is highlighted; border and radius guides appear as you scale.":
      "선택한 레이어가 강조되고, 크기를 조절하면 테두리와 모서리 가이드가 나타납니다.",
    "Automatic sizing": "자동 크기 조절",
    "Text adapts to its container, so titles and monograms always fit.": "텍스트가 컨테이너에 맞춰 조절되어 제목도 모노그램도 늘 딱 맞습니다.",
    "Undo / redo": "실행 취소 / 다시 실행",
    "Both edits and layer order can be reverted, so experiment freely.": "편집과 레이어 순서 모두 되돌릴 수 있어 마음껏 시도해도 안전합니다.",
    "Sharp export": "선명한 내보내기",
    "Icons render at 4×, staying crisp in Finder and on the desktop.": "아이콘은 4배 렌더링되어 Finder와 데스크탑에서도 또렷합니다.",
    "Fresh folders in three steps": "세 단계로 폴더를 새롭게",
    "Pick a source": "소재 고르기",
    "Open a curated icon pack, or import your own images, SF Symbols and text.": "엄선된 아이콘 팩을 열거나 내 이미지, SF Symbols, 텍스트를 가져오세요.",
    "Polish the style": "스타일 다듬기",
    "Adjust colour, scale, corner radius and effects, tuning every layer live.": "색상, 크기, 모서리 반경, 효과를 조정하며 매 레이어를 실시간으로 완성합니다.",
    "Apply or restore": "적용 또는 복원",
    "Replace a single icon by drag and drop, apply in batches, or restore defaults in one click.":
      "드래그 앤 드롭으로 하나씩 교체하거나, 일괄 적용하고, 한 번의 클릭으로 기본값을 복원하세요.",
    "Drop it in, it's swapped": "놓으면, 바로 교체",
    "Drag files or folders into the window and the icon is replaced the moment you let go. You can also export a brand-new folder with its icon already set.":
      "파일이나 폴더를 창으로 드래그하면 손을 떼는 순간 아이콘이 교체됩니다. 아이콘이 설정된 새 폴더를 내보낼 수도 있습니다.",
    "Single or multi-file drops, plus the system open panel": "단일·다중 드래그 모두 지원, 시스템 열기 패널 사용 가능",
    "White outline switch for light wallpapers": "흰 테두리 스위치로 밝은 배경화면에서도 잘 보임",
    "Old icons are cleared before replacing, so nothing lingers": "교체 전에 이전 아이콘을 지워 잔상이 남지 않습니다",
    "Bundled Finder extension: right-click files in Finder to restore default icons in one click, with multi-select support.":
      "내장 Finder 확장: Finder에서 파일을 오른쪽 클릭해 한 번에 기본 아이콘으로 복원하고, 다중 선택 일괄 복원도 지원합니다.",
    "Colors — Instant replace": "색상 — 즉시 교체",
    "Curated packs, picked for your desktop": "데스크탑을 위해 엄선한 아이콘 팩",
    "Open any icon and make it yours — change the text, the colour, add a badge. It's up to you.":
      "어떤 아이콘이든 열어 당신 것으로 만드세요 — 텍스트를 바꾸고, 색을 바꾸고, 배지를 더하세요. 모두 자유입니다.",
    Basic: "기본",
    "Essentials · Free": "엄선 컬렉션 · 무료",
    Placard: "플래카드",
    Typography: "타이포그래피",
    "Cartoon Doodle Zoo": "만화 낙서 동물원",
    Illustration: "일러스트 시리즈",
    Colors: "색상",
    "Colour series · Free": "색상 시리즈 · 무료",
    "On-device only": "온디바이스 전용",
    "Rendering and icon application happen locally. No network, no uploads.":
      "렌더링과 아이콘 적용은 모두 로컬에서 처리됩니다. 네트워크도, 업로드도 없습니다.",
    "Light &amp; dark": "라이트 / 다크 대응",
    "Follows the system appearance with frosted materials and motion.": "시스템 외관에 따라 흐린 유리 질감과 모션으로 함께 바뀝니다.",
    "Four languages": "네 가지 언어",
    "简体中文, English, 日本語 and 한국어 out of the box.": "简体中文·English·日本語·한국어를 기본 지원합니다.",
    "Questions, answered": "궁금증을 해소해 드립니다",
    "Which Macs does Moodsk support?": "어떤 Mac에서 사용할 수 있나요?",
    "Moodsk runs on macOS 14 or later, including Apple Silicon Macs.": "Moodsk는 macOS 14 이상에서 작동하며 Apple Silicon Mac도 지원합니다.",
    "What can I use to create icons?": "아이콘은 무엇으로 만들 수 있나요?",
    "Import your own images (PNG, JPG, HEIC or SVG), pick from thousands of SF Symbols, or compose icons from text and emoji. Curated icon packs are included.":
      "내 이미지(PNG, JPG, HEIC, SVG)를 가져오거나 수천 개의 SF Symbols에서 고르거나 텍스트와 이모지로 구성할 수 있습니다. 엄선된 아이콘 팩도 포함되어 있습니다.",
    "How do I restore an original icon?": "원래 아이콘으로 되돌리려면?",
    "Drop the files back into Moodsk to restore them, or right-click any file in Finder and choose restore with the bundled Finder extension. Batch restore is supported.":
      "파일을 Moodsk에 다시 드래그하면 복원됩니다. 내장 Finder 확장을 사용하면 Finder에서 오른쪽 클릭 한 번으로 복원되며, 다중 선택 일괄 복원도 지원합니다.",
    "Does Moodsk upload my files anywhere?": "파일이 어딘가로 업로드되나요?",
    "No. Rendering and icon application happen entirely on your Mac; Moodsk works offline and never uploads your data.":
      "아니요. 렌더링과 아이콘 적용은 모두 당신의 Mac에서 처리됩니다. Moodsk는 오프라인으로 작동하며 데이터를 절대 업로드하지 않습니다.",
    "Make your desktop stand out, today": "오늘, 데스크탑을 당신답게",
    "Download Moodsk for free and give every folder a little personality.": "Moodsk를 무료로 다운로드하고 모든 폴더에 개성을 더하세요.",
    "macOS 14+ · Apple Silicon supported": "macOS 14+ · Apple Silicon 지원",
  },
};

// Accessibility labels and image alt text, replaced as quoted attributes.
const attrs = {
  "zh-Hans": {
    "Moodsk home": "Moodsk 首页",
    "Main navigation": "主导航",
    "Footer links": "页脚链接",
    "Supported icon sources": "支持的图标素材",
    "Supported image formats": "支持的图片格式",
    "Moodsk app icon": "Moodsk 应用图标",
    "Moodsk Discover home showing curated icon packs over a desktop theme": "Moodsk 发现页：桌面主题展示与精选图标包",
    "Moodsk icon pack editor with the layer canvas and pack sidebar": "Moodsk 图标编辑器：图层画布与图标包侧边栏",
    "Adding a Work text layer to a whole icon pack in the editor": "在编辑器中为整个图标包添加 Work 文字图层",
    "Drop files or folders to replace their icons right away": "拖入文件或文件夹立即替换图标界面",
    "Basic icon pack preview": "基本图标包预览",
    "Placard icon pack preview": "铭牌图标包预览",
    "Cartoon Doodle Zoo icon pack preview": "卡通涂鸦动物园图标包预览",
    "Colors icon pack preview": "颜色图标包预览",
  },
  ja: {
    "Moodsk home": "Moodsk ホーム",
    "Main navigation": "メインナビゲーション",
    "Footer links": "フッターリンク",
    "Supported icon sources": "アイコンの素材",
    "Supported image formats": "対応画像フォーマット",
    "Moodsk app icon": "Moodsk アプリアイコン",
    "Moodsk Discover home showing curated icon packs over a desktop theme": "Moodsk の「見つける」ホーム。デスクトップテーマの上に厳選アイコンパックが並びます",
    "Moodsk icon pack editor with the layer canvas and pack sidebar": "レイヤーキャンバスとパックサイドバーのある Moodsk アイコンパックエディタ",
    "Adding a Work text layer to a whole icon pack in the editor": "エディタでアイコンパック全体に Work のテキストレイヤーを追加する様子",
    "Drop files or folders to replace their icons right away": "ファイルやフォルダをドロップしてすぐアイコンを置き換える画面",
    "Basic icon pack preview": "「基本」アイコンパックのプレビュー",
    "Placard icon pack preview": "「プラカード」アイコンパックのプレビュー",
    "Cartoon Doodle Zoo icon pack preview": "「漫画の落書き動物園」アイコンパックのプレビュー",
    "Colors icon pack preview": "「カラー」アイコンパックのプレビュー",
  },
  ko: {
    "Moodsk home": "Moodsk 홈",
    "Main navigation": "기본 탐색",
    "Footer links": "푸터 링크",
    "Supported icon sources": "아이콘 소재",
    "Supported image formats": "지원 이미지 형식",
    "Moodsk app icon": "Moodsk 앱 아이콘",
    "Moodsk Discover home showing curated icon packs over a desktop theme": "Moodsk 둘러보기 홈: 데스크탑 테마 위의 엄선된 아이콘 팩",
    "Moodsk icon pack editor with the layer canvas and pack sidebar": "레이어 캔버스와 팩 사이드바가 있는 Moodsk 아이콘 팩 편집기",
    "Adding a Work text layer to a whole icon pack in the editor": "편집기에서 아이콘 팩 전체에 Work 텍스트 레이어 추가하기",
    "Drop files or folders to replace their icons right away": "파일이나 폴더를 드롭해 즉시 아이콘을 교체하는 화면",
    "Basic icon pack preview": "기본 아이콘 팩 미리보기",
    "Placard icon pack preview": "플래카드 아이콘 팩 미리보기",
    "Cartoon Doodle Zoo icon pack preview": "만화 낙서 동물원 아이콘 팩 미리보기",
    "Colors icon pack preview": "색상 아이콘 팩 미리보기",
  },
};

const enSource = locales[0];
const pageUrl = (locale) => `${origin}/${locale.route ? locale.route + "/" : ""}`;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function alternatesBlock() {
  return locales
    .map((locale) => `  <link rel="alternate" hreflang="${locale.code}" href="${pageUrl(locale)}" />`)
    .concat(`  <link rel="alternate" hreflang="x-default" href="${pageUrl(enSource)}" />`)
    .join("\n  ");
}

function faqScript(locale) {
  const entities = locale.faq
    .map(
      ([question, answer]) =>
        `      { "@type": "Question", "name": ${JSON.stringify(question)}, "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(answer)} } }`
    )
    .join(",\n");
  return [
    `  <script type="application/ld+json">`,
    `  {`,
    `    "@context": "https://schema.org",`,
    `    "@type": "FAQPage",`,
    `    "inLanguage": "${locale.code}",`,
    `    "mainEntity": [`,
    entities,
    `    ]`,
    `  }`,
    `  </script>`,
  ].join("\n");
}

function switcherBlock(locale, route) {
  const links = locales
    .map((option) => {
      const href = option.route ? (route ? `../${option.route}/` : `${option.route}/`) : route ? "../" : "./";
      const current = option.code === locale.code ? ` aria-current="page"` : "";
      return `          <a data-language="${option.code}" href="${href}" lang="${option.code}"${current}>${option.label}</a>`;
    })
    .join("\n");
  return [
    `      <details class="language-switcher">`,
    `        <summary aria-label="${locale.chooseLanguage}"><span aria-hidden="true">◎</span> <span class="language-current">${locale.label}</span></summary>`,
    `        <div class="language-menu">`,
    links,
    `        </div>`,
    `      </details>`,
  ].join("\n");
}

function translateTextNodes(html, map) {
  return html
    .split(/(<[^>]+>)/g)
    .map((token) => {
      if (token.startsWith("<")) return token;
      const leading = token.match(/^\s*/)[0];
      const trailing = token.match(/\s*$/)[0];
      const core = token.slice(leading.length, token.length - trailing.length);
      if (!core) return token;
      const hit = map[core.replace(/\s+/g, " ").trim()];
      return hit !== undefined ? leading + hit + trailing : token;
    })
    .join("");
}

function applyAttributes(html, map) {
  let output = html;
  for (const [source, translated] of Object.entries(map)) {
    output = output
      .replaceAll(`aria-label="${source}"`, `aria-label="${translated}"`)
      .replaceAll(`alt="${source}"`, `alt="${translated}"`);
  }
  return output;
}

function buildHead(head, locale) {
  let output = head
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${locale.title}</title>`)
    // The English description appears in both the meta tag and the SoftwareApplication schema.
    .replaceAll(enSource.description, locale.description)
    .replaceAll(enSource.ogDescription, locale.ogDescription)
    .replaceAll(`content="Moodsk — Custom Icons for Mac &amp; Finder"`, `content="${locale.title}"`)
    .replaceAll(`content="en_GB"`, `content="${locale.ogLocale}"`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${pageUrl(locale)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${pageUrl(locale)}" />`)
    .replace(/"url": "https:\/\/moodsk\.ajigu\.com\/"/, `"url": "${pageUrl(locale)}"`);

  output = output.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, "");
  output = output.replace(/(<link rel="canonical"[^>]*>)/, `$1\n${alternatesBlock()}`);
  output = output.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/,
    faqScript(locale)
  );

  if (locale.route) {
    output = output
      .replaceAll(`href="assets/`, `href="../assets/`)
      .replaceAll(`href="styles.css"`, `href="../styles.css"`);
  }
  return output;
}

function localizeDocument(html, locale) {
  const route = locale.route;
  const head = buildHead(html.match(/<head>[\s\S]*?<\/head>/)[0], locale);
  let body = html.match(/<body>[\s\S]*?<\/body>/)[0];

  body = translateTextNodes(body, copy[locale.code]);
  body = applyAttributes(body, attrs[locale.code]);
  body = body.replace(/<details class="language-switcher">[\s\S]*?<\/details>/, switcherBlock(locale, route));

  if (route) {
    body = body
      .replaceAll(`href="index.html"`, `href="../"`)
      .replaceAll(`src="assets/`, `src="../assets/`)
      .replaceAll(`href="assets/`, `href="../assets/`)
      .replaceAll(`href="styles.css"`, `href="../styles.css"`)
      .replaceAll(`href="privacy/"`, `href="../privacy/"`)
      .replaceAll(`href="support/"`, `href="../support/"`)
      .replaceAll(`src="main.js"`, `src="../main.js"`)
      .replaceAll(`src="language.js?v=2"`, `src="../language.js?v=2"`);
  }

  return `<!DOCTYPE html>\n<html lang="${locale.code}" data-locale="${locale.code}">\n${head}\n${body}\n</html>\n`;
}

function sitemap() {
  const urls = locales.map((locale) => {
    const alternates = locales
      .map((option) => `    <xhtml:link rel="alternate" hreflang="${option.code}" href="${pageUrl(option)}" />`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(enSource)}" />`)
      .join("\n");
    return `  <url>\n    <loc>${pageUrl(locale)}</loc>\n${alternates}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

const source = await readFile(path.join(root, "index.html"), "utf8");
for (const locale of locales.filter((item) => !item.source)) {
  const destination = path.join(root, locale.route, "index.html");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, localizeDocument(source, locale));
  console.log(`wrote ${path.relative(root, destination)}`);
}
await writeFile(path.join(root, "sitemap.xml"), sitemap());
console.log("wrote sitemap.xml");
