import { useState } from 'react'
import { useDarkMode } from './hooks/useDarkMode'
import { translations } from './locales/translations'
import Landing from './components/Landing'
import ChatInterface from './components/ChatInterface'
import AnalyzingScreen from './components/AnalyzingScreen'
import ResultsDashboard from './components/ResultsDashboard'
import Navbar from './components/Navbar'

export default function App() {
  const { isDark, toggle } = useDarkMode()
  const [screen, setScreen] = useState('landing') // landing | chat | analyzing | results
  const [country, setCountry] = useState(null)    // 'nigeria' | 'pakistan'
  const [language, setLanguage] = useState('en')  // en | pcm | ur | ha
  const [userProfile, setUserProfile] = useState(null)
  const [eligibilityResults, setEligibilityResults] = useState(null)
  const [isCaseworker, setIsCaseworker] = useState(false)

  const t = translations[language] || translations.en

  const handleStart = (selectedCountry) => {
    setCountry(selectedCountry)
    // Auto-set language defaults
    if (selectedCountry === 'pakistan' && language === 'pcm') setLanguage('en')
    setScreen('chat')
  }

  const handleProfileComplete = (profile) => {
    setUserProfile(profile)
    setScreen('analyzing')
  }

  const handleResultsReady = (results) => {
    setEligibilityResults(results)
    setScreen('results')
  }

  const handleStartOver = () => {
    setScreen('landing')
    setCountry(null)
    setUserProfile(null)
    setEligibilityResults(null)
    setLanguage('en')
    setIsCaseworker(false)
  }

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar
        isDark={isDark}
        toggleDark={toggle}
        language={language}
        setLanguage={setLanguage}
        t={t}
        country={country}
        screen={screen}
        onStartOver={handleStartOver}
      />

      {screen === 'landing' && (
        <Landing
          t={t}
          language={language}
          onStart={handleStart}
          isCaseworker={isCaseworker}
          setIsCaseworker={setIsCaseworker}
        />
      )}

      {screen === 'chat' && (
        <ChatInterface
          t={t}
          language={language}
          country={country}
          isCaseworker={isCaseworker}
          onProfileComplete={handleProfileComplete}
        />
      )}

      {screen === 'analyzing' && (
        <AnalyzingScreen
          t={t}
          country={country}
          userProfile={userProfile}
          onResultsReady={handleResultsReady}
        />
      )}

      {screen === 'results' && (
        <ResultsDashboard
          t={t}
          language={language}
          country={country}
          userProfile={userProfile}
          eligibilityResults={eligibilityResults}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  )
}
