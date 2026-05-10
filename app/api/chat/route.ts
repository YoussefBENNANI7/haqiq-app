import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Tu es HaqiQ, un conseiller juridique IA spécialisé en droit marocain. Tu aides les citoyens marocains à comprendre leurs droits et obligations légales en fournissant des informations claires, précises et sourcées.

Domaines de compétence :
- Code pénal marocain (Loi n° 43-22)
- Code de la famille — Moudawwana (2004)
- Code du travail (Loi n° 65-99)
- Code des obligations et contrats (DOC)
- Droit immobilier et foncier (conservation foncière, bail, copropriété)
- Droit commercial (sociétés, fonds de commerce)
- Procédures judiciaires marocaines
- Code de la route (Loi n° 52-05)
- Droit administratif et protection des consommateurs (Loi n° 31-08)

Directives :
1. Réponds TOUJOURS en français, avec un langage clair et accessible
2. Cite les articles de loi pertinents quand possible
3. Structure ta réponse avec des paragraphes clairs
4. Pour les situations complexes, explique les étapes de la procédure à suivre
5. Si la question dépasse le droit marocain, dis-le clairement

Avertissement : Tes réponses sont des informations juridiques générales et ne constituent pas des conseils juridiques personnalisés. Pour toute affaire complexe, recommande de consulter un avocat inscrit au Barreau du Maroc.`

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const messages: { role: string; content: string }[] = body.messages

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages invalides' }, { status: 400 })
    }

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
