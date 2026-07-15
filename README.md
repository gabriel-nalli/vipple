# Vipple IA — Central de Comando

Dashboard de visão total sobre os **agentes de IA de atendimento no WhatsApp** da [Vipple Digital](https://github.com/gabriel-nalli). Mostra, em tempo real, o que a IA está fazendo: atendimento, qualificação de leads, funil, inteligência de mercado e handoff para o time de vendas.

> ⚠️ Este repositório é **apenas o front-end** (camada de visualização), com dados de demonstração em `lib/data.ts`. O agente de IA em si roda no backend (n8n) — este painel é a "vitrine" que lê os dados que ele produz.

## Abas

- **Visão Geral** — impacto: KPIs, atendimento diário, antes × depois, ritmo de qualificação.
- **Ao Vivo** — central de atendimentos: cards dos leads em atendimento (clicáveis) e a conversa lead ↔ IA transmitida ao vivo, além do heatmap de chegada de leads.
- **Funil** — jornada do lead em 6 estágios, motivos de descarte e critérios de qualificação.
- **Inteligência** — o raio-x de mercado que a IA coleta: dores, objeções, origens, serviços e perfil do lead.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) · [Tailwind CSS v4](https://tailwindcss.com) · [Recharts](https://recharts.org) · [lucide-react](https://lucide.dev)
- Identidade visual Vipple: preto absoluto + vermelho `#FF1717`, tipografia Neue Haas Grotesk / Poppins.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

## Roadmap

Conectar o painel a dados reais via **Supabase** (o n8n grava leads/conversas; o dashboard lê por queries/realtime). O arquivo `lib/data.ts` é a "tomada" onde essa integração vai entrar.

---

🤖 Construído com [Claude Code](https://claude.com/claude-code).
