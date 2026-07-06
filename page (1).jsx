import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CharacterTabs from '@/app/components/CharacterTabs'

async function getPersonagem(id) {
  const { data, error } = await supabase
    .from('personagens')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function PersonagemPage({ params }) {
  const personagem = await getPersonagem(params.id)

  if (!personagem) return notFound()

  const statusCor =
    personagem.status === 'vivo'
      ? 'bg-green-600'
      : personagem.status === 'morto'
      ? 'bg-red-600'
      : 'bg-gray-600'

  return (
    <main className="min-h-screen bg-[#0b1410] text-white px-4 py-8 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm mb-8 hover:bg-white/5"
        >
          ← Voltar ao Painel
        </Link>

        {/* Card principal */}
        <div className="rounded-3xl bg-gradient-to-b from-green-800 to-green-950 p-8 text-center relative overflow-hidden">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-black/30 mb-4 bg-black/40">
            {personagem.avatar_url ? (
              <img
                src={personagem.avatar_url}
                alt={personagem.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🍥
              </div>
            )}
          </div>

          <h1 className="font-display text-4xl tracking-wide">
            {personagem.nome}
          </h1>
          {personagem.titulo && (
            <p className="italic text-white/80 mt-1">"{personagem.titulo}"</p>
          )}

          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {personagem.patente && (
              <Badge texto={personagem.patente} destaque />
            )}
            {personagem.vila && <Badge texto={personagem.vila} />}
            {personagem.status && (
              <Badge texto={personagem.status} cor={statusCor} />
            )}
          </div>

          {personagem.tipo && (
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600/90 text-sm font-semibold uppercase tracking-wide">
                ✊ {personagem.tipo}
              </span>
            </div>
          )}

          <div className="flex justify-center flex-wrap gap-2 mt-6">
            <MiniLink texto="Ficha" ok />
            <MiniLink texto="Banco" ok />
            <MiniLink texto="Avaliação" ok />
            <MiniLink texto="GF" ok />
            <MiniLink texto="MOD" ok />
            <MiniLink texto="Mercado" ok={false} />
          </div>
        </div>

        <CharacterTabs personagem={personagem} />
      </div>
    </main>
  )
}

function Badge({ texto, destaque, cor }) {
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
        cor
          ? `${cor} text-white`
          : destaque
          ? 'bg-white text-green-900'
          : 'bg-black/30 text-white'
      }`}
    >
      {texto?.toUpperCase()}
    </span>
  )
}

function MiniLink({ texto, ok }) {
  return (
    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-black/20 border border-white/10">
      <span className={ok ? 'text-green-400' : 'text-red-400'}>
        {ok ? '✓' : '✕'}
      </span>
      {texto}
    </span>
  )
}
