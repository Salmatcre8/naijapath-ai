import { useState, useRef } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Download, Share2, RotateCcw, Shield, CheckCircle, XCircle, HelpCircle, FileText, Phone, Clock, AlertTriangle } from 'lucide-react'

const CATEGORY_FILTERS = ['all', 'employment', 'business', 'health', 'welfare', 'education', 'nutrition', 'business_employment']

const CATEGORY_LABELS = {
  all: 'All Programs',
  employment: '💼 Employment',
  business: '🚀 Business',
  health: '🏥 Health',
  welfare: '🤲 Welfare',
  education: '🎓 Education',
  nutrition: '🍲 Nutrition',
  business_employment: '💼 Business & Jobs',
}

const DIFFICULTY_COLOR = {
  Easy: { bg: 'rgba(16,185,129,0.1)', text: '#059669', label: '✓ Easy to apply' },
  Medium: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', label: '~ Moderate process' },
  Hard: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', label: '! Detailed process' },
}

function ConfidenceBadge({ score }) {
  const isHigh = score >= 75
  const isMed = score >= 50 && score < 75
  const color = isHigh ? '#059669' : isMed ? '#d97706' : '#94a3b8'
  const bg = isHigh ? 'rgba(16,185,129,0.12)' : isMed ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.12)'

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="3.5" />
          <circle
            cx="20" cy="20" r="16" fill="none"
            stroke={color} strokeWidth="3.5"
            strokeDasharray={`${(score / 100) * 100.5} 100.5`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-700" style={{ color }}>
          {score}
        </span>
      </div>
      <div>
        <div className="text-xs font-600" style={{ color }}>
          {score >= 75 ? 'Strong Match' : score >= 50 ? 'Possible Match' : 'Worth Exploring'}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Match likelihood</div>
      </div>
    </div>
  )
}

function ProgramCard({ result, index, t }) {
  const [expanded, setExpanded] = useState(index === 0)
  const { program, confidenceScore, matchedCriteria, unmatchedCriteria, unverifiedCriteria, recommendedNextStep, urgencyFlag } = result

  if (!program) return null

  const diff = DIFFICULTY_COLOR[program.difficulty] || DIFFICULTY_COLOR.Medium

  return (
    <div
      className="program-card rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        borderLeft: `4px solid ${confidenceScore >= 75 ? '#059669' : confidenceScore >= 50 ? '#d97706' : '#94a3b8'}`,
      }}
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-3xl shrink-0">{program.emoji}</span>
            <div className="min-w-0">
              <h3 className="font-display font-700 text-base leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                {program.name}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{program.agency}</p>
              {urgencyFlag && (
                <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full font-600"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
                  <AlertTriangle size={10} /> Act soon
                </span>
              )}
            </div>
          </div>
          <ConfidenceBadge score={confidenceScore} />
        </div>

        {/* Benefit */}
        <div className="mt-3 px-3 py-2 rounded-lg text-sm font-600"
          style={{ background: 'rgba(10,107,59,0.08)', color: 'var(--brand-green)' }}>
          🎯 {program.benefit}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: diff.bg, color: diff.text }}>
            {diff.label}
          </span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
            <Clock size={10} className="inline mr-1" />{program.processingTime}
          </span>
          {program.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full capitalize"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable section */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors"
        style={{
          borderTop: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-hover)',
        }}
      >
        <span>See full details</span>
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {expanded && (
        <div className="p-5 space-y-5 animate-fade-slide" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {program.description}
          </p>

          {/* Match criteria */}
          <div>
            <h4 className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              {t.why_match}
            </h4>
            <div className="space-y-2">
              {matchedCriteria?.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#059669' }} />
                  <span style={{ color: 'var(--text-primary)' }}>{c}</span>
                </div>
              ))}
              {unverifiedCriteria?.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <HelpCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{c}</span>
                </div>
              ))}
              {unmatchedCriteria?.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <XCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{c}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span><CheckCircle size={10} className="inline mr-1 text-green-500" />Matched</span>
              <span><HelpCircle size={10} className="inline mr-1 text-yellow-500" />Unverified</span>
              <span><XCircle size={10} className="inline mr-1 text-red-500" />Not met</span>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              <FileText size={11} className="inline mr-1" />{t.documents}
            </h4>
            <div className="space-y-1.5">
              {program.requiredDocuments?.map((doc, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-700"
                    style={{ background: 'var(--bg-hover)', color: 'var(--brand-green)' }}>
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next step */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(10,107,59,0.06)', border: '1px solid rgba(10,107,59,0.15)' }}>
            <h4 className="text-xs font-700 uppercase tracking-wider mb-2" style={{ color: 'var(--brand-green)' }}>
              {t.next_step}
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{recommendedNextStep}</p>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Phone size={11} />
            <span>{program.contactInfo}</span>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <a
              href={program.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-600 text-sm transition-all"
              style={{ background: 'var(--brand-green)', color: 'white' }}
            >
              {t.apply_now} <ExternalLink size={13} />
            </a>
            <a
              href={program.officialSource}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-500 text-xs transition-all"
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Shield size={12} /> {t.official_source}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultsDashboard({ t, language, country, userProfile, eligibilityResults, onStartOver }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showHumanLoop, setShowHumanLoop] = useState(false)
  const resultsRef = useRef(null)

  const dir = language === 'ur' ? 'rtl' : 'ltr'

  const results = eligibilityResults?.results || []
  const sortedResults = [...results].sort((a, b) => b.confidenceScore - a.confidenceScore)

  const highMatches = sortedResults.filter(r => r.confidenceScore >= 75)
  const midMatches = sortedResults.filter(r => r.confidenceScore >= 50 && r.confidenceScore < 75)
  const lowMatches = sortedResults.filter(r => r.confidenceScore < 50)

  const filtered = activeFilter === 'all'
    ? sortedResults
    : sortedResults.filter(r => r.program?.category === activeFilter)

  const handleWhatsApp = () => {
    const topPrograms = highMatches.slice(0, 2).map(r => r.program?.name).join(' and ')
    const text = encodeURIComponent(
      `I used NaijaPath AI to find government support programs. I may qualify for: ${topPrograms || 'several programs'}. Check it out: https://naijapath-ai.vercel.app`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleDownload = () => {
    const content = sortedResults.map(r => `
PROGRAM: ${r.program?.name}
MATCH: ${r.confidenceScore}%
BENEFIT: ${r.program?.benefit}
WHY YOU MAY QUALIFY:
${r.matchedCriteria?.map(c => `  • ${c}`).join('\n')}
NEXT STEP: ${r.recommendedNextStep}
APPLY AT: ${r.program?.applyUrl}
DOCUMENTS NEEDED:
${r.program?.requiredDocuments?.map(d => `  - ${d}`).join('\n')}
${'─'.repeat(50)}
`).join('\n')

    const blob = new Blob([
      `NAIJAPATH AI — YOUR SUPPORT PROGRAM ACTION PLAN\n`,
      `Generated: ${new Date().toLocaleDateString()}\n`,
      `Country: ${country?.toUpperCase()}\n\n`,
      eligibilityResults?.overallSummary || '',
      '\n\n',
      content,
      '\n\nDISCLAIMER: These are possibilities, not guarantees. Verify all information at official sources before applying.\n',
      'This plan was generated by NaijaPath AI — naijapath-ai.vercel.app\n'
    ], { type: 'text/plain' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'NaijaPath-Action-Plan.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const categories = ['all', ...new Set(results.map(r => r.program?.category).filter(Boolean))]

  return (
    <div dir={dir} className="min-h-[calc(100vh-64px)]" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Summary */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <h1 className="font-display font-700 text-xl" style={{ color: 'var(--text-primary)' }}>
                {t.results_title}
              </h1>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {eligibilityResults?.overallSummary}
            </p>
          </div>

          {/* Match summary chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {highMatches.length > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full font-600"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                ✓ {highMatches.length} Strong {highMatches.length === 1 ? 'Match' : 'Matches'}
              </span>
            )}
            {midMatches.length > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full font-600"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
                ~ {midMatches.length} Possible {midMatches.length === 1 ? 'Match' : 'Matches'}
              </span>
            )}
            {lowMatches.length > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full font-600"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                {lowMatches.length} Worth Exploring
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 transition-all"
              style={{ background: 'var(--brand-green)', color: 'white' }}>
              <Download size={14} /> {t.download_plan}
            </button>
            <button onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 transition-all"
              style={{ background: '#25D366', color: 'white' }}>
              <Share2 size={14} /> {t.share_whatsapp}
            </button>
            <button onClick={onStartOver}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-500 transition-all"
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}>
              <RotateCcw size={14} /> {t.start_over}
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="max-w-3xl mx-auto px-4 pb-0">
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="shrink-0 px-3 py-2 text-xs font-600 rounded-t-lg transition-all"
                style={{
                  background: activeFilter === cat ? 'var(--bg-secondary)' : 'transparent',
                  color: activeFilter === cat ? 'var(--brand-green)' : 'var(--text-muted)',
                  borderBottom: activeFilter === cat ? '2px solid var(--brand-green)' : '2px solid transparent',
                }}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4" ref={resultsRef}>
        {filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <p className="text-4xl mb-3">🔍</p>
            <p>{t.no_results}</p>
          </div>
        ) : (
          filtered.map((result, i) => (
            <ProgramCard key={result.programId} result={result} index={i} t={t} />
          ))
        )}

        {/* Human in the loop section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setShowHumanLoop(!showHumanLoop)}
            className="w-full flex items-center gap-3 p-4 text-left"
          >
            <Shield size={18} style={{ color: 'var(--brand-green)', shrink: 0 }} />
            <div className="flex-1">
              <div className="font-600 text-sm" style={{ color: 'var(--text-primary)' }}>{t.human_loop_title}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Responsible AI design</div>
            </div>
            {showHumanLoop ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {showHumanLoop && (
            <div className="px-4 pb-4 pt-0 text-sm leading-relaxed animate-fade-slide"
              style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
              <div className="pt-4">{t.human_loop_body}</div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl text-xs leading-relaxed"
          style={{
            background: 'rgba(212,160,23,0.06)',
            border: '1px solid rgba(212,160,23,0.2)',
            color: 'var(--text-secondary)',
          }}>
          ⚠️ {eligibilityResults?.disclaimer}
        </div>
      </div>
    </div>
  )
}
