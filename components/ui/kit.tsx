"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

/* ══════════════════════════════════════════════════════════════
   Kit de UI Vipple — todos os painéis usam ESTES componentes
   para manter a identidade 100% consistente entre as abas.
   ══════════════════════════════════════════════════════════════ */

/* ── Hooks ──────────────────────────────────────────────────── */

/** true a partir do momento em que o elemento entra na viewport */
export function useInViewOnce<T extends HTMLElement>(margin = "-40px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return { ref, inView };
}

/** Número animado 0 → alvo (easeOutExpo), respeita reduced-motion */
export function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

/* ── Blocos básicos ─────────────────────────────────────────── */

export function Panel({
  children,
  className = "",
  beam = false,
}: {
  children: ReactNode;
  className?: string;
  beam?: boolean;
}) {
  return (
    <div className={`panel ${beam ? "panel-beam" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** Cabeçalho de seção — título display com a palavra-chave em vermelho */
export function SectionHeader({
  kicker,
  title,
  accent,
  right,
  className = "",
  as = "h2",
}: {
  kicker: string;
  title: string;
  accent?: string;
  right?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  const Tag = as;
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <p className="kicker mb-2">{kicker}</p>
        <Tag className="display text-2xl text-white md:text-[1.9rem]">
          {title} {accent && <span className="text-vred">{accent}</span>}
        </Tag>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vred opacity-70" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-vred" />
    </span>
  );
}

export function Delta({
  value,
  suffix = "%",
  goodWhenUp = true,
  label,
}: {
  value: number;
  suffix?: string;
  goodWhenUp?: boolean;
  label?: string;
}) {
  const up = value >= 0;
  const good = goodWhenUp ? up : !up;
  return (
    <span
      className={`num inline-flex items-center gap-1 text-[0.7rem] font-medium ${
        good ? "text-money" : "text-vred-soft"
      }`}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      <span className="sr-only">{up ? "aumento de " : "queda de "}</span>
      {Math.abs(value).toLocaleString("pt-BR")}
      {suffix}
      {label && (
        <span className="ml-1 font-light text-ink-mute">{label}</span>
      )}
    </span>
  );
}

/* ── Sparkline (SVG puro, leve) ─────────────────────────────── */

export function Sparkline({
  data,
  width = 110,
  height = 30,
  stroke = "#FF1717",
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 3 - ((v - min) / span) * (height - 8);
    return `${x},${y}`;
  });
  const [lx, ly] = pts[pts.length - 1].split(",").map(Number);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="overflow-visible"
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
      <circle cx={lx} cy={ly} r={2.6} fill={stroke} />
      <circle cx={lx} cy={ly} r={5.5} fill={stroke} opacity={0.25} />
    </svg>
  );
}

/* ── StatCard — o tile de KPI padrão ────────────────────────── */

export function StatCard({
  kicker,
  value,
  format,
  rawText,
  delta,
  hint,
  spark,
  accent = false,
  className = "",
}: {
  kicker: string;
  /** valor numérico animado… */
  value?: number;
  format?: (n: number) => string;
  /** …ou texto direto (ex.: "8s", "24/7") */
  rawText?: string;
  delta?: { value: number; suffix?: string; goodWhenUp?: boolean; label?: string };
  hint?: string;
  spark?: number[];
  accent?: boolean;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const animated = useCountUp(value ?? 0, inView && value !== undefined);
  const display =
    rawText ?? (format ? format(animated) : Math.round(animated).toLocaleString("pt-BR"));

  return (
    <Panel
      className={`flex flex-col justify-between gap-3 p-5 ${className}`}
      beam={accent}
    >
      <div ref={ref} className="flex items-start justify-between gap-3">
        <p className="kicker !text-[0.56rem]">{kicker}</p>
        {delta && <Delta {...delta} />}
      </div>
      <div className="flex items-end justify-between gap-3">
        <p
          className={`display num text-[2.1rem] leading-none md:text-[2.5rem] ${
            accent ? "text-vred" : "text-white"
          }`}
          style={
            accent
              ? { textShadow: "0 0 30px rgba(255,23,23,0.45)" }
              : undefined
          }
        >
          {display}
        </p>
        {spark && <Sparkline data={spark} />}
      </div>
      {hint && (
        <p className="text-[0.68rem] font-light leading-relaxed text-ink-mute">
          {hint}
        </p>
      )}
    </Panel>
  );
}

/* ── RankRow — barra horizontal rotulada (categorias 3+) ────── */

export function RankRow({
  label,
  value,
  pct,
  sub,
  delay = 0,
  color = "#FF1717",
}: {
  label: string;
  /** texto do valor à direita (ex.: "41%" ou "60 leads") */
  value: string;
  /** largura da barra 0–100 */
  pct: number;
  sub?: string;
  delay?: number;
  color?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="group">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.8rem] font-normal text-ink">{label}</span>
        <span className="num text-[0.8rem] font-medium text-white">{value}</span>
      </div>
      <div className="h-[7px] w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: inView ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 12px ${color}55`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      {sub && (
        <p className="mt-1 text-[0.65rem] font-light text-ink-mute">{sub}</p>
      )}
    </div>
  );
}

/* ── Pills / badges ─────────────────────────────────────────── */

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    aguardando: {
      label: "Aguardando vendedor",
      cls: "bg-warn/15 text-warn border border-warn/30",
    },
    em_conversa: {
      label: "Em conversa",
      cls: "bg-white/[0.06] text-ink-dim border border-white/15",
    },
    ganho: {
      label: "Ganho",
      cls: "bg-money/15 text-money border border-money/30",
    },
    perdido: {
      label: "Perdido",
      cls: "bg-vred/10 text-vred-soft border border-vred/25",
    },
  };
  const s = map[status] ?? map.em_conversa;
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

/** Score de qualificação 0–100 em anel */
export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title={`Score de qualificação: ${score}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={score >= 85 ? "#FF1717" : score >= 70 ? "#FF5C47" : "#686868"}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={inView ? circ * (1 - score / 100) : circ}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span className="num absolute inset-0 flex items-center justify-center text-[0.7rem] font-semibold text-white">
        {score}
      </span>
    </div>
  );
}
