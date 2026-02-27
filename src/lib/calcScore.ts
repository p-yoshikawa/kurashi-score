export interface FormInputs {
  age: number;
  income: number;
  children: 0 | 1;
  rent: number;
  food: number;
  utility: number;
  communication: number;
  insurance: number;
  subscription: number;
  education: number;
  investment: number;
  savings: number;
}

export interface Recommendation {
  title: string;
  description: string; // Used for "why"
  link: string;
  linkText: string;
  annualImpact: number;
  priority: number;
  nextSteps: string[]; // Two actionable steps
}

export interface ScoreDetails {
  savingsRateScore: number;
  fixedCostScore: number;
  investmentScore: number;
  ageSavingsScore: number;
  insuranceScore: number;
}

export interface ScoreResult {
  totalScore: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  details: ScoreDetails;
  recommendations: Recommendation[];
  surplusMonthly: number;
  annualImprovementPotential: number;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function ageMultiplier(age: number): number {
  if (age < 35) return 0.5; // 30-34
  if (age < 40) return 1.0; // 35-39
  return 1.5; // 40+
}

export function calcScore(input: FormInputs): ScoreResult {
  const {
    age, income, children, rent, food, utility, communication, insurance, subscription, education, investment, savings
  } = input;

  // 1. 基本計算
  const activeEducation = children === 1 ? education : 0;
  const totalExpenses = rent + food + utility + communication + insurance + subscription + activeEducation;
  const surplusMonthly = income - totalExpenses - investment;

  // 貯蓄率スコア (満点30) => 理想は20%以上
  const savingsRate = income > 0 ? Math.max(0, surplusMonthly / income) : 0;
  const savingsRateScore = Math.round(clamp01(savingsRate / 0.20) * 30);

  // 固定費比率スコア (満点25)
  // 子どもありなら教育費を含む
  const fixedCosts = rent + utility + communication + insurance + subscription + activeEducation;
  const fixedCostRatio = income > 0 ? fixedCosts / income : 1;

  const goodThreshold = 0.5;
  const badThreshold = children === 1 ? 0.60 : 0.55;

  let fixedCostScore = 0;
  if (fixedCostRatio <= goodThreshold) fixedCostScore = 25;
  else if (fixedCostRatio >= badThreshold) fixedCostScore = 0;
  else fixedCostScore = Math.round((1 - (fixedCostRatio - goodThreshold) / (badThreshold - goodThreshold)) * 25);

  // 投資比率スコア (満点20) => 収入の10%以上投資で満点
  const investmentRatio = income > 0 ? investment / income : 0;
  const investmentScore = Math.round(clamp01(investmentRatio / 0.10) * 20);

  // 年齢適正貯蓄スコア (満点15) => 目安: 年収(手取り月収*12) * 年齢乗数
  const annualIncome = income * 12;
  const targetSavings = annualIncome * ageMultiplier(age);
  const ageSavingsScore = Math.round(clamp01(savings / Math.max(1, targetSavings)) * 15);

  // 保険適正度スコア (満点10) => 収入の5%以内なら満点、10%以上で0点
  const insuranceRatio = income > 0 ? insurance / income : 0;
  let insuranceScore = 0;
  if (insuranceRatio <= 0.05) insuranceScore = 10;
  else if (insuranceRatio >= 0.10) insuranceScore = 0;
  else insuranceScore = Math.round((1 - (insuranceRatio - 0.05) / 0.05) * 10);

  const totalScore = savingsRateScore + fixedCostScore + investmentScore + ageSavingsScore + insuranceScore;

  let rank: ScoreResult['rank'] = 'D';
  if (totalScore >= 90) rank = 'S';
  else if (totalScore >= 75) rank = 'A';
  else if (totalScore >= 60) rank = 'B';
  else if (totalScore >= 40) rank = 'C';

  const details: ScoreDetails = {
    savingsRateScore,
    fixedCostScore,
    investmentScore,
    ageSavingsScore,
    insuranceScore
  };

  const recommendations = buildRecommendations(input, details, surplusMonthly);
  const annualImprovementPotential = recommendations.reduce((sum, rec) => sum + rec.annualImpact, 0);

  return {
    totalScore,
    rank,
    details,
    recommendations,
    surplusMonthly,
    annualImprovementPotential
  };
}

export function buildRecommendations(input: FormInputs, details: ScoreDetails, surplusMonthly: number): Recommendation[] {
  let recs: Recommendation[] = [];

  // MUST: 収支赤字の場合は最優先カードを注入 (Priority: 999)
  if (surplusMonthly < 0) {
    recs.push({
      title: '緊急：家計の赤字を解消しましょう',
      description: '毎月の支出が収入を上回っています。貯蓄を切り崩す状態が続くと将来の生活設計が危険です。',
      link: '/fixed-cost-guide',
      linkText: 'まずは固定費削減の手順を見る',
      annualImpact: Math.abs(surplusMonthly) * 12, // 赤字額1年分を改善額目標とする
      priority: 999,
      nextSteps: [
        '使っていないサブスクの即時解約',
        'スマホを大手キャリアから格安SIMへ変更'
      ]
    });
  }

  // 通信費: 10,000円以上
  if (input.communication > 10000) {
    recs.push({
      title: '通信費の見直し（格安SIMへの移行）',
      description: 'スマホやネット代が平均より高くなっています。格安SIMへの乗り換えで毎月の痛みがなく大幅な節約が可能です。',
      link: '/sim-compare',
      linkText: '格安SIMの比較を見る',
      annualImpact: (input.communication - 4000) * 12,
      priority: 90,
      nextSteps: [
        '現在の月のデータ使用量を確認する',
        '家族割の恩恵より格安SIMが安いかシミュレーションする'
      ]
    });
  }

  // 保険料: スコアが低い(比率が高い)
  if (details.insuranceScore < 5) {
    const targetInsurance = Math.round(input.income * 0.05);
    recs.push({
      title: '保険料の最適化',
      description: '収入に対する保険料の負担が重いです。公的保険（高額療養費制度など）でカバーできる範囲を理解し、過剰な民間保険を外しましょう。',
      link: '/insurance-review',
      linkText: '必要な保険・不要な保険の仕分け方',
      annualImpact: Math.max(0, input.insurance - targetInsurance) * 12,
      priority: 85,
      nextSteps: [
        '現在加入している保険の保障内容・月額をリスト化する',
        '貯蓄型保険から掛け捨て保険への見直しを検討する'
      ]
    });
  }

  // 住居費: 収入の30%以上
  if (input.rent > input.income * 0.3) {
    const targetRent = Math.round(input.income * 0.25);
    recs.push({
      title: '住居費（家賃）の見直し',
      description: '家賃が手取りの30%を超えており、自由に使えるお金を圧迫しています。更新のタイミング等での引越しも視野に入れましょう。',
      link: '/housing-cost-guide',
      linkText: '家賃目安と引越しの判断基準',
      annualImpact: (input.rent - targetRent) * 12,
      priority: 80,
      nextSteps: [
        '次の更新月を確認し、解約予告の期日をメモする',
        '家賃の安いエリア（急行通過駅など）で物件を検索してみる'
      ]
    });
  }

  // NISAスタート（投資未経験・少額 ＆ 余剰あり）
  if (input.investment < 10000 && surplusMonthly > 30000) {
    recs.push({
      title: '新NISAでの資産運用スタート',
      description: '毎月の家計に余裕があります。現金で置いておくだけではインフレで価値が目減りするため、非課税での運用を始めましょう。',
      link: '/nisa-start',
      linkText: '新NISAの始め方ステップ',
      annualImpact: 0, // 節約ではなく運用益期待のため0
      priority: 75,
      nextSteps: [
        'ネット証券（SBI・楽天など）の口座を開設する',
        '全世界株式・S&P500などのインデックス投信を月1万円から積立設定する'
      ]
    });
  }

  // サブスク: 5000円以上なら整理提案
  if (input.subscription > 5000) {
    recs.push({
      title: 'サブスクリプションの棚卸し',
      description: '少額でも毎月課金されるサブスクは、年間で見ると大きな出費です。使っていないサービスは一旦解約しましょう。',
      link: '/subs-cleanup',
      linkText: 'サブスク整理の手順',
      annualImpact: (input.subscription - Math.round(input.subscription * 0.5)) * 12,
      priority: 70,
      nextSteps: [
        'クレジットカードの明細で自動課金されている項目を洗い出す',
        '「月に1回も使っていない」サービスを即日解約する'
      ]
    });
  }

  // 光熱費: 20,000円以上
  if (input.utility > 20000) {
    recs.push({
      title: '電力・ガス会社の切り替え（光熱費の削減）',
      description: '光熱費が高めです。新電力・新ガス会社への切り替えは、工事不要で簡単に固定費を下げられる有効な手段です。',
      link: '/energy-compare',
      linkText: '光熱費切り替えガイド',
      annualImpact: (input.utility - 15000) * 12,
      priority: 65,
      nextSteps: [
        '直近の検針票（電気・ガス）を手元に用意する',
        '料金比較サイトで現在のアンペア数・使用量をもとにシミュレーションする'
      ]
    });
  }

  // 食費
  const targetFoodRatio = input.children === 1 ? 0.20 : 0.15;
  if (input.food > input.income * targetFoodRatio) {
    const targetFood = Math.round(input.income * targetFoodRatio);
    recs.push({
      title: '食費のコントロール',
      description: '食費が目安を上回っています。極端な節約はストレスになるため、まずは外食の頻度や日々の買い物ルールを見直しましょう。',
      link: '/food-budget',
      linkText: '無理のない食費節約のコツ',
      annualImpact: (input.food - targetFood) * 12,
      priority: 60,
      nextSteps: [
        '1週間の予算を決め、財布に入れる現金を固定する',
        'まとめ買いを活用し、コンビニへ行く回数を減らす'
      ]
    });
  }

  // 貯金最優先（貯蓄が少ない場合）
  if (input.savings < input.income * 3 && surplusMonthly >= 0) {
    recs.push({
      title: '生活防衛資金を最優先で貯める',
      description: '現在の貯蓄額は、万が一の休職や病気のリスクに対して少し心もとない水準です。投資よりもまずは現金確保を優先しましょう。',
      link: '/saving-order',
      linkText: '正しいお金を貯める順番',
      annualImpact: 0,
      priority: 95,
      nextSteps: [
        '給与が入った瞬間に「先取り貯蓄」を自動化する',
        '手取り月収の3〜6ヶ月分の口座残高を第一目標にする'
      ]
    });
  }

  // 何も引っかからない場合のフォールバック（固定費がやや高めの場合のみ）
  if (recs.length === 0 && details.fixedCostScore < 20) {
    const activeEducation = input.children === 1 ? input.education : 0;
    const fixedCosts = input.rent + input.utility + input.communication + input.insurance + input.subscription + activeEducation;
    recs.push({
      title: '固定費の総点検',
      description: '目立って悪い項目はありませんが、全体的に固定費が少し高めです。小さな無駄の見直しを行いましょう。',
      link: '/fixed-cost-guide',
      linkText: '固定費削減チェックリスト',
      annualImpact: Math.max(0, fixedCosts - (input.income * 0.5)) * 12,
      priority: 50,
      nextSteps: [
        '3ヶ月分のカード明細を一つずつチェックする',
        '月額500円程度の少額サービスも不要なら見直す'
      ]
    });
  }

  // 赤字の999は常にトップ、残りをpriorityでソートして上位3件
  recs.sort((a, b) => b.priority - a.priority);

  // 最大3件まで
  return recs.slice(0, 3);
}
