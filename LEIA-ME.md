# Como usar

## 1. Instalar dependência do Supabase
No seu projeto Next.js (App Router), rode:
```
npm install @supabase/supabase-js
```

## 2. Variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
```
(Coloque essas mesmas variáveis também nas configurações do projeto na Vercel,
em Settings > Environment Variables.)

## 3. Estrutura de arquivos
Copie estes arquivos para o seu projeto, mantendo os mesmos caminhos:
- `lib/supabase.js`
- `app/page.jsx` (página inicial)
- `app/personagem/[id]/page.jsx` (ficha do personagem)
- `app/components/CharacterTabs.jsx`

## 4. Ajustar ao seu esquema do Supabase
Eu assumi que existe uma tabela chamada `personagens` com estas colunas:

| coluna       | tipo        | exemplo                    |
|--------------|-------------|-----------------------------|
| id           | uuid/int    | 1                           |
| nome         | text        | "Tatsuo Rokuhira"           |
| titulo       | text        | "Herói da Folha"            |
| patente      | text        | "Jonin"                     |
| vila         | text        | "Konoha"                    |
| status       | text        | "vivo" / "morto"            |
| tipo         | text        | "Combatente"                |
| avatar_url   | text        | link da imagem              |
| qualidades   | text[]      | ["[00] Agilidade Aguçada"]  |
| defeitos     | text[]      | ["[01] Teimosia"]           |

**Se os nomes reais das suas colunas ou tabela forem diferentes**, me diga
quais são que eu ajusto o código certinho (é só trocar os nomes usados nos
`.select()` e nos componentes).

## 5. Fonte usada no design (título estilo "quadrinho")
No screenshot o título usa uma fonte tipo cartoon/comic. Para chegar perto
disso, adicione no `app/layout.jsx`:

```jsx
import { Bangers } from 'next/font/google'
const bangers = Bangers({ weight: '400', subsets: ['latin'], variable: '--font-display' })
```

E no `tailwind.config.js`, dentro de `theme.extend.fontFamily`:
```js
fontFamily: {
  display: ['var(--font-display)', 'cursive'],
},
```

## 6. Ordem das patentes na home
No topo de `app/page.jsx` tem uma lista `ORDEM_PATENTES` — ajuste os nomes
para bater exatamente com os valores salvos na coluna `patente` (maiúsculas/
minúsculas importam na comparação).

## O que falta decidir com você
- Os botões "Ficha / Banco / Avaliação / GF / MOD / Mercado" no topo da ficha:
  hoje só aparecem como indicadores visuais (✓/✕). Se cada um deve abrir uma
  aba, um modal ou uma página separada, me fala o que cada um faz que eu
  implemento a navegação de verdade.
- Os campos de "Qualidades" e "Defeitos": se no seu banco eles não são um
  array simples de texto, e sim tabelas relacionadas (ex: uma tabela
  `qualidades` com `personagem_id`, `nivel`, `nome`), me avisa que eu troco
  a consulta para um `join`.
