'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError('Erreur lors de l\'envoi. Vérifiez votre adresse email.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-ink/10 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="font-playfair text-2xl font-bold text-forest">HaqiQ.</Link>
          <h1 className="font-playfair text-xl font-bold text-ink mt-4 mb-1">Mot de passe oublié</h1>
          <p className="font-ibm text-sm text-ink/60">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <p className="font-ibm text-sm text-ink/70 mb-6">
              Un email a été envoyé à <strong>{email}</strong>. Cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
            <Link href="/login" className="font-ibm text-sm text-forest hover:underline">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-ibm text-sm font-medium text-ink/80 block mb-1.5">
                Adresse email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="vous@exemple.com"
                className="w-full font-ibm text-sm px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-cream/50 placeholder:text-ink/30 transition-colors" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
                <p className="font-ibm text-sm text-red-700">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full font-ibm text-sm font-medium py-3 px-6 bg-forest text-cream rounded hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {loading ? 'Envoi…' : 'Envoyer le lien'}
            </button>
            <div className="text-center">
              <Link href="/login" className="font-ibm text-sm text-ink/60 hover:text-ink transition-colors">
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
