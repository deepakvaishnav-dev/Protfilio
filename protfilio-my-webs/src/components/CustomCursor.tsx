import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduceMotion || !fineHover) return;

    document.body.classList.add("custom-cursor-active");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const updateMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Dot: instant GPU set (transform only)
      gsap.set(dotRef.current, {
        x: mouse.x,
        y: mouse.y,
        force3D: true,
      });
    };

    window.addEventListener("mousemove", updateMouse, { passive: true });

    // ── Ring: reduced lag 0.35 → 0.28s, power4.out for fast initial response ──
    const xRing = gsap.quickTo(ringRef.current, "x", { duration: 0.28, ease: "power4.out" });
    const yRing = gsap.quickTo(ringRef.current, "y", { duration: 0.28, ease: "power4.out" });

    // ── Trail: slower ghost 0.55s with opacity fade ──
    const xTrail = gsap.quickTo(trailRef.current, "x", { duration: 0.55, ease: "power2.out" });
    const yTrail = gsap.quickTo(trailRef.current, "y", { duration: 0.55, ease: "power2.out" });

    const ticker = () => {
      xRing(mouse.x);
      yRing(mouse.y);
      xTrail(mouse.x);
      yTrail(mouse.y);
    };

    gsap.ticker.add(ticker);

    // ── mousedown/mouseup: scale spring micro-reaction on dot ──
    const onMouseDown = () => {
      gsap.to(dotRef.current, {
        scale: 0.45,
        duration: 0.08,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
      gsap.to(ringRef.current, {
        scale: 0.88,
        duration: 0.1,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
    };

    const onMouseUp = () => {
      // Spring bounce-back on release
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
        force3D: true,
        overwrite: "auto",
      });
      gsap.to(ringRef.current, {
        scale: 1,
        duration: 0.45,
        ease: "elastic.out(1, 0.5)",
        force3D: true,
        overwrite: "auto",
      });
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // ── Hover: animate ring size via GSAP (eliminates CSS class-toggle repaint) ──
    const handleMouseEnter = () => {
      // Asymmetric: fast expand 0.18s
      gsap.to(ringRef.current, {
        width: 64,
        height: 64,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary) / 0.06)",
        duration: 0.18,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
      gsap.to(trailRef.current, {
        opacity: 0.25,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Asymmetric: slow return 0.42s (eases back naturally)
      gsap.to(ringRef.current, {
        width: 34,
        height: 34,
        borderColor: "rgba(18, 19, 26, 0.35)",
        backgroundColor: "transparent",
        duration: 0.42,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
      gsap.to(trailRef.current, {
        opacity: 0.12,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const attachHoverListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, .p-card, [role='button'], input, textarea, select, .magnetic"
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    attachHoverListeners();

    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      gsap.ticker.remove(ticker);
      observer.disconnect();

      const interactives = document.querySelectorAll(
        "a, button, .p-card, [role='button'], input, textarea, select, .magnetic"
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      {/* Trail ghost — GPU layer, leads ring with longer lag */}
      <div id="cursor-trail" ref={trailRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
