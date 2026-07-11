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

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Default to light mode as requested by theme
    document.documentElement.classList.remove("dark");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
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
      <nav
        id="nav"
        className={`fixed top-0 left-0 right-0 z-[100] py-6 transition-all duration-500 ease-out ${
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
            <span className="logo-dot w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
            Deepak Vaishnav
          </a>

          {/* Desktop Navigation Links */}
          <ul className="navlinks hidden md:flex items-center gap-9 list-none">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline pb-1"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions & Responsive Toggle */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Let's Talk CTA */}
            <div className="hidden md:block">
              <Magnetic multiplier={0.2}>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="nav-cta text-xs md:text-sm font-medium px-5 py-2.5 border border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  Let's talk
                </a>
              </Magnetic>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full border border-border bg-card"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-[73px] bg-background border-b border-border shadow-md z-[99] md:hidden"
          >
            <div className="flex flex-col items-start gap-5 p-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
              <hr className="w-full border-border my-2" />
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#contact");
                }}
                className="w-full text-center py-3 border border-foreground rounded-full bg-foreground text-background font-medium"
              >
                Let's talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
