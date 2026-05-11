'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/chat` },
        })
        if (error) throw error
        setMessage(
          'Compte créé. Vérifiez votre email pour confirmer votre inscription, puis connectez-vous.'
        )
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/chat')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(translateError(message))
    } finally {
      setLoading(false)
    }
  }

  function translateError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.'
    if (msg.includes('Email not confirmed')) return 'Veuillez confirmer votre email avant de vous connecter.'
    if (msg.includes('User already registered')) return 'Un compte existe déjà avec cet email.'
    if (msg.includes('Password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.'
    return msg
  }

  const isRegister = mode === 'register'

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-gold/20 rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-forest mb-2">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="font-ibm text-sm text-ink/60">
            {isRegister
              ? 'Accédez à votre conseiller juridique IA'
              : 'Bienvenue sur HaqiQ'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block font-ibm text-sm font-medium text-ink mb-1.5">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full font-ibm text-sm px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-cream placeholder:text-ink/30 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block font-ibm text-sm font-medium text-ink">
                Mot de passe
              </label>
              {!isRegister && (
                <Link href="/reset-password" className="font-ibm text-xs text-gold hover:underline">
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full font-ibm text-sm px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-cream placeholder:text-ink/30 transition-colors"
            />
            {isRegister && (
              <p className="font-ibm text-xs text-ink/40 mt-1">Minimum 6 caractères</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
              <p className="font-ibm text-sm text-red-700">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-forest/5 border border-forest/20 rounded px-4 py-3">
              <p className="font-ibm text-sm text-forest">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-ibm text-sm font-medium py-3 px-6 bg-forest text-cream rounded hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? 'Chargement…'
              : isRegister
              ? 'Créer mon compte'
              : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-ink/10 text-center">
          <p className="font-ibm text-sm text-ink/60">
            {isRegister ? (
              <>
                Déjà un compte ?{' '}
                <Link href="/login" className="text-gold hover:underline font-medium">
                  Se connecter
                </Link>
              </>
            ) : (
              <>
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-gold hover:underline font-medium">
                  Créer un compte
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
