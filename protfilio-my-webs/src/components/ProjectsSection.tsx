import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger
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

// Constant floating oscillator wrapper to simulate cards floating in 3D space
function FloatingCardWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.to(el, {
      y: "+=12",
      duration: 3.5 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay,
    });

    return () => {
      anim.kill();
    };
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}

// Holographic 3D parallax tilt card
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

    // Tilt card surface container
    gsap.to(card, {
      rotateY: px * 14,
      rotateX: -py * 14,
      transformPerspective: 800,
      duration: 0.35,
      ease: "power2.out",
    });

    // Parallax shift contents relative to tilt angle
    if (content) {
      gsap.to(content, {
        x: px * 8,
        y: py * 8,
        z: 14,
        transformPerspective: 800,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    if (content) {
      gsap.to(content, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`p-card cursor-default ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div ref={contentRef} style={{ transformStyle: "preserve-3d" }}>
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
      }),
    });

    return () => {
      scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <section id="work" className="py-36 relative overflow-hidden bg-transparent">
      {/* Background visual overlays */}
      <div className="absolute inset-0 bg-grid opacity-[0.15] pointer-events-none" />

      <div className="wrap">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 max-w-[640px]"
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
            <div ref={pulseRef} className="spine-pulse" />
          </div>

          {/* Project timeline nodes */}
          {projects.map((proj, index) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="p-node"
            >
              {/* Spine marker bullet */}
              <div className="p-marker" />

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

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="mono text-[10px] font-semibold border border-border px-2.5 py-1 rounded bg-secondary text-foreground/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="p-links text-xs font-semibold">
                    {proj.isPrivate ? (
                      <span className="private text-muted-foreground flex items-center gap-1.5 mono text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground inline-block" />
                        repo private — case study on request
                      </span>
                    ) : (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-foreground inline-flex items-center gap-1 transition-colors duration-200"
                      >
                        {proj.linkLabel}
                      </a>
                    )}
                  </div>
                </TiltCard>
              </FloatingCardWrapper>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
