import { Sun, Moon, Globe, ChevronDown, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const LANGUAGES = {
  en:  { name: 'English', flag: '🇬🇧' },
  pcm: { name: 'Pidgin',  flag: '🇳🇬' },
  ur:  { name: 'اردو',    flag: '🇵🇰' },
  ha:  { name: 'Hausa',   flag: '🇳🇬' },
}

const COUNTRY_LANGS = {
  nigeria: ['en', 'pcm', 'ha'],
  pakistan: ['en', 'ur'],
}

export default function Navbar({ isDark, toggleDark, language, setLanguage, t, country, screen, onStartOver }) {
  const [langOpen, setLangOpen] = useState(false)

  const availableLangs = country ? COUNTRY_LANGS[country] : Object.keys(LANGUAGES)

  return (
    <nav
      className="sticky top-0 z-50 theme-transition"
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {screen !== 'landing' && (
            <button
              onClick={onStartOver}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-hover)] mr-1"
              aria-label="Go back"
            >
              <ArrowLeft size={18} style={{ color: 'var(--text-secondary)' }} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #0A6B3B, #0D8A4E)' }}
            >
              N
            </div>
            <div>
              <span className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
                NaijaPath
              </span>
              <span className="font-display font-300 text-base" style={{ color: 'var(--brand-green)' }}>
                {' '}AI
              </span>
            </div>
          </div>
          {country && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
            >
              {country === 'nigeria' ? '🇳🇬 Nigeria' : '🇵🇰 Pakistan'}
            </span>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: 'var(--bg-hover)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <Globe size={14} />
              <span className="hidden sm:inline">{LANGUAGES[language]?.flag} {LANGUAGES[language]?.name}</span>
              <span className="sm:hidden">{LANGUAGES[language]?.flag}</span>
              <ChevronDown size={12} />
            </button>

            {langOpen && (
              <div
                className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 min-w-[140px]"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {availableLangs.map(lang => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors"
                    style={{
                      background: language === lang ? 'var(--bg-hover)' : 'transparent',
                      color: language === lang ? 'var(--brand-green)' : 'var(--text-primary)',
                      fontWeight: language === lang ? 600 : 400,
                    }}
                  >
                    {LANGUAGES[lang].flag} {LANGUAGES[lang].name}
                    {language === lang && <span className="ml-auto text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun size={16} className="text-yellow-400" />
              : <Moon size={16} />
            }
          </button>
        </div>
      </div>

      {/* Click outside to close lang dropdown */}
      {langOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
      )}
    </nav>
  )
}
