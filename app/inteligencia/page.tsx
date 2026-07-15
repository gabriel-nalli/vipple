"use client";

import { SectionHeader } from "@/components/ui/kit";
import { CLIENT, TOTALS } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import PainsPanel from "@/components/tabs/inteligencia/PainsPanel";
import OriginsPanel from "@/components/tabs/inteligencia/OriginsPanel";
import ServicesPanel from "@/components/tabs/inteligencia/ServicesPanel";
import LeadProfilePanel from "@/components/tabs/inteligencia/LeadProfilePanel";

export default function InteligenciaPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* 1 · Hero */}
      <section className="stagger">
        <div className="reveal space-y-5">
          <SectionHeader
            as="h1"
            kicker="Inteligência de mercado"
            title={`O que ${fmtInt(TOTALS.contatos)} conversas`}
            accent="te ensinaram."
          />
          <p className="max-w-2xl text-sm font-light leading-relaxed text-ink-dim md:text-[0.95rem]">
            Cada conversa da {CLIENT.agentName} é uma pesquisa de mercado
            gratuita. Isso é o que seus leads estão dizendo.
          </p>
        </div>
      </section>

      {/* 2 · Dores & objeções × Origens */}
      <section className="stagger grid grid-cols-12 gap-5">
        <PainsPanel className="reveal col-span-12 lg:col-span-7" />
        <OriginsPanel className="reveal col-span-12 lg:col-span-5" />
      </section>

      {/* 3 · Serviços × Perfil do lead */}
      <section className="stagger grid grid-cols-12 gap-5">
        <ServicesPanel className="reveal col-span-12 lg:col-span-5" />
        <LeadProfilePanel className="reveal col-span-12 lg:col-span-7" />
      </section>
    </div>
  );
}
