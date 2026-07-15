"use client";

import Hero from "@/components/tabs/visao-geral/Hero";
import KpiRow from "@/components/tabs/visao-geral/KpiRow";
import AttendanceRoi from "@/components/tabs/visao-geral/AttendanceRoi";
import BeforeAfter from "@/components/tabs/visao-geral/BeforeAfter";
import FooterCharts from "@/components/tabs/visao-geral/FooterCharts";

/* ══════════════════════════════════════════════════════════════
   VISÃO GERAL — a tela que prova o impacto da Vipple IA
   Hero de impacto → 5 KPIs → atendimento diário + ROI →
   antes × depois → ritmo semanal + custo por qualificado
   ══════════════════════════════════════════════════════════════ */

export default function VisaoGeralPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      <Hero />
      <KpiRow />
      <AttendanceRoi />
      <BeforeAfter />
      <FooterCharts />
    </div>
  );
}
