'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-[#F8F6F1] border-b border-[#C9A84C]/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span style={{ fontFamily: 'var(--font-playfair)' }} className="text-2xl font-bold text-[#1B4332] tracking-tight">HaqiQ</span>
          <span className="text-[#C9A84C] text-2xl font-bold leading-none -ml-0.5">.</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/chat" className="text-sm text-[#1A1A1A] hover:text-[#1B4332] transition-colors">Ma conversation</Link>
              <button onClick={handleSignOut} className="text-sm px-4 py-2 border border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-[#F8F6F1] transition-colors rounded">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[#1A1A1A] hover:text-[#1B4332] transition-colors">Connexion</Link>
              <Link href="/register" className="text-sm px-4 py-2 bg-[#1B4332] text-[#F8F6F1] hover:bg-[#1B4332]/90 transition-colors rounded">Commencer</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
