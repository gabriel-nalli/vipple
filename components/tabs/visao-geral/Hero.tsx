"use client";

import { CLIENT, TOTALS } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import { LiveDot, useCountUp, useInViewOnce } from "@/components/ui/kit";

/** Número animado inline para a frase de impacto */
function CountNum({
  value,
  format = fmtInt,
  red = false,
}: {
  value: number;
  format?: (n: number) => string;
  red?: boolean;
}) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const v = useCountUp(value, inView, 1600);
  return (
    <span
      ref={ref}
      className={`num font-semibold ${red ? "text-vred" : "text-white"}`}
    >
      {format(v)}
    </span>
  );
}

export default function Hero() {
  const csat = TOTALS.csat.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
  });

  return (
    <section className="grid grid-cols-12 items-end gap-8">
      <div className="col-span-12 lg:col-span-8">
        <p className="kicker mb-5">{CLIENT.period}</p>
        <h1 className="display text-[2.7rem] text-white md:text-6xl">
          Sua operação,{" "}
          <span
            className="text-vred"
            style={{ textShadow: "0 0 44px rgba(255,23,23,0.45)" }}
          >
            multiplicada.
          </span>
        </h1>
        <p className="mt-7 max-w-2xl text-[0.95rem] font-light leading-relaxed text-ink-dim md:text-lg">
          Nos últimos 30 dias, a{" "}
          <span className="font-medium text-white">{CLIENT.agentName}</span>{" "}
          atendeu <CountNum value={TOTALS.contatos} /> leads, qualificou{" "}
          <CountNum value={TOTALS.qualificados} red /> e devolveu{" "}
          <CountNum
            value={TOTALS.horasEconomizadas}
            format={(n) => `${Math.round(n)}h`}
          />{" "}
          à sua equipe — respondendo em{" "}
          <CountNum
            value={TOTALS.primeiraRespostaSeg}
            format={(n) => `${Math.round(n)} segundos`}
            red
          />
          , 24/7.
        </p>
      </div>

      <div className="col-span-12 flex lg:col-span-4 lg:justify-end">
        <div className="stagger flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
          <span className="reveal pill pill-ghost">
            <LiveDot />
            Operação ativa
          </span>
          <span className="reveal pill pill-ghost">
            CSAT <span aria-hidden className="text-vred">★</span>{" "}
            <span className="num font-medium text-white">{csat}</span>
          </span>
          <span className="reveal pill pill-ghost">{CLIENT.plan}</span>
        </div>
      </div>
    </section>
  );
}
