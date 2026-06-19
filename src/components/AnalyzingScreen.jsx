import { useEffect, useState } from 'react'
import { runEligibilityCheck } from '../lib/claude'
import nigeriaPrograms from '../data/nigeria-programs.json'
import pakistanPrograms from '../data/pakistan-programs.json'

const STEPS = [
  { label: 'Reading your profile...', duration: 800 },
  { label: 'Loading program database...', duration: 700 },
  { label: 'Comparing eligibility criteria...', duration: 1200 },
  { label: 'Calculating match scores...', duration: 900 },
  { label: 'Preparing your results...', duration: 600 },
]

export default function AnalyzingScreen({ t, country, userProfile, onResultsReady }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState(null)
  const [dots, setDots] = useState('')

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  // Step through loading messages
  useEffect(() => {
    let i = 0
    const advance = () => {
      if (i < STEPS.length - 1) {
        i++
        setStepIndex(i)
        setTimeout(advance, STEPS[i].duration)
      }
    }
    setTimeout(advance, STEPS[0].duration)
  }, [])

  // Run eligibility check
  useEffect(() => {
    const programs = country === 'pakistan' ? pakistanPrograms : nigeriaPrograms

    runEligibilityCheck(userProfile, programs)
      .then(results => {
        // Merge results with full program data
        const enriched = {
          ...results,
          results: results.results.map(r => ({
            ...r,
            program: programs.find(p => p.id === r.programId) || null
          })).filter(r => r.program !== null)
        }
        setTimeout(() => onResultsReady(enriched), 800)
      })
      .catch(err => {
        setError(err.message || 'Something went wrong. Please try again.')
      })
  }, [])

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'var(--brand-green)' }}
          />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #0A6B3B, #0D8A4E)' }}
          >
            🔍
          </div>
        </div>

        <h2 className="font-display font-700 text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
          {t.analyzing}
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t.checking}
        </p>

        {/* Progress bar */}
        <div
          className="h-2 rounded-full overflow-hidden mb-4 mx-auto max-w-xs"
          style={{ background: 'var(--border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #0A6B3B, #D4A017)',
            }}
          />
        </div>

        {/* Current step */}
        <p className="text-sm font-medium" style={{ color: 'var(--brand-green)' }}>
          {STEPS[stepIndex]?.label}{dots}
        </p>

        {/* Programs count */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[
            { label: 'Programs', value: country === 'pakistan' ? '6' : '8' },
            { label: 'Criteria', value: '40+' },
            { label: 'Checked', value: `${Math.round(progress)}%` },
          ].map(s => (
            <div key={s.label}
              className="p-3 rounded-xl text-center"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="font-700 text-lg" style={{ color: 'var(--brand-green)' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
            ⚠️ {error}
            <br />
            <button
              className="mt-2 underline"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
