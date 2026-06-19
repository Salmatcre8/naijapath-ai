import { useState } from 'react'
import { ArrowRight, Shield, Zap, Heart, Users, Briefcase, BookOpen } from 'lucide-react'

const SITUATION_TEMPLATES = {
  nigeria: [
    { icon: '💼', label: 'Looking for work or training', message: "I'm unemployed and looking for government training programs or job support." },
    { icon: '🛒', label: 'I run a small trade or business', message: "I run a small business/trade and I'm looking for loans or business support programs." },
    { icon: '🏥', label: 'Need affordable healthcare', message: "I need help accessing affordable healthcare for myself or my family." },
    { icon: '👨‍👩‍👧', label: 'Supporting my family', message: "I'm a parent or caregiver trying to find support programs for my household." },
    { icon: '🎓', label: 'Student or recent graduate', message: "I'm a student or recent graduate looking for government support or opportunities." },
  ],
  pakistan: [
    { icon: '💚', label: 'Looking for financial support', message: "I'm from a low-income household and looking for government financial assistance." },
    { icon: '🚀', label: 'Want to start a business', message: "I'm a young person who wants to start a business and need funding support." },
    { icon: '🏥', label: 'Need healthcare coverage', message: "I need help accessing free or subsidized healthcare for my family." },
    { icon: '🌾', label: 'Food and basic needs', message: "I'm struggling with food costs and need help accessing subsidized essentials." },
    { icon: '💻', label: 'Student seeking opportunities', message: "I'm a university student looking for government programs and scholarships." },
  ]
}

const STATS = [
  { value: '14+', label: 'Programs covered' },
  { value: '2', label: 'Countries' },
  { value: '0', label: 'Sign-ups needed' },
]

const PROGRAMS_PREVIEW = {
  nigeria: ['N-Power', 'TraderMoni', 'NHIS', 'NYIF', 'LSETF', 'NASSP'],
  pakistan: ['Ehsaas Kafaalat', 'BISP', 'Kamyab Jawan', 'Sehat Sahulat', 'Ehsaas Rashan'],
}

export default function Landing({ t, language, onStart, isCaseworker, setIsCaseworker }) {
  const [hoveredCountry, setHoveredCountry] = useState(null)

  const dir = language === 'ur' ? 'rtl' : 'ltr'

  return (
    <div dir={dir} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #0A6B3B, transparent)' }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #D4A017, transparent)' }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-slide"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI-Powered Benefits Navigator · Nigeria & Pakistan
          </div>

          {/* Headline */}
          <h1 className="font-display font-800 text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4 animate-fade-slide" style={{ animationDelay: '0.1s' }}>
            <span style={{ color: 'var(--text-primary)' }}>{t.hero_headline}</span>
            <br />
            <span className="gradient-text">{t.hero_headline2}</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-slide"
            style={{ color: 'var(--text-secondary)', animationDelay: '0.2s' }}
          >
            {t.hero_sub}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12 animate-fade-slide" style={{ animationDelay: '0.3s' }}>
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-800 text-3xl" style={{ color: 'var(--brand-green)' }}>{s.value}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Caseworker toggle */}
          <div className="flex items-center justify-center gap-3 mb-10 animate-fade-slide" style={{ animationDelay: '0.35s' }}>
            <button
              onClick={() => setIsCaseworker(false)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: !isCaseworker ? 'var(--brand-green)' : 'var(--bg-hover)',
                color: !isCaseworker ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <Users size={13} className="inline mr-1.5" />
              {t.help_someone}
            </button>
            <button
              onClick={() => setIsCaseworker(true)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: isCaseworker ? 'var(--brand-green)' : 'var(--bg-hover)',
                color: isCaseworker ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <Briefcase size={13} className="inline mr-1.5" />
              {t.help_caseworker}
            </button>
          </div>

          {/* Country Selection */}
          <div className="animate-fade-slide" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm font-medium mb-5" style={{ color: 'var(--text-muted)' }}>
              {t.country_select}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              {[
                { key: 'nigeria', emoji: '🇳🇬', name: 'Nigeria', tagline: 'N-Power, TraderMoni, NHIS & more' },
                { key: 'pakistan', emoji: '🇵🇰', name: 'Pakistan', tagline: 'Ehsaas, BISP, Kamyab Jawan & more' },
              ].map(c => (
                <button
                  key={c.key}
                  onClick={() => onStart(c.key)}
                  onMouseEnter={() => setHoveredCountry(c.key)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className="flex-1 group relative flex flex-col items-center gap-3 p-6 rounded-2xl font-medium transition-all duration-200 pulse-glow"
                  style={{
                    background: hoveredCountry === c.key ? 'var(--brand-green)' : 'var(--bg-card)',
                    border: `2px solid ${hoveredCountry === c.key ? 'var(--brand-green)' : 'var(--border)'}`,
                    color: hoveredCountry === c.key ? 'white' : 'var(--text-primary)',
                    boxShadow: hoveredCountry === c.key ? '0 8px 30px rgba(10,107,59,0.25)' : 'var(--shadow-sm)',
                    transform: hoveredCountry === c.key ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <span className="text-4xl">{c.emoji}</span>
                  <div>
                    <div className="text-lg font-700 mb-1">{c.name}</div>
                    <div className="text-xs opacity-70">{c.tagline}</div>
                  </div>
                  <ArrowRight size={18} className={`transition-transform ${hoveredCountry === c.key ? 'translate-x-1' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Situation templates */}
      <section className="py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
            Or choose a situation that describes you:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...SITUATION_TEMPLATES.nigeria.slice(0,3), ...SITUATION_TEMPLATES.pakistan.slice(0,2)].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-center cursor-pointer transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '💬', step: '01', title: 'Describe your situation', body: 'Tell NaijaPath about yourself in plain language. No forms, no jargon.' },
              { icon: '🧠', step: '02', title: 'AI reasons through programs', body: 'The AI compares your situation against real eligibility criteria across multiple programs.' },
              { icon: '📋', step: '03', title: 'Get your action plan', body: 'Receive clear matches, required documents, and next steps — ready to act on.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-xs font-700 tracking-widest mb-2" style={{ color: 'var(--brand-green)' }}>{s.step}</div>
                <h3 className="font-600 text-base mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible AI notice */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Shield size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--brand-green)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Responsible AI: </strong>
              NaijaPath helps you explore options. It does not guarantee approval. Final decisions rest with the relevant government agency. No personal data is stored.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Built for USAII Global AI Hackathon 2026 · NaijaPath AI · Free to use · No data stored
        </p>
      </footer>
    </div>
  )
}
