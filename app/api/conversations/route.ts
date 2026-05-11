import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data } = await supabase
      .from('conversations')
      .select('id, messages')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({ messages: data?.messages ?? [], id: data?.id ?? null })
  } catch {
    return NextResponse.json({ messages: [], id: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { messages, id } = await request.json()

    if (id) {
      await supabase
        .from('conversations')
        .update({ messages, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
    } else {
      const firstUserMsg = messages.find((m: { role: string }) => m.role === 'user')
      const title = firstUserMsg?.content?.slice(0, 60) ?? 'Conversation'
      await supabase
        .from('conversations')
        .insert({ user_id: user.id, messages, title })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
