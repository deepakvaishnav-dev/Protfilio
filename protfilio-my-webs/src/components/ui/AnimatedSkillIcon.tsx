import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

interface AnimatedSkillIconProps {
  type: "frontend" | "backend" | "database" | "ai";
  isHovered: boolean;
  triggerEntrance?: boolean;
}

export function AnimatedSkillIcon({ type, isHovered, triggerEntrance }: AnimatedSkillIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeTimelineInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset styles/animations on start
    anime.remove(containerRef.current.querySelectorAll(".anim-target"));

    const targets = containerRef.current.querySelectorAll(".anim-target");
    const paths = containerRef.current.querySelectorAll("path.anim-path");

    // Initialize line offsets for drawing effects
    paths.forEach((path) => {
      const p = path as SVGPathElement;
      const length = p.getTotalLength();
      p.style.strokeDasharray = `${length}`;
      p.style.strokeDashoffset = `${length}`;
    });

    if (isHovered || triggerEntrance) {
      if (type === "frontend") {
        // Line drawing + cursor movement + code line scale animation
        animationRef.current = anime.timeline({
          easing: "easeOutCubic",
        });

        animationRef.current
          .add({
            targets: containerRef.current.querySelectorAll(".anim-path-screen"),
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 800,
          })
          .add({
            targets: containerRef.current.querySelectorAll(".anim-path-code"),
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 600,
            delay: anime.stagger(100),
          }, "-=400")
          .add({
            targets: containerRef.current.querySelector(".anim-cursor"),
            translateX: [20, -5],
            translateY: [20, -5],
            opacity: [0, 1],
            duration: 600,
          }, "-=300")
          .add({
            targets: containerRef.current.querySelector(".anim-click"),
            scale: [0.8, 1.3, 1],
            opacity: [0, 0.7, 0],
            duration: 500,
          });
      } else if (type === "backend") {
        // Connectors drawing + pulse travel
        animationRef.current = anime.timeline({
          loop: true,
        });

        animationRef.current
          .add({
            targets: paths,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 900,
            easing: "easeInOutQuad",
          })
          .add({
            targets: containerRef.current.querySelectorAll(".anim-pulse"),
            cx: (el) => el.getAttribute("data-target-x") || "12",
            cy: (el) => el.getAttribute("data-target-y") || "12",
            opacity: [0, 1, 0],
            duration: 1000,
            easing: "easeInOutSine",
            delay: anime.stagger(200),
          }, "-=400");
      } else if (type === "database") {
        // Cylinder build + light blinking
        animationRef.current = anime.timeline({
          easing: "easeOutSine",
        });

        animationRef.current
          .add({
            targets: paths,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 800,
            delay: anime.stagger(150),
          })
          .add({
            targets: containerRef.current.querySelectorAll(".anim-db-dot"),
            opacity: [0.2, 1, 0.2],
            duration: 600,
            loop: true,
            direction: "alternate",
            delay: anime.stagger(150),
          }, "-=200")
          .add({
            targets: containerRef.current.querySelector(".anim-cloud"),
            translateY: [0, -3, 0],
            duration: 1800,
            loop: true,
            easing: "easeInOutSine",
          }, "-=400");
      } else if (type === "ai") {
        // Gear rotation + chip pulse + lines drawing
        animationRef.current = anime.timeline({
          easing: "easeOutBack",
        });

        animationRef.current
          .add({
            targets: containerRef.current.querySelector(".anim-gear"),
            rotate: "360deg",
            duration: 2000,
            easing: "linear",
            loop: true,
          })
          .add({
            targets: paths,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 800,
            delay: anime.stagger(100),
          }, "0")
          .add({
            targets: containerRef.current.querySelector(".anim-chip"),
            scale: [0.95, 1.05, 0.95],
            fill: ["rgba(70, 64, 222, 0.05)", "rgba(70, 64, 222, 0.2)", "rgba(70, 64, 222, 0.05)"],
            duration: 1500,
            loop: true,
            easing: "easeInOutQuad",
          }, "-=1000");
      }
    } else {
      // Return elements to initial state when hover leaves
      anime.remove(targets);
      anime.remove(paths);
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Reset static states
      anime({
        targets: paths,
        strokeDashoffset: 0,
        duration: 400,
        easing: "easeOutQuad",
      });

      anime({
        targets: containerRef.current.querySelectorAll(".anim-reset"),
        translateX: 0,
        translateY: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 400,
        easing: "easeOutQuad",
      });

      // Specific resets
      if (type === "backend") {
        const pulses = containerRef.current.querySelectorAll(".anim-pulse");
        pulses.forEach((p) => {
          p.setAttribute("cx", p.getAttribute("data-start-x") || "12");
          p.setAttribute("cy", p.getAttribute("data-start-y") || "12");
          (p as HTMLElement).style.opacity = "0";
        });
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [isHovered, type, triggerEntrance]);

  return (
    <div
      ref={containerRef}
      className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-500 mb-6"
    >
      {type === "frontend" && (
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 anim-target"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Screen / Window */}
          <path
            className="anim-path anim-path-screen"
            d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z"
          />
          {/* Bottom Stand */}
          <path className="anim-path anim-path-screen" d="M8 21h8" />
          <path className="anim-path anim-path-screen" d="M12 17v4" />

          {/* Window Control Buttons */}
          <circle cx="5" cy="6" r="0.5" fill="currentColor" stroke="none" className="anim-reset" />
          <circle cx="7" cy="6" r="0.5" fill="currentColor" stroke="none" className="anim-reset" />
          <circle cx="9" cy="6" r="0.5" fill="currentColor" stroke="none" className="anim-reset" />

          {/* Browser Code Lines */}
          <path className="anim-path anim-path-code" d="M6 10h6" />
          <path className="anim-path anim-path-code" d="M6 13h10" />

          {/* Clicking effect circle */}
          <circle
            cx="14"
            cy="11"
            r="3"
            stroke="hsl(var(--accent))"
            strokeWidth="1"
            className="anim-click anim-reset"
            style={{ opacity: 0, transformOrigin: "14px 11px" }}
          />

          {/* Cursor */}
          <path
            className="anim-cursor anim-reset"
            d="M19 19l-4-4h4l-5-7"
            fill="currentColor"
            style={{ opacity: 0, transformOrigin: "15px 15px" }}
          />
        </svg>
      )}

      {type === "backend" && (
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 anim-target"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Center API Node */}
          <circle cx="12" cy="12" r="3" className="anim-reset" />

          {/* Surrounding Connected Nodes */}
          <circle cx="12" cy="4" r="2" className="anim-reset" />
          <circle cx="5" cy="17" r="2" className="anim-reset" />
          <circle cx="19" cy="17" r="2" className="anim-reset" />

          {/* Connected Lines / Paths */}
          <path className="anim-path" d="M12 7v2" />
          <path className="anim-path" d="M6.5 15.5l4-2.5" />
          <path className="anim-path" d="M17.5 15.5l-4-2.5" />

          {/* Traveling Data Pulses */}
          <circle
            className="anim-pulse anim-reset"
            data-start-x="12"
            data-start-y="4"
            data-target-x="12"
            data-target-y="10"
            cx="12"
            cy="4"
            r="1.5"
            fill="hsl(var(--accent))"
            stroke="none"
            style={{ opacity: 0 }}
          />
          <circle
            className="anim-pulse anim-reset"
            data-start-x="5"
            data-start-y="17"
            data-target-x="11"
            data-target-y="13"
            cx="5"
            cy="17"
            r="1.5"
            fill="hsl(var(--accent))"
            stroke="none"
            style={{ opacity: 0 }}
          />
          <circle
            className="anim-pulse anim-reset"
            data-start-x="19"
            data-start-y="17"
            data-target-x="13"
            data-target-y="13"
            cx="19"
            cy="17"
            r="1.5"
            fill="hsl(var(--accent))"
            stroke="none"
            style={{ opacity: 0 }}
          />
        </svg>
      )}

      {type === "database" && (
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 anim-target"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top cylinder / Database Disk 1 */}
          <path className="anim-path" d="M4 6c0 1.66 3.58 3 8 3s8-1.34 8-3-3.58-3-8-3-8 1.34-8 3z" />

          {/* Middle Cylinder / Database Disk 2 */}
          <path className="anim-path" d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          <path className="anim-path" d="M4 6v6" />
          <path className="anim-path" d="M20 6v6" />

          {/* Bottom Cylinder / Database Disk 3 */}
          <path className="anim-path" d="M4 18c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          <path className="anim-path" d="M4 12v6" />
          <path className="anim-path" d="M20 12v6" />

          {/* Blinking Data Lights */}
          <circle cx="7" cy="8" r="0.75" fill="hsl(var(--accent))" stroke="none" className="anim-db-dot anim-reset" />
          <circle cx="7" cy="14" r="0.75" fill="hsl(var(--accent))" stroke="none" className="anim-db-dot anim-reset" />
          <circle cx="7" cy="19.5" r="0.75" fill="hsl(var(--accent))" stroke="none" className="anim-db-dot anim-reset" />

          {/* Floating Cloud (DevOps integration) */}
          <path
            className="anim-cloud anim-reset anim-path"
            d="M17 14.5a2.5 2.5 0 0 1 .5 4.95H14a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 3 0.05z"
            style={{ transformOrigin: "16px 16px" }}
          />
        </svg>
      )}

      {type === "ai" && (
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 anim-target"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Rotating Cog / Gear in background */}
          <path
            className="anim-gear anim-reset"
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M12 9V7 M12 17v-2 M9 12H7 M17 12h-2 M14.1 14.1l1.4 1.4 M8.5 8.5l1.4 1.4 M9.9 14.1l-1.4 1.4 M15.5 8.5l-1.4 1.4"
            style={{ transformOrigin: "12px 12px", opacity: 0.35 }}
          />

          {/* Main CPU Chip */}
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="2"
            className="anim-chip anim-reset"
            style={{ transformOrigin: "12px 12px" }}
          />

          {/* Circuit Pins */}
          <path className="anim-path" d="M9 2v3" />
          <path className="anim-path" d="M15 2v3" />
          <path className="anim-path" d="M9 19v3" />
          <path className="anim-path" d="M15 19v3" />
          <path className="anim-path" d="M2 9h3" />
          <path className="anim-path" d="M2 15h3" />
          <path className="anim-path" d="M19 9h3" />
          <path className="anim-path" d="M19 15h3" />

          {/* Brain / Synapse nodes inside chip */}
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" className="anim-reset" />
        </svg>
      )}
    </div>
  );
}
