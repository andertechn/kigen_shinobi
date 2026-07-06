import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Ordem de exibição das patentes. Ajuste os nomes para bater
// exatamente com o que está salvo na coluna "patente" do Supabase.
const ORDEM_PATENTES = [
  'Hokage',
  'Sannin',
  'Anbu',
  'Jonin',
  'Chunin',
  'Genin',
  'Academico',
]

async function getPersonagensVivos() {
  const { data, error } = await supabase
    .from('personagens')
    .select('id, nome, titulo, patente, vila, status, avatar_url')
    .eq('status', 'vivo')
    .order('nome', { ascending: true })

  if (error) {
    console.error('Erro ao buscar personagens:', error)
    return []
  }
  return data || []
}

export default async function HomePage() {
  const personagens = await getPersonagensVivos()

  // Agrupa por patente
  const agrupados = {}
  for (const p of personagens) {
    const patente = p.patente || 'Sem Patente'
    if (!agrupados[patente]) agrupados[patente] = []
    agrupados[patente].push(p)
  }

  // Monta a lista de patentes na ordem definida, e no final
  // qualquer patente que não esteja na lista ORDEM_PATENTES
  const patentesExtras = Object.keys(agrupados).filter(
    (p) => !ORDEM_PATENTES.includes(p)
  )
  const patentesFinal = [...ORDEM_PATENTES, ...patentesExtras].filter(
    (p) => agrupados[p]?.length
  )

  return (
    <main className="min-h-screen bg-[#0b1410] text-white px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-center mb-2 tracking-wide">
          Shinobis da Vila
        </h1>
        <p className="text-center text-green-300/70 mb-12">
          {personagens.length} personagens ativos
        </p>

        {patentesFinal.length === 0 && (
          <p className="text-center text-white/50">
            Nenhum personagem encontrado.
          </p>
        )}

        <div className="space-y-12">
          {patentesFinal.map((patente) => (
            <section key={patente}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px flex-1 bg-green-800/50" />
                <h2 className="font-display text-2xl text-green-400 tracking-widest uppercase">
                  {patente}
                </h2>
                <span className="h-px flex-1 bg-green-800/50" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {agrupados[patente].map((p) => (
                  <Link
                    key={p.id}
                    href={`/personagem/${p.id}`}
                    className="group flex flex-col items-center rounded-2xl border border-green-800/40 bg-gradient-to-b from-green-900/30 to-black/30 p-4 transition hover:border-green-400/60 hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500/60 mb-3 bg-black/40">
                      {p.avatar_url ? (
                        <img
                          src={p.avatar_url}
                          alt={p.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍥
                        </div>
                      )}
                    </div>
                    <span className="font-display text-lg text-center leading-tight group-hover:text-green-300">
                      {p.nome}
                    </span>
                    {p.vila && (
                      <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-black/40 text-green-300/80 border border-green-800/40">
                        {p.vila}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
