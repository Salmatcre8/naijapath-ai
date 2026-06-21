# NaijaPath AI 🇳🇬🇵🇰

> You don't need to understand the system. The system should understand you.

An AI-powered public benefits navigator helping citizens in **Nigeria** and **Pakistan** discover government support programs they may qualify for — in minutes, not weeks.

Built for the **USAII Global AI Hackathon 2026** — Challenge Brief 4: Fix Systems People Depend On.

---

## ✨ Features

- 🤖 **Conversational AI intake** — Claude guides users through their situation naturally
- 🎯 **Eligibility reasoning** — Matches users against 14+ real government programs
- 📊 **Confidence scoring** — Shows match likelihood with clear explanations
- 🌍 **Multi-country** — Nigeria 🇳🇬 and Pakistan 🇵🇰
- 🗣️ **4 languages** — English, Nigerian Pidgin, Urdu, Hausa
- 🌙 **Dark/Light mode** — Full theme toggle
- 📱 **Mobile-first** — Works on any screen size
- 📄 **Action plan download** — Save your results as a text file
- 💬 **WhatsApp share** — Share results with family or case workers
- 🛡️ **Responsible AI** — "May qualify" framing, source transparency, human-in-loop

---

## 🚀 Setup & Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/naijapath-ai.git
cd naijapath-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your API key
```bash
cp .env.example .env
```
Then open `.env` and replace `your_anthropic_api_key_here` with your real key from [console.anthropic.com](https://console.anthropic.com).

### 4. Run the app
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploy to Vercel 

1. Push your code to GitHub (see instructions below)
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Click **"Add New Project"** → Import your repo
4. Under **Environment Variables**, add:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
5. Click **Deploy** — live in ~2 minutes!

---

## 📁 Project Structure

```
naijapath-ai/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top nav with dark mode + language switcher
│   │   ├── Landing.jsx         # Hero page + country selector
│   │   ├── ChatInterface.jsx   # Conversational intake
│   │   ├── AnalyzingScreen.jsx # Loading/analysis screen
│   │   └── ResultsDashboard.jsx # Results + action plan
│   ├── data/
│   │   ├── nigeria-programs.json   # 8 Nigerian programs
│   │   └── pakistan-programs.json  # 6 Pakistani programs
│   ├── hooks/
│   │   └── useDarkMode.js      # Dark mode toggle hook
│   ├── lib/
│   │   └── claude.js           # All Anthropic API calls
│   ├── locales/
│   │   └── translations.js     # EN, Pidgin, Urdu, Hausa
│   ├── App.jsx                 # Main app + screen routing
│   ├── main.jsx                # React entry point
│   └── index.css              # Global styles + CSS variables
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🏛️ Programs Covered

### Nigeria 🇳🇬
| Program | Category | Benefit |
|---------|----------|---------|
| N-Power | Employment | ₦30,000/month + training |
| TraderMoni (GEEP) | Business | ₦10k–₦100k loan |
| MarketMoni (GEEP) | Business | ₦50k–₦1M group loan |
| NYIF | Business | Up to ₦25M loan |
| NHIS/BHCPF | Health | Free healthcare |
| LSETF | Business/Jobs | ₦50k–₦5M at 5% interest |
| Conditional Cash Transfer | Welfare | ₦5,000/month |
| Home Grown School Feeding | Nutrition | Free daily school meals |

### Pakistan 🇵🇰
| Program | Category | Benefit |
|---------|----------|---------|
| Ehsaas Kafaalat | Welfare | PKR 2,000/month |
| BISP | Welfare | PKR 8,500/quarter |
| Ehsaas Rashan | Nutrition | 30-40% food subsidy |
| Kamyab Jawan | Business | PKR 100k–25M loan |
| Sehat Sahulat | Health | PKR 1M/year free hospital |
| PM Youth Laptop Scheme | Education | Free laptop |

---

## 🛡️ Responsible AI Design

- **Never says "you qualify"** — always "you may qualify"
- **Source transparency** — every result links to official government source
- **Human-in-loop** — AI does not approve applications; final decisions rest with agencies
- **No data stored** — zero personal information retained after session
- **Uncertainty-aware** — unverified criteria clearly flagged

---

## 🔧 Tech Stack

- **React + Vite** — fast, modern frontend
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **Anthropic Claude API** (claude-sonnet-4-6) — AI reasoning engine
- **Vercel** — deployment

---

## 📝 Hackathon Submission

- **Track:** Undergraduate
- **Challenge:** Brief 4 — Fix Systems People Depend On
- **Direction:** A — Benefits Navigator
- **Countries:** Nigeria 🇳🇬 + Pakistan 🇵🇰
