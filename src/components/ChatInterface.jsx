import { useState, useRef, useEffect } from 'react'
import { Send, Shield, User, Bot } from 'lucide-react'
import { runIntakeConversation } from '../lib/claude';

const QUICK_REPLIES = {
  nigeria: [
    "I'm unemployed and looking for support",
    "I run a small business",
    "I need healthcare help",
    "I'm a student",
    "I want to start a business",
  ],
  pakistan: [
    "I need financial support",
    "I want to start a business",
    "I need healthcare coverage",
    "I'm a student",
    "I need food assistance",
  ]
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-slide">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #0A6B3B, #0D8A4E)' }}>
        <Bot size={14} className="text-white" />
      </div>
      <div className="chat-bubble-ai px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center h-5">
          <div className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
          <div className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
          <div className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isAI = message.role === 'assistant'
  return (
    <div className={`flex items-end gap-2 animate-fade-slide ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isAI
            ? 'linear-gradient(135deg, #0A6B3B, #0D8A4E)'
            : 'var(--bg-hover)',
          border: isAI ? 'none' : '1px solid var(--border)',
        }}
      >
        {isAI
          ? <Bot size={14} className="text-white" />
          : <User size={14} style={{ color: 'var(--text-secondary)' }} />
        }
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isAI ? 'chat-bubble-ai rounded-bl-sm' : 'chat-bubble-user rounded-br-sm'
        }`}
        style={{ color: isAI ? 'var(--text-primary)' : 'white' }}
      >
        {message.content}
      </div>
    </div>
  )
}

export default function ChatInterface({ t, language, country, isCaseworker, onProfileComplete }) {
  const [messages, setMessages] = useState([])
  const [conversationHistory, setConversationHistory] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [factsCollected, setFactsCollected] = useState(0)
  const [error, setError] = useState(null)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const dir = language === 'ur' ? 'rtl' : 'ltr'

  // Send opening message on mount
  useEffect(() => {
    startConversation()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const startConversation = async () => {
    setIsLoading(true)
    try {
      const openingMessage = isCaseworker
        ? `Hello! I'm NaijaPath AI. I see you're helping someone else find support programs — that's wonderful. Please describe their situation, and I'll guide you through finding the right programs for them.`
        : t.chat_welcome

      // Get first message from Claude
      const result = await runIntakeConversation(
        [{ role: 'user', content: openingMessage }],
        country,
        language
      )

      // Actually, just show welcome directly to save an API call on start
      const welcomeMsg = { role: 'assistant', content: t.chat_welcome, id: Date.now() }
      setMessages([welcomeMsg])
      setStarted(true)
    } catch (e) {
      const welcomeMsg = { role: 'assistant', content: t.chat_welcome, id: Date.now() }
      setMessages([welcomeMsg])
      setStarted(true)
    }
    setIsLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return
    setError(null)

    const userMsg = { role: 'user', content: text.trim(), id: Date.now() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Build conversation history for Claude (only role + content)
    const history = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const result = await runIntakeConversation(history, country, language)

      if (result.type === 'profile_complete') {
        // Show any final message before transitioning
        if (result.message) {
          const aiMsg = {
            role: 'assistant',
            content: result.message || "Perfect! I have everything I need. Let me analyze your situation now...",
            id: Date.now() + 1
          }
          setMessages(prev => [...prev, aiMsg])
        } else {
          const aiMsg = {
            role: 'assistant',
            content: "Perfect! I have enough information now. Give me a moment to analyze which programs you may qualify for...",
            id: Date.now() + 1
          }
          setMessages(prev => [...prev, aiMsg])
        }
        setFactsCollected(10)
        setTimeout(() => onProfileComplete(result.profile), 1500)
      } else {
        const aiMsg = { role: 'assistant', content: result.message, id: Date.now() + 1 }
        setMessages(prev => [...prev, aiMsg])
        // Estimate facts collected based on conversation length
        setFactsCollected(Math.min(Math.floor(newMessages.length / 2) + 1, 9))
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    }

    setIsLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleQuickReply = (text) => {
    if (!isLoading) {
      setInput(text)
      sendMessage(text)
    }
  }

  const progressPct = Math.round((factsCollected / 10) * 100)
  const quickReplies = QUICK_REPLIES[country] || QUICK_REPLIES.nigeria
  const showQuickReplies = messages.length <= 2 && !isLoading

  return (
    <div dir={dir} className="flex flex-col h-[calc(100vh-64px)]">
      {/* Responsible AI Banner */}
      <div
        className="px-4 py-2.5 flex items-center gap-2 text-xs shrink-0"
        style={{
          background: 'rgba(10,107,59,0.06)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Shield size={13} style={{ color: 'var(--brand-green)', shrink: 0 }} />
        <span style={{ color: 'var(--text-secondary)' }}>{t.responsible_notice}</span>
      </div>

      {/* Progress bar */}
      <div
        className="px-4 py-3 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <span className="text-xs font-medium shrink-0" style={{ color: 'var(--text-muted)' }}>
          {t.profile_progress}
        </span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #0A6B3B, #0D8A4E)',
            }}
          />
        </div>
        <span className="text-xs font-600 shrink-0" style={{ color: 'var(--brand-green)' }}>
          {progressPct}%
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="animate-fade-slide pt-2">
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Or pick a quick start:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className="quick-chip text-xs px-3 py-1.5 rounded-full cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="animate-fade-slide p-3 rounded-xl text-sm"
              style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
              ⚠️ {error}
              <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="shrink-0 px-4 py-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}
      >
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder={t.chat_placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            dir={dir}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0"
            style={{
              background: input.trim() && !isLoading ? 'var(--brand-green)' : 'var(--bg-hover)',
              color: input.trim() && !isLoading ? 'white' : 'var(--text-muted)',
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          Powered by Claude AI · No personal data stored
        </p>
      </div>
    </div>
  )
}
