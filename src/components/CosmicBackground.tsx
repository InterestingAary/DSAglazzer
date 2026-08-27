import React, { useRef, useEffect } from 'react';

interface CosmicBackgroundProps {
  intensity?: number;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({intensity = 1}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
    interface ShootingStar {
      x: number; y: number; length: number; angle: number; alpha: number; speed: number;
    }
    interface Nebula {
      x: number; y: number; size: number; hue: number; alpha: number; speed: number;
    }

    const createStars = (): Star[] => {
      const stars: Star[] = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.3,
          speed: Math.random() * 0.3 + 0.05,
          brightness: Math.random() * 0.6 + 0.4,
          hue: Math.random() > 0.7 ? 240 + Math.random() * 40 : 220 + Math.random() * 20,
        });
      }
      return stars;
    };

    const createShootingStars = (): ShootingStar[] => {
      const shootingStars: ShootingStar[] = [];
      for (let i = 0; i < 2; i++) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.3,
          length: Math.random() * 80 + 40,
          angle: Math.random() * 0.3 + 0.1,
          alpha: 1,
          speed: Math.random() * 1.5 + 1,
        });
      }
      return shootingStars;
    };

    const createNebulae = (): Nebula[] => {
      const nebulae: Nebula[] = [];
      for (let i = 0; i < 4; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 200 + 100,
          hue: 230 + Math.random() * 40,
          alpha: Math.random() * 0.04 + 0.01,
          speed: Math.random() * 0.15 + 0.05,
        });
      }
      return nebulae;
    };

    const stars = createStars();
    const shootingStars = createShootingStars();
    const nebulae = createNebulae();

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      ctx.fillStyle = 'rgba(5, 5, 16, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae (depth layers)
      nebulae.forEach((nebula) => {
        nebula.x -= nebula.speed * intensity;
        if (nebula.x < -nebula.size) {
          nebula.x = canvas.width + nebula.size;
          nebula.y = Math.random() * canvas.height;
        }
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.size
        );
        gradient.addColorStop(0, `hsla(${nebula.hue}, 60%, 40%, ${nebula.alpha})`);
        gradient.addColorStop(0.5, `hsla(${nebula.hue + 20}, 50%, 30%, ${nebula.alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw stars
      stars.forEach((star) => {
        star.y += star.speed * intensity;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `hsla(${star.hue}, 60%, 70%, ${star.brightness * 0.5})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw shooting stars
      shootingStars.forEach((star) => {
        star.y += star.speed * intensity;
        star.alpha -= 0.008;
        if (star.alpha <= 0 || star.y > canvas.height) {
          star.y = Math.random() * canvas.height * 0.3;
          star.x = Math.random() * canvas.width;
          star.alpha = 1;
        }
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x + star.length * Math.cos(star.angle),
          star.y + star.length * Math.sin(star.angle)
        );
        gradient.addColorStop(0, `rgba(160, 180, 255, ${star.alpha})`);
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x + star.length * Math.cos(star.angle),
          star.y + star.length * Math.sin(star.angle)
        );
        ctx.stroke();
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <>
      {/* Deep space gradient base */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(5,5,16,1) 0%, #050510 100%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
    </>
  );
};
