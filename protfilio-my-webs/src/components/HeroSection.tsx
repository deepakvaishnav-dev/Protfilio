import { motion, Variants } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { Typewriter } from "./Typewriter";
import { ArrowDown, Github, Linkedin, Instagram } from "lucide-react";

const roles = [
  "Creative Developer",
  "Digital Designer",
  "UI/UX Engineer",
  "WebGL Artist",
  "Full Stack Developer",
];

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <ParticleField />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent/10 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 text-center"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants} className="mt-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available for work
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          Hi, I'm <span className="text-gradient">Deepak Vaishnav</span>
        </motion.h1>

        {/* Subtitle with typing effect */}
        <motion.div
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl font-light mb-4 h-10 flex items-center justify-center"
        >
          <Typewriter
            words={roles}
            typingSpeed={80}
            deletingSpeed={40}
            pauseDuration={2500}
          />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-muted-foreground mb-12"
        >
          I craft immersive digital experiences that seamlessly blend
          cutting-edge technology with striking visual design. Specialized in
          building high-performance web applications using React, Node.js, and
          creative coding.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold glow-primary transition-all duration-300 hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)]"
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl glass-card font-semibold border border-primary/30 hover:border-primary/60 transition-all duration-300"
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6"
        >
          {[
            {
              icon: Github,
              href: "https://github.com/deepakvaishnav-dev",
              label: "GitHub",
            },
            {
              icon: Linkedin,
              href: "https://www.linkedin.com/in/deepak-vaishnav-5185b9396/",
              label: "LinkedIn",
            },
            {
              icon: Instagram,
              href: "https://www.instagram.com/___mr__dv_____?utm_source=qr&igsh=ajE4YnlhZnFubzdw",
              label: "Instagram",
            },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl glass-card text-muted-foreground hover:text-primary transition-colors"
              aria-label={social.label}
            >
              <social.icon size={24} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
