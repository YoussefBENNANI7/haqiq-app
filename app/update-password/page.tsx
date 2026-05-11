'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setDone(false)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 6) { setError('Minimum 6 caractères.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Erreur lors de la mise à jour. Réessayez.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/chat'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-ink/10 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="font-playfair text-2xl font-bold text-forest">HaqiQ.</Link>
          <h1 className="font-playfair text-xl font-bold text-ink mt-4 mb-1">Nouveau mot de passe</h1>
          <p className="font-ibm text-sm text-ink/60">Choisissez un nouveau mot de passe sécurisé</p>
        </div>

        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <p className="font-ibm text-sm text-ink/70">Mot de passe mis à jour. Redirection…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-ibm text-sm font-medium text-ink/80 block mb-1.5">Nouveau mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={6} placeholder="••••••••"
                className="w-full font-ibm text-sm px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-cream/50 placeholder:text-ink/30 transition-colors" />
            </div>
            <div>
              <label className="font-ibm text-sm font-medium text-ink/80 block mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required minLength={6} placeholder="••••••••"
                className="w-full font-ibm text-sm px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-cream/50 placeholder:text-ink/30 transition-colors" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
                <p className="font-ibm text-sm text-red-700">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full font-ibm text-sm font-medium py-3 px-6 bg-forest text-cream rounded hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {loading ? 'Mise à jour…' : 'Mettre à jour'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
