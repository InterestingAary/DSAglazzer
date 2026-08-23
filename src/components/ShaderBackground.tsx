import { useEffect, useRef, useState } from "react";

const VERT = `attribute vec2 a_position; varying vec2 v_texCoord; void main(){ v_texCoord = a_position*0.5+0.5; gl_Position = vec4(a_position,0.,1.); }`;
const FRAG = `precision highp float;
uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_intensity; varying vec2 v_texCoord;
void main(){
  vec2 uv = v_texCoord;
  vec2 center = vec2(0.5);
  float d = distance(uv, center);
  float angle = u_time * 0.04;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 rotUv = rot * (uv - center);
  vec2 grid = fract(uv * 36.0 + vec2(u_time*0.015, u_time*0.01));
  float line = smoothstep(0.03, 0.0, abs(grid.x-0.5)) + smoothstep(0.03, 0.0, abs(grid.y-0.5));
  vec3 bg = vec3(0.055, 0.045, 0.08);
  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 whiteA = vec3(0.96, 0.96, 0.96);
  float pulse = 0.5 + 0.5 * sin(u_time * 0.6);
  vec2 normMouse = u_mouse / u_resolution;
  float mouseDist = distance(uv, vec2(normMouse.x, normMouse.y));
  float mouseGlow = smoothstep(0.35, 0.0, mouseDist) * 0.15;
  vec3 color = bg;
  color += violet * (line * 0.06 * u_intensity);
  color += violet * ((1.0 - smoothstep(0.0, 0.85, d)) * 0.08 * pulse * u_intensity);
  color += mix(violet, whiteA, sin(u_time*0.2)*0.5+0.5) * mouseGlow;
  gl_FragColor = vec4(color, 1.0);
}`;

interface ShaderBackgroundProps { className?: string; intensity?: number; }
export default function ShaderBackground({ className = "", intensity = 0.9 }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) { setFailed(true); return; }
    const compile = (type:number,src:string)=>{ const s=gl.createShader(type)!; gl.shaderSource(s,src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uInt = gl.getUniformLocation(prog, "u_intensity");
    let mousePos = { x: window.innerWidth/2, y: window.innerHeight/2 };
    const onMove = (e:MouseEvent)=>{ const r=canvas.getBoundingClientRect(); mousePos={ x: e.clientX - r.left, y: canvas.height - (e.clientY - r.top)}; };
    window.addEventListener("mousemove", onMove);
    const syncSize = ()=>{ const dpr=Math.min(window.devicePixelRatio||1,2); const w=Math.max(1,Math.floor(canvas.clientWidth*dpr)); const h=Math.max(1,Math.floor(canvas.clientHeight*dpr)); if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h);} };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf=0; const start=performance.now();
    const draw=(t:number)=>{ syncSize(); gl.viewport(0,0,canvas.width,canvas.height); if(uTime) gl.uniform1f(uTime, t); if(uRes) gl.uniform2f(uRes, canvas.width, canvas.height); if(uMouse) gl.uniform2f(uMouse, mousePos.x, mousePos.y); if(uInt) gl.uniform1f(uInt, intensity); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); };
    if(reduce){ draw(8); return ()=>{ window.removeEventListener("mousemove", onMove); }; }
    const loop=()=>{ draw((performance.now()-start)/1000); raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop);
    const ro = typeof ResizeObserver!=="undefined" ? new ResizeObserver(syncSize) : null; ro?.observe(canvas);
    const onVis=()=>{ cancelAnimationFrame(raf); if(!document.hidden) raf=requestAnimationFrame(loop); };
    document.addEventListener("visibilitychange", onVis);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); document.removeEventListener("visibilitychange", onVis); ro?.disconnect(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [intensity]);
  if (failed) return <div aria-hidden="true" className={className} style={{ background: "radial-gradient(80% 80% at 50% 40%, rgba(139,92,246,0.14), transparent 70%), linear-gradient(180deg,#15121b,#1d1a23)" }} />;
  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ display:"block", width:"100%", height:"100%" }} />;
}