import { useEffect, useRef } from "react";
import gsap from "gsap";

export function BackgroundBlobs() {
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const blobCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Soft floating drift loop for ambient blobs
    const drift = (el: HTMLDivElement | null, rx: number, ry: number, duration: number) => {
      if (!el) return;
      gsap.to(el, {
        x: `+=${rx}`,
        y: `+=${ry}`,
        duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    drift(blobARef.current, 50, 40, 10);
    drift(blobBRef.current, -40, 60, 12);
    drift(blobCRef.current, 30, -50, 15);

    // Scroll-based parallax depth calculation
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (blobARef.current) {
        const depth = 0.06;
        gsap.to(blobARef.current, {
          y: scrollY * depth,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (blobBRef.current) {
        const depth = 0.09;
        gsap.to(blobBRef.current, {
          y: scrollY * depth,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (blobCRef.current) {
        const depth = 0.04;
        gsap.to(blobCRef.current, {
          y: scrollY * depth,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div ref={blobARef} className="blob blob-a" />
      <div ref={blobBRef} className="blob blob-b" />
      <div ref={blobCRef} className="blob blob-c" />
    </>
  );
}
