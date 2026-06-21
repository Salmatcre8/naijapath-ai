import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Users, Briefcase, ChevronDown, CheckCircle2 } from 'lucide-react'

/* ── Live chat preview — the hero's signature element ──
   Amina's actual story from the pitch deck: 24, Lagos, recently
   unemployed, household of 3. Written the way someone would actually
   text it, not a generated script. */
const DEMO_SCRIPT = [
  { role: 'user', text: "I no get work again. I dey try find wetin go help me." },
  { role: 'ai', text: "Sorry about that. Which state you dey, and you don work before?" },
  { role: 'user', text: "Lagos. I don work before, I just finish SSCE." },
  { role: 'ai', text: "Checking N-Power, TraderMoni and 2 more against your profile…", isMatching: true },
]

function LiveChatPreview() {
  const [stepIndex, setStepIndex] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState([])
  const [showMatch, setShowMatch] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    let matchTimer, resetTimer
    function advance(i) {
      if (i >= DEMO_SCRIPT.length) {
        matchTimer = setTimeout(() => setShowMatch(true), 900)
        resetTimer = setTimeout(() => {
          setShowMatch(false)
          setVisibleSteps([])
          setStepIndex(0)
        }, 4200)
        return
      }
      const delay = i === 0 ? 500 : 1100
      timeoutRef.current = setTimeout(() => {
        setVisibleSteps(prev => [...prev, DEMO_SCRIPT[i]])
        setStepIndex(i + 1)
      }, delay)
    }
    advance(stepIndex)
    return () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(matchTimer)
      clearTimeout(resetTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  const isTyping = stepIndex > 0 && stepIndex < DEMO_SCRIPT.length

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
      <div className="glass-panel" style={{
        width: '100%',
        borderRadius: 22,
        overflow: 'hidden',
        transform: 'rotate(2deg)',
      }}>
        {/* Window chrome */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid var(--glass-border)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #1FBE8C, #0A6B3B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: 'white',
          }}>N</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--hero-text)' }}>NaijaPath · SMS</div>
          </div>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em',
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(31,190,140,0.15)', color: '#3FE0AC',
            border: '1px solid rgba(63,224,172,0.3)',
          }}>
            NO DATA STORED
          </span>
        </div>

        {/* Conversation */}
        <div style={{
          padding: '20px 18px',
          minHeight: 230,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          justifyContent: 'flex-end',
        }}>
          {visibleSteps.map((step, i) => {
            const isUser = step.role === 'user'
            return (
              <div key={i} style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13,
                lineHeight: 1.45,
                animation: 'fadeSlideUp 0.35s ease both',
                background: isUser
                  ? 'linear-gradient(135deg, #1FBE8C, #0A6B3B)'
                  : 'rgba(255,255,255,0.06)',
                color: isUser ? '#04130D' : 'var(--hero-text)',
                fontWeight: isUser ? 600 : 400,
                border: isUser ? 'none' : '1px solid var(--glass-border)',
              }}>
                {step.text}
              </div>
            )
          })}

          {isTyping && (
            <div style={{
              alignSelf: 'flex-start',
              display: 'flex', gap: 4, alignItems: 'center',
              padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="typing-dot" style={{
                  width: 5, height: 5, borderRadius: '50%', background: 'var(--hero-text-muted)',
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Fake input bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 16px',
          borderTop: '1px solid var(--glass-border)',
        }}>
          <div style={{
            flex: 1, height: 30, borderRadius: 999,
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
          }} />
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1FBE8C, #0A6B3B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowRight size={14} style={{ color: '#04130D' }} />
          </div>
        </div>
      </div>

      {/* Floating match card — breaks out of the frame, like a notification */}
      <div style={{
        position: 'absolute',
        bottom: -26,
        left: -22,
        width: 220,
        opacity: showMatch ? 1 : 0,
        transform: showMatch ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.96)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: 'none',
      }}>
        <div className="glass-panel-solid" style={{
          borderRadius: 16,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'rgba(31,190,140,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle2 size={17} style={{ color: '#3FE0AC' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--hero-text)' }}>91% match · N-Power</div>
            <div style={{ fontSize: 10, color: 'var(--hero-text-muted)' }}>Age ✓ · Unemployed ✓ · Lagos ✓</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const QUICK_STARTS = {
  nigeria: [
    { icon: '💼', label: 'I lost my job', message: "I recently lost my job and I'm looking for government support or training programs." },
    { icon: '🛒', label: 'I run a small trade', message: "I run a small trade or business and I need funding or support." },
    { icon: '🏥', label: 'I need healthcare', message: "I need help accessing affordable healthcare for myself or my family." },
    { icon: '👨‍👩‍👧', label: 'I have a family to feed', message: "I'm struggling to support my household and looking for welfare or food support." },
    { icon: '🎓', label: 'I just graduated', message: "I'm a recent graduate looking for government youth programs or opportunities." },
  ],
  pakistan: [
    { icon: '💚', label: 'I need financial help', message: "I'm from a low-income household looking for government financial support." },
    { icon: '🚀', label: 'I want to start a business', message: "I want to start a business and need funding or a government loan." },
    { icon: '🏥', label: 'I need healthcare', message: "I need free or subsidized healthcare coverage for my family." },
    { icon: '🌾', label: 'I need food support', message: "I'm struggling with food costs and need help accessing subsidized essentials." },
    { icon: '💻', label: "I'm a student", message: "I'm a university student looking for government programs and scholarships." },
  ]
}

export default function Landing({ t, language, onStart, isCaseworker, setIsCaseworker }) {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [visible, setVisible] = useState(false)
  const dir = language === 'ur' ? 'rtl' : 'ltr'

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const quickStarts = selectedCountry ? QUICK_STARTS[selectedCountry] : []

  return (
    <div dir={dir} style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Grain texture — replaces dot-grid pattern */}
        <div className="hero-grain" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: 0.4,
        }} />

        {/* Top-right glow */}
        <div className="hero-glow-a" style={{
          position: 'absolute', top: -120, right: -120,
          width: 500, height: 500, borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Bottom-left gold glow */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,23,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1160,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr minmax(280px, 400px)',
          gap: 56,
          alignItems: 'start',
        }}
        className="hero-grid"
        >

          {/* ── LEFT: copy + actions ── */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}>

            {/* Eyebrow — Sora gives it a distinct "data label" voice */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(var(--glass-blur))',
              marginBottom: 28,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--brand-mint)',
                boxShadow: '0 0 0 3px rgba(63,224,172,0.25)',
                display: 'inline-block',
              }} />
              <span style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: 11.5, fontWeight: 600, color: 'var(--brand-mint)', letterSpacing: '0.1em',
              }}>
                AI-POWERED · NIGERIA & PAKISTAN
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 'clamp(2.4rem, 4.6vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.06,
              marginBottom: 22,
              color: 'var(--hero-text)',
              letterSpacing: '-0.02em',
            }}>
              Find the government<br />
              support you deserve —<br />
              <span style={{ color: 'var(--brand-mint)' }}>in plain language.</span>
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
              color: 'var(--hero-text-muted)',
              lineHeight: 1.65,
              marginBottom: 36,
              maxWidth: 520,
            }}>
              Describe your situation. NaijaPath AI asks the right questions,
              reasons through real program criteria, and shows you exactly
              what you may qualify for — with confidence scores and next steps.
            </p>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
              {[
                { key: false, icon: <Users size={13} />, label: 'Helping myself' },
                { key: true, icon: <Briefcase size={13} />, label: 'Case worker (helping someone else)' },
              ].map(opt => (
                <button key={String(opt.key)}
                  onClick={() => setIsCaseworker(opt.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 999,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isCaseworker === opt.key ? 'var(--brand-mint)' : 'var(--glass-bg)',
                    color: isCaseworker === opt.key ? '#04130D' : 'var(--hero-text-muted)',
                    border: '1px solid var(--glass-border)',
                  }}>
                  {opt.icon}{opt.label}
                </button>
              ))}
            </div>

            {/* Country selector */}
            <p style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: 12, color: 'var(--hero-text-muted)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.03em',
            }}>
              Choose your country to get started:
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              {[
                { key: 'nigeria', flag: '🇳🇬', name: 'Nigeria', sub: 'N-Power · TraderMoni · NHIS · LSETF' },
                { key: 'pakistan', flag: '🇵🇰', name: 'Pakistan', sub: 'Ehsaas · BISP · Kamyab Jawan · Sehat' },
              ].map(c => {
                const sel = selectedCountry === c.key
                return (
                  <button key={c.key}
                    onClick={() => { setSelectedCountry(c.key); onStart(c.key) }}
                    className="glass-panel"
                    style={{
                      flex: '1 1 220px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 20px', borderRadius: 16, textAlign: 'left',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      background: sel ? 'var(--brand-mint)' : 'var(--glass-bg)',
                      border: sel ? '1.5px solid var(--brand-mint)' : '1px solid var(--glass-border)',
                      transform: sel ? 'translateY(-2px)' : 'none',
                    }}>
                    <span style={{ fontSize: 32 }}>{c.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: sel ? '#04130D' : 'var(--hero-text)', marginBottom: 3 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: sel ? 'rgba(4,19,13,0.65)' : 'var(--hero-text-muted)' }}>
                        {c.sub}
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: sel ? '#04130D' : 'var(--hero-text-muted)', flexShrink: 0 }} />
                  </button>
                )
              })}
            </div>

            {/* Trust pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['🔒 No sign-up', '💾 No data stored', '⚡ Free to use', '🌍 2 countries'].map(item => (
                <span key={item} style={{
                  fontSize: 11, color: 'var(--hero-text-muted)',
                  padding: '4px 12px', borderRadius: 999,
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}>{item}</span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: floating live chat preview ── */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(2deg)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 48,
          }}>
            <LiveChatPreview />
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          animation: 'bounce 2s infinite',
        }}>
          <ChevronDown size={18} style={{ color: 'var(--hero-text-muted)' }} />
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .dark .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: screen;
        }
        .hero-glow-a {
          background: radial-gradient(circle, rgba(10,107,59,0.15) 0%, transparent 70%);
        }
        .dark .hero-glow-a {
          background: radial-gradient(circle, rgba(63,224,172,0.14) 0%, transparent 70%);
        }
      `}</style>

      {/* ── STATS BAR ── */}
      <div style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        padding: '24px',
      }}>
        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, textAlign: 'center',
        }}>
          {[
            { n: '14+', l: 'Real programs encoded' },
            { n: '4', l: 'Languages supported' },
            { n: '0', l: 'Forms to fill out' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0A6B3B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 24px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 32, height: 2, background: '#0A6B3B' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#0A6B3B' }}>HOW IT WORKS</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 40, lineHeight: 1.2,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}>
          Three steps.<br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>No confusion.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {[
            { n: '01', icon: '💬', title: 'Describe', body: 'Tell us your situation in plain language. No forms, no jargon.' },
            { n: '02', icon: '🧠', title: 'AI Reasons', body: 'We match your situation against real program eligibility criteria.' },
            { n: '03', icon: '📋', title: 'Take Action', body: 'Get matched programs, required documents, and your next step.' },
          ].map(s => (
            <div key={s.n} style={{ background: 'var(--bg-card)', padding: '28px 24px' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#0A6B3B', marginBottom: 6 }}>{s.n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AMINA QUOTE ── */}
      <section style={{
        background: '#0A6B3B',
        padding: '72px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 32, marginBottom: 20 }}>👩🏾</div>
          <blockquote style={{
            fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
            fontWeight: 700, color: 'white',
            lineHeight: 1.35, marginBottom: 20,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}>
            "I lost my job. I didn't know<br />where to go for help."
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, marginBottom: 10 }}>
            30 seconds later, Amina had 4 matched programs,<br />her document checklist, and her next step.
          </p>
          <p style={{ color: '#D4A017', fontSize: 14, fontWeight: 700 }}>
            — That's what NaijaPath is built for.
          </p>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section style={{ padding: '80px 24px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 32, height: 2, background: '#D4A017' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#D4A017' }}>PROGRAMS COVERED</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 28,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}>
          Real programs. Real criteria.<br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Not a search engine.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10 }}>
          {[
            { e: '💼', n: 'N-Power', c: 'Employment', f: '🇳🇬' },
            { e: '🛒', n: 'TraderMoni', c: 'Business loan', f: '🇳🇬' },
            { e: '🏥', n: 'NHIS/BHCPF', c: 'Healthcare', f: '🇳🇬' },
            { e: '🚀', n: 'NYIF', c: 'Youth business', f: '🇳🇬' },
            { e: '🌊', n: 'LSETF', c: 'Lagos fund', f: '🇳🇬' },
            { e: '💚', n: 'Ehsaas Kafaalat', c: 'Cash support', f: '🇵🇰' },
            { e: '🏥', n: 'Sehat Sahulat', c: 'Free hospital', f: '🇵🇰' },
            { e: '🚀', n: 'Kamyab Jawan', c: 'Business loan', f: '🇵🇰' },
          ].map((p, i) => (
            <div key={i} style={{
              padding: '14px 14px',
              borderRadius: 12,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              transition: 'transform 0.15s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{p.e}</span>
                <span style={{ fontSize: 12 }}>{p.f}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.c}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
          + 6 more programs · All sourced from official government websites
        </p>
      </section>

      {/* ── RESPONSIBLE AI ── */}
      <section style={{ padding: '72px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 2, background: '#0A6B3B' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#0A6B3B' }}>RESPONSIBLE AI</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: 32,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}>
            Built for users who may act on what it says.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '🛡️', t: '"May qualify" only', b: 'We never say you qualify. Final decisions belong to the government agency — always.' },
              { icon: '👤', t: 'Human in control', b: 'NaijaPath navigates. It never approves. Acceptance decisions belong to real humans at the agency.' },
              { icon: '🔒', t: 'Zero data stored', b: 'No database. No account. No analytics. Your session clears when you close the tab.' },
            ].map((c, i) => (
              <div key={i} style={{
                padding: '24px 20px', borderRadius: 16,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{c.t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{c.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800,
            color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.15,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}>
            Ready to find your programs?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
            No sign-up. No forms. Just tell us your situation.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onStart('nigeria')}
              style={{
                padding: '14px 28px', borderRadius: 12, fontWeight: 700,
                fontSize: 15, cursor: 'pointer', transition: 'all 0.2s ease',
                background: '#0A6B3B', color: 'white', border: 'none',
                boxShadow: '0 4px 20px rgba(10,107,59,0.35)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              🇳🇬 Start for Nigeria
            </button>
            <button onClick={() => onStart('pakistan')}
              style={{
                padding: '14px 28px', borderRadius: 12, fontWeight: 700,
                fontSize: 15, cursor: 'pointer', transition: 'all 0.2s ease',
                background: 'var(--bg-hover)', color: 'var(--text-primary)',
                border: '1.5px solid var(--border)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              🇵🇰 Start for Pakistan
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Built for USAII Global AI Hackathon 2026 · Brief 4 · naijapath-ai.vercel.app
        </p>
      </footer>
    </div>
  )
}