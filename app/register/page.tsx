import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AuthForm from '@/components/AuthForm'
import LegalDisclaimer from '@/components/LegalDisclaimer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata = { title: 'Créer un compte — HaqiQ' }

export default async function RegisterPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/chat')
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full"><AuthForm mode="register" /></div>
      </main>
      <LegalDisclaimer />
    </div>
  )
}
