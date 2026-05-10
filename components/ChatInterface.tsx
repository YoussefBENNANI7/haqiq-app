'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_TOPICS = [
  { label: 'Droit du travail', question: 'Quels sont mes droits en cas de licenciement abusif au Maroc ?' },
  { label: 'Moudawwana', question: 'Comment fonctionne la procédure de divorce au Maroc selon la Moudawwana ?' },
  { label: 'Bail & logement', question: 'Quels sont les droits et obligations du locataire selon le droit marocain ?' },
  { label: 'Code de la route', question: "Quelles sont les sanctions pour excès de vitesse selon le Code de la route marocain ?" },
]

export default function ChatInterface({ userEmail }: { userEmail: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsStreaming(true)

    const assistantMessage: Message = { role: 'assistant', content: '' }
    setMessages([...updatedMessages, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!response.ok) {
        throw new Error('Erreur de connexion')
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Une erreur est survenue. Veuillez réessayer.',
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  const username = userEmail.split('@')[0]

  return (
    <div className="flex-1 bg-white border border-gold/20 rounded-lg flex flex-col overflow-hidden min-h-[500px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚖️</span>
            </div>
            <h2 className="font-playfair text-xl font-bold text-forest mb-2">
              Bienvenue, {username}
            </h2>
            <p className="font-ibm text-sm text-ink/60 max-w-sm mb-8">
              Posez votre question en droit marocain. Je cite les articles de loi
              pertinents et explique vos droits clairement.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => sendMessage(topic.question)}
                  className="font-ibm text-xs text-left px-4 py-3 border border-gold/30 rounded-lg bg-cream/50 hover:bg-gold/10 hover:border-gold/60 text-ink/70 hover:text-ink transition-colors"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-forest rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-xs text-cream font-bold">
                    H
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-lg font-ibm text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-forest text-cream rounded-br-none'
                      : 'bg-cream border border-gold/20 text-ink rounded-bl-none'
                  }`}
                >
                  {msg.content}
                  {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && msg.content === '' && (
                    <span className="inline-flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-gold rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0 text-xs text-white font-bold uppercase">
                    {username[0]}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gold/20 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question juridique…"
            disabled={isStreaming}
            className="flex-1 font-ibm text-sm px-4 py-3 border border-ink/20 rounded bg-cream/50 placeholder:text-ink/30 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/30 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="font-ibm text-sm px-5 py-3 bg-forest text-cream rounded hover:bg-forest/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? '…' : 'Envoyer'}
          </button>
        </form>
        <p className="font-ibm text-xs text-ink/40 mt-2 text-center">
          HaqiQ fournit des informations générales — consultez un avocat pour votre situation.
        </p>
      </div>
    </div>
  )
}
