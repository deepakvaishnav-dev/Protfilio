import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Magnetic } from "./ui/Magnetic";

// ─────────────────────────────────────────────────────────────────────────────
// Spring Physics Tokens — stiffness:180, damping:12, mass:0.8
// ─────────────────────────────────────────────────────────────────────────────
const SPRING_BASE = { type: "spring" as const, stiffness: 180, damping: 12, mass: 0.8 };
const SPRING_SNAP = { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.6 };

// Narrative stagger — 0.05s increments drive eye movement top → bottom
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Eyebrow — slides in from left axis for distinct directional narrative
const eyebrowVariants = {
  hidden: { opacity: 0, x: -22, willChange: "transform" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING_BASE, delay: 0.05 },
  },
};

// Heading lines — masked clip reveal, spring-settled
const wordRevealVariants = {
  hidden: { y: "110%", willChange: "transform" },
  visible: {
    y: "0%",
    transition: { ...SPRING_BASE },
  },
};

// Body text — fades + rises
const itemVariants = {
  hidden: { opacity: 0, y: 24, willChange: "transform, opacity" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_BASE },
  },
};

// Buttons — pop-in with tighter spring
const buttonGroupVariants = {
  hidden: { opacity: 0, y: 18, willChange: "transform, opacity" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_SNAP, delay: 0.35 },
  },
};

// Scroll cue — springs up from bottom
const scrollCueVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_BASE, delay: 0.55 },
  },
};

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const heroSection = heroRef.current;
    if (!canvas || !heroSection) return;

    let width = window.innerWidth;
    let height = heroSection.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function makeGlowTexture(hex: string) {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      if (ctx) {
        const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grd.addColorStop(0, hex + "ff");
        grd.addColorStop(0.35, hex + "88");
        grd.addColorStop(1, hex + "00");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(c);
    }

    const glowTexMain = makeGlowTexture("#4640DE");
    const glowTexAccent = makeGlowTexture("#12A594");

    const NODE_COUNT = window.innerWidth < 700 ? 40 : 85;
    const RANGE = 75;
    const nodes: THREE.Sprite[] = [];
    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < NODE_COUNT; i++) {
      const isAccent = i % 9 === 0;
      const mat = new THREE.SpriteMaterial({
        map: isAccent ? glowTexAccent : glowTexMain,
        transparent: true,
        opacity: isAccent ? 0.55 : 0.42,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(mat);
      const scale = isAccent ? 2.2 + Math.random() * 1.1 : 1.2 + Math.random() * 1.4;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(
        (Math.random() - 0.5) * RANGE * 1.6,
        (Math.random() - 0.5) * RANGE,
        (Math.random() - 0.5) * RANGE * 0.6
      );
      sprite.userData = {
        speed: 0.05 + Math.random() * 0.1,
        offset: Math.random() * Math.PI * 2,
        baseY: sprite.position.y,
        baseOpacity: mat.opacity,
      };
      group.add(sprite);
      nodes.push(sprite);
    }

    const getLineColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark ? 0x3a3d4a : 0xd8d8e4;
    };

    const lineMat = new THREE.LineBasicMaterial({
      color: getLineColor(),
      transparent: true,
      opacity: 0.65,
    });

    const linePositions: number[] = [];
    const maxDist = 20;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if (d < maxDist) {
          linePositions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
          linePositions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineSegments);

    // ── Mouse inertia — raised lerp factor for more responsive feel ──
    let mouseX = 0,
      mouseY = 0,
      targetRotY = 0,
      targetRotX = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
      targetRotY = mouseX * 0.35;
      targetRotX = mouseY * 0.2;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      width = window.innerWidth;
      height = heroSection.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
      lineMat.color.setHex(getLineColor());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let animationId: number;
    let t = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      t += 0.01;
      if (!reduceMotion) {
        // Raised lerp 0.02 → 0.05 for responsive inertia with natural mass
        group.rotation.y += (targetRotY - group.rotation.y) * 0.05 + 0.0006;
        group.rotation.x += (-targetRotX - group.rotation.x) * 0.05;

        nodes.forEach((n) => {
          // GPU-only y-axis float — only translateY, composited on GPU
          n.position.y =
            n.userData.baseY + Math.sin(t * n.userData.speed * 4 + n.userData.offset) * 1.5;
          n.material.opacity =
            n.userData.baseOpacity *
            (0.7 + 0.3 * Math.sin(t * n.userData.speed * 6 + n.userData.offset));
        });
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      group.remove(lineSegments);
      nodes.forEach((n) => {
        group.remove(n);
        n.material.dispose();
      });
      lineGeo.dispose();
      lineMat.dispose();
      glowTexMain.dispose();
      glowTexAccent.dispose();
      renderer.dispose();
    };
  }, []);

  const handleScrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="hero relative min-h-screen flex items-center overflow-hidden"
      style={{ willChange: "transform" }}
    >
      {/* Three.js interactive canvas network */}
      <canvas
        id="hero-canvas"
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-[0.85] pointer-events-none"
        style={{ willChange: "transform" }}
      />

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-grid opacity-[0.25] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="wrap hero-content relative z-10 pt-20"
        style={{ willChange: "transform" }}
      >
        {/* Eyebrow — slides from left axis (distinct from y-axis heading) */}
        <motion.div
          variants={eyebrowVariants}
          className="eyebrow inline-flex items-center gap-2 mb-8"
          style={{ willChange: "transform, opacity" }}
        >
          open to full-time roles · jaipur, india
        </motion.div>

        {/* Heading — masked word reveal with spring settle */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="reveal-word block leading-none">
            <motion.span variants={wordRevealVariants} style={{ willChange: "transform" }}>
              Full-stack developer
            </motion.span>
          </span>
          <span className="reveal-word block leading-none">
            <motion.span
              variants={wordRevealVariants}
              style={{ willChange: "transform" }}
            >
              who ships <em className="not-italic text-primary">connected systems.</em>
            </motion.span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="lead max-w-[560px] text-muted-foreground text-lg mb-12"
          style={{ willChange: "transform, opacity" }}
        >
          MERN + TypeScript on the front, Node &amp; AI/automation pipelines underneath — I wire
          products end to end, from schema to webhook, and I'm currently looking for a full-time
          engineering seat.
        </motion.p>

        {/* Action buttons — snap-in with tighter spring, scale micro-bounce */}
        <motion.div
          variants={buttonGroupVariants}
          className="hero-actions flex gap-4 flex-wrap"
          style={{ willChange: "transform, opacity" }}
        >
          <Magnetic multiplier={0.2}>
            <motion.a
              href="#work"
              whileHover={{ scale: 1.04, transition: { ...SPRING_SNAP, duration: undefined } }}
              whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="btn-primary px-8 py-4 bg-foreground text-background font-semibold rounded-full flex items-center gap-2.5 transition-colors duration-300 hover:bg-primary hover:text-white"
              style={{ willChange: "transform" }}
            >
              See the work →
            </motion.a>
          </Magnetic>
          <Magnetic multiplier={0.25}>
            <motion.a
              href="mailto:deepakvaishnav486@gmail.com"
              whileHover={{ scale: 1.03, transition: { ...SPRING_SNAP, duration: undefined } }}
              whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="btn-ghost px-8 py-4 border border-border bg-card hover:border-foreground hover:bg-secondary font-medium rounded-full transition-colors duration-300"
              style={{ willChange: "transform" }}
            >
              Email me
            </motion.a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — springs up from below after content reveals */}
      <motion.button
        variants={scrollCueVariants}
        initial="hidden"
        animate="visible"
        onClick={handleScrollDown}
        whileHover={{ opacity: 1, y: -2, transition: { duration: 0.18, ease: "easeOut" } }}
        className="scroll-cue absolute bottom-10 left-8 z-10 flex items-center gap-2.5 mono text-[10px] text-muted-foreground uppercase tracking-widest"
        style={{ willChange: "transform, opacity" }}
      >
        <motion.span
          className="line w-px h-9 block bg-gradient-to-b from-muted-foreground to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top", willChange: "transform, opacity" }}
        />
        scroll
      </motion.button>
    </section>
  );
}
