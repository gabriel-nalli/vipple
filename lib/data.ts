/* ══════════════════════════════════════════════════════════════
   VIPPLE IA — DATASET DEMO (fonte única de verdade)
   Cliente demo: Clínica Vitalle (Odontologia) · Agente: "Vitória"
   Período: últimos 30 dias — 14/06 a 13/07/2026
   Totais SEMPRE derivados das séries (nunca duplicar números).
   ══════════════════════════════════════════════════════════════ */

export const CLIENT = {
  name: "Clínica Vitalle",
  segment: "Odontologia",
  agentName: "Vitória",
  agentFull: "Vitória — Agente IA Vipple",
  plan: "Vipple IA · Plano Anual",
  planMonthly: 1500,
  period: "Últimos 30 dias · 14 jun — 13 jul 2026",
  whatsapp: "5511988880000",
};

/* ── Série diária (30 dias) ─────────────────────────────────── */

export type DailyPoint = {
  d: string; // dd/mm
  contatos: number;
  qualificados: number;
};

const C = [9, 13, 15, 14, 16, 12, 8, 10, 14, 17, 15, 16, 11, 9, 12, 16, 19, 18, 17, 13, 10, 14, 18, 21, 19, 17, 12, 11, 15, 21];
const Q = [2, 3, 4, 3, 4, 3, 2, 2, 3, 4, 4, 4, 3, 2, 3, 4, 5, 4, 4, 3, 2, 3, 4, 5, 5, 4, 3, 3, 4, 5];

function dayLabel(i: number): string {
  // 14/06 → 13/07 (jun tem 30 dias)
  const day = 14 + i;
  return day <= 30 ? `${String(day).padStart(2, "0")}/06` : `${String(day - 30).padStart(2, "0")}/07`;
}

export const DAILY: DailyPoint[] = C.map((c, i) => ({
  d: dayLabel(i),
  contatos: c,
  qualificados: Q[i],
}));

const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);

/* ── Totais derivados ───────────────────────────────────────── */

export const TOTALS = (() => {
  const contatos = sum(C); // 432
  const qualificados = sum(Q); // 104
  const engajaram = Math.round(contatos * 0.77); // 333
  const desqualificados = 158;
  const identificados = qualificados + desqualificados; // 262
  const entregues = 101; // 3 qualificados ainda em conversa
  const fechados = 34;
  const perdidos = 41;
  const emNegociacao = entregues - fechados - perdidos; // 26
  const ticketMedio = 4790;
  const receita = 162860; // soma dos fechamentos dos vendedores
  return {
    contatos,
    engajaram,
    identificados,
    qualificados,
    desqualificados,
    entregues,
    fechados,
    perdidos,
    emNegociacao,
    ticketMedio,
    receita,
    taxaQualificacao: (qualificados / contatos) * 100, // ~24%
    taxaFechamento: (fechados / entregues) * 100, // ~33,7%
    mensagensTrocadas: 6480,
    foraHorario: Math.round(contatos * 0.41), // 177
    horasEconomizadas: 65,
    primeiraRespostaSeg: 8,
    primeiraRespostaAntesSeg: 13620, // 3h47
    tempoQualificacaoSeg: 252, // 4min12s
    msgsAteQualificar: 11,
    custoPorQualificado: CLIENT.planMonthly / sum(Q), // ~R$14,4
    custoPorQualificadoHumano: 44,
    escaladaPrecocePct: 3.2,
    csat: 4.7,
    retencaoPosObjecaoPct: 74, // % dos leads que seguem após a Vitória contornar a objeção
    ganhoVsManualPct: Math.round((qualificados / (11 * 4) - 1) * 100), // +136% vs. operação manual (11 qualificados/sem × 4 sem)
  };
})();

/* Limiar único de SLA/espera (minutos): verde ≤ ok · âmbar ≤ warn · vermelho > warn */
export const SLA = { ok: 5, warn: 10 } as const;

/* ── Funil ──────────────────────────────────────────────────── */

export type FunnelStage = { key: string; label: string; value: number; desc: string };

export const FUNNEL: FunnelStage[] = [
  { key: "recebidos", label: "Contatos recebidos", value: TOTALS.contatos, desc: "Novas conversas iniciadas no WhatsApp" },
  { key: "engajaram", label: "Engajaram", value: TOTALS.engajaram, desc: "Responderam e conversaram com a Vitória" },
  { key: "identificados", label: "Identificados", value: TOTALS.identificados, desc: "Nome, interesse e contexto capturados" },
  { key: "qualificados", label: "Qualificados", value: TOTALS.qualificados, desc: "Passaram em todos os critérios" },
  { key: "entregues", label: "Entregues ao time", value: TOTALS.entregues, desc: "Handoff com resumo + link direto" },
  { key: "fechados", label: "Fechados", value: TOTALS.fechados, desc: "Viraram pacientes da clínica" },
];

export const DISQUALIFY_REASONS = [
  { label: "Sem orçamento mínimo", n: 60 },
  { label: "Fora da região de atendimento", n: 35 },
  { label: "Só pesquisando preço", n: 28 },
  { label: "Fora do perfil de paciente", n: 22 },
  { label: "Buscava outro serviço", n: 13 },
]; // soma = 158 = TOTALS.desqualificados

/* Tempo médio em cada etapa (segundos) */
export const STAGE_TIME = [
  { label: "1ª resposta", seg: 8 },
  { label: "Identificação", seg: 96 },
  { label: "Diagnóstico da dor", seg: 148 },
  { label: "Qualificação", seg: 252 },
  { label: "Handoff ao vendedor", seg: 31 },
];

/* ── Heatmap 7 dias × 18 horas (06h–23h) — determinístico ───── */

export const HEATMAP_DAYS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
export const HEATMAP_HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6..23

/** Intensidade 0–100. Picos: manhã comercial e noite (19–22h). */
export function heatValue(dayIdx: number, hour: number): number {
  const weekday = dayIdx <= 4 ? 1 : dayIdx === 5 ? 0.62 : 0.38;
  const morning = Math.exp(-Math.pow(hour - 10, 2) / 7) * 78;
  const evening = Math.exp(-Math.pow(hour - 20.5, 2) / 5) * 92;
  const lunchDip = hour === 12 || hour === 13 ? -12 : 0;
  const wave = Math.sin(dayIdx * 2.1 + hour * 0.7) * 6;
  return Math.max(0, Math.min(100, Math.round((morning + evening + lunchDip + wave) * weekday)));
}

/* ── Inteligência de mercado ────────────────────────────────── */

export const ORIGINS = [
  { label: "Meta Ads", pct: 44 },
  { label: "Google Ads", pct: 21 },
  { label: "Instagram orgânico", pct: 15 },
  { label: "Indicação", pct: 11 },
  { label: "Site / outros", pct: 9 },
];

export const PAINS = [
  { label: "Preço / parcelamento", pct: 41, quote: "“Consigo dividir em quantas vezes?”" },
  { label: "Medo / ansiedade de dentista", pct: 17, quote: "“Tenho pavor de dentista, dói?”" },
  { label: "Convênio não aceito", pct: 15, quote: "“Vocês atendem meu plano?”" },
  { label: "Urgência de agenda", pct: 14, quote: "“Preciso resolver ainda essa semana”" },
  { label: "Dúvida sobre resultado", pct: 13, quote: "“E se não ficar natural?”" },
];

export const SERVICES = [
  { label: "Implante dentário", pct: 34 },
  { label: "Invisalign / alinhadores", pct: 26 },
  { label: "Lentes / estética", pct: 22 },
  { label: "Clareamento", pct: 11 },
  { label: "Avaliação geral", pct: 7 },
];

export const UNANSWERED = [
  { q: "Vocês parcelam em até 24x no boleto?", n: 14 },
  { q: "Atendem convênio OdontoPrev?", n: 11 },
  { q: "Tem avaliação gratuita aos sábados?", n: 9 },
  { q: "Fazem sedação para pacientes com pânico?", n: 7 },
  { q: "Qual o prazo de entrega das lentes?", n: 5 },
];

export const AGE_PROFILE = [
  { label: "18–24", pct: 8 },
  { label: "25–34", pct: 27 },
  { label: "35–44", pct: 31 },
  { label: "45–54", pct: 21 },
  { label: "55+", pct: 13 },
];

export const REGIONS = [
  { label: "Moema", pct: 24 },
  { label: "Vila Mariana", pct: 19 },
  { label: "Itaim Bibi", pct: 16 },
  { label: "Pinheiros", pct: 14 },
  { label: "Outras regiões", pct: 27 },
];

export const SENTIMENT = { positivo: 63, neutro: 28, negativo: 9 };

/* Evolução semanal: msgs médias até qualificar (IA aprendendo) */
export const MSGS_TREND = [
  { w: "Sem 1", msgs: 14.0 },
  { w: "Sem 2", msgs: 12.5 },
  { w: "Sem 3", msgs: 11.4 },
  { w: "Sem 4", msgs: 10.8 },
];

/* Qualificados por semana: média manual anterior (11/sem) vs com a Vitória.
   comIA derivado da série Q em blocos de 7 dias; a última janela (Sem 4)
   absorve os 2 dias extras do período (dias 22–30 = 9 dias).
   Soma das 4 janelas = 104 = TOTALS.qualificados → [21, 22, 25, 36]. */
const sumRange = (a: number[], start: number, end: number) => sum(a.slice(start, end));
export const WEEKLY_QUALIFIED = [
  { w: "Sem 1", antes: 11, comIA: sumRange(Q, 0, 7) }, // 21
  { w: "Sem 2", antes: 11, comIA: sumRange(Q, 7, 14) }, // 22
  { w: "Sem 3", antes: 11, comIA: sumRange(Q, 14, 21) }, // 25
  { w: "Sem 4", antes: 11, comIA: sumRange(Q, 21, 30) }, // 36 (9 dias)
];

/* ── Antes × Depois ─────────────────────────────────────────── */

export const BEFORE_AFTER = [
  { label: "Tempo de 1ª resposta", before: "3h 47min", after: "8 segundos", gain: "−99,9%" },
  { label: "Cobertura de atendimento", before: "seg–sex · 8h às 18h", after: "24h / 7 dias", gain: `+${24 * 7 - 10 * 5}h por semana` }, // antes 10h×5=50h; depois 168h; ganho 118h
  { label: "Leads fora do horário perdidos", before: "~41% perdidos", after: "0 perdidos", gain: "177 leads salvos" },
  { label: "Custo por lead qualificado", before: "R$ 44,00", after: "R$ 14,42", gain: "−67%" },
  { label: "Triagem manual da equipe", before: "~65h/mês", after: "0h", gain: "65h devolvidas" },
];

/* ── Vendas & Handoff ───────────────────────────────────────── */

export type Seller = {
  name: string;
  initials: string;
  entregues: number;
  fechados: number;
  receita: number;
  slaMin: number; // tempo médio até responder o lead entregue
};

export const SELLERS: Seller[] = [
  { name: "Carla Mendes", initials: "CM", entregues: 38, fechados: 14, receita: 67100, slaMin: 4 },
  { name: "Diego Rocha", initials: "DR", entregues: 34, fechados: 11, receita: 52700, slaMin: 9 },
  { name: "Renan Alves", initials: "RA", entregues: 29, fechados: 9, receita: 43060, slaMin: 16 },
];

export type HandoffStatus = "aguardando" | "em_conversa" | "ganho" | "perdido";

export type Handoff = {
  id: string;
  lead: string;
  phone: string; // formato 55DDDNÚMERO (para wa.me)
  interesse: string;
  score: number; // 0–100
  origem: string;
  vendedor: string;
  minAgo: number;
  status: HandoffStatus;
  valor?: number;
  resumo: string;
};

export const HANDOFFS: Handoff[] = [
  {
    id: "L-0432",
    lead: "Mariana Lopes",
    phone: "5511987650001",
    interesse: "Implante unitário",
    score: 92,
    origem: "Meta Ads",
    vendedor: "Carla Mendes",
    minAgo: 12,
    status: "aguardando",
    resumo:
      "Mariana, 38 anos, Moema. Perdeu o dente 24 há 2 meses e quer resolver com urgência (casamento da filha em set/26). Orçamento até R$ 6 mil, prefere parcelar em 12x. Disponível para avaliação ter/qui após 18h. Dor relatada: vergonha ao sorrir. Alta intenção — pediu para falar com humano.",
  },
  {
    id: "L-0431",
    lead: "Ricardo Fontes",
    phone: "5511987650002",
    interesse: "Invisalign completo",
    score: 87,
    origem: "Google Ads",
    vendedor: "Diego Rocha",
    minAgo: 38,
    status: "em_conversa",
    resumo:
      "Ricardo, 29, Itaim. Executivo, quer alinhadores invisíveis por estética profissional. Já pesquisou concorrentes (SmileX) e achou caro. Orçamento ~R$ 12 mil à vista. Objeção principal: prazo do tratamento. Quer começar ainda em julho.",
  },
  {
    id: "L-0429",
    lead: "Fernanda Sales",
    phone: "5511987650003",
    interesse: "Lentes de contato dental",
    score: 84,
    origem: "Instagram",
    vendedor: "Carla Mendes",
    minAgo: 95,
    status: "ganho",
    valor: 9800,
    resumo:
      "Fernanda, 34, Vila Mariana. Influencer, quer lentes nos 8 dentes superiores. Referência estética: sorriso natural. Fechou avaliação na conversa com a Carla e aprovou orçamento de R$ 9.800 em 10x.",
  },
  {
    id: "L-0427",
    lead: "Paulo Cezar Nunes",
    phone: "5511987650004",
    interesse: "Implante total superior",
    score: 90,
    origem: "Indicação",
    vendedor: "Renan Alves",
    minAgo: 180,
    status: "em_conversa",
    resumo:
      "Paulo, 61, Pinheiros. Indicado pela paciente Sônia (protocolo 2025). Usa dentadura há 8 anos, quer protocolo fixo. Aposentado com reserva — sem restrição de orçamento declarada. Pediu detalhes de sedação. Alta propensão, decisor único.",
  },
  {
    id: "L-0424",
    lead: "Juliana Prado",
    phone: "5511987650005",
    interesse: "Clareamento a laser",
    score: 71,
    origem: "Meta Ads",
    vendedor: "Diego Rocha",
    minAgo: 300,
    status: "perdido",
    resumo:
      "Juliana, 26, Saúde. Queria clareamento para formatura em agosto. Orçamento apertado (R$ 800), sugerida opção caseira supervisionada. Optou por adiar — recontatar em campanha de setembro.",
  },
  {
    id: "L-0421",
    lead: "André Kobayashi",
    phone: "5511987650006",
    interesse: "Invisalign + clareamento",
    score: 88,
    origem: "Google Ads",
    vendedor: "Carla Mendes",
    minAgo: 420,
    status: "ganho",
    valor: 14200,
    resumo:
      "André, 41, Moema. Dentista aposentado do exército, exigente com técnica. Comparou 3 clínicas, decidiu pela Vitalle pela tecnologia. Fechou pacote alinhadores + clareamento por R$ 14.200.",
  },
];

/** Link clicável de handoff: abre o WhatsApp do lead com contexto */
export function waLink(phone: string, text?: string): string {
  const t = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${t}`;
}

/* ── Ao vivo (simulação) ────────────────────────────────────── */

export const LIVE = {
  activeConversations: 7,
  hotQueue: [
    { lead: "Beatriz Amaral", interesse: "Implante unitário", score: 89, waitMin: 6, vendedor: "Carla Mendes" },
    { lead: "Otávio Serra", interesse: "Protocolo fixo", score: 94, waitMin: 14, vendedor: "Renan Alves" },
    { lead: "Larissa Pontes", interesse: "Lentes de contato", score: 81, waitMin: 3, vendedor: "Diego Rocha" },
  ],
  alerts: [
    { level: "warn" as const, text: "Otávio Serra (score 94) aguarda o vendedor há 14 min — Renan notificado 2×" },
    { level: "info" as const, text: "Pico de contatos detectado: +38% vs. média de segunda à noite" },
  ],
};

/* Eventos do feed ao vivo — templates que a UI cicla */
export const LIVE_EVENTS = [
  { type: "msg" as const, text: "Nova conversa iniciada — Camila F. via Meta Ads" },
  { type: "qualify" as const, text: "Beatriz Amaral qualificada — score 89 · implante unitário" },
  { type: "msg" as const, text: "Vitória respondeu Otávio S. em 6s — dúvida sobre sedação" },
  { type: "handoff" as const, text: "Handoff: Otávio Serra → Renan Alves (resumo + link enviados)" },
  { type: "msg" as const, text: "Lead Larissa P. enviou áudio — transcrito e processado" },
  { type: "identify" as const, text: "Identificado: Marcos T., 45, Vila Mariana — busca protocolo" },
  { type: "msg" as const, text: "Vitória contornou objeção de preço com parcelamento em 12x" },
  { type: "disqualify" as const, text: "Lead R.S. desqualificado — fora da região (Campinas)" },
  { type: "qualify" as const, text: "Marcos T. avançou na qualificação — 4 de 5 critérios ✓" },
  { type: "msg" as const, text: "Nova conversa iniciada — Pedro L. via Google Ads" },
  { type: "handoff" as const, text: "Handoff: Larissa Pontes → Diego Rocha (resumo + link enviados)" },
  { type: "win" as const, text: "Diego marcou L-0440 (Sofia R.) como GANHO — R$ 11.400 💰" },
];

/* ── Atendimentos ao vivo (lead ↔ Vitória) ──────────────────────────
   Cada card é um lead sendo atendido pela Vitória; clicar abre a
   conversa. "em_andamento" = acontecendo agora; "qualificado" =
   já passou nos critérios e virou handoff. A UI transmite a
   conversa mensagem a mensagem (a Vitória "digita"). */

export type ChatMsg = { from: "lead" | "via" | "system"; text: string };

export type LiveConversation = {
  lead: string;
  interesse: string;
  origem: string;
  score: number;
  status: "em_andamento" | "qualificado";
  startedMin: number; // começou há X min
  messages: ChatMsg[];
};

export const LIVE_CONVERSATIONS: LiveConversation[] = [
  {
    lead: "Beatriz Amaral",
    interesse: "Implante unitário",
    origem: "Meta Ads",
    score: 89,
    status: "em_andamento",
    startedMin: 6,
    messages: [
      { from: "lead", text: "Oi! Queria saber sobre implante, quebrei um dente mordendo e ficou feio 😖" },
      { from: "via", text: "Oi Beatriz, tudo bem?? 😊" },
      { from: "via", text: "Nossa, imagino como você tá se sentindo viu" },
      { from: "via", text: "mas pode ficar super tranquila que isso a gente resolve certinho, e o resultado fica bem natural, ninguém percebe 🙌" },
      { from: "via", text: "me conta uma coisa: foi só esse dente ou tem mais algum te incomodando?" },
      { from: "lead", text: "só um, o de cima da frente" },
      { from: "via", text: "Aa entendi" },
      { from: "via", text: "e faz quanto tempo que isso aconteceu?" },
      { from: "lead", text: "semana passada" },
      { from: "via", text: "Sei..." },
      { from: "via", text: "e você tá querendo resolver logo ou ainda tá só dando uma pesquisada?" },
    ],
  },
  {
    lead: "Ricardo Fontes",
    interesse: "Invisalign completo",
    origem: "Google Ads",
    score: 87,
    status: "em_andamento",
    startedMin: 11,
    messages: [
      { from: "lead", text: "Boa noite, vocês fazem aquele alinhador invisível? Tipo o Invisalign" },
      { from: "via", text: "Boa noite Ricardo, tudo certo? 😊" },
      { from: "via", text: "Fazemos sim!" },
      { from: "via", text: "é a opção mais discreta que tem viu, dá pra ir alinhando os dentes sem ninguém ver aparelho nenhum" },
      { from: "via", text: "me fala uma coisa, você já usou aparelho antes ou seria a primeira vez?" },
      { from: "lead", text: "usei quando era mais novo, mas os dentes voltaram a entortar" },
      { from: "via", text: "Aah, isso é super comum viu" },
      { from: "via", text: "é a tal da recidiva, quando a gente para de usar a contenção os dentes tendem a voltar mesmo" },
      { from: "via", text: "mas relaxa que com o alinhador a gente resolve isso tranquilo" },
      { from: "via", text: "e me conta, você quer corrigir mais pela estética ou também tá te incomodando na mordida?" },
      { from: "lead", text: "é mais estética mesmo, trabalho com atendimento ao público" },
    ],
  },
  {
    lead: "Larissa Pontes",
    interesse: "Lentes de contato dental",
    origem: "Instagram",
    score: 81,
    status: "em_andamento",
    startedMin: 3,
    messages: [
      { from: "lead", text: "oii vi o antes e depois de vocês no insta 😍 quanto fica as lentes?" },
      { from: "via", text: "Oieee Larissa, que bom que você curtiu 💛" },
      { from: "via", text: "olha, o valor a gente consegue te passar certinho depois de entender o seu caso, porque muda bastante dependendo de quantos dentes e do que você tá querendo" },
      { from: "via", text: "mas me conta, você tá pensando em fazer quantos dentes mais ou menos?" },
      { from: "lead", text: "os 6 de cima da frente" },
    ],
  },
  {
    lead: "Otávio Serra",
    interesse: "Protocolo fixo",
    origem: "Meta Ads",
    score: 94,
    status: "qualificado",
    startedMin: 18,
    messages: [
      { from: "lead", text: "Oi, vi o anúncio de vocês sobre implante. Ainda uso dentadura e queria uma coisa fixa." },
      { from: "via", text: "Oi Otávio, tudo bem? 😊" },
      { from: "via", text: "que bom que você chegou até a gente!" },
      { from: "via", text: "olha, o protocolo fixo é exatamente o que você tá procurando, ele devolve a mordida firme e aquela segurança de sorrir sem ficar preocupado" },
      { from: "via", text: "posso te fazer umas perguntinhas rápidas pra já ir adiantando seu atendimento?" },
      { from: "lead", text: "pode sim" },
      { from: "via", text: "Show!" },
      { from: "via", text: "você já chegou a fazer alguma avaliação pra implante antes ou seria a primeira vez?" },
      { from: "lead", text: "primeira vez, nunca fui atrás direito" },
      { from: "via", text: "Entendi, sem problema nenhum" },
      { from: "via", text: "e você tá querendo resolver isso logo ou ainda tá pesquisando com calma?" },
      { from: "lead", text: "pra logo, já tô incomodado faz tempo" },
      { from: "via", text: "Imagino viu, não é fácil conviver com isso todo dia" },
      { from: "via", text: "deixa eu já ser bem transparente com você sobre o investimento" },
      { from: "via", text: "o protocolo é um valor mais alto que uma prótese comum, mas é definitivo, é pra vida toda" },
      { from: "via", text: "você conseguiria investir a partir de uns 12 mil pra resolver de vez?" },
      { from: "lead", text: "se for bem feito e parcelado, sim" },
      { from: "via", text: "Perfeito Otávio! 🙌" },
      { from: "via", text: "pelo seu perfil você é exatamente quem a gente consegue ajudar muito bem" },
      { from: "via", text: "vou te passar agora pro Renan, ele é nosso especialista em protocolo, já vou mandar pra ele o resumo da nossa conversa" },
      { from: "via", text: "ele te chama aqui pra fechar sua avaliação, pode ser?" },
      { from: "lead", text: "pode sim, muito obrigado!" },
      { from: "system", text: "Lead qualificado · handoff para Renan Alves" },
    ],
  },
  {
    lead: "Mariana Lopes",
    interesse: "Implante unitário",
    origem: "Instagram",
    score: 89,
    status: "qualificado",
    startedMin: 27,
    messages: [
      { from: "lead", text: "Boa tarde! Perdi um dente da frente e tô com vergonha de sorrir 😥 vocês fazem implante?" },
      { from: "via", text: "Oi Mariana, boa tarde! 😊" },
      { from: "via", text: "Poxa, imagino o quanto isso te incomoda" },
      { from: "via", text: "mas pode ficar tranquila que a gente resolve isso pra você, e fica tão natural que você volta a sorrir sem nem lembrar disso 💛" },
      { from: "via", text: "posso entender rapidinho o seu caso pra te encaminhar certinho?" },
      { from: "lead", text: "claro" },
      { from: "via", text: "Foi há quanto tempo que você perdeu esse dente?" },
      { from: "lead", text: "uns 2 meses, foi numa queda" },
      { from: "via", text: "Ai, que susto né" },
      { from: "via", text: "e me conta, tem alguma data ou evento chegando que te deixa mais na pressa de resolver?" },
      { from: "lead", text: "sim! o casamento da minha filha em setembro 🥹" },
      { from: "via", text: "Aah que lindo, que momento especial 🥹💛" },
      { from: "via", text: "então vamos cuidar pra você tá com esse sorriso lindo no casamento" },
      { from: "via", text: "sobre valor, o implante unitário começa a partir de uns 3 mil e dá pra parcelar tranquilo" },
      { from: "via", text: "isso cabe no que você tinha pensado?" },
      { from: "lead", text: "cabe, ainda mais parcelado" },
      { from: "via", text: "Que ótimo Mariana! 🙌" },
      { from: "via", text: "você tem o perfil certinho pra gente te atender super bem" },
      { from: "via", text: "vou te encaminhar agora pra Carla, nossa especialista, e já mando pra ela todo o resumo da nossa conversa" },
      { from: "via", text: "ela te chama aqui pra marcar sua avaliação, combinado?" },
      { from: "lead", text: "combinado, obrigada! 😊" },
      { from: "system", text: "Lead qualificado · handoff para Carla Mendes" },
    ],
  },
];

/* ── Critérios de qualificação (checklist da Vitória) ───────────── */

export const CRITERIA = [
  { label: "Identidade confirmada", desc: "Nome + contato validados", pct: 79 },
  { label: "Interesse específico", desc: "Procedimento identificado", pct: 74 },
  { label: "Orçamento compatível", desc: "Capacidade financeira sinalizada", pct: 46 },
  { label: "Região atendida", desc: "Distância viável da clínica", pct: 68 },
  { label: "Urgência real", desc: "Prazo de decisão até 30 dias", pct: 41 },
];
