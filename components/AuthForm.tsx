'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setMessage(null); setLoading(true)
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/chat` },
        })
        if (error) throw error
        setMessage('Compte créé. Vérifiez votre email pour confirmer, puis connectez-vous.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/chat'); router.refresh()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      if (msg.includes('Invalid login credentials')) setError('Email ou mot de passe incorrect.')
      else if (msg.includes('Email not confirmed')) setError('Confirmez votre email avant de vous connecter.')
      else if (msg.includes('User already registered')) setError('Un compte existe déjà avec cet email.')
      else setError(msg)
    } finally { setLoading(false) }
  }

  const isRegister = mode === 'register'

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#C9A84C]/20 rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-3xl font-bold text-[#1B4332] mb-2">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="text-sm text-[#1A1A1A]/60">{isRegister ? 'Accédez à votre conseiller juridique IA' : 'Bienvenue sur HaqiQ'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Adresse email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full text-sm px-4 py-3 border border-[#1A1A1A]/20 rounded focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] bg-[#F8F6F1] placeholder:text-[#1A1A1A]/30 transition-colors" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Mot de passe</label>
            <input id="password" type="password" required autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={6}
              className="w-full text-sm px-4 py-3 border border-[#1A1A1A]/20 rounded focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] bg-[#F8F6F1] placeholder:text-[#1A1A1A]/30 transition-colors" />
            {isRegister && <p className="text-xs text-[#1A1A1A]/40 mt-1">Minimum 6 caractères</p>}
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded px-4 py-3"><p className="text-sm text-red-700">{error}</p></div>}
          {message && <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded px-4 py-3"><p className="text-sm text-[#1B4332]">{message}</p></div>}
          <button type="submit" disabled={loading}
            className="w-full text-sm font-medium py-3 px-6 bg-[#1B4332] text-[#F8F6F1] rounded hover:bg-[#1B4332]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
            {loading ? 'Chargement…' : isRegister ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-[#1A1A1A]/10 text-center">
          <p className="text-sm text-[#1A1A1A]/60">
            {isRegister
              ? <><span>Déjà un compte ? </span><Link href="/login" className="text-[#C9A84C] hover:underline font-medium">Se connecter</Link></>
              : <><span>Pas encore de compte ? </span><Link href="/register" className="text-[#C9A84C] hover:underline font-medium">Créer un compte</Link></>}
          </p>
        </div>
      </div>
    </div>
  )
}
