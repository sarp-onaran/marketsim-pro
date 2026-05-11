import { COUNTRIES, CATEGORIES, DISTRIBUTION_CHANNELS } from './data.js';

export class SimulationEngine {
  constructor(config) {
    this.product = config.product;
    this.country = COUNTRIES[config.countryCode];
    this.countryCode = config.countryCode;
    this.category = CATEGORIES[config.category];
    this.duration = config.duration || 12;
    this.channels = config.channels || ['retail'];
    this.marketingBudget = config.marketingBudget || 50000;
    this.initialInvestment = config.initialInvestment || 100000;
    this.monteCarloRuns = 500;
  }

  _bassParams() {
    const p = this.category.baseAdoption * (1 + this.product.innovationScore * 0.5);
    const q = 0.3 + this.product.viralPotential * 0.2;
    const m = this._calculateMarketSize();
    return { p, q, m };
  }

  _calculateMarketSize() {
    const targetPop = this._getTargetPopulation();
    const affordability = this._getAffordabilityFactor();
    const channelReach = this._getChannelReach();
    const trendFit = this._getTrendFitScore();
    return Math.floor(targetPop * affordability * channelReach * trendFit * this.category.basePenetration);
  }

  _getTargetPopulation() {
    let targetPop = 0;
    const ageGroups = this.product.targetAgeGroups || Object.keys(this.country.ageDistribution);
    for (const ag of ageGroups) targetPop += (this.country.ageDistribution[ag] || 0) * this.country.population;
    if (this.product.targetGender === 'male' || this.product.targetGender === 'female') targetPop *= 0.5;
    return targetPop;
  }

  _getAffordabilityFactor() {
    const priceUSD = this.product.price / this.country.exchangeRate;
    const ratio = priceUSD / (this.country.gdpPerCapita / 365);
    if (ratio < 0.01) return 0.95;
    if (ratio < 0.05) return 0.80;
    if (ratio < 0.1) return 0.60;
    if (ratio < 0.3) return 0.35;
    return 0.15;
  }

  _getChannelReach() {
    let totalReach = 0;
    for (const ch of this.channels) {
      const channel = DISTRIBUTION_CHANNELS[ch];
      if (channel) {
        let reach = channel.reachMultiplier;
        if (ch === 'online') reach *= this.country.ecommercePenetration;
        if (ch === 'retail') reach *= this.country.retailDensity;
        totalReach += reach;
      }
    }
    return Math.min(totalReach, 1.0);
  }

  _getTrendFitScore() {
    let score = 0.5;
    if (this.product.isHealthy) score += this.country.healthTrend * 0.2;
    if (this.product.isTechEnabled) score += this.country.techAdoption * 0.15;
    if (this.product.isEcoFriendly) score += 0.1;
    if (this.product.isTrendy) score += 0.15;
    score *= (0.5 + this.country.consumerConfidence * 0.5);
    return Math.min(score, 1.0);
  }

  _getMarketingEffectiveness(month) {
    const budgetPerMonth = this.marketingBudget / this.duration;
    const budgetUSD = budgetPerMonth / this.country.exchangeRate;
    const popMillions = this.country.population / 1_000_000;
    let eff = Math.min((budgetUSD / popMillions) / 5000, 1.0);
    eff = Math.pow(eff, 0.6);
    if (month < 3) eff *= 1.3;
    return eff;
  }

  _getCompetitionFactor() {
    const map = { low: 0.9, medium: 0.7, high: 0.5, veryHigh: 0.3 };
    let factor = map[this.product.competitionLevel] || 0.7;
    if (this.product.uniquenessScore > 0.7) factor += 0.15;
    return Math.min(factor, 1.0);
  }

  _generateRandomEvent(month) {
    const r = Math.random();
    if (r < 0.03) return { type: 'viral', name: 'Viral Sosyal Medya Patlaması', multiplier: 2.5, icon: '🔥' };
    if (r < 0.05) return { type: 'celeb', name: 'Ünlü Endorsement', multiplier: 1.8, icon: '⭐' };
    if (r < 0.07) return { type: 'news', name: 'Medya İlgisi', multiplier: 1.4, icon: '📰' };
    if (r < 0.09) return { type: 'competitor', name: 'Yeni Rakip Girişi', multiplier: 0.7, icon: '⚔️' };
    if (r < 0.10) return { type: 'crisis', name: 'PR Krizi', multiplier: 0.5, icon: '💥' };
    if (r < 0.11) return { type: 'regulation', name: 'Düzenleme Değişikliği', multiplier: 0.6, icon: '📋' };
    if (r < 0.13 && month > 3) return { type: 'expansion', name: 'Yeni Dağıtım Kanalı', multiplier: 1.3, icon: '🚀' };
    return null;
  }

  // Single simulation run
  _runOnce(collectEvents = false) {
    const { p, q, m } = this._bassParams();
    const compFactor = this._getCompetitionFactor();
    const priceEffect = Math.max(0.3, 1 - (this.product.price / (this.country.gdpPerCapita / 12 * this.country.exchangeRate)) * this.category.priceElasticity);
    const monthlyData = [];
    const events = [];
    let cumAdopters = 0, cumRevenue = 0, cumCost = this.initialInvestment;

    for (let month = 0; month < this.duration; month++) {
      const F_t = cumAdopters / m;
      const newBase = (p + q * F_t) * (m - cumAdopters);
      const seasonal = this.country.seasonalFactors[month % 12];
      const mktg = 0.6 + this._getMarketingEffectiveness(month) * 0.8;
      const noise = 0.85 + Math.random() * 0.3; // Monte Carlo noise
      const event = this._generateRandomEvent(month);
      const eventMul = event ? event.multiplier : 1.0;
      if (event && collectEvents) events.push({ month, ...event });

      let newAdopters = Math.max(0, Math.floor(newBase * seasonal * mktg * compFactor * priceEffect * eventMul * noise));
      const churnRate = 0.02 + (1 - (this.product.repeatPurchaseRate || 0.6)) * 0.05;
      const churned = Math.floor(cumAdopters * churnRate);
      const active = Math.max(0, cumAdopters - churned + newAdopters);
      cumAdopters += newAdopters;

      const freq = this.product.purchaseFrequency || 1;
      const units = Math.floor(active * freq);
      const revenue = units * this.product.price;
      cumRevenue += revenue;

      const unitCost = this.product.unitCost || this.product.price * 0.4;
      const totalCost = units * unitCost + this.marketingBudget / this.duration + (this.product.monthlyOpex || 5000);
      cumCost += totalCost;

      monthlyData.push({
        month: month + 1, newAdopters, activeCustomers: active,
        cumulativeAdopters: cumAdopters, monthlyUnits: units,
        revenue, profit: revenue - totalCost, totalMonthlyCost: totalCost,
        cumulativeRevenue: cumRevenue, cumulativeCost: cumCost,
        penetration: cumAdopters / this._getTargetPopulation(),
        seasonal, event: collectEvents ? event : null,
        churnRate, churned,
        roi: ((cumRevenue - cumCost) / this.initialInvestment) * 100
      });
    }
    return { monthlyData, events, cumRevenue, cumCost, cumAdopters };
  }

  run() {
    // Monte Carlo: run many simulations
    const allRevenues = [], allProfits = [], allROIs = [], allAdopters = [];
    const revenueByMonth = Array.from({ length: this.duration }, () => []);
    const profitByMonth = Array.from({ length: this.duration }, () => []);

    for (let i = 0; i < this.monteCarloRuns; i++) {
      const r = this._runOnce(false);
      allRevenues.push(r.cumRevenue);
      allProfits.push(r.cumRevenue - r.cumCost);
      allROIs.push(((r.cumRevenue - r.cumCost) / this.initialInvestment) * 100);
      allAdopters.push(r.cumAdopters);
      r.monthlyData.forEach((m, idx) => {
        revenueByMonth[idx].push(m.revenue);
        profitByMonth[idx].push(m.profit);
      });
    }

    // Percentiles
    const pct = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length * p)]; };
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    // Best-case (median) run for detailed display
    const baseRun = this._runOnce(true);
    const d = baseRun.monthlyData;
    const last = d[d.length - 1];

    const demographics = this._generateDemographics(baseRun.cumAdopters);
    const risks = this._analyzeRisks();
    const score = this._calculateOverallScore(d);
    const beMonth = d.findIndex(m => m.cumulativeRevenue >= m.cumulativeCost) + 1;

    return {
      id: null,
      monthlyData: d,
      events: baseRun.events,
      demographics, riskAnalysis: risks, overallScore: score,
      breakEvenMonth: beMonth > 0 ? beMonth : null,
      totalRevenue: baseRun.cumRevenue,
      totalCost: baseRun.cumCost,
      totalProfit: baseRun.cumRevenue - baseRun.cumCost,
      finalROI: ((baseRun.cumRevenue - baseRun.cumCost) / this.initialInvestment) * 100,
      marketSize: this._calculateMarketSize(),
      finalPenetration: baseRun.cumAdopters / this._getTargetPopulation(),
      totalAdopters: baseRun.cumAdopters,
      product: this.product, country: this.country,
      countryCode: this.countryCode, category: this.category,
      duration: this.duration,
      // Monte Carlo confidence intervals
      monteCarlo: {
        runs: this.monteCarloRuns,
        revenue: { p5: pct(allRevenues, 0.05), p25: pct(allRevenues, 0.25), median: pct(allRevenues, 0.5), p75: pct(allRevenues, 0.75), p95: pct(allRevenues, 0.95), mean: avg(allRevenues) },
        profit: { p5: pct(allProfits, 0.05), p25: pct(allProfits, 0.25), median: pct(allProfits, 0.5), p75: pct(allProfits, 0.75), p95: pct(allProfits, 0.95), mean: avg(allProfits) },
        roi: { p5: pct(allROIs, 0.05), median: pct(allROIs, 0.5), p95: pct(allROIs, 0.95), mean: avg(allROIs) },
        adopters: { p5: pct(allAdopters, 0.05), median: pct(allAdopters, 0.5), p95: pct(allAdopters, 0.95), mean: avg(allAdopters) },
        successRate: allProfits.filter(p => p > 0).length / allProfits.length * 100,
        revenueByMonth: revenueByMonth.map(arr => ({ p5: pct(arr, 0.05), median: pct(arr, 0.5), p95: pct(arr, 0.95) })),
        profitByMonth: profitByMonth.map(arr => ({ p5: pct(arr, 0.05), median: pct(arr, 0.5), p95: pct(arr, 0.95) }))
      }
    };
  }

  _generateDemographics(totalAdopters) {
    const ageGroups = {};
    const targetGroups = this.product.targetAgeGroups || [];
    for (const [ag, pct] of Object.entries(this.country.ageDistribution)) {
      ageGroups[ag] = pct * (targetGroups.length > 0 && targetGroups.includes(ag) ? 2 : 1);
    }
    const total = Object.values(ageGroups).reduce((s, v) => s + v, 0);
    for (const ag in ageGroups) ageGroups[ag] = Math.floor((ageGroups[ag] / total) * totalAdopters);
    return { ageGroups };
  }

  _analyzeRisks() {
    const risks = [];
    if (this.category.regulatoryRisk > 0.5) risks.push({ level: 'high', name: 'Düzenleyici Risk', desc: 'Bu sektör yüksek düzenleme riski taşıyor.', score: this.category.regulatoryRisk });
    if (this.product.competitionLevel === 'high' || this.product.competitionLevel === 'veryHigh') risks.push({ level: 'high', name: 'Rekabet Riski', desc: 'Pazarda yoğun rekabet mevcut.', score: 0.8 });
    if (this._getAffordabilityFactor() < 0.4) risks.push({ level: 'medium', name: 'Fiyat Riski', desc: 'Ürün hedef pazar için pahalı.', score: 0.6 });
    if (this._getChannelReach() < 0.4) risks.push({ level: 'medium', name: 'Dağıtım Riski', desc: 'Sınırlı dağıtım kanalları.', score: 0.5 });
    if (this.product.uniquenessScore < 0.3) risks.push({ level: 'medium', name: 'Farklılaşma Riski', desc: 'Ürün yeterince benzersiz değil.', score: 0.5 });
    if (risks.length === 0) risks.push({ level: 'low', name: 'Düşük Risk Profili', desc: 'Genel risk seviyesi kabul edilebilir.', score: 0.2 });
    return risks;
  }

  _calculateOverallScore(monthlyData) {
    const last = monthlyData[monthlyData.length - 1];
    let score = 50;
    if (last.roi > 100) score += 20; else if (last.roi > 50) score += 15; else if (last.roi > 0) score += 10; else score -= 10;
    if (last.penetration > 0.05) score += 15; else if (last.penetration > 0.01) score += 10; else score -= 5;
    if (monthlyData.length > 6) {
      const lastQ = monthlyData.slice(-3).reduce((s, d) => s + d.revenue, 0);
      const prevQ = monthlyData.slice(-6, -3).reduce((s, d) => s + d.revenue, 0);
      if (prevQ > 0 && lastQ > prevQ * 1.1) score += 10;
    }
    score -= this._analyzeRisks().filter(r => r.level === 'high').length * 5;
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}
