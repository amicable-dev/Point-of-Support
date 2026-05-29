import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const featureCards = [
  {
    img: '/assets/philosophy-card-1.jpg',
    caption: 'meeting without pressure',
  },
  {
    img: '/assets/philosophy-card-2.jpg',
    caption: 'finding roots, not symptoms',
  },
  {
    img: '/assets/philosophy-card-3.jpg',
    caption: 'support for growth',
  },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Ambient cursor glow canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on mobile
    if (window.innerWidth < 768) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animId: number;
    let isVisible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader - ambient cursor glow
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform vec2 u_mouse;

      float glow(float d, float str, float range) {
        return str / (pow(d, 2.2) + pow(1.0 / (range + 1e-5), 1.8)) * 0.04;
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453);
        float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
        float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
        float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 p = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
        vec2 mousePos = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);
        float mouseInfluence = glow(length(p - mousePos), 1.0, 4.0);
        float time = u_time * 0.3;
        float n1 = noise(p * 3.0 + time);
        float n2 = noise(p * 2.0 - time * 0.5);
        vec3 ambient = vec3(0.015, 0.015, 0.018);
        vec3 color = mix(ambient, ambient + vec3(0.02, 0.015, 0.01), (n1 + n2) * 0.5);
        color += vec3(0.45, 0.35, 0.2) * mouseInfluence;
        color = clamp(color, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const startTime = performance.now();

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }
      const elapsed = (performance.now() - startTime) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative w-full bg-black overflow-hidden py-16 md:py-36"
    >
      {/* Ambient cursor glow canvas */}
      {typeof window !== 'undefined' && window.innerWidth >= 768 && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* Content */}
      <div className="relative z-[1] px-5">
        {/* Section label */}
        <ScrollReveal>
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-10">
            [ philosophy ]
          </p>
        </ScrollReveal>

        {/* Main heading + body */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 mb-20">
          <ScrollReveal className="md:w-[60%]">
            <h2
              className="font-normal tracking-[-0.03em]"
              style={{
                fontSize: 'clamp(2rem, 4vw, 5rem)',
                lineHeight: 1.05,
                fontFamily: "'Geist Sans', sans-serif",
              }}
            >
              <span className="text-[#f2f2f2]">
                You are not supposed to &quot;handle it.&quot;
              </span>{' '}
              <span className="text-[#c4a96a]">
                You have the right to ask for help.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal className="md:w-[40%] flex items-center" delay={0.2}>
            <p
              className="text-[#b5b3ad] max-w-[400px]"
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              My work is not about &quot;fixing&quot; — it is about accompaniment:
              during times of loss of support, after burnout, in the search for
              voice, after anxiety, in relationship crises, during fear. The main
              tool is our trust.
            </p>
          </ScrollReveal>
        </div>

        {/* Feature cards */}
        <ScrollReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10"
          stagger={0.15}
        >
          {featureCards.map((card, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="overflow-hidden mb-4">
                <img
                  src={card.img}
                  alt={card.caption}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover transition-all duration-600 group-hover:scale-[1.03] group-hover:brightness-110"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] flex items-center gap-2">
                {card.caption}
                <span className="w-1 h-1 rounded-full bg-[#c4a96a]" />
              </p>
            </div>
          ))}
        </ScrollReveal>

        {/* Stages button */}
        <ScrollReveal className="flex justify-end" delay={0.3}>
          <button
            onClick={() =>
              document
                .getElementById('journey-section')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-7 py-3.5 bg-transparent text-[#f2f2f2] text-[13px] uppercase tracking-[0.08em] border cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-all duration-350"
            style={{
              borderColor: 'rgba(255,255,255,0.3)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            [ stages ]
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
