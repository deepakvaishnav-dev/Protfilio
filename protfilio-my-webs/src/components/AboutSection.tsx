import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

interface CounterProps {
  start?: number;
  end: number;
  prefix?: string;
  suffix?: string;
}

function Counter({ start = 0, end, prefix = "", suffix = "" }: CounterProps) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const obj = { val: start };
      gsap.to(obj, {
        val: end,
        duration: 1.8,
        // expo.out — natural inertia deceleration (feels like physical weight)
        ease: "expo.out",
        onUpdate: () => { setCount(Math.floor(obj.val)); },
        force3D: true,
      });
    }
  }, [isInView, start, end]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spring tokens
// ─────────────────────────────────────────────────────────────────────────────
const SPRING = { type: "spring" as const, stiffness: 140, damping: 16, mass: 0.85 };

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Stagger paragraphs 0.08s each for narrative eye flow
  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 24, willChange: "transform, opacity" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...SPRING },
    },
  };

  // Stats children stagger 0.06s with scale entrance
  const statsContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.18 },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 16, willChange: "transform, opacity" },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 22 },
    },
  };

  return (
    <section id="about" className="py-36 relative overflow-hidden">
      {/* Ambient lighting overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div ref={ref} className="wrap">
        <div className="about-grid grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-start">

          {/* Main Bio Column — each paragraph staggered */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="about-text"
          >
            <motion.span
              variants={paragraphVariants}
              className="mono text-xs uppercase tracking-wider text-accent mb-4 block font-semibold"
              style={{ willChange: "transform, opacity" }}
            >
              01 — about
            </motion.span>

            <motion.h2
              variants={paragraphVariants}
              className="text-4xl font-bold tracking-tight mb-8"
              style={{ willChange: "transform, opacity" }}
            >
              I like systems more than screens.
            </motion.h2>

            <motion.p
              variants={paragraphVariants}
              className="text-foreground/80 text-lg mb-6 leading-relaxed"
              style={{ willChange: "transform, opacity" }}
            >
              I'm <strong className="text-foreground font-semibold">Deepak</strong>, a Full-Stack
              Developer working mainly in the{" "}
              <strong className="text-foreground font-semibold">MERN stack</strong> — React,
              Node.js, Express, MongoDB — with TypeScript as the default, not the exception. Over
              the last 1-2 years I've moved from building interfaces to building the plumbing behind
              them: authentication, REST APIs, dashboards, and increasingly,{" "}
              <strong className="text-foreground font-semibold">AI and automation layers</strong>{" "}
              that make an app feel like it's thinking.
            </motion.p>

            <motion.p
              variants={paragraphVariants}
              className="text-foreground/80 text-lg mb-6 leading-relaxed"
              style={{ willChange: "transform, opacity" }}
            >
              My recent work leans into that — integrating LLMs into real products, and building
              automation pipelines with tools like{" "}
              <strong className="text-foreground font-semibold">n8n</strong> that connect APIs
              together without a human in the loop. I'm not chasing AI as a buzzword; I'm
              interested in it as plumbing that removes repetitive work.
            </motion.p>

            <motion.p
              variants={paragraphVariants}
              className="text-foreground/80 text-lg leading-relaxed"
              style={{ willChange: "transform, opacity" }}
            >
              Right now I'm looking for a full-time role where I can take that same instinct —
              clean code, end-to-end ownership, a bias toward shipping — onto a team that's building
              something real.
            </motion.p>
          </motion.div>

          {/* Stats Grid — spring scale entrance per cell */}
          <motion.div
            initial={{ opacity: 0, x: 30, willChange: "transform, opacity" }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...SPRING, delay: 0.12 }}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.div
              variants={statsContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="stat-grid shadow-sm border border-border"
            >
              {/* Stat 1 */}
              <motion.div
                variants={statVariants}
                className="stat"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="num text-3xl md:text-4xl font-bold font-display text-primary mb-2">
                  <Counter start={1} end={2} />
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  years, full-stack
                </div>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                variants={statVariants}
                className="stat"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="num text-3xl md:text-4xl font-bold font-display text-primary mb-2">
                  <Counter start={0} end={10} suffix="+" />
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  shipped projects
                </div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                variants={statVariants}
                className="stat flex flex-col justify-between"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="num text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
                  MERN
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  core stack
                </div>
              </motion.div>

              {/* Stat 4 */}
              <motion.div
                variants={statVariants}
                className="stat flex flex-col justify-between"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="num text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
                  AI/n8n
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  current focus
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
