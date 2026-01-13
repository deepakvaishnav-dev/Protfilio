import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, Briefcase, GraduationCap, Award } from "lucide-react";

interface TimelineItem {
  id: number;
  type: "work" | "education" | "award";
  title: string;
  organization: string;
  period: string;
  description: string;
}

const timeline: TimelineItem[] = [
  {
    id: 1,
    type: "work",
    title: "Full Stack Web Developer",
    organization: "Freelance / Client Projects",
    period: "2025 – Present",
    description:
      "Building modern, responsive web applications using React, Node.js, and MongoDB. Worked on real-world projects including dashboards, landing pages, and Shopify customizations.",
  },
  {
    id: 2,
    type: "work",
    title: "Frontend Developer",
    organization: "Startup / Agency Environment",
    period: "2025",
    description:
      "Developed reusable UI components, implemented animations with Framer Motion, and collaborated with designers to deliver clean, user-focused interfaces.",
  },
  {
    id: 3,
    type: "education",
    title: "Bachelor of Computer Applications (BCA)",
    organization: "University / College",
    period: "2025 – 2028",
    description:
      "Focused on web development, programming fundamentals, databases, and software engineering concepts.",
  },
  {
    id: 4,
    type: "award",
    title: "Best Project Recognition",
    organization: "Academic / Internal Project",
    period: "2025",
    description:
      "Recognized for building a complete full-stack web application with authentication, APIs, and responsive UI.",
  },
];

const getIcon = (type: TimelineItem["type"]) => {
  switch (type) {
    case "work":
      return Briefcase;
    case "education":
      return GraduationCap;
    case "award":
      return Award;
  }
};

export function ResumeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resume" className="py-24 md:py-32 relative bg-muted/30">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div ref={ref} className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Resume
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            My <span className="text-gradient">Journey</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-8">
            A snapshot of my professional experience, education, and key
            achievements.
          </p>

          {/* Download button */}
          <motion.a
            href="/Deepak Vaishnav Resume.pdf"
            download="Deepak Vaishnav Resume.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold glow-primary transition-all"
          >
            <Download size={20} />
            Download CV
          </motion.a>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary" />

          {timeline.map((item, index) => {
            const Icon = getIcon(item.type);
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className={`relative flex items-center mb-12 md:mb-16 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Icon */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center glow-primary"
                  >
                    <Icon size={20} className="text-primary" />
                  </motion.div>
                </div>

                {/* Card */}
                <div
                  className={`ml-24 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isEven ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-xl p-6 group hover:border-primary/50 transition-all"
                  >
                    <span className="text-primary text-sm font-medium">
                      {item.period}
                    </span>
                    <h3 className="font-display text-xl font-semibold mt-1 mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-medium mb-2">
                      {item.organization}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
