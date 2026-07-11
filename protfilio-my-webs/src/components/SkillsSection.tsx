import { motion } from "framer-motion";

const groups = [
  {
    title: "Frontend",
    tags: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
  },
  {
    title: "Backend & Data",
    tags: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Auth"],
  },
  {
    title: "AI & Automation",
    tags: ["OpenAI API", "LLM Integration", "n8n", "Python", "Cloud Deploy"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-36 bg-secondary/50 relative">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-[640px]"
        >
          <span className="mono text-xs uppercase tracking-wider text-accent mb-4 block font-semibold">
            02 — toolkit
          </span>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            What I build with
          </h2>
          <p className="text-muted-foreground text-lg">
            The core stack I ship production apps with, plus the automation and AI tools I've been layering on top of it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {groups.map((group, groupIdx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: groupIdx * 0.15 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20 group"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono text-xs font-medium px-3.5 py-2 rounded-lg border border-border bg-background text-foreground/80 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
