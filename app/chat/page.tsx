import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LegalDisclaimer from '@/components/LegalDisclaimer'
import ChatInterface from '@/components/ChatInterface'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'Conversation — HaqiQ',
}

export default async function ChatPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-3xl font-bold text-forest">
            Votre conseiller juridique
          </h1>
          <p className="font-ibm text-sm text-ink/60 mt-1">
            Droit marocain — réponses sourcées et citées
          </p>
        </div>

        <ChatInterface userEmail={user.email!} />
      </main>

      <LegalDisclaimer />
    </div>
  )
}
