// ===== ÜLKE VE PAZAR VERİLERİ =====
export const COUNTRIES = {
  TR: {
    name: "Türkiye", population: 85_000_000, gdpPerCapita: 10_600,
    urbanRate: 0.77, internetPenetration: 0.83, medianAge: 32,
    currency: "₺", currencyCode: "TRY", exchangeRate: 32.5,
    ageDistribution: { "0-14": 0.23, "15-24": 0.15, "25-34": 0.16, "35-44": 0.14, "45-54": 0.12, "55-64": 0.10, "65+": 0.10 },
    incomeDistribution: { low: 0.35, middle: 0.45, upper: 0.15, high: 0.05 },
    regions: ["Marmara", "Ege", "Akdeniz", "İç Anadolu", "Karadeniz", "Doğu Anadolu", "Güneydoğu Anadolu"],
    consumerConfidence: 0.55, healthTrend: 0.65, techAdoption: 0.70,
    ecommercePenetration: 0.45, retailDensity: 0.60,
    seasonalFactors: [0.85,0.88,0.95,1.0,1.05,1.10,1.08,0.95,1.02,1.05,1.12,1.20]
  },
  US: {
    name: "ABD", population: 335_000_000, gdpPerCapita: 76_000,
    urbanRate: 0.83, internetPenetration: 0.92, medianAge: 38,
    currency: "$", currencyCode: "USD", exchangeRate: 1,
    ageDistribution: { "0-14": 0.18, "15-24": 0.13, "25-34": 0.14, "35-44": 0.13, "45-54": 0.12, "55-64": 0.13, "65+": 0.17 },
    incomeDistribution: { low: 0.25, middle: 0.40, upper: 0.25, high: 0.10 },
    regions: ["Northeast", "Midwest", "South", "West"],
    consumerConfidence: 0.65, healthTrend: 0.75, techAdoption: 0.85,
    ecommercePenetration: 0.70, retailDensity: 0.80,
    seasonalFactors: [0.90,0.88,0.95,1.0,1.05,1.08,1.05,0.98,1.02,1.05,1.15,1.25]
  },
  DE: {
    name: "Almanya", population: 84_000_000, gdpPerCapita: 52_000,
    urbanRate: 0.77, internetPenetration: 0.93, medianAge: 45,
    currency: "€", currencyCode: "EUR", exchangeRate: 0.92,
    ageDistribution: { "0-14": 0.14, "15-24": 0.10, "25-34": 0.13, "35-44": 0.12, "45-54": 0.14, "55-64": 0.16, "65+": 0.21 },
    incomeDistribution: { low: 0.20, middle: 0.50, upper: 0.22, high: 0.08 },
    regions: ["Kuzey", "Güney", "Doğu", "Batı"],
    consumerConfidence: 0.60, healthTrend: 0.80, techAdoption: 0.78,
    ecommercePenetration: 0.65, retailDensity: 0.75,
    seasonalFactors: [0.88,0.85,0.95,1.0,1.05,1.08,1.02,0.95,1.0,1.05,1.10,1.22]
  },
  GB: {
    name: "İngiltere", population: 67_000_000, gdpPerCapita: 46_000,
    urbanRate: 0.84, internetPenetration: 0.95, medianAge: 40,
    currency: "£", currencyCode: "GBP", exchangeRate: 0.79,
    ageDistribution: { "0-14": 0.17, "15-24": 0.12, "25-34": 0.14, "35-44": 0.13, "45-54": 0.13, "55-64": 0.12, "65+": 0.19 },
    incomeDistribution: { low: 0.22, middle: 0.45, upper: 0.24, high: 0.09 },
    regions: ["London", "South", "Midlands", "North", "Scotland", "Wales"],
    consumerConfidence: 0.58, healthTrend: 0.72, techAdoption: 0.82,
    ecommercePenetration: 0.72, retailDensity: 0.78,
    seasonalFactors: [0.88,0.85,0.93,0.98,1.05,1.08,1.05,0.98,1.0,1.05,1.12,1.25]
  },
  JP: {
    name: "Japonya", population: 125_000_000, gdpPerCapita: 40_000,
    urbanRate: 0.92, internetPenetration: 0.93, medianAge: 49,
    currency: "¥", currencyCode: "JPY", exchangeRate: 155,
    ageDistribution: { "0-14": 0.12, "15-24": 0.09, "25-34": 0.11, "35-44": 0.13, "45-54": 0.15, "55-64": 0.14, "65+": 0.26 },
    incomeDistribution: { low: 0.18, middle: 0.55, upper: 0.20, high: 0.07 },
    regions: ["Kanto", "Kansai", "Chubu", "Kyushu", "Tohoku"],
    consumerConfidence: 0.50, healthTrend: 0.85, techAdoption: 0.88,
    ecommercePenetration: 0.68, retailDensity: 0.90,
    seasonalFactors: [0.92,0.90,0.98,1.02,1.05,1.0,1.08,1.02,0.98,1.02,1.08,1.18]
  },
  BR: {
    name: "Brezilya", population: 215_000_000, gdpPerCapita: 8_900,
    urbanRate: 0.87, internetPenetration: 0.75, medianAge: 34,
    currency: "R$", currencyCode: "BRL", exchangeRate: 5.1,
    ageDistribution: { "0-14": 0.20, "15-24": 0.15, "25-34": 0.16, "35-44": 0.14, "45-54": 0.13, "55-64": 0.11, "65+": 0.11 },
    incomeDistribution: { low: 0.40, middle: 0.38, upper: 0.15, high: 0.07 },
    regions: ["Güneydoğu", "Güney", "Kuzeydoğu", "Kuzey", "Orta-Batı"],
    consumerConfidence: 0.52, healthTrend: 0.55, techAdoption: 0.62,
    ecommercePenetration: 0.40, retailDensity: 0.50,
    seasonalFactors: [1.10,1.05,0.95,0.90,0.88,0.85,0.88,0.90,0.95,1.0,1.08,1.20]
  },
  SA: {
    name: "Suudi Arabistan", population: 36_000_000, gdpPerCapita: 27_000,
    urbanRate: 0.84, internetPenetration: 0.88, medianAge: 31,
    currency: "﷼", currencyCode: "SAR", exchangeRate: 3.75,
    ageDistribution: { "0-14": 0.24, "15-24": 0.14, "25-34": 0.18, "35-44": 0.16, "45-54": 0.12, "55-64": 0.09, "65+": 0.07 },
    incomeDistribution: { low: 0.20, middle: 0.40, upper: 0.28, high: 0.12 },
    regions: ["Riyad", "Mekke", "Medine", "Doğu"],
    consumerConfidence: 0.68, healthTrend: 0.60, techAdoption: 0.80,
    ecommercePenetration: 0.55, retailDensity: 0.65,
    seasonalFactors: [0.90,0.92,1.05,1.10,1.05,0.85,0.82,0.85,0.95,1.0,1.05,1.10]
  },
  AE: {
    name: "BAE", population: 10_000_000, gdpPerCapita: 44_000,
    urbanRate: 0.87, internetPenetration: 0.99, medianAge: 33,
    currency: "AED", currencyCode: "AED", exchangeRate: 3.67,
    ageDistribution: { "0-14": 0.15, "15-24": 0.12, "25-34": 0.25, "35-44": 0.22, "45-54": 0.14, "55-64": 0.08, "65+": 0.04 },
    incomeDistribution: { low: 0.15, middle: 0.35, upper: 0.32, high: 0.18 },
    regions: ["Dubai", "Abu Dhabi", "Sharjah", "Diğer"],
    consumerConfidence: 0.72, healthTrend: 0.70, techAdoption: 0.90,
    ecommercePenetration: 0.60, retailDensity: 0.75,
    seasonalFactors: [0.92,0.90,0.98,1.02,1.0,0.82,0.80,0.85,0.95,1.05,1.10,1.15]
  }
};

export const CATEGORIES = {
  food: { name: "Gıda & İçecek", icon: "🍽️", baseAdoption: 0.08, basePenetration: 0.15, priceElasticity: 1.2, regulatoryRisk: 0.3 },
  health: { name: "Sağlık & Wellness", icon: "💊", baseAdoption: 0.05, basePenetration: 0.10, priceElasticity: 0.8, regulatoryRisk: 0.5 },
  tech: { name: "Teknoloji", icon: "📱", baseAdoption: 0.10, basePenetration: 0.12, priceElasticity: 1.0, regulatoryRisk: 0.2 },
  beauty: { name: "Güzellik & Bakım", icon: "✨", baseAdoption: 0.07, basePenetration: 0.13, priceElasticity: 1.1, regulatoryRisk: 0.3 },
  fashion: { name: "Moda & Giyim", icon: "👗", baseAdoption: 0.09, basePenetration: 0.14, priceElasticity: 1.3, regulatoryRisk: 0.1 },
  tobacco: { name: "Tütün & Alternatif", icon: "🚬", baseAdoption: 0.04, basePenetration: 0.08, priceElasticity: 0.5, regulatoryRisk: 0.8 },
  beverage: { name: "İçecek", icon: "🥤", baseAdoption: 0.09, basePenetration: 0.18, priceElasticity: 1.3, regulatoryRisk: 0.2 },
  sports: { name: "Spor & Fitness", icon: "🏋️", baseAdoption: 0.06, basePenetration: 0.10, priceElasticity: 0.9, regulatoryRisk: 0.1 },
  home: { name: "Ev & Yaşam", icon: "🏠", baseAdoption: 0.05, basePenetration: 0.11, priceElasticity: 1.0, regulatoryRisk: 0.1 },
  pet: { name: "Evcil Hayvan", icon: "🐾", baseAdoption: 0.06, basePenetration: 0.09, priceElasticity: 0.7, regulatoryRisk: 0.2 }
};

export const DISTRIBUTION_CHANNELS = {
  retail: { name: "Perakende Mağaza", reachMultiplier: 1.0, costFactor: 1.2 },
  online: { name: "Online Satış", reachMultiplier: 0.8, costFactor: 0.7 },
  wholesale: { name: "Toptan Satış", reachMultiplier: 0.6, costFactor: 0.5 },
  directSales: { name: "Doğrudan Satış", reachMultiplier: 0.4, costFactor: 0.9 },
  franchise: { name: "Franchise", reachMultiplier: 0.7, costFactor: 1.5 },
  subscription: { name: "Abonelik Modeli", reachMultiplier: 0.5, costFactor: 0.6 }
};

// Referans ürünler (IQOS, Puff vb.)
export const REFERENCE_PRODUCTS = {
  iqos: { name: "IQOS", category: "tobacco", launchYear: 2014, peakPenetration: 0.06, adoptionSpeed: "slow", pricePoint: "premium" },
  puff: { name: "Puff Bar", category: "tobacco", launchYear: 2019, peakPenetration: 0.04, adoptionSpeed: "fast", pricePoint: "mid" },
  redbull: { name: "Red Bull", category: "beverage", launchYear: 1987, peakPenetration: 0.25, adoptionSpeed: "medium", pricePoint: "premium" },
  proteinBar: { name: "Protein Bar", category: "health", launchYear: 2000, peakPenetration: 0.12, adoptionSpeed: "medium", pricePoint: "mid" },
  airpods: { name: "AirPods", category: "tech", launchYear: 2016, peakPenetration: 0.15, adoptionSpeed: "fast", pricePoint: "premium" },
  oatMilk: { name: "Yulaf Sütü", category: "food", launchYear: 2016, peakPenetration: 0.08, adoptionSpeed: "medium", pricePoint: "mid" }
};

export const MONTH_NAMES_TR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
