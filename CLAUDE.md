# CLAUDE.md — Dashboard Vipple IA (contexto pro próximo Claude)

> Leia isto primeiro. Resume **o que é o sistema, o que já foi feito, onde paramos e o próximo passo** — pra você não precisar abrir cada arquivo. Datas em jul/2026.

---

## ⚠️ Antes de tudo: os caminhos têm ESPAÇO NO FINAL

O projeto vive em `/Users/gabrielhenriquenalli/Projects/VIPLLE /DASHBOARD VIPLLE /` — **ambas as pastas terminam com um espaço**. Sempre cite os caminhos entre aspas. Rodar comandos: `cd '/Users/gabrielhenriquenalli/Projects/VIPLLE /DASHBOARD VIPLLE '`.

---

## O que é este sistema

**Vipple Digital** é uma agência que está montando **agentes de IA de primeiro atendimento no WhatsApp**: o agente identifica o lead, entende a dor, qualifica por critérios e, quando aprovado, faz **handoff para um vendedor humano com resumo da conversa + link clicável `wa.me`**. Lead reprovado é descartado com motivo registrado.

**Este projeto é SÓ O FRONT — o painel de visão sobre o que a IA faz.**
- ❌ NÃO tem o agente de IA. NÃO conversa no WhatsApp, não chama LLM, não qualifica.
- ✅ O cérebro (WhatsApp + IA + qualificação + handoff) será feito **no backend via n8n** (decisão do usuário, firme).
- ✅ Hoje o dashboard lê dados **mockados** de `lib/data.ts`. Esse arquivo é a "tomada" onde o backend real vai plugar depois.

Cliente demo usado nos mocks: **Clínica Vitalle** (odontologia), agente batizado de **"Via"**. Números-chave derivados: 432 contatos, 104 qualificados, 101 entregues, 34 fechados, receita R$ 162.860, ROI ≈ 108×.

---

## Stack & como rodar

- **Next.js 15.5** (App Router, todas as páginas `"use client"`) · **Tailwind v4** (tokens em `app/globals.css` via `@theme`) · **recharts 2.15** · **lucide-react** · fontes **Poppins + Archivo** (fallback do Neue Haas) via `next/font`.
- `npm run dev` → http://localhost:3000 · `npm run build` (passa limpo, 10 rotas estáticas).
- Node 24. Há um `package-lock.json` local (o Next avisa sobre múltiplos lockfiles — inofensivo).

---

## Mapa de arquivos (o essencial)

```
app/
  layout.tsx          → monta BackgroundFX + Header + <main>; carrega fontes
  page.tsx            → redirect para /visao-geral
  globals.css         → TODOS os tokens da identidade (@theme) + classes .panel .kicker .display .num .pill .stagger/.reveal
  {visao-geral,ao-vivo,funil,inteligencia,vendas}/page.tsx  → as 5 abas
components/
  BackgroundFX.tsx    → fundo animado (canvas de pontos halftone + "V" gigante + vinhetas vermelhas)
  Header.tsx          → nav das 5 abas (com fade de scroll no mobile, aria, relógio)
  ui/kit.tsx          → KIT DE UI compartilhado: Panel, SectionHeader(as?), StatCard, RankRow,
                        ScoreRing, StatusPill, Delta, Sparkline, LiveDot, useInViewOnce, useCountUp
  charts/theme.tsx    → tema recharts: CHART (cores), seqColor, AXIS, GRID, VTooltip, ChartLegend,
                        CHART_DEFS (elemento JSX <defs> com gradientes — use {CHART_DEFS}, NÃO <ChartDefs/>)
  tabs/<aba>/*.tsx    → componentes de cada aba (um por seção)
lib/
  data.ts             → FONTE ÚNICA DE VERDADE (mock). Totais derivados das séries num IIFE (TOTALS).
  format.ts           → formatadores pt-BR: fmtInt, fmtBRL, fmtBRLFull, fmtPct, fmtDur, fmtAgo
```

### As 4 abas (o usuário removeu a de Vendas em jul/2026 — ver histórico)
1. **/visao-geral** — impacto: hero + 5 KPIs + gráfico "Atendimento diário" (full width) + tabela Antes×Depois + "Qualificados por semana" (full width). ⚠️ Removidos: painel ROI (108×) e "Custo por lead qualificado".
2. **/ao-vivo** — pulso da operação: strip de status, fila de leads quentes (HotQueue), **Conversa ao vivo** (LiveFeed = chat lead↔Via que "digita" e cicla, lê de `LIVE_CONVERSATIONS`), heatmap semanal. ⚠️ Removidos: painel "Alertas da operação".
3. **/funil** — funil vertical custom (6 estágios) + motivos de descarte + checklist de qualificação + tempo por etapa + conversão etapa a etapa.
4. **/inteligencia** — inteligência de mercado: dores/objeções, origens, serviços, perfil do lead. ⚠️ Removidos: "Perguntas sem resposta", "Clima das conversas" (Sentiment) e "A Via está aprendendo" (Learning).

> **Removido: a aba /vendas** (Vendas & Handoff) — deletados `app/vendas/` e `components/tabs/vendas/`. Os dados `HANDOFFS`, `SELLERS`, `waLink` continuam em `lib/data.ts` (dead code proposital — modelam o handoff pro futuro Supabase/n8n). `LIVE_EVENTS` e `LIVE.alerts` também ficaram sem uso após a troca do LiveFeed.

---

## Regras que NÃO podem ser quebradas

**Identidade visual (requisito nº 1 do usuário — seguir fielmente):**
- Preto absoluto de fundo · vermelho `#FF1717` como ÚNICO acento forte · branco `#F5F5F5` · cinzas `#686868`/`#1E1E1E`.
- **Verde (`--color-money`) SÓ para dinheiro/resultado positivo** (as pills verdes da apresentação). Âmbar (`--color-warn`) só para alerta.
- Títulos em `.display` (Neue Haas/Helvetica) com a palavra-chave em vermelho → use `<SectionHeader kicker title accent>`.
- Kickers em caixa alta com tracking largo. Números sempre com classe `.num` (tabular).
- Fundo animado é global (layout) — NÃO adicione background nas páginas.
- Referência da marca: `TIPOGRAFIA E CORES.png` e `VIPPLE - APRESENTAÇÃO.pdf` na pasta pai (`../`).

**Dados (`lib/data.ts` é a fonte única):**
- NUNCA hardcode número em componente — importe de `data.ts`. Totais são DERIVADOS das séries (não duplicar).
- Formate SEMPRE com `lib/format.ts` (pt-BR: vírgula decimal, R$).
- Limiar de SLA unificado: `export const SLA = { ok: 5, warn: 10 }` (verde ≤ok · âmbar ≤warn · vermelho >warn) — usado em HotQueue e TeamRanking.

**Gráficos (regras validadas em acessibilidade):**
- Máx. 2 séries por gráfico: vermelho × branco, sempre com `<ChartLegend>` + `<Tooltip content={<VTooltip/>}/>`.
- 3+ categorias → NÃO multicolorido: use `<RankRow>` (barras rotuladas).
- Heatmap → rampa sequencial de vermelho (`seqColor`). Nunca dual-axis. Nunca pizza multicolorida.
- Todo chart: `accessibilityLayer` no componente + wrapper com `role="img"` e `aria-label`. Gradientes de área via `{CHART_DEFS}` (o function component `<ChartDefs/>` é descartado pelo recharts).

---

## O que já foi feito (histórico)

1. **Construído do zero** — as 5 abas, kit de UI, tema de gráficos, fundo animado, dados mock. Build limpo, verificado no browser.
2. **Review adversarial** (workflow, 3 lentes: correção React, consistência de dados, responsivo/a11y) → 18 achados.
3. **Correções aplicadas** (workflow de 11 agentes) e verificadas no browser. Destaques:
   - 🔴 Bug real: gráficos de área sem preenchimento (recharts descartava `<ChartDefs/>`) → corrigido com `CHART_DEFS`.
   - 🔴 Conta errada Antes×Depois: +112h → +118h/semana.
   - Coerência: feed vs. aba Vendas (lead L-0431), SLA unificado, `WEEKLY_QUALIFIED` derivado de Q, taxa 33,7%, delta +136% e `74%`/`136` vindos de `TOTALS`.
   - a11y/mobile: nav com fade de scroll, `role`/`aria-label` nos gráficos, heatmap/funil acessíveis no touch, `Delta` com direção pra leitor de tela, hierarquia de headings (`SectionHeader as="h1"`).

4. **Enxugamento pedido pelo usuário** (jul/2026): removidos painel ROI (108×) e "Custo por lead" da Visão Geral; removidos "Alertas da operação" (Ao Vivo) e os 3 painéis de baixo da Inteligência; **removida a aba inteira Vendas & Handoff**. E o **Feed ao vivo virou "Conversa ao vivo"** — um chat que mostra as mensagens reais do lead e da Via, mensagem a mensagem, com indicador de digitação (o usuário quis "acompanhar de fato" o atendimento). Tudo verificado no browser, build limpo.

Estado atual: **dashboard enxuto e polido, rodando com dados mock.** Console limpo.

---

## 🔜 Onde paramos / próximo passo: conectar ao n8n via Supabase

O usuário definiu a arquitetura: **n8n (backend/IA) escreve no Supabase; o dashboard lê do Supabase.**

```
WhatsApp → n8n (IA: identifica, qualifica, handoff) → [INSERT/UPSERT] → Supabase (Postgres)
                                                                              ↓ SELECT / Realtime
                                                                         Dashboard (troca lib/data.ts)
```

**Por que Supabase:** Postgres com node nativo no n8n · Realtime (ideal pra aba Ao Vivo substituir a simulação) · RLS pra multi-tenant (agência = vários clientes, cada um vê só o seu via `client_id`).

**Modelagem esboçada** (o `lib/data.ts` já é o desenho): tabelas `clients`, `leads`, `messages`, `events`, `handoffs`, `sellers`. KPIs/funil/heatmap = **views ou RPC** de agregação (peso no banco, não no front). Cada export de `data.ts` mapeia num SELECT → o visual não muda.

**Plano de execução do lado do front:** criar schema (tabelas + views + RLS) como migration Supabase → substituir `lib/data.ts` por um cliente que lê do Supabase (mantendo a MESMA forma de dados, pra não tocar nos componentes) → Realtime na aba Ao Vivo.

**Decisões do usuário ainda PENDENTES** (perguntar antes de executar):
1. Já existe projeto Supabase ou criar do zero (ou só o schema no papel primeiro)?
2. Multi-cliente com `client_id`+RLS já, ou um cliente só por enquanto?
3. Escopo: só schema+leitura, ou também documentar os payloads que o n8n deve gravar?

MCP do Supabase está disponível nesta sessão (`mcp__claude_ai_Supabase__*`) caso o usuário queira provisionar direto.

---

## Memória global relacionada
Há memórias em `~/.claude/projects/.../memory/`: `vipple-brand-identity`, `vipple-business-context`, `vipple-dashboard-project`. Este CLAUDE.md é a versão detalhada e específica do dashboard.
