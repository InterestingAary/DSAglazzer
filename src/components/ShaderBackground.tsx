import { useEffect, useRef, useState } from "react";

const VERT = `attribute vec2 a_position; varying vec2 v_texCoord;
void main(){ v_texCoord = a_position*0.5+0.5; gl_Position = vec4(a_position,0.,1.); }`;

const FRAG = `precision highp float;
uniform float u_time; uniform vec2 u_resolution; varying vec2 v_texCoord;
void main(){
  vec2 uv = v_texCoord;
  vec2 center = vec2(0.5);
  float d = distance(uv, center);
  float angle = u_time * 0.05;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 rotUv = rot * (uv - center);
  vec2 grid = fract(uv * 40.0 + u_time * 0.02);
  float line = smoothstep(0.02, 0.0, abs(grid.x-0.5)) + smoothstep(0.02, 0.0, abs(grid.y-0.5));
  vec3 color = vec3(0.055, 0.045, 0.08);
  vec3 accent = vec3(0.545, 0.361, 0.965);
  float pulse = 0.5 + 0.5 * sin(u_time * 0.5);
  color += accent * (line * 0.06);
  color += accent * (1.0 - smoothstep(0.0, 0.8, d)) * 0.07 * pulse;
  gl_FragColor = vec4(color, 1.0);
}`;

interface ShaderBackgroundProps {
  className?: string;
}

/** Violet "DSA Universe" WebGL shader. No dependencies. Falls back to a CSS
 * gradient when WebGL is unavailable; renders a single static frame when the
 * user prefers reduced motion. */
export default function ShaderBackground({ className = "" }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();

    const draw = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    if (reduce) {
      draw(8);
      return;
    }

    const loop = () => {
      draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncSize) : null;
    ro?.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro?.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ background: "radial-gradient(80% 80% at 50% 40%, rgba(139,92,246,0.16), transparent 70%), linear-gradient(180deg,#15121b,#1d1a23)" }}
      />
    );
  }
  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ display: "block", width: "100%", height: "100%" }} />;
}