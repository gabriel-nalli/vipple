/* Formatadores pt-BR — usar SEMPRE estes (nunca formatar na mão) */

const intFmt = new Intl.NumberFormat("pt-BR");
const brlFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const brlFullFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function fmtInt(n: number): string {
  return intFmt.format(Math.round(n));
}

export function fmtBRL(n: number): string {
  return brlFmt.format(n);
}

export function fmtBRLFull(n: number): string {
  return brlFullFmt.format(n);
}

export function fmtPct(n: number, decimals = 0): string {
  return `${n.toFixed(decimals).replace(".", ",")}%`;
}

/** Segundos → "8s" | "4min 12s" | "3h 47min" */
export function fmtDur(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s > 0 ? `${m}min ${s}s` : `${m}min`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/** Minutos relativos → "há 12 min" | "há 2h" */
export function fmtAgo(minutes: number): string {
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `há ${h}h${String(m).padStart(2, "0")}` : `há ${h}h`;
}
