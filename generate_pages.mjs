import fs from 'fs';

const pageData = [
  {
    id: 'sim-compare',
    title: '格安SIM乗り換えガイド',
    desc: '毎月のスマホ代を劇的に下げる。格安SIMへの乗り換え手順と比較ポイント。',
    points: [
      '大手キャリアから乗り換えるだけで年間数万円の節約が可能',
      '電話番号や端末はそのまま引き継げる',
      '家族割の恩恵より、個別に安いプランを契約する方が安いケースが多い'
    ]
  },
  {
    id: 'insurance-review',
    title: '保険見直しのポイント',
    desc: '過剰な保障を見直し、毎月の固定費を下げるための保険整理ガイド。',
    points: [
      '高額療養費制度などの「公的保険」でカバーできる範囲を正しく知る',
      'ライフステージに合わせて、不要な特約や重複している保険を外す',
      '貯蓄型保険よりも「掛け捨て」で安く抑え、浮いたお金を投資に回す'
    ]
  },
  {
    id: 'nisa-start',
    title: '新NISAの始め方（投資初心者向け）',
    desc: '月1万円から始めるインフレ対策。非課税メリットを最大限活かす投資の第一歩。',
    points: [
      '銀行預金だけではインフレによって実質的にお金が目減りするリスクがある',
      'ネット証券（SBI・楽天など）なら手数料が安くスマホで完結する',
      '最初は幅広く分散投資できる「全世界株式」等のインデックス投信が王道'
    ]
  },
  {
    id: 'fixed-cost-guide',
    title: '固定費削減チェックリスト',
    desc: '家計改善は「固定費」から。毎月自動的に出ていくお金を止める手順。',
    points: [
      '食費や日用品などの変動費よりも、一度見直せば効果が続く固定費削減を優先する',
      'スマホ代、ネット代、保険料、サブスクの4大固定費をまず疑う',
      'クレジットカードの明細書を3ヶ月分チェックし、使途不明な引き落としを特定する'
    ]
  },
  {
    id: 'saving-order',
    title: '正しいお金を貯める順番',
    desc: '投資を始める前に絶対に必要な「生活防衛資金」の考え方。',
    points: [
      '万が一の病気や失業に備え、まず生活費の3〜6ヶ月分を現金で確保する',
      '現金が確保できるまでは、投資よりも貯蓄を最優先にする',
      '給与が入った瞬間に別口座に自動で移す「先取り貯蓄」を習慣化する'
    ]
  },
  {
    id: 'food-budget',
    title: '無理のない食費節約のコツ',
    desc: 'ストレスを溜めずに食費を適正化する、持続可能な節約術。',
    points: [
      '毎日のスーパー通いを週1〜2回のまとめ買いに変更し、無駄遣いを防ぐ',
      '1週間の予算を決めて財布に入れ、その中でやりくりするゲーム感覚を取り入れる',
      '外食は「禁止」するのではなく、回数や金額のルールを決める'
    ]
  },
  {
    id: 'energy-compare',
    title: '光熱費（電力・ガス）切り替えガイド',
    desc: '工事不要、ネット申し込みだけで毎月の光熱費を削減する方法。',
    points: [
      '電力会社・ガス会社の乗り換えは、設備の変更や立ち会い工事なしで完了する',
      '現在の検針票（使用量・アンペア数）をもとにシミュレーションし、安い会社を探す',
      'セット割（電気＋ガス＋通信など）を利用するとさらに安くなる場合がある'
    ]
  },
  {
    id: 'housing-cost-guide',
    title: '住居費（家賃）見直しと引越しの判断基準',
    desc: '家計の最大支出「家賃」を適正化し、自由な資金を生み出す考え方。',
    points: [
      '家賃は手取り月収の「25%〜30%以下」に収めるのが理想的',
      '毎月の家賃が2万円下がれば、年間24万円の大きな改善効果が生まれる',
      '急行通過駅や築古リノベ物件など、妥協できる条件を整理して物件を探す'
    ]
  },
  {
    id: 'subs-cleanup',
    title: 'サブスクリプションの整理',
    desc: '使っていない定額サービスを解約し、月々の出費を最適化する手順。',
    points: [
      '動画配信、音楽、アプリ、ジムなど、月額課金されている全てのサービスをリスト化する',
      '「過去1ヶ月間に1度も使っていない」サービスは迷わず即解約する',
      '見たい作品がある時だけ単発で加入し、見終わったら解約する癖をつける'
    ]
  }
];

pageData.forEach(p => {
  const content = `---
import Layout from '../layouts/Layout.astro';
---

<Layout title="${p.title} | くらしスコア" description="${p.desc}">
  <div class="max-w-3xl mx-auto py-12 md:py-16 px-4">
    
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="bg-blue-50 text-blue-800 p-4 rounded-full inline-block mb-4">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4 text-slate-900 leading-tight">${p.title}</h1>
      <p class="text-lg text-slate-600">${p.desc}</p>
    </div>

    <!-- Points Content -->
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
      <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center border-b pb-4">
        <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        知っておくべき3つのポイント
      </h2>
      
      <ul class="space-y-6">
        ${p.points.map((pt, i) => `
        <li class="flex items-start">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-4 mt-0.5">${i + 1}</span>
          <p class="text-slate-700 leading-relaxed pt-1">${pt}</p>
        </li>
        `).join('')}
      </ul>
    </div>

    <!-- Warning / Disclaimer -->
    <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-5 rounded-xl text-sm mb-10 flex items-start">
      <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <div>
        <p class="font-bold mb-1">ご注意事項</p>
        <p>本ページの情報は一般的な目安であり、実際の効果や最適なプランは個人の状況によって異なります。各種サービスの契約等に際しては、提供元の公式規定や最新情報を必ずご確認のうえ、ご自身の判断でご対応ください。</p>
      </div>
    </div>

    <!-- CTA & Navigation -->
    <div class="text-center space-y-6">
      <div class="mb-10">
        <a href="#" class="inline-flex items-center justify-center w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 group no-underline">
          おすすめのサービスを見る
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
      </div>
      
      <div class="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="/score?result=true" class="inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow transition-colors no-underline">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          診断結果を見る
        </a>
        <a href="/score" class="inline-flex items-center justify-center w-full sm:w-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors no-underline">
          <svg class="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          もう一度診断する
        </a>
      </div>
    </div>

  </div>
</Layout>
`;
  fs.writeFileSync(`src/pages/${p.id}.astro`, content);
});

console.log('Landing pages generated.');
