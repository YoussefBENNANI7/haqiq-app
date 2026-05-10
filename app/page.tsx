import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LegalDisclaimer from '@/components/LegalDisclaimer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const pillars = [
  { icon: '⚖️', title: 'Fiable', description: 'Réponses fondées sur les textes de loi officiels, codes et décrets du Royaume du Maroc.' },
  { icon: '📜', title: 'Sourcé', description: 'Chaque réponse cite les articles et références légales précises pour une totale transparence.' },
  { icon: '✓', title: 'Gratuit', description: 'Accès sans frais à une information juridique de qualité, pour tous les citoyens marocains.' },
]

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={!!user} />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full">
            <span className="text-xs font-medium text-[#C9A84C] tracking-wider uppercase">Droit marocain · IA certifiée</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-5xl md:text-6xl font-bold text-[#1B4332] leading-tight mb-6">
            Votre conseiller juridique marocain,{' '}
            <span className="text-[#C9A84C]">disponible 24h/24</span>
          </h1>
          <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Des réponses fondées sur les textes officiels du droit marocain — Code pénal, Code de la famille, Code du travail, et plus encore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="font-medium px-8 py-4 bg-[#1B4332] text-[#F8F6F1] rounded hover:bg-[#1B4332]/90 transition-colors">Poser ma question</Link>
            <Link href="/login" className="font-medium px-8 py-4 border-2 border-[#1B4332] text-[#1B4332] rounded hover:bg-[#1B4332] hover:text-[#F8F6F1] transition-colors">Se connecter</Link>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-6"><div className="border-t border-[#C9A84C]/20" /></div>
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 style={{ fontFamily: 'var(--font-playfair)' }} className="text-2xl font-bold text-[#1B4332] text-center mb-12">Pourquoi HaqiQ ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map(p => (
              <div key={p.title} className="bg-white border border-[#C9A84C]/20 rounded-lg p-8 text-center hover:border-[#C9A84C]/40 hover:shadow-sm transition-all">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-playfair)' }} className="text-xl font-bold text-[#1B4332] mb-3">{p.title}</h3>
                <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-[#1B4332] py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 style={{ fontFamily: 'var(--font-playfair)' }} className="text-3xl font-bold text-[#F8F6F1] mb-4">Prêt à obtenir une réponse juridique ?</h2>
            <p className="text-[#F8F6F1]/70 mb-8">Créez votre compte gratuitement et posez votre première question en moins d&apos;une minute.</p>
            <Link href="/register" className="font-medium px-8 py-4 bg-[#C9A84C] text-[#1A1A1A] rounded hover:bg-[#C9A84C]/90 transition-colors inline-block">Commencer gratuitement</Link>
          </div>
        </section>
      </main>
      <LegalDisclaimer />
    </div>
  )
}
