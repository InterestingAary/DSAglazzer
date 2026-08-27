import React, { useRef, useEffect, useState } from 'react';

interface CosmicBackgroundProps {
  intensity?: number;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({intensity = 0.6}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Star {
      x: number; y: number; size: number; speed: number; brightness: number; hue: number;
    }

    const createStars = (): Star[] => {
      const stars: Star[] = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.2,
          speed: Math.random() * 0.15 + 0.02,
          brightness: Math.random() * 0.4 + 0.2,
          hue: 230 + Math.random() * 30,
        });
      }
      return stars;
    };

    const stars = createStars();

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      ctx.fillStyle = 'rgba(8, 9, 14, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y += star.speed * intensity;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `hsla(${star.hue}, 50%, 60%, ${star.brightness * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, prefersReducedMotion]);

  return (
    <>
      {/* Deep space gradient base */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(8,9,14,1) 0%, #08090e 100%)',
        }}
      />
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}
    </>
  );
};
