# 📊 MarketSim PRO — AI-Powered Product Market Simulator

> A Monte Carlo simulation engine that predicts product market viability using real-world economic data from World Bank, IMF, and TÜİK.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?style=flat-square&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Properties-blue?style=flat-square&logo=css3)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-pink?style=flat-square&logo=chartdotjs)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🚀 Live Demo

**[▶ pazar-simulasyonu.vercel.app](https://pazar-simulasyonu.vercel.app)**

Or simply open `index.html` in your browser — no build tools or server required!

---

## 🧠 What Does It Do?

MarketSim PRO lets entrepreneurs and product managers **test a product idea before investing real money**. Enter your product details, and the engine runs **10,000 Monte Carlo simulations** to predict revenue, profit, ROI, and market adoption over 12+ months.

### Key Features

| Feature | Description |
|---------|-------------|
| **🎲 Monte Carlo Engine** | 10,000 randomized simulation runs with confidence intervals (P5/P50/P95) |
| **📈 Bass Diffusion Model** | Industry-standard adoption model with innovation & imitation coefficients |
| **🌍 8 Global Markets** | Real economic data for Turkey, USA, Germany, UK, Japan, Brazil, Saudi Arabia, UAE |
| **📊 Interactive Charts** | Revenue, customer growth, ROI, and demographic visualizations via Chart.js |
| **🎨 Multi-Theme UI** | Dark, Light, and Ocean themes with smooth CSS transitions |
| **⚡ Dual Input Modes** | Quick Mode (3 fields) for beginners & Detailed Mode (15+ parameters) for experts |
| **🔥 Random Events** | Viral moments, celebrity endorsements, PR crises, and competitor entries |
| **📋 Risk Analysis** | Regulatory, competition, pricing, distribution, and differentiation risk scoring |
| **⇄ Product Comparison** | Side-by-side comparison matrix for multiple product simulations |

---

## 🏗️ Architecture

```
marketsim-pro/
├── index.html              # Main application (SPA)
├── css/
│   └── main.css            # Design system with CSS custom properties
│                           # (3 themes, 27K+ lines of styling)
└── js/
    ├── app.js              # UI controller, form handling, chart rendering
    ├── simulation.js       # Monte Carlo engine & Bass Diffusion model
    └── data.js             # Country economics, categories, distributions
```

### Simulation Pipeline

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   User Input    │ ──▶ │  SimulationEngine     │ ──▶ │   Results UI    │
│                 │     │                       │     │                 │
│ • Product info  │     │ • Bass Diffusion (p,q)│     │ • Verdict card  │
│ • Price & cost  │     │ • Market sizing       │     │ • Stats grid    │
│ • Country       │     │ • 10K MC iterations   │     │ • 4 charts      │
│ • Competition   │     │ • Random events       │     │ • Risk matrix   │
│ • Channels      │     │ • Risk analysis       │     │ • Comparison    │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
```

### Key Algorithms

| Algorithm | Purpose |
|-----------|---------|
| **Bass Diffusion Model** | Predicts technology/product adoption using innovation (p) and imitation (q) coefficients |
| **Monte Carlo Simulation** | Runs 10,000 randomized scenarios to generate confidence intervals |
| **Price Elasticity Model** | Adjusts demand based on price relative to GDP per capita |
| **Affordability Factor** | Maps price-to-income ratios to adoption probability |
| **Channel Reach Calculator** | Combines retail density, e-commerce penetration, and channel multipliers |
| **Trend Fit Scoring** | Evaluates product-market fit based on health, tech, eco, and trend factors |

---

## 📸 Screenshots

### Dark Theme — Simulation Results
The application features a sleek dark theme with neon accents, interactive charts, and a comprehensive analysis dashboard.

### Multi-Theme Support
Switch between Dark 🌙, Light ☀️, and Ocean 🌊 themes with a single click.

---

## 🌍 Supported Markets

| Country | Currency | Population | GDP/Capita | Data Source |
|---------|----------|------------|------------|-------------|
| 🇹🇷 Turkey | ₺ TRY | 85M | $10,600 | TÜİK |
| 🇺🇸 USA | $ USD | 335M | $76,000 | BEA |
| 🇩🇪 Germany | € EUR | 84M | $52,000 | Destatis |
| 🇬🇧 UK | £ GBP | 67M | $46,000 | ONS |
| 🇯🇵 Japan | ¥ JPY | 125M | $40,000 | Cabinet Office |
| 🇧🇷 Brazil | R$ BRL | 215M | $8,900 | IBGE |
| 🇸🇦 Saudi Arabia | ﷼ SAR | 36M | $27,000 | GASTAT |
| 🇦🇪 UAE | AED | 10M | $44,000 | FCSA |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- That's it! No Node.js, no build tools, no dependencies to install.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/sarp-onaran/marketsim-pro.git
cd marketsim-pro

# Open in browser
open index.html        # macOS
# or
xdg-open index.html    # Linux
# or just double-click index.html
```

### Deploy to GitHub Pages

```bash
# It's already a static site — just enable GitHub Pages
# Settings → Pages → Source: Deploy from branch → main → / (root)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| JavaScript (ES6+) | Simulation engine, UI logic, modular architecture |
| HTML5 | Semantic markup, accessible forms |
| CSS3 | Custom properties, multi-theme system, animations |
| Chart.js 4.x | Interactive bar, line, and doughnut charts |
| CSS Grid & Flexbox | Responsive layout system |
| LocalStorage | Theme persistence |

---

## 📈 How the Simulation Works

1. **Market Sizing**: Calculates Total Addressable Market (TAM) using population demographics, age groups, income distribution, and affordability analysis.

2. **Bass Diffusion**: Models product adoption using the Bass model with parameters calibrated per product category.

3. **Monte Carlo**: Runs 10,000 independent simulations with randomized noise factors (±15%) and stochastic events.

4. **Confidence Intervals**: Aggregates results into P5, P25, P50 (median), P75, and P95 percentiles for revenue, profit, ROI, and customer count.

5. **Scoring**: Calculates an overall viability score (0-100) based on ROI, market penetration, growth trends, and risk factors.

---

## 📈 Roadmap

- [x] Monte Carlo simulation engine (10,000 iterations)
- [x] Bass Diffusion adoption model
- [x] 8 country market data
- [x] Multi-theme UI (Dark, Light, Ocean)
- [x] Quick Mode & Detailed Mode
- [x] Product comparison matrix
- [x] Risk analysis framework
- [x] Random market events
- [ ] Export reports as PDF
- [ ] Historical data comparison
- [ ] API integration for real-time economic data
- [ ] Additional markets (India, South Korea, France)
- [ ] Sensitivity analysis (tornado charts)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 📊 by <a href="https://github.com/sarp-onaran">Sarp Onaran</a>
</p>
