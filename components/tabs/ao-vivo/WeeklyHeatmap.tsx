"use client";

import { Fragment } from "react";
import { Panel, SectionHeader } from "@/components/ui/kit";
import { CHART, seqColor } from "@/components/charts/theme";
import { HEATMAP_DAYS, HEATMAP_HOURS, heatValue, TOTALS } from "@/lib/data";
import { fmtPct } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   HEATMAP SEMANAL — 7 dias × 18 horas (06h–23h).
   Rampa sequencial de vermelho (luminosidade monotônica) via
   seqColor(). Tooltip nativo por célula; hover ganha ring branco.
   ══════════════════════════════════════════════════════════════ */

export default function WeeklyHeatmap() {
  const foraPct = fmtPct((TOTALS.foraHorario / TOTALS.contatos) * 100);

  return (
    <section className="space-y-6">
      <SectionHeader
        kicker="Mapa de calor · últimos 30 dias"
        title="Quando seus leads"
        accent="chegam"
        right={<span className="pill pill-ghost">06h–23h · seg–dom</span>}
      />

      <Panel className="p-6 md:p-8">
        {/* grade — rola horizontalmente no mobile */}
        <div className="relative">
          <div className="overflow-x-auto pb-1">
            <div
              role="img"
              aria-label="Mapa de calor de contatos por dia e hora; picos nas noites de segunda a quarta, entre 19h e 22h."
              className="grid min-w-[760px] gap-[2px]"
              style={{
                gridTemplateColumns: `2.6rem repeat(${HEATMAP_HOURS.length}, minmax(0, 1fr))`,
              }}
            >
            {/* cabeçalho de horas */}
            <div />
            {HEATMAP_HOURS.map((h) => (
              <div
                key={h}
                className="num pb-1.5 text-center text-[0.58rem] font-light text-ink-mute"
              >
                {h}h
              </div>
            ))}

            {/* linhas: dia + 18 células */}
            {HEATMAP_DAYS.map((day, di) => (
              <Fragment key={day}>
                <div className="flex items-center pr-2 text-[0.6rem] font-light uppercase tracking-[0.18em] text-ink-mute">
                  {day}
                </div>
                {HEATMAP_HOURS.map((h) => {
                  const v = heatValue(di, h);
                  return (
                    <div
                      key={h}
                      title={`${day} ${h}h · intensidade ${v}`}
                      className="h-[26px] cursor-default rounded-[3px] transition-all duration-150 hover:z-10 hover:brightness-125 hover:ring-1 hover:ring-white/85"
                      style={{ background: seqColor(v) }}
                    />
                  );
                })}
              </Fragment>
            ))}
            </div>
          </div>

          {/* dica visual de scroll no mobile — fade na borda direita, só <lg */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent lg:hidden"
          />
        </div>

        {/* legenda da rampa + insight */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/[0.06] pt-5">
          <div className="flex items-center gap-3">
            <span className="text-[0.62rem] font-light text-ink-mute">
              menos
            </span>
            <span
              aria-hidden
              className="h-[6px] w-36 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${CHART.seq.join(", ")})`,
              }}
            />
            <span className="text-[0.62rem] font-light text-ink-mute">
              mais
            </span>
          </div>

          <p className="max-w-xl text-[0.78rem] font-light leading-relaxed text-ink-dim">
            Pico nas noites de seg–qua, entre 19h e 22h —{" "}
            <span className="num font-medium text-white">{foraPct}</span> do
            volume chega fora do horário comercial. A Via cobre{" "}
            <span className="num font-medium text-vred">100%</span>.
          </p>
        </div>
      </Panel>
    </section>
  );
}
