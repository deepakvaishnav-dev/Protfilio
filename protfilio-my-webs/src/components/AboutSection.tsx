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
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          setCount(Math.floor(obj.val));
        },
      });
    }
  }, [isInView, start, end]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-36 relative overflow-hidden">
      {/* Subtle lighting overlay effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div ref={ref} className="wrap">
        <div className="about-grid grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          
          {/* Main Bio Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="about-text"
          >
            <span className="mono text-xs uppercase tracking-wider text-accent mb-4 block font-semibold">
              01 — about
            </span>
            <h2 className="text-4xl font-bold tracking-tight mb-8">
              I like systems more than screens.
            </h2>
            <p className="text-foreground/80 text-lg mb-6 leading-relaxed">
              I'm <strong className="text-foreground font-semibold">Deepak</strong>, a Full-Stack Developer working mainly in the <strong className="text-foreground font-semibold">MERN stack</strong> — React, Node.js, Express, MongoDB — with TypeScript as the default, not the exception. Over the last 1-2 years I've moved from building interfaces to building the plumbing behind them: authentication, REST APIs, dashboards, and increasingly, <strong className="text-foreground font-semibold">AI and automation layers</strong> that make an app feel like it's thinking.
            </p>
            <p className="text-foreground/80 text-lg mb-6 leading-relaxed">
              My recent work leans into that — integrating LLMs into real products, and building automation pipelines with tools like <strong className="text-foreground font-semibold">n8n</strong> that connect APIs together without a human in the loop. I'm not chasing AI as a buzzword; I'm interested in it as plumbing that removes repetitive work.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Right now I'm looking for a full-time role where I can take that same instinct — clean code, end-to-end ownership, a bias toward shipping — onto a team that's building something real.
            </p>
          </motion.div>

          {/* Stats Grid Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="stat-grid shadow-sm border border-border">
              {/* Stat 1 */}
              <div className="stat">
                <div className="num text-3xl md:text-4xl font-bold font-display text-primary mb-2">
                  <Counter start={1} end={2} prefix="" suffix="" />
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  years, full-stack
                </div>
              </div>

              {/* Stat 2 */}
              <div className="stat">
                <div className="num text-3xl md:text-4xl font-bold font-display text-primary mb-2">
                  <Counter start={0} end={10} suffix="+" />
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  shipped projects
                </div>
              </div>

              {/* Stat 3 */}
              <div className="stat flex flex-col justify-between">
                <div className="num text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
                  MERN
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  core stack
                </div>
              </div>

              {/* Stat 4 */}
              <div className="stat flex flex-col justify-between">
                <div className="num text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
                  AI/n8n
                </div>
                <div className="label text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  current focus
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
