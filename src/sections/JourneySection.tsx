import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const journeyData = [
  { bg: '/assets/journey-1.jpg', img: '/assets/service-card-1.jpg' },
  { bg: '/assets/journey-2.jpg', img: '/assets/service-card-2.jpg' },
  { bg: '/assets/journey-3.jpg', img: '/assets/service-card-3.jpg' },
  { bg: '/assets/journey-4.jpg', img: '/assets/service-card-4.jpg' },
  { bg: '/assets/journey-5.jpg', img: '/assets/service-card-5.jpg' },
  { bg: '/assets/journey-6.jpg', img: '/assets/service-card-6.jpg' },
];

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 1080);
  const [pinnedDone, setPinnedDone] = useState(false);
  const progressRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  const cardH = 600;
  const travel = journeyData.length * cardH + vh * 0.5;

  // Pin + drive progress — end exactly when last card reaches final position
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${journeyData.length * cardH + window.innerHeight * 0.5}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setProgress(p);
        const idx = Math.min(Math.floor(p * journeyData.length), journeyData.length - 1);
        setActiveIndex(idx);
      },
      onLeave: () => setPinnedDone(true),
      onEnterBack: () => setPinnedDone(false),
    });
    stRef.current = st;

    return () => st.kill();
  }, []);

  // Recalculate ScrollTrigger on resize so pin end matches new travel
  useEffect(() => {
    const handler = () => setVh(window.innerHeight);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    stRef.current?.refresh();
  }, [vh]);

  // WebGL unrolling shader for background images
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) return;

    let animId: number;
    const isVisible = { value: true };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.value = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(section);

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        // Flip both axes = 180 degree rotation
        v_uv = 0.5 - a_position * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_progress;
      uniform float u_opacity;

      void main() {
        vec2 uv = v_uv;
        float progress = u_progress;

        // Drunken weave distortion — applied BEFORE texture lookup
        float weaveAmount = (1.0 - smoothstep(0.0, 0.6, progress)) * 0.012;
        float weave = sin(uv.y * 24.0 + u_time * 1.8) * weaveAmount;
        float weaveY = cos(uv.x * 20.0 + u_time * 1.5) * weaveAmount * 0.6;
        uv.x += weave;
        uv.y += weaveY;

        // Unroll effect: rolling paper peel
        float fold = smoothstep(0.0, 0.3, progress);
        float unfoldX = smoothstep(0.3, 1.0, progress);
        float rollWidth = 0.25;
        float rollPos = 1.0 - progress;
        float distFromRoll = abs(uv.x - rollPos);
        float inRoll = smoothstep(rollWidth, 0.0, distFromRoll);
        float bend = inRoll * 0.3 * sin(rollPos * 3.14159);
        uv.x += bend;
        float visible = smoothstep(rollPos + rollWidth * 0.5, rollPos - rollWidth * 0.5, uv.x);
        visible = mix(0.0, visible, fold);
        visible = mix(visible, 1.0, unfoldX);
        float shadow = inRoll * 0.3;

        vec4 tex = texture2D(u_texture, v_uv);
        tex.rgb -= shadow;
        tex.a = visible * u_opacity;

        gl_FragColor = tex;
      }
    `;

    function createShader(g: WebGLRenderingContext, type: number, source: string) {
      const shader = g.createShader(type);
      if (!shader) return null;
      g.shaderSource(shader, source);
      g.compileShader(shader);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Load textures
    const textures: WebGLTexture[] = [];
    journeyData.forEach((item) => {
      const tex = gl.createTexture();
      if (!tex) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      };
      img.src = item.bg;
      textures.push(tex);
    });

    const uTexture = gl.getUniformLocation(program, 'u_texture');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uProgress = gl.getUniformLocation(program, 'u_progress');
    const uOpacity = gl.getUniformLocation(program, 'u_opacity');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const startTime = performance.now();

    const render = () => {
      if (!isVisible.value) {
        animId = requestAnimationFrame(render);
        return;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLLOR_BUFFER_BIT);

      const elapsed = (performance.now() - startTime) / 1000;
      gl.uniform1f(uTime, elapsed);

      const totalProgress = progressRef.current;

      // Render all images — crossfade between them at fixed center, 180° rotated
      textures.forEach((tex, i) => {
        if (!tex) return;

        const imageStart = i / journeyData.length;
        const imageEnd = (i + 1) / journeyData.length;
        const scrollRange = imageEnd - imageStart;
        const imageProgress = Math.max(0, Math.min(1, (totalProgress - imageStart) / scrollRange));

        if (imageProgress <= 0 || imageProgress >= 1) return;

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uTexture, 0);
        gl.uniform1f(uProgress, imageProgress);

        // Each image fades in gently, holds, fades out — paced to match cards
        const opacity = Math.min(1, imageProgress * 3) * Math.max(0, 1 - Math.max(0, (imageProgress - 0.75) * 4));
        gl.uniform1f(uOpacity, Math.max(0, opacity));

        if (opacity <= 0.01) return;

        // Centered, original size — not stretched
        const imgW = canvas.width * 0.5;
        const imgH = imgW * 1.25;
        const vx = (canvas.width - imgW) / 2;
        const vy = (canvas.height - imgH) / 2;
        gl.viewport(vx, vy, imgW, imgH);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });

      gl.viewport(0, 0, canvas.width, canvas.height);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
      textures.forEach((t) => t && gl.deleteTexture(t));
    };
  }, []);

  // Opening statement scatter-to-assemble
  useEffect(() => {
    const el = openingRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll('.char');
      if (chars.length === 0) return;

      gsap.set(chars, {
        opacity: 0,
        x: () => (Math.random() - 0.5) * 400,
        y: () => (Math.random() - 0.5) * 200,
        rotation: () => (Math.random() - 0.5) * 60,
      });

      gsap.to(chars, {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  const totalCards = journeyData.length;
  const stackOffset = -progress * travel;

  return (
    <section
      ref={sectionRef}
      id="journey-section"
      className="relative w-full bg-black"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* WebGL canvas — unrolling shader background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(210,207,204,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(210,207,204,0.06) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Opening statement */}
      <div
        ref={openingRef}
        className="absolute z-[3] px-5"
        style={{ top: '6%', left: 0, right: 0 }}
      >
        <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-4">
          [ journey ]
        </p>
        <h2
          className="font-normal tracking-[-0.03em] max-w-[700px]"
          style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 3rem)',
            lineHeight: 1.05,
            fontFamily: "'Geist Sans', sans-serif",
          }}
        >
          <span className="text-[#f2f2f2]">
            {splitText("You don't have to be strong. You have to be ")}
          </span>
          <span className="text-[#c4a96a]">
            {splitText('real')}
          </span>
          <span className="text-[#f2f2f2]">{splitText('.')}</span>
        </h2>
      </div>

      {/* Card stack — scrolls upward through viewport */}
      <div
        ref={stackRef}
        className="absolute z-[3]"
        style={{
          top: '100%',
          left: '50%',
          transform: `translateX(-50%) translateY(${stackOffset}px)`,
          width: 'min(360px, 80vw)',
          transition: 'transform 0.1s linear',
        }}
      >
        {journeyData.map((item, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;

          return (
            <div key={i}>
                <div
                  className="flex justify-center py-24"
                  style={{
                    opacity: isActive ? 1 : isPast ? 0.12 : 0.2,
                    transform: `scale(${isActive ? 1 : 0.92})`,
                    filter: isActive ? 'blur(0px) saturate(1)' : isPast ? 'blur(2px) saturate(0.3)' : 'blur(4px) saturate(0.15)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease, filter 0.8s ease',
                  }}
                >
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                      width: 'clamp(180px, 35vw, 360px)',
                      aspectRatio: '4/5',
                      transform: `rotate(${i % 2 === 0 ? 20 : -20}deg)`,
                      boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)',
                      transition: 'box-shadow 0.4s ease',
                    }}
                  >
                    <img
                      src={item.img}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ transform: `rotate(${i % 2 === 0 ? -20 : 20}deg) scale(1.15)` }}
                    />
                  </div>

                </div>
            </div>
          );
        })}
      </div>

      {/* Closing CTA */}
      {pinnedDone && (
        <div
          className="absolute z-[4] flex flex-col items-center text-center px-5"
          style={{ bottom: '10%', left: 0, right: 0 }}
        >
          <p className="text-[#b5b3ad]" style={{ fontSize: '14px', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
            Every journey begins with a single step.
          </p>
        </div>
      )}
    </section>
  );
}
