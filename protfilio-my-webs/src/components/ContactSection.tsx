import { motion } from "framer-motion";
import { Magnetic } from "./ui/Magnetic";

export function ContactSection() {
  return (
    <section id="contact" className="py-36 bg-secondary/50 relative">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="contact-card relative bg-[#12131A] text-white rounded-[28px] py-20 px-8 md:px-16 text-center overflow-hidden border border-white/5 shadow-2xl"
        >
          {/* Accent radial glow overlay */}
          <div className="absolute w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(70,64,222,0.35)_0%,transparent_70%)] -top-[160px] -right-[100px] pointer-events-none" />

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 relative z-10">
            Let's build the next node.
          </h2>

          {/* Description */}
          <p className="max-w-[460px] mx-auto text-white/65 text-base md:text-lg mb-10 leading-relaxed relative z-10">
            Open to full-time Full-Stack / AI-integration roles — on-site or hybrid in Jaipur, or
            remote. If a team needs someone who'll own a feature end to end, I'd like to talk.
          </p>

          {/* Magnetic Actions */}
          <div className="contact-actions flex flex-wrap gap-4 justify-center items-center relative z-10">
            <Magnetic multiplier={0.2}>
              <a
                href="mailto:deepakvaishnav486@gmail.com"
                className="px-8 py-4 bg-white text-[#12131A] font-semibold rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
              >
                deepakvaishnav486@gmail.com
              </a>
            </Magnetic>

            <Magnetic multiplier={0.25}>
              <a
                href="https://www.linkedin.com/in/deepak-vaishnav-5185b9396/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 bg-transparent hover:bg-white/10 hover:border-white font-medium rounded-full transition-all duration-300"
              >
                LinkedIn ↗
              </a>
            </Magnetic>

            <Magnetic multiplier={0.25}>
              <a
                href="https://github.com/deepakvaishnav-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 bg-transparent hover:bg-white/10 hover:border-white font-medium rounded-full transition-all duration-300"
              >
                GitHub ↗
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
