import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSkillIcon } from "./ui/AnimatedSkillIcon";
import anime from "animejs/lib/anime.es.js";
import gsap from "gsap";

interface SkillCardProps {
  title: string;
  iconType: "frontend" | "backend" | "database" | "ai";
  tags: string[];
  delay: number;
  spotlightColor: string;
  index: number;
}

function SkillCard({ title, iconType, tags, delay, spotlightColor, index }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [entranceFinished, setEntranceFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<SVGRectElement>(null);
  const floatRef = useRef<gsap.core.Tween | null>(null);

  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  // Self-drawing blueprint border animation — enhanced easing
  useEffect(() => {
    if (isInView) {
      const border = borderRef.current;
      if (border) {
        const length = border.getTotalLength ? border.getTotalLength() : 1200;
        border.style.strokeDasharray = `${length}`;
        border.style.strokeDashoffset = `${length}`;

        anime({
          targets: border,
          strokeDashoffset: [length, 0],
          duration: 1600,
          // Tighter cubic-bezier for snappier blueprint draw
          easing: "cubicBezier(0.22, 1, 0.36, 1)",
          delay: delay * 1000,
          complete: () => { setEntranceFinished(true); },
        });
      }
    }
  }, [isInView, delay]);

  // GPU-composited GSAP bob float — replaces CSS keyframe to stay on compositor thread
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isInView) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const durations = [5.2, 5.8, 6.4, 5.0];
    const amounts = [-7, -11, -8, -12];

    floatRef.current = gsap.to(el, {
      y: amounts[index % 4],
      duration: durations[index % 4],
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.22,
      force3D: true,
    });

    return () => { floatRef.current?.kill(); };
  }, [isInView, index]);

  // Real-time mouse tracking for 3D tilt + spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = (yc - y) / 12;
    const tiltY = (x - xc) / 12;

    // Fast snap-in: 0.08s (under 100ms response target)
    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      translateY: -8,
      scale: 1.02,
      transformPerspective: 1000,
      duration: 0.08,
      ease: "power2.out",
      force3D: true,
      overwrite: "auto",
    });
  };

  const handleMouseEnter = () => { setIsHovered(true); };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;

    // Asymmetric return: 0.55s organic settle (vs 0.08s snap-in)
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      translateY: 0,
      scale: 1,
      transformPerspective: 1000,
      duration: 0.55,
      ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      force3D: true,
      overwrite: "auto",
    });
  };

  // Framer Motion spring variants for skill tags
  const tagsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay + 0.5,
      },
    },
  };

  // Tighter spring for snappier tag pop-in
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 320,
        damping: 22,
      },
    },
  };

  return (
    // Outer wrapper: spring entrance replaces CSS transition for compositor path
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60, willChange: "transform, opacity" }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 16,
        mass: 0.85,
        delay: delay,
      }}
      style={{ willChange: "transform, opacity", position: "relative", width: "100%", height: "100%" }}
    >
      {/* Dynamic 3D Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="glass-card border border-transparent rounded-2xl p-8 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 group cursor-default h-full min-h-[480px]"
      >
        {/* Animated blueprint SVG border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
          <rect
            ref={borderRef}
            x="0.75"
            y="0.75"
            width="calc(100% - 1.5px)"
            height="calc(100% - 1.5px)"
            rx="16"
            fill="none"
            stroke={`rgba(${spotlightColor}, 0.35)`}
            strokeWidth="1.5"
            strokeDasharray="2000"
            strokeDashoffset="2000"
            className="transition-colors duration-500 group-hover:stroke-primary/50"
          />
        </svg>

        {/* 3D background grid pattern */}
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(120,119,198,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"
          style={{ transform: "translateZ(-20px)" }}
        />

        {/* Real-time cursor tracking neon spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{
            background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${spotlightColor}, 0.13), transparent 80%)`,
            transform: "translateZ(-10px)",
          }}
        />

        {/* Card content with Z-index perspective layers */}
        <div style={{ transform: "translateZ(30px)" }}>
          <AnimatedSkillIcon
            type={iconType}
            isHovered={isHovered}
            triggerEntrance={isInView && !entranceFinished}
          />

          <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-3">
            <motion.span
              className="w-2.5 h-2.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: `rgb(${spotlightColor})` }}
              animate={isHovered ? { scale: 1.4 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            />
            {title}
          </h3>

          {/* Cascaded tags with spring stagger */}
          <motion.div
            variants={tagsContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap gap-2.5 relative z-10"
          >
            {tags.map((tag) => (
              <motion.span
                key={tag}
                variants={tagVariants}
                whileHover={{
                  scale: 1.06,
                  transition: { type: "spring", stiffness: 400, damping: 18 },
                }}
                className="mono text-[11px] font-medium px-3.5 py-2 rounded-lg border border-border bg-background/40 backdrop-blur-sm text-foreground/80 transition-colors duration-200 hover:border-primary hover:text-primary hover:bg-primary/5"
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                  willChange: "transform, opacity",
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const groups = [
  {
    title: "Frontend Architecture",
    iconType: "frontend" as const,
    spotlightColor: "70, 64, 222",
    tags: [
      "React.js", "Next.js", "TypeScript", "Tailwind CSS",
      "Redux Toolkit", "Framer Motion", "HTML5 & CSS3", "Responsive UI/UX",
    ],
  },
  {
    title: "Backend & APIs",
    iconType: "backend" as const,
    spotlightColor: "18, 165, 148",
    tags: [
      "Node.js", "Express.js", "REST APIs", "GraphQL / Apollo",
      "Socket.io", "JWT & OAuth 2.0", "NestJS", "Webhooks",
    ],
  },
  {
    title: "Databases & DevOps",
    iconType: "database" as const,
    spotlightColor: "139, 92, 246",
    tags: [
      "MongoDB", "PostgreSQL", "Redis Caching", "SQL & NoSQL",
      "Docker", "Git & GitHub Actions", "AWS S3/EC2", "Vercel & CI/CD",
    ],
  },
  {
    title: "AI & Automation",
    iconType: "ai" as const,
    spotlightColor: "245, 158, 11",
    tags: [
      "n8n Workflows", "OpenAI API", "LangChain", "Vector DBs",
      "Python Scripting", "Prompt Engineering", "LLM Fine-tuning", "Cloud Automations",
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-36 bg-secondary/50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent pointer-events-none rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-gradient-radial from-accent/5 to-transparent pointer-events-none rounded-full blur-3xl" />

      <div className="wrap relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32, willChange: "transform, opacity" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 160, damping: 18, mass: 0.9 }}
          className="mb-16 max-w-[640px]"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="mono text-xs uppercase tracking-wider text-accent mb-4 block font-semibold">
            02 — toolkit
          </span>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            What I build with
          </h2>
          <p className="text-muted-foreground text-lg">
            The core stack I ship production apps with, plus the automation, data layer management,
            and AI tools I've been integration-focused on.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {groups.map((group, groupIdx) => (
            <SkillCard
              key={group.title}
              title={group.title}
              iconType={group.iconType}
              tags={group.tags}
              spotlightColor={group.spotlightColor}
              delay={groupIdx * 0.12}   // Tighter stagger: 0.12s vs 0.15s
              index={groupIdx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
