import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LegalDisclaimer from '@/components/LegalDisclaimer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata = { title: 'Conversation — HaqiQ' }

export default async function ChatPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated />
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-3xl font-bold text-[#1B4332]">Votre conseiller juridique</h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-1">Posez votre question en droit marocain — le chatbot IA arrive bientôt.</p>
        </div>
        <div className="flex-1 bg-white border border-[#C9A84C]/20 rounded-lg flex flex-col overflow-hidden min-h-[500px]">
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <div className="w-16 h-16 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair)' }} className="text-xl font-bold text-[#1B4332] mb-2">
                Bienvenue, {user.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-[#1A1A1A]/60 max-w-sm">
                L&apos;interface de conversation sera disponible prochainement. Votre compte est actif et sécurisé.
              </p>
            </div>
          </div>
          <div className="border-t border-[#C9A84C]/20 p-4">
            <div className="flex gap-3">
              <input type="text" placeholder="Posez votre question juridique…" disabled
                className="flex-1 text-sm px-4 py-3 border border-[#1A1A1A]/20 rounded bg-[#F8F6F1]/50 placeholder:text-[#1A1A1A]/30 cursor-not-allowed" />
              <button disabled className="text-sm px-5 py-3 bg-[#1B4332] text-[#F8F6F1] rounded opacity-50 cursor-not-allowed">Envoyer</button>
            </div>
          </div>
        </div>
      </main>
      <LegalDisclaimer />
    </div>
  )
}
