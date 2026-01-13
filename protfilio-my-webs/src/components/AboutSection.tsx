import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Palette, Sparkles, Zap } from 'lucide-react';

const skills = [
  { name: 'React / Next.js', level: 95, color: 'from-primary to-accent' },
  { name: 'JavaScript / TypeScript', level: 92, color: 'from-primary to-accent' },
  { name: 'Node.js / Express', level: 88, color: 'from-primary to-accent' },
  { name: 'MongoDB / REST APIs', level: 85, color: 'from-primary to-accent' },
  { name: 'Shopify Theme Development', level: 82, color: 'from-primary to-accent' },
  { name: 'UI/UX & Responsive Design', level: 90, color: 'from-primary to-accent' },
  { name: 'Framer Motion / Animations', level: 88, color: 'from-primary to-accent' },
  { name: 'Creative Coding', level: 86, color: 'from-primary to-accent' },
  { name: 'Performance Optimization', level: 84, color: 'from-primary to-accent' },
];

const highlights = [
  { icon: Code2, label: '1+ Years', description: 'Development Experience' },
  { icon: Palette, label: '12+', description: 'Projects Completed' },
  { icon: Sparkles, label: '30+', description: 'Happy Clients' },
  { icon: Zap, label: '99%', description: 'On-Time Delivery' },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-accent/5 via-transparent to-transparent" />

      <div ref={ref} className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            About Me
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Crafting Digital <span className="text-gradient">Experiences</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            I build modern, scalable, and visually engaging web experiences
            where performance, design, and clean code come together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-8 mb-8">
              <h3 className="font-display text-2xl font-semibold mb-4">
                My Journey
              </h3>
              <p className="text-muted-foreground mb-4">
                I’m a full-stack developer with hands-on experience building real-world
                web applications for startups and growing businesses.
                My focus is on writing clean, scalable code and delivering polished user experiences.
              </p>
              <p className="text-muted-foreground">
                I specialize in React, Node.js, and modern UI frameworks,
                creating fast, responsive, and interactive products.
                I enjoy working on animations, performance optimization,
                and creative problem-solving.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="glass-card rounded-xl p-6 text-center group hover:border-primary/50 transition-all"
                >
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-display text-2xl font-bold text-gradient">
                    {item.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-semibold mb-8">
              Skills & Expertise
            </h3>

            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-primary font-semibold">
                      {skill.level}%
                    </span>
                  </div>

                  <div className="skill-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{
                        duration: 1,
                        delay: 0.6 + index * 0.1,
                        ease: 'easeOut',
                      }}
                      className={`skill-bar-fill bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
