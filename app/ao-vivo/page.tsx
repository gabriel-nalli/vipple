"use client";

import StatusStrip from "@/components/tabs/ao-vivo/StatusStrip";
import LiveAttendance from "@/components/tabs/ao-vivo/LiveAttendance";
import WeeklyHeatmap from "@/components/tabs/ao-vivo/WeeklyHeatmap";

/* ══════════════════════════════════════════════════════════════
   AO VIVO — o pulso da operação agora.
   1. Strip de status (painel de missão, contadores vivos)
   2. Central de atendimentos: cards dos leads (clicáveis) ×
      conversa ao vivo do lead selecionado
   3. Heatmap semanal de chegada de leads
   ══════════════════════════════════════════════════════════════ */

export default function AoVivoPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      <StatusStrip />
      <LiveAttendance />
      <WeeklyHeatmap />
    </div>
  );
}
