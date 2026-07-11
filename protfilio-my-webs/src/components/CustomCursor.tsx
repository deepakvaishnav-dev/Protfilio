import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduceMotion || !fineHover) {
      return;
    }

    // Add class to body to hide default cursor
    document.body.classList.add("custom-cursor-active");

    // Position variables
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const updateMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Instantly position the center dot
      gsap.set(dotRef.current, { x: mouse.x, y: mouse.y });
    };

    window.addEventListener("mousemove", updateMouse);

    // Render loop for smooth ring lag/inertia (quickTo is more performant than gsap.to in mousemove)
    const xTo = gsap.quickTo(ringRef.current, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(ringRef.current, "y", { duration: 0.35, ease: "power3.out" });

    const ticker = () => {
      xTo(mouse.x);
      yTo(mouse.y);
    };

    gsap.ticker.add(ticker);

    // Hover effect handlers
    const handleMouseEnter = () => {
      ringRef.current?.classList.add("big");
    };

    const handleMouseLeave = () => {
      ringRef.current?.classList.remove("big");
    };

    // Attach listeners to interactive elements
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

    // Use MutationObserver to wire up hover listeners on dynamically rendered elements
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", updateMouse);
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
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
