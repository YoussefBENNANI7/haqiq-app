export default function LegalDisclaimer() {
  return (
    <div className="bg-[#1B4332]/5 border-t border-[#C9A84C]/20 py-8 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
          <strong className="text-[#1A1A1A]/80">Avis de non-responsabilité légale :</strong>{' '}
          HaqiQ est un outil d&apos;information juridique et ne constitue pas un conseil juridique professionnel.
          Les réponses sont fondées sur les textes officiels du droit marocain et fournies à titre informatif uniquement.
          Pour toute situation spécifique, consultez un avocat inscrit au Barreau du Maroc.
        </p>
        <p className="text-xs text-[#1A1A1A]/40 mt-3">© {new Date().getFullYear()} HaqiQ · Tous droits réservés</p>
      </div>
    </div>
  )
}
