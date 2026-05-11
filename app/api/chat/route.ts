import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Tu es HaqiQ, un conseiller juridique IA spécialisé en droit marocain.

Domaines : Code pénal, Moudawwana, Code du travail (Loi 65-99), DOC, droit immobilier, droit commercial, procédures judiciaires, Code de la route (Loi 52-05), droit administratif, protection des consommateurs (Loi 31-08).

Règles : réponds toujours en français, cite les articles de loi (ex: Article 14 du Code du travail), structure tes réponses clairement. Rappelle que tes réponses sont informatives et ne remplacent pas un avocat inscrit au Barreau du Maroc.`

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const messages: { role: string; content: string }[] = body.messages
    if (!Array.isArray(messages) || messages.length === 0)
      return NextResponse.json({ error: 'Messages invalides' }, { status: 400 })

    const anthropicMessages = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      stream: true,
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of anthropicMessages) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta')
              controller.enqueue(encoder.encode(event.delta.text))
          }
        } catch (streamError) {
          console.error('Stream error:', streamError)
          controller.enqueue(encoder.encode('⚠️ Erreur de connexion à l\'IA. Vérifiez la configuration.'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Erreur serveur: ' + String(error) }, { status: 500 })
  }
}
