import { useEffect, useRef } from "react";

const SECTIONS = [
  { id: "top", icon: "dashboard" },
  { id: "main-content", icon: "list" },
];

const ICONS: Record<string, React.ReactNode> = {
  dashboard: <path d="M13 6a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 3c-5 0-9 3.4-9 8v3h18v-3c0-4.6-4-8-9-8Z" />,
  list: <path d="M4 6h18v14H4V6Zm3 3 4 4-4 4m7 0h5" />,
  calendar: <path d="M6 4h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4h12M9 3v3m6-3v3" />,
  chart: <path d="M4 18h18M8 14v4m4-7v7m4-10v10" />,
  settings: <path d="M13 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-3v2.5M13 18v2.5M5.5 13H3m5.6-4.4-1.8-1.8M19.2 19.2l-1.8-1.8M20.5 13H23m-5.6 4.4 1.8 1.8M5.6 17.4l1.8-1.8" />,
};

export default function NeedleThread() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGSVGElement>(null);
  const motifRefs = useRef<(SVGSVGElement | null)[]>([]);
  const positions = useRef<number[]>([]);
  const docHeight = useRef(1);

  useEffect(() => {
    const measure = () => {
      docHeight.current = document.documentElement.scrollHeight;
      positions.current = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (el) return el.offsetTop;
        // fallback spaced positions
        return 0;
      });
      // if no sections found, distribute motifs down the page
      if (positions.current.every((p) => p === 0)) {
        positions.current = SECTIONS.map((_, i) => (i + 1) * (docHeight.current / (SECTIONS.length + 1)));
      }
    };
    measure();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (overlayRef.current) overlayRef.current.style.height = "100%";
      if (needleRef.current) needleRef.current.style.top = `${docHeight.current - 24}px`;
      motifRefs.current.forEach((el, i) => {
        if (el) {
          el.style.top = `${positions.current[i] + 64}px`;
          (el as unknown as HTMLElement).style.strokeDashoffset = "0";
        }
      });
      return;
    }
    let raf = 0;
    const tick = () => {
      const docH = docHeight.current;
      const vh = window.innerHeight;
      const max = Math.max(docH - vh, 1);
      const y = window.scrollY;
      const progress = Math.min(Math.max(y / max, 0), 1);
      if (overlayRef.current) overlayRef.current.style.height = `${(progress * 100).toFixed(2)}%`;
      if (needleRef.current) needleRef.current.style.top = `${(progress * docH).toFixed(0)}px`;
      motifRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = Math.min(Math.max((y + vh * 0.65 - positions.current[i]) / 130, 0), 1);
        el.style.top = `${positions.current[i] + 64}px`;
        (el as unknown as HTMLElement).style.strokeDashoffset = `${(60 * (1 - p)).toFixed(1)}`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2 z-[4] hidden w-9 lg:block">
      <div className="embroidery-base absolute inset-y-0 left-1/2 w-px -translate-x-1/2" />
      <div ref={overlayRef} className="embroidery-form absolute left-1/2 top-0 h-0 w-[2px] -translate-x-1/2" />
      <svg
        ref={needleRef}
        className="embroidery-needle absolute left-1/2 -translate-x-1/2"
        width="14"
        height="26"
        viewBox="0 0 14 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ color: "var(--accent)" }}
      >
        <circle cx="7" cy="4" r="2.6" />
        <path d="M7 7.5v14" />
      </svg>
      {SECTIONS.map((s, i) => (
        <svg
          key={s.id}
          ref={(el) => { motifRefs.current[i] = el; }}
          className="embroidery-motif absolute left-1/2 -translate-x-1/2"
          style={{ top: 0 }}
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          strokeDashoffset="60"
        >
          {ICONS[s.icon]}
        </svg>
      ))}
    </div>
  );
}