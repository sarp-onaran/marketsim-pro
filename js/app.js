import { COUNTRIES, CATEGORIES, DISTRIBUTION_CHANNELS, MONTH_NAMES_TR } from './data.js';
import { SimulationEngine } from './simulation.js';

const state = { simulations: [], currentView: 'dashboard', selectedSimId: null, mode: 'quick' };

// Smart defaults per category for quick mode
const QUICK_DEFAULTS = {
  foodBeverage: { cost:0.35, freq:3, opex:8000, invest:80000, mktg:60000, innov:55, unique:50, viral:45, repeat:70 },
  health:       { cost:0.40, freq:2, opex:12000, invest:120000, mktg:80000, innov:65, unique:60, viral:50, repeat:65 },
  tech:         { cost:0.45, freq:0.5, opex:20000, invest:250000, mktg:150000, innov:80, unique:75, viral:60, repeat:40 },
  fashion:      { cost:0.30, freq:1.5, opex:10000, invest:100000, mktg:80000, innov:50, unique:55, viral:65, repeat:50 },
  beauty:       { cost:0.35, freq:2, opex:10000, invest:90000, mktg:70000, innov:55, unique:50, viral:60, repeat:65 },
  homeGarden:   { cost:0.40, freq:0.5, opex:8000, invest:80000, mktg:50000, innov:50, unique:45, viral:35, repeat:35 },
  sports:       { cost:0.40, freq:1, opex:10000, invest:100000, mktg:70000, innov:60, unique:55, viral:50, repeat:45 },
  automotive:   { cost:0.50, freq:0.1, opex:30000, invest:500000, mktg:200000, innov:60, unique:50, viral:40, repeat:15 },
  education:    { cost:0.30, freq:1, opex:8000, invest:60000, mktg:40000, innov:65, unique:60, viral:55, repeat:60 },
  entertainment:{ cost:0.25, freq:2, opex:12000, invest:100000, mktg:80000, innov:70, unique:65, viral:70, repeat:55 }
};

function fmt(n, d = 0) {
  if (n == null || isNaN(n)) return '0';
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(d);
}
function fmtC(n, s = '₺') { return s + fmt(n); }
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

setInterval(() => { const el = $('#live-clock'); if (el) el.textContent = new Date().toLocaleTimeString('tr-TR'); }, 1000);

function switchView(view) {
  state.currentView = view;
  $$('.section').forEach(s => s.classList.remove('active'));
  const sec = $(`#section-${view}`);
  if (sec) sec.classList.add('active');
  $$('.nav-tab').forEach(t => t.classList.remove('active'));
  const tab = $(`.nav-tab[data-view="${view}"]`);
  if (tab) tab.classList.add('active');
  if (view === 'dashboard') renderDashboard();
  if (view === 'compare') renderComparison();
}

function initModeSwitch() {
  $$('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      $$('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $('#quick-form').style.display = state.mode === 'quick' ? 'block' : 'none';
      $('#detailed-form').style.display = state.mode === 'detailed' ? 'block' : 'none';
      const hint = $('#mode-hint');
      if (hint) hint.textContent = state.mode === 'quick'
        ? 'Sadece birkaç bilgi girin, gerisini biz halledelim. Teknik bilgi gerekmez!'
        : 'Tüm parametreleri kendiniz kontrol edin. İleri düzey kullanıcılar için.';
    });
  });
}

function populateSelects(prefix, addRequired) {
  const cs = $(`#${prefix}country-select`);
  if (cs) { cs.innerHTML = ''; for (const [code, c] of Object.entries(COUNTRIES)) cs.innerHTML += `<option value="${code}">${c.name}</option>`; }
  const cat = $(`#${prefix}category-select`);
  if (cat) { cat.innerHTML = ''; for (const [key, c] of Object.entries(CATEGORIES)) cat.innerHTML += `<option value="${key}">${c.icon} ${c.name}</option>`; }
}

function initForm() {
  populateSelects('', true);
  populateSelects('d-', false);

  $$('input[type="range"]').forEach(s => {
    const d = s.parentElement?.querySelector('.slider-value');
    if (d) { d.textContent = s.value + (s.dataset.unit || ''); s.addEventListener('input', () => { d.textContent = s.value + (s.dataset.unit || ''); }); }
  });
  $$('.checkbox-item').forEach(i => i.addEventListener('click', () => i.classList.toggle('active')));
  $('#sim-form').addEventListener('submit', e => { e.preventDefault(); runSimulation(); });
  initModeSwitch();
}

function runSimulation() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay'; overlay.id = 'loading-overlay';
  overlay.innerHTML = `<div class="spinner"></div><div class="loading-text">Monte Carlo Simülasyonu Çalışıyor</div><div class="loading-progress pulse" id="loading-progress">500 senaryo hesaplanıyor...</div>`;
  document.body.appendChild(overlay);

  const msgs = ['Demografik modeller yükleniyor...', 'Bass Diffusion parametreleri hesaplanıyor...', 'Rekabet matrisi oluşturuluyor...', 'Fiyat elastikiyeti analiz ediliyor...', 'Monte Carlo iterasyonları çalışıyor...', 'Güven aralıkları hesaplanıyor...', 'Risk skorlaması yapılıyor...', 'Rapor derleniyor...'];
  let mi = 0;
  const msgI = setInterval(() => { if (mi < msgs.length) { const el = $('#loading-progress'); if (el) el.textContent = msgs[mi]; mi++; } }, 500);

  setTimeout(() => {
    clearInterval(msgI);
    const p = state.mode === 'detailed' ? 'd-' : '';
    const catKey = $(`#${p}category-select`)?.value || 'foodBeverage';
    const price = parseFloat($(`#${p}product-price`)?.value) || 25;
    const defaults = QUICK_DEFAULTS[catKey] || QUICK_DEFAULTS.foodBeverage;

    let product;
    if (state.mode === 'quick') {
      product = {
        name: $('#product-name').value || 'Adsız Ürün',
        description: $('#product-desc').value || '',
        price,
        unitCost: price * defaults.cost,
        purchaseFrequency: defaults.freq,
        monthlyOpex: defaults.opex,
        innovationScore: defaults.innov / 100,
        uniquenessScore: defaults.unique / 100,
        viralPotential: defaults.viral / 100,
        repeatPurchaseRate: defaults.repeat / 100,
        competitionLevel: $('#competition-level').value || 'medium',
        targetGender: 'all',
        isHealthy: $('#is-healthy')?.classList.contains('active'),
        isTechEnabled: $('#is-tech')?.classList.contains('active'),
        isEcoFriendly: $('#is-eco')?.classList.contains('active'),
        isTrendy: $('#is-trendy')?.classList.contains('active'),
        targetAgeGroups: ['15-24','25-34','35-44']
      };
    } else {
      product = {
        name: $('#d-product-name').value || 'Adsız Ürün',
        description: $('#d-product-desc').value || '',
        price,
        unitCost: parseFloat($('#d-product-cost').value) || 4,
        purchaseFrequency: parseFloat($('#d-purchase-freq').value) || 1,
        monthlyOpex: parseFloat($('#d-monthly-opex').value) || 5000,
        innovationScore: parseFloat($('#d-innovation-score').value) / 100,
        uniquenessScore: parseFloat($('#d-uniqueness-score').value) / 100,
        viralPotential: parseFloat($('#d-viral-score').value) / 100,
        repeatPurchaseRate: parseFloat($('#d-repeat-score').value) / 100,
        competitionLevel: $('#d-competition-level').value || 'medium',
        targetGender: $('#d-target-gender').value || 'all',
        isHealthy: $('#d-is-healthy')?.classList.contains('active'),
        isTechEnabled: $('#d-is-tech')?.classList.contains('active'),
        isEcoFriendly: $('#d-is-eco')?.classList.contains('active'),
        isTrendy: $('#d-is-trendy')?.classList.contains('active'),
        targetAgeGroups: [...$$('#age-groups .checkbox-item.active')].map(e => e.dataset.value)
      };
    }

    const channels = state.mode === 'detailed'
      ? [...$$('#channels .checkbox-item.active')].map(e => e.dataset.value)
      : ['retail', 'online'];

    const engine = new SimulationEngine({
      product, countryCode: $(`#${p}country-select`)?.value || 'TR',
      category: catKey,
      duration: state.mode === 'quick' ? 12 : (parseInt($('#d-sim-duration').value) || 12),
      channels: channels.length > 0 ? channels : ['retail'],
      marketingBudget: state.mode === 'quick' ? defaults.mktg : (parseFloat($('#d-marketing-budget').value) || 50000),
      initialInvestment: state.mode === 'quick' ? defaults.invest : (parseFloat($('#d-initial-investment').value) || 100000)
    });

    const results = engine.run();
    results.id = Date.now();
    results.categoryKey = catKey;
    state.simulations.push(results);

    const ol = $('#loading-overlay'); if (ol) ol.remove();
    const badge = $('.nav-tab[data-view="dashboard"] .badge');
    if (badge) badge.textContent = state.simulations.length;
    state.selectedSimId = results.id;
    renderResults(results);
    switchView('results');
  }, 4500);
}

function renderResults(d) {
  const c = $('#results-content');
  const last = d.monthlyData[d.monthlyData.length - 1];
  const cur = d.country.currency;
  const mc = d.monteCarlo;

  let vc, vi, vt, vd;
  if (d.overallScore >= 70) { vc='sell'; vi='◈'; vt='SATIŞ POTANSİYELİ YÜKSEK'; vd=`${d.country.name} pazarında güçlü performans bekleniyor. Başarı oranı: %${mc.successRate.toFixed(0)}`; }
  else if (d.overallScore >= 45) { vc='risky'; vi='△'; vt='RİSKLİ — STRATEJİ GEREKLİ'; vd=`Orta performans bekleniyor. Başarı oranı: %${mc.successRate.toFixed(0)}. Strateji optimizasyonu önerilir.`; }
  else { vc='nosell'; vi='✕'; vt='SATIŞ ÖNERİLMİYOR'; vd=`Düşük performans bekleniyor. Başarı oranı: %${mc.successRate.toFixed(0)}. Ürün/pazar değişikliği gerekebilir.`; }

  c.innerHTML = `
    <div class="verdict-banner ${vc}">
      <div class="verdict-icon" style="font-size:28px">${vi}</div>
      <div class="verdict-text"><div class="verdict-title">${vt}</div><div class="verdict-desc">${vd}</div></div>
      <div style="margin-left:auto"><div class="score-circle" style="--score-pct:${d.overallScore}%;width:72px;height:72px"><div class="score-value" style="font-size:22px">${d.overallScore}</div><div class="score-label" style="font-size:8px">SKOR</div></div></div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value" style="color:var(--neon-cyan)">${fmtC(mc.revenue.median, cur)}</div><div class="stat-label">Medyan Gelir</div><div class="data-source">${fmtC(mc.revenue.p5, cur)} — ${fmtC(mc.revenue.p95, cur)}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:${mc.profit.median>=0?'var(--neon-green)':'var(--neon-red)'}">${fmtC(mc.profit.median, cur)}</div><div class="stat-label">Medyan Kâr</div><div class="data-source">P5: ${fmtC(mc.profit.p5, cur)}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:${mc.roi.median>=0?'var(--neon-green)':'var(--neon-red)'}">%${mc.roi.median.toFixed(0)}</div><div class="stat-label">Medyan ROI</div><div class="data-source">%${mc.roi.p5.toFixed(0)} — %${mc.roi.p95.toFixed(0)}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--neon-purple)">${fmt(mc.adopters.median)}</div><div class="stat-label">Medyan Müşteri</div><div class="data-source">${fmt(mc.adopters.p5)} — ${fmt(mc.adopters.p95)}</div></div>
      <div class="stat-card"><div class="stat-value">${d.breakEvenMonth ? 'Ay ' + d.breakEvenMonth : '—'}</div><div class="stat-label">Başabaş</div></div>
      <div class="stat-card"><div class="stat-value" style="color:${mc.successRate>=60?'var(--neon-green)':mc.successRate>=40?'var(--neon-amber)':'var(--neon-red)'}">%${mc.successRate.toFixed(0)}</div><div class="stat-label">Başarı Oranı</div><div class="data-source">${mc.runs} senaryo</div></div>
    </div>

    <div class="results-grid">
      <div>
        <div class="chart-container"><h3>▦ Gelir Güven Aralığı (P5 / P50 / P95)</h3><div class="chart-wrapper"><canvas id="chart-revenue"></canvas></div></div>
        <div class="chart-container"><h3>▦ Müşteri Büyümesi</h3><div class="chart-wrapper"><canvas id="chart-customers"></canvas></div></div>
        <div class="chart-container"><h3>▦ Kümülatif ROI</h3><div class="chart-wrapper"><canvas id="chart-roi"></canvas></div></div>
      </div>
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-title"><span class="icon">◈</span> Simülasyon Özeti</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-soft);line-height:2.2">
            <div>Ürün: <span style="color:var(--text-white)">${d.product.name}</span></div>
            <div>Pazar: <span style="color:var(--text-white)">${d.country.name}</span></div>
            <div>Kategori: <span style="color:var(--text-white)">${d.category.icon} ${d.category.name}</span></div>
            <div>Fiyat: <span style="color:var(--neon-cyan)">${cur}${d.product.price}</span></div>
            <div>Süre: <span style="color:var(--text-white)">${d.duration} ay</span></div>
            <div>TAM: <span style="color:var(--text-white)">${fmt(d.marketSize)}</span></div>
            <div>Model: <span style="color:var(--neon-purple)">Monte Carlo ×${mc.runs}</span></div>
          </div>
          <div class="data-source">World Bank · IMF · TÜİK</div>
        </div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-title"><span class="icon">△</span> Risk Matrisi</div>
          ${d.riskAnalysis.map(r => `<div class="risk-item ${r.level}"><div style="flex:1"><div style="font-weight:600;font-size:13px">${r.name}</div><div style="font-size:11px;color:var(--text-dim);margin-top:2px">${r.desc}</div></div><span class="risk-level">${r.level==='high'?'YÜKSEK':r.level==='medium'?'ORTA':'DÜŞÜK'}</span></div>`).join('')}
        </div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-title"><span class="icon">◉</span> Demografik Dağılım</div>
          <div class="chart-wrapper" style="height:220px"><canvas id="chart-demo"></canvas></div>
        </div>
        ${d.events.length > 0 ? `<div class="card"><div class="card-title"><span class="icon">⚡</span> Olaylar</div><div class="events-timeline">${d.events.map(e => `<div class="event-item"><div class="event-icon">${e.icon}</div><div class="event-info"><div class="event-name">${e.name}</div><div class="event-month">Ay ${e.month+1}</div></div><span class="event-impact ${e.multiplier>=1?'positive':'negative'}">${e.multiplier>=1?'+':''}${((e.multiplier-1)*100).toFixed(0)}%</span></div>`).join('')}</div></div>` : ''}
      </div>
    </div>`;

  setTimeout(() => renderCharts(d), 100);
}

function renderCharts(d) {
  const months = d.monthlyData.map(m => MONTH_NAMES_TR[(m.month-1)%12]);
  const gc = 'rgba(0,229,255,0.06)';
  const tc = '#4a5578';
  const scales = { x:{grid:{color:gc},ticks:{color:tc,font:{family:'JetBrains Mono',size:10}}}, y:{grid:{color:gc},ticks:{color:tc,font:{family:'JetBrains Mono',size:10}}} };
  const plugins = { legend:{labels:{color:'#8b9cc7',font:{family:'Outfit',size:11}}} };
  const mc = d.monteCarlo;

  // Revenue with confidence bands
  const ctx1 = document.getElementById('chart-revenue');
  if (ctx1) new Chart(ctx1, { type:'bar', data:{ labels:months, datasets:[
    { label:'Medyan Gelir', data:mc.revenueByMonth.map(m=>m.median), backgroundColor:'rgba(0,229,255,0.5)', borderRadius:4 },
    { label:'Medyan Kâr', data:mc.profitByMonth.map(m=>m.median), backgroundColor:mc.profitByMonth.map(m=>m.median>=0?'rgba(0,255,163,0.5)':'rgba(255,59,92,0.5)'), borderRadius:4 }
  ]}, options:{responsive:true,maintainAspectRatio:false,scales,plugins}});

  const ctx2 = document.getElementById('chart-customers');
  if (ctx2) new Chart(ctx2, { type:'line', data:{ labels:months, datasets:[
    { label:'Aktif', data:d.monthlyData.map(m=>m.activeCustomers), borderColor:'#b44aff', backgroundColor:'rgba(180,74,255,0.08)', fill:true, tension:0.4, pointRadius:3, borderWidth:2 },
    { label:'Yeni', data:d.monthlyData.map(m=>m.newAdopters), borderColor:'#00e5ff', backgroundColor:'rgba(0,229,255,0.08)', fill:true, tension:0.4, pointRadius:3, borderWidth:2 }
  ]}, options:{responsive:true,maintainAspectRatio:false,scales,plugins}});

  const ctx3 = document.getElementById('chart-roi');
  if (ctx3) new Chart(ctx3, { type:'line', data:{ labels:months, datasets:[
    { label:'ROI %', data:d.monthlyData.map(m=>m.roi), borderColor:'#ffb300', backgroundColor:'rgba(255,179,0,0.08)', fill:true, tension:0.4, pointRadius:3, borderWidth:2 }
  ]}, options:{ responsive:true,maintainAspectRatio:false, scales:{...scales,y:{...scales.y,ticks:{...scales.y.ticks,callback:v=>v+'%'}}}, plugins }});

  const ctx4 = document.getElementById('chart-demo');
  if (ctx4) new Chart(ctx4, { type:'doughnut', data:{ labels:Object.keys(d.demographics.ageGroups), datasets:[{ data:Object.values(d.demographics.ageGroups), backgroundColor:['#00e5ff','#b44aff','#ff2d87','#00ffa3','#ffb300','#ff3b5c','#22d3ee'] }]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#8b9cc7',font:{size:10},padding:8}}}}});
}

function renderDashboard() {
  const c = $('#dashboard-content');
  if (state.simulations.length === 0) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">◈</div><h3>Henüz Simülasyon Yok</h3><p>Yeni bir ürün ekleyerek AI destekli pazar simülasyonunu başlatın.</p><button class="btn btn-primary btn-lg" onclick="document.querySelector('.nav-tab[data-view=new]').click()">◈ İlk Analizi Başlat</button></div>`;
    return;
  }
  const sims = state.simulations;
  c.innerHTML = `
    <div class="stats-grid" style="margin-bottom:24px">
      <div class="stat-card"><div class="stat-value" style="color:var(--neon-cyan)">${sims.length}</div><div class="stat-label">Toplam Analiz</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--neon-green)">${sims.filter(s=>s.overallScore>=70).length}</div><div class="stat-label">Başarılı</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--neon-amber)">${sims.filter(s=>s.overallScore>=45&&s.overallScore<70).length}</div><div class="stat-label">Riskli</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--neon-red)">${sims.filter(s=>s.overallScore<45).length}</div><div class="stat-label">Başarısız</div></div>
    </div>
    <div class="products-grid">${sims.map(s => {
      const sc = s.overallScore>=70?'good':s.overallScore>=45?'medium':'bad';
      return `<div class="product-card" onclick="window.viewSim(${s.id})">
        <div class="product-emoji">${s.category.icon}</div>
        <div class="product-score"><div class="mini-score ${sc}">${s.overallScore}</div></div>
        <h3>${s.product.name}</h3>
        <div class="product-meta">${s.country.name} · ${s.duration}ay · Başarı: %${s.monteCarlo.successRate.toFixed(0)}</div>
        <div style="display:flex;gap:14px;margin-top:10px;font-family:var(--font-mono);font-size:12px">
          <div><span style="color:var(--text-dim)">Gelir:</span> <strong style="color:var(--neon-cyan)">${fmtC(s.monteCarlo.revenue.median,s.country.currency)}</strong></div>
          <div><span style="color:var(--text-dim)">ROI:</span> <strong style="color:${s.monteCarlo.roi.median>=0?'var(--neon-green)':'var(--neon-red)'}">%${s.monteCarlo.roi.median.toFixed(0)}</strong></div>
        </div></div>`;
    }).join('')}</div>`;
}

function renderComparison() {
  const c = $('#compare-content');
  if (state.simulations.length < 2) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⇄</div><h3>En Az 2 Analiz Gerekli</h3><p>Birden fazla ürün analiz ederek karşılaştırma yapabilirsiniz.</p></div>`;
    return;
  }
  c.innerHTML = `
    <div class="card">
      <div class="card-title"><span class="icon">⇄</span> Karşılaştırma Matrisi</div>
      <div style="overflow-x:auto"><table class="comparison-table"><thead><tr>
        <th>Ürün</th><th>Pazar</th><th>Skor</th><th>Medyan Gelir</th><th>Medyan Kâr</th><th>ROI</th><th>Başarı %</th><th>Karar</th>
      </tr></thead><tbody>${state.simulations.map(s => `<tr style="cursor:pointer" onclick="window.viewSim(${s.id})">
        <td><strong>${s.category.icon} ${s.product.name}</strong></td>
        <td>${s.country.name}</td>
        <td><span class="mini-score ${s.overallScore>=70?'good':s.overallScore>=45?'medium':'bad'}" style="width:34px;height:34px;font-size:12px">${s.overallScore}</span></td>
        <td style="font-family:var(--font-mono)">${fmtC(s.monteCarlo.revenue.median,s.country.currency)}</td>
        <td style="font-family:var(--font-mono);color:${s.monteCarlo.profit.median>=0?'var(--neon-green)':'var(--neon-red)'}">${fmtC(s.monteCarlo.profit.median,s.country.currency)}</td>
        <td style="font-family:var(--font-mono);color:${s.monteCarlo.roi.median>=0?'var(--neon-green)':'var(--neon-red)'}">%${s.monteCarlo.roi.median.toFixed(0)}</td>
        <td style="font-family:var(--font-mono)">%${s.monteCarlo.successRate.toFixed(0)}</td>
        <td>${s.overallScore>=70?'<span style="color:var(--neon-green)">● SAT</span>':s.overallScore>=45?'<span style="color:var(--neon-amber)">● RİSKLİ</span>':'<span style="color:var(--neon-red)">● SATMA</span>'}</td>
      </tr>`).join('')}</tbody></table></div>
      <div class="data-source">Monte Carlo simülasyonu · Güven aralığı %90</div>
    </div>
    <div class="chart-container" style="margin-top:20px">
      <h3>▦ Kümülatif Gelir Karşılaştırması</h3>
      <div class="chart-wrapper"><canvas id="chart-compare"></canvas></div>
    </div>`;

  setTimeout(() => {
    const ctx = document.getElementById('chart-compare');
    if (ctx) {
      const colors = ['#00e5ff','#b44aff','#ff2d87','#00ffa3','#ffb300','#ff3b5c'];
      const maxM = Math.max(...state.simulations.map(s => s.monthlyData.length));
      new Chart(ctx, { type:'line', data:{
        labels:Array.from({length:maxM},(_,i)=>MONTH_NAMES_TR[i%12]),
        datasets:state.simulations.map((s,i) => ({
          label:s.product.name,
          data:s.monthlyData.map(m=>m.cumulativeRevenue),
          borderColor:colors[i%colors.length], backgroundColor:'transparent',
          tension:0.4, pointRadius:2, borderWidth:2
        }))
      }, options:{responsive:true,maintainAspectRatio:false,
        scales:{x:{grid:{color:'rgba(0,229,255,0.06)'},ticks:{color:'#4a5578',font:{family:'JetBrains Mono',size:10}}},y:{grid:{color:'rgba(0,229,255,0.06)'},ticks:{color:'#4a5578',font:{family:'JetBrains Mono',size:10}}}},
        plugins:{legend:{labels:{color:'#8b9cc7',font:{family:'Outfit',size:11}}}}}});
    }
  }, 100);
}

window.viewSim = function(id) {
  const sim = state.simulations.find(s => s.id === id);
  if (sim) { state.selectedSimId = id; renderResults(sim); switchView('results'); }
};

// ===== THEME SYSTEM =====
function initTheme() {
  const saved = localStorage.getItem('marketsim-theme') || 'ocean';
  applyTheme(saved);

  $$('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('marketsim-theme', theme);

  $$('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initTheme();
  $$('.nav-tab').forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));
  switchView('new');
});
