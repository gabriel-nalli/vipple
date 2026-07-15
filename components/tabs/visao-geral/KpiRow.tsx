"use client";

import { DAILY, TOTALS } from "@/lib/data";
import { fmtDur, fmtInt, fmtPct } from "@/lib/format";
import { StatCard } from "@/components/ui/kit";

const SPARK_CONTATOS = DAILY.map((p) => p.contatos);
const SPARK_QUALIFICADOS = DAILY.map((p) => p.qualificados);

const PCT_FORA_HORARIO = fmtPct((TOTALS.foraHorario / TOTALS.contatos) * 100);
const TAXA_QUALIFICACAO = fmtPct(TOTALS.taxaQualificacao);

export default function KpiRow() {
  return (
    <section className="stagger grid grid-cols-12 gap-5">
      <StatCard
        className="reveal col-span-12 md:col-span-6 lg:col-span-3"
        kicker="Contatos atendidos"
        value={TOTALS.contatos}
        format={fmtInt}
        spark={SPARK_CONTATOS}
        hint="Conversas iniciadas no WhatsApp — todas atendidas de imediato, sem fila."
      />
      <StatCard
        className="reveal col-span-12 md:col-span-6 lg:col-span-3"
        kicker="Leads qualificados"
        value={TOTALS.qualificados}
        format={fmtInt}
        accent
        spark={SPARK_QUALIFICADOS}
        delta={{ value: TOTALS.ganhoVsManualPct, label: "vs. operação manual" }}
        hint={`${TAXA_QUALIFICACAO} de taxa de qualificação — só lead pronto chega ao seu time.`}
      />
      <StatCard
        className="reveal col-span-12 md:col-span-4 lg:col-span-2"
        kicker="Tempo de 1ª resposta"
        rawText={fmtDur(TOTALS.primeiraRespostaSeg)}
        delta={{ value: -99.9, goodWhenUp: false }}
        hint={`antes: ${fmtDur(TOTALS.primeiraRespostaAntesSeg)}`}
      />
      <StatCard
        className="reveal col-span-12 md:col-span-4 lg:col-span-2"
        kicker="Fora do horário · salvos"
        value={TOTALS.foraHorario}
        format={fmtInt}
        hint={`${PCT_FORA_HORARIO} dos contatos chegaram fora do comercial — nenhum ficou sem resposta.`}
      />
      <StatCard
        className="reveal col-span-12 md:col-span-4 lg:col-span-2"
        kicker="Horas devolvidas"
        rawText={`${TOTALS.horasEconomizadas}h`}
        hint="Triagem manual eliminada — sua equipe só entra na conversa que vale a pena."
      />
    </section>
  );
}
