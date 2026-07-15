"use client";

import { BEFORE_AFTER, CLIENT } from "@/lib/data";
import { Panel, SectionHeader } from "@/components/ui/kit";

export default function BeforeAfter() {
  return (
    <section>
      <Panel className="p-6 md:p-8">
        <SectionHeader
          kicker="A virada de chave"
          title="Antes"
          accent="× Depois"
          className="mb-7"
        />

        <div
          role="table"
          aria-label={`Comparativo antes e depois da ${CLIENT.agentName}`}
        >
          {/* Cabeçalho da tabela (desktop) */}
          <div
            role="row"
            className="hidden grid-cols-12 gap-4 border-b border-white/[0.06] pb-3 md:grid"
          >
            <p role="columnheader" className="kicker col-span-3 !text-[0.52rem]">
              Métrica
            </p>
            <p role="columnheader" className="kicker col-span-3 !text-[0.52rem]">
              Antes da {CLIENT.agentName}
            </p>
            <p className="col-span-1" aria-hidden />
            <p role="columnheader" className="kicker col-span-3 !text-[0.52rem]">
              Com a {CLIENT.agentName}
            </p>
            <p
              role="columnheader"
              className="kicker col-span-2 !text-[0.52rem] md:text-right"
            >
              Ganho
            </p>
          </div>

          <div role="rowgroup" className="stagger">
            {BEFORE_AFTER.map((row) => (
              <div
                role="row"
                key={row.label}
                className="reveal grid grid-cols-12 items-center gap-x-4 gap-y-2 rounded-lg border-b border-white/[0.04] px-1 py-4 transition-colors duration-300 last:border-0 hover:bg-white/[0.02]"
              >
                <p
                  role="rowheader"
                  className="col-span-12 text-[0.82rem] font-normal text-ink md:col-span-3"
                >
                  {row.label}
                </p>
                <p
                  role="cell"
                  className="num col-span-5 text-[0.8rem] font-light text-ink-mute line-through decoration-white/20 md:col-span-3"
                >
                  <span className="sr-only">antes: </span>
                  {row.before}
                </p>
                <p className="col-span-2 text-center text-vred md:col-span-1" aria-hidden>
                  →
                </p>
                <p
                  role="cell"
                  className="num col-span-5 text-[0.85rem] font-semibold text-white md:col-span-3"
                >
                  <span className="sr-only">com a {CLIENT.agentName}: </span>
                  {row.after}
                </p>
                <p role="cell" className="col-span-12 md:col-span-2 md:text-right">
                  <span className="sr-only">ganho: </span>
                  <span className="pill pill-money num !text-[0.68rem]">
                    {row.gain}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  );
}
