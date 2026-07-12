import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  idx: string;
  stage: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  isPrivate?: boolean;
}

const projects: Project[] = [
  {
    idx: "Node 01",
    stage: "AI · voice assistant",
    title: "JARVIS",
    description:
      "A Python-based personal AI assistant that automates day-to-day tasks through natural voice/text commands — the project that pulled me from 'using AI' to actually building with it.",
    tags: ["Python", "AI", "Automation"],
    link: "https://github.com/deepakvaishnav-dev/JARVIS",
    linkLabel: "GitHub ↗",
  },
  {
    idx: "Node 02",
    stage: "automation · n8n + OpenAI",
    title: "WhatsApp Automation Suite",
    description:
      "An automation pipeline connecting the WhatsApp API, n8n, and OpenAI — messages get read, understood, and answered without anyone touching a keyboard. My most-discussed post on LinkedIn.",
    tags: ["n8n", "OpenAI API", "WhatsApp API"],
    link: "https://www.linkedin.com/posts/deepak-vaishnav-5185b9396_whatsappapi-n8n-openai-share-7451227544332288000-Oy7f",
    linkLabel: "Case study ↗",
  },
  {
    idx: "Node 03",
    stage: "AI · edtech",
    title: "Study Buddy AI",
    description:
      "An AI-powered learning platform built to help students learn faster — AI chat assistant, notes management, and a smart-learning mode wrapped in a clean, responsive UI.",
    tags: ["React", "TypeScript", "Node.js", "MongoDB"],
    link: "https://study-buddy-ai-kohl.vercel.app/",
    linkLabel: "Live demo ↗",
  },
  {
    idx: "Node 04",
    stage: "fintech · AI insights",
    title: "Expense Tracker AI",
    description:
      "A modern expense-management app with a full analytics dashboard and AI-generated spending suggestions — built to make 'where did my money go' an answerable question.",
    tags: ["React", "TypeScript", "AI Insights"],
    isPrivate: true,
  },
  {
    idx: "Node 05",
    stage: "developer tooling",
    title: "Devhub-AI",
    description:
      "An AI-assisted developer productivity tool, built to fold everyday dev tasks into one workspace instead of ten browser tabs.",
    tags: ["TypeScript", "AI"],
    link: "https://github.com/deepakvaishnav-dev/Devhub-AI",
    linkLabel: "GitHub ↗",
  },
  {
    idx: "Node 06",
    stage: "browser tooling",
    title: "Productivity Chrome Extension",
    description:
      "A React + TypeScript browser extension with authentication and a dashboard view — small surface area, real engineering underneath.",
    tags: ["React", "TypeScript", "Chrome APIs"],
    isPrivate: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Floating Card Wrapper — GPU-accelerated GSAP quickTo float
// ─────────────────────────────────────────────────────────────────────────────
function FloatingCardWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // GPU-composited float: use translate3d path via GSAP y prop (triggers GPU layer)
    const anim = gsap.to(el, {
      y: "+=14",
      duration: 3.2 + Math.random() * 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay,
      // Force GPU compositing
      force3D: true,
    });

    return () => { anim.kill(); };
  }, [delay]);

  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Holographic 3D Tilt Card — asymmetric enter/exit timing
// ─────────────────────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    // FAST response on enter (<50ms): power2.out at 0.2s
    gsap.to(card, {
      rotateY: px * 14,
      rotateX: -py * 14,
      transformPerspective: 900,
      duration: 0.2,          // Fast snap-in
      ease: "power2.out",
      force3D: true,
      overwrite: "auto",
    });

    if (content) {
      gsap.to(content, {
        x: px * 10,
        y: py * 10,
        z: 16,
        transformPerspective: 900,
        duration: 0.2,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      });
    }
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card) return;

    // SLOW asymmetric return: cubic organic settle at 0.7s
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,          // Asymmetric — slow organic return
      ease: "power3.out",
      force3D: true,
      overwrite: "auto",
    });

    if (content) {
      gsap.to(content, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.65,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`p-card cursor-default ${className}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <div ref={contentRef} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pipeline = pipelineRef.current;
    const pulse = pulseRef.current;
    if (!pipeline || !pulse) return;

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: pipeline,
      start: "top 42%",
      end: "bottom 58%",
      scrub: true,
      animation: gsap.to(pulse, {
        top: "100%",
        ease: "none",
        force3D: true,
      }),
    });

    return () => { scrollTriggerInstance.kill(); };
  }, []);

  return (
    <section id="work" className="py-36 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-grid opacity-[0.15] pointer-events-none" />

      <div className="wrap">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 32, willChange: "transform, opacity" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 160, damping: 18, mass: 0.9 }}
          className="mb-24 max-w-[640px]"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="mono text-xs uppercase tracking-wider text-accent mb-4 block font-semibold">
            03 — selected work
          </span>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            From idea to deployed pipeline
          </h2>
          <p className="text-muted-foreground text-lg">
            A run of the projects I'd actually want a recruiter to open — each one is a full loop:
            interface, backend, and (mostly) an AI or automation layer doing real work.
          </p>
        </motion.div>

        {/* Pipeline timeline */}
        <div ref={pipelineRef} className="pipeline">
          {/* Vertical central spine line */}
          <div className="pipeline-spine">
            {/* Glowing travelling pulse node */}
            <div ref={pulseRef} className="spine-pulse" style={{ willChange: "transform, top" }} />
          </div>

          {/* Project timeline nodes — alternating x-axis stagger for L/R narrative */}
          {projects.map((proj, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={proj.title}
                initial={{
                  opacity: 0,
                  x: isEven ? -40 : 40,   // Alternating L/R entrance
                  y: 30,
                  willChange: "transform, opacity",
                }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 14,
                  mass: 0.9,
                  delay: 0.05,
                }}
                className="p-node"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Spine marker bullet — pulse on hover */}
                <motion.div
                  className="p-marker"
                  whileHover={{
                    scale: 1.5,
                    transition: { type: "spring", stiffness: 400, damping: 16 },
                  }}
                  style={{ willChange: "transform" }}
                />

                {/* Side Stage Metadata */}
                <div className="p-meta">
                  <span className="idx mono text-xs font-semibold text-primary block mb-2">
                    {proj.idx}
                  </span>
                  <span className="stage text-xs uppercase tracking-wider font-semibold text-muted-foreground block">
                    {proj.stage}
                  </span>
                </div>

                {/* Floating Wrapper & Interactive Card */}
                <FloatingCardWrapper delay={index * 0.18}>
                  <TiltCard>
                    <h3 className="text-xl font-bold mb-3">{proj.title}</h3>
                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Tech tags — spring cascade on parent entry */}
                    <motion.div
                      className="flex flex-wrap gap-2 mb-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {proj.tags.map((t) => (
                        <motion.span
                          key={t}
                          variants={{
                            hidden: { opacity: 0, scale: 0.82, y: 6 },
                            visible: {
                              opacity: 1,
                              scale: 1,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 320,
                                damping: 22,
                              },
                            },
                          }}
                          className="mono text-[10px] font-semibold border border-border px-2.5 py-1 rounded bg-secondary text-foreground/80"
                          style={{ willChange: "transform, opacity" }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Links */}
                    <div className="p-links text-xs font-semibold">
                      {proj.isPrivate ? (
                        <span className="private text-muted-foreground flex items-center gap-1.5 mono text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground inline-block" />
                          repo private — case study on request
                        </span>
                      ) : (
                        <motion.a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-foreground inline-flex items-center gap-1 transition-colors duration-150"
                          whileHover={{
                            x: 3,
                            transition: { type: "spring", stiffness: 400, damping: 20 },
                          }}
                          style={{ willChange: "transform" }}
                        >
                          {proj.linkLabel}
                        </motion.a>
                      )}
                    </div>
                  </TiltCard>
                </FloatingCardWrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
