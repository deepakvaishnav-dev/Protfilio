import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Magnetic } from "./ui/Magnetic";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Toolkit", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Spring Physics Tokens
// ─────────────────────────────────────────────────────────────────────────────
const SPRING_NAV = { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.7 };
const SPRING_DRAWER = { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.6 };

// Nav entrance — slides down from above on mount
const navMountVariants = {
  hidden: { opacity: 0, y: -20, willChange: "transform, opacity" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_NAV, delay: 0.1 },
  },
};

// Mobile drawer — spring in, spring out
const drawerVariants = {
  hidden: { opacity: 0, y: -14, scaleY: 0.92, transformOrigin: "top" },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { ...SPRING_DRAWER },
  },
  exit: {
    opacity: 0,
    y: -8,
    scaleY: 0.95,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as [number, number, number, number] }, // asymmetric — fast exit
  },
};

// Mobile items — stagger 0.04s each, slide from left
const drawerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
  exit: {},
};

const drawerItemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 22 },
  },
  exit: { opacity: 0, x: -8, transition: { duration: 0.12 } },
};

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Nav entrance — spring mount animation */}
      <motion.nav
        id="nav"
        variants={navMountVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        style={{ willChange: "transform, opacity" }}
        className={`fixed top-0 left-0 right-0 z-[100] py-6 transition-[padding,background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out ${
          isScrolled
            ? "py-4 bg-background/85 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="wrap flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="logo font-display font-bold text-lg md:text-xl flex items-center gap-2 text-foreground"
          >
            {/* Logo dot — subtle scale pulse via spring */}
            <motion.span
              className="logo-dot w-2 h-2 rounded-full bg-accent inline-block"
              animate={{
                scale: [1, 1.45, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ willChange: "transform, opacity" }}
            />
            Deepak Vaishnav
          </a>

          {/* Desktop Navigation Links */}
          <ul className="navlinks hidden md:flex items-center gap-9 list-none">
            {navItems.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_NAV, delay: 0.15 + i * 0.05 }}
                style={{ willChange: "transform, opacity" }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline pb-1"
                >
                  {item.label}
                </a>
              </motion.li>
            ))}
          </ul>

          {/* Actions & Responsive Toggle */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle — spring micro-interaction */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 400, damping: 18 },
              }}
              whileTap={{
                scale: 0.88,
                transition: { type: "spring", stiffness: 500, damping: 22 },
              }}
              className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-200"
              aria-label="Toggle theme"
              style={{ willChange: "transform" }}
            >
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ display: "flex", willChange: "transform, opacity" }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </motion.button>

            {/* Let's Talk CTA */}
            <div className="hidden md:block">
              <Magnetic multiplier={0.2}>
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  whileHover={{
                    scale: 1.04,
                    transition: { type: "spring", stiffness: 320, damping: 20 },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { type: "spring", stiffness: 400, damping: 24 },
                  }}
                  className="nav-cta text-xs md:text-sm font-medium px-5 py-2.5 border border-foreground rounded-full hover:bg-foreground hover:text-background transition-colors duration-200"
                  style={{ willChange: "transform", display: "inline-block" }}
                >
                  Let's talk
                </motion.a>
              </Magnetic>
            </div>

            {/* Mobile Menu Button — spring icon swap */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.88, transition: { type: "spring", stiffness: 500, damping: 22 } }}
              className="md:hidden p-2.5 rounded-full border border-border bg-card"
              aria-label="Toggle mobile menu"
              style={{ willChange: "transform" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  style={{ display: "flex", willChange: "transform, opacity" }}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Drawer — spring mount, staggered items */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-[73px] bg-background/95 backdrop-blur-md border-b border-border shadow-lg z-[99] md:hidden"
            style={{ willChange: "transform, opacity", transformOrigin: "top" }}
          >
            <motion.div
              variants={drawerContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-start gap-5 p-6"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  variants={drawerItemVariants}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150"
                  style={{ willChange: "transform, opacity" }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.hr variants={drawerItemVariants} className="w-full border-border my-1" />
              <motion.a
                variants={drawerItemVariants}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#contact");
                }}
                className="w-full text-center py-3 border border-foreground rounded-full bg-foreground text-background font-medium"
                style={{ willChange: "transform, opacity" }}
              >
                Let's talk
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
