'use client'

import { useState } from 'react'

const TABS = [
  { id: 'perfil', label: 'Perfil', icon: '👤' },
  { id: 'combate', label: 'Combate', icon: '🎖️' },
  { id: 'jornada', label: 'Jornada', icon: '🗺️' },
  { id: 'extras', label: 'Extras', icon: '⭐' },
  { id: 'colecionaveis', label: 'Colecionáveis', icon: '📜' },
]

export default function CharacterTabs({ personagem }) {
  const [tab, setTab] = useState('combate')

  return (
    <div className="mt-8">
      <div className="flex flex-wrap justify-center gap-2 border-b border-green-800/40 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.id
                ? 'bg-green-700/40 text-green-300'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'perfil' && <PerfilTab personagem={personagem} />}
        {tab === 'combate' && <CombateTab personagem={personagem} />}
        {tab === 'jornada' && <PlaceholderTab nome="Jornada" />}
        {tab === 'extras' && <PlaceholderTab nome="Extras" />}
        {tab === 'colecionaveis' && <PlaceholderTab nome="Colecionáveis" />}
      </div>
    </div>
  )
}

function PerfilTab({ personagem }) {
  return (
    <div className="rounded-xl border border-green-800/30 bg-black/20 p-6 space-y-2">
      <InfoRow label="Nome" valor={personagem.nome} />
      <InfoRow label="Título" valor={personagem.titulo} />
      <InfoRow label="Patente" valor={personagem.patente} />
      <InfoRow label="Vila" valor={personagem.vila} />
      <InfoRow label="Status" valor={personagem.status} />
    </div>
  )
}

function InfoRow({ label, valor }) {
  if (!valor) return null
  return (
    <div className="flex justify-between border-b border-white/5 py-2 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="text-white/90">{valor}</span>
    </div>
  )
}

function CombateTab({ personagem }) {
  const qualidades = personagem.qualidades || []
  const defeitos = personagem.defeitos || []

  return (
    <div className="rounded-xl border border-green-800/30 bg-black/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-green-400">⚖️</span>
        <h3 className="font-display text-xl tracking-wide">
          Qualidades &amp; Defeitos
        </h3>
      </div>

      <TagSection titulo="Qualidades" itens={qualidades} cor="green" />
      <TagSection titulo="Defeitos" itens={defeitos} cor="red" />
    </div>
  )
}

function TagSection({ titulo, itens, cor }) {
  const corClasses =
    cor === 'green'
      ? 'border-green-700/50 text-green-300 bg-green-900/20'
      : 'border-red-700/50 text-red-300 bg-red-900/20'

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-green-400/80 uppercase tracking-wide">
        <span>+</span>
        {titulo}
      </div>
      {itens.length === 0 ? (
        <p className="text-white/40 text-sm">Nenhum item cadastrado.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {itens.map((item, i) => (
            <span
              key={i}
              className={`text-sm px-3 py-1.5 rounded-full border ${corClasses}`}
            >
              ✓ {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function PlaceholderTab({ nome }) {
  return (
    <div className="rounded-xl border border-green-800/30 bg-black/20 p-10 text-center text-white/40">
      Conteúdo de "{nome}" ainda não implementado.
    </div>
  )
}
