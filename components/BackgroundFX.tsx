"use client";

import { useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   BackgroundFX — a atmosfera da identidade Vipple:
   1. Campo de pontos halftone ondulando (como o fundo do PDF)
   2. "V" gigante sangrando na lateral com glow vermelho
   3. Vinhetas radiais vermelhas profundas
   ══════════════════════════════════════════════════════════════ */

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(); // reatribuir width/height limpou o bitmap; redesenha (essencial no reduced-motion)
    };

    const GAP = 26;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * GAP;
          const y = j * GAP;

          // Duas ondas viajantes sobrepostas (o "tecido" do PDF)
          const w1 = Math.sin(x * 0.011 + y * 0.006 + t * 0.9);
          const w2 = Math.sin(x * 0.004 - y * 0.012 + t * 0.55);
          const v = (w1 + w2) / 2; // -1 .. 1

          const r = 0.4 + (v + 1) * 0.85; // raio 0.4 → 2.1
          const alpha = 0.03 + (v + 1) * 0.05; // 0.03 → 0.13

          // Crista da onda ganha um leve calor vermelho
          const warm = Math.max(0, v - 0.55) * 2.2; // 0..1 só no topo
          const red = 255;
          const gb = Math.round(255 - warm * 210);

          ctx.beginPath();
          ctx.fillStyle = `rgba(${warm > 0 ? red : 200}, ${gb}, ${gb}, ${
            alpha + warm * 0.1
          })`;
          ctx.arc(x, y, r + warm * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps é suficiente e leve
      t += (now - last) / 1000;
      last = now;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      t = 2.4;
      draw(); // um frame estático bonito
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Campo de pontos halftone */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* V gigante sangrando à direita — assinatura da marca */}
      <img
        src="/vipple-logo.png"
        alt=""
        className="absolute -right-[12%] top-1/2 h-[130vh] w-auto -translate-y-1/2 select-none opacity-[0.055]"
        style={{
          filter: "drop-shadow(0 0 120px rgba(255,23,23,0.55)) saturate(1.4)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 60% 50%, black 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 60% 50%, black 30%, transparent 78%)",
        }}
      />

      {/* Vinhetas radiais vermelhas (como o slide de Planos) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 88% 8%, rgba(255,23,23,0.09), transparent 60%)," +
            "radial-gradient(ellipse 45% 40% at 4% 96%, rgba(255,23,23,0.05), transparent 55%)," +
            "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(163,18,18,0.06), transparent 65%)",
        }}
      />

      {/* Escurecimento suave nas bordas para foco central */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
