import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';

type ProjectCategory = 'all' | 'web' | '3d' | 'mobile' | 'design';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: ProjectCategory;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Nebula Dashboard',
    description: 'A futuristic analytics dashboard with real-time data visualization and 3D charts.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'web',
    technologies: ['React', 'Three.js', 'D3.js', 'WebSocket'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 2,
    title: 'Quantum Portfolio',
    description: 'An immersive 3D portfolio experience with particle effects and smooth animations.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: '3d',
    technologies: ['Three.js', 'GSAP', 'React Three Fiber'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 3,
    title: 'Synth Wave App',
    description: 'A mobile music production app with real-time audio visualization.',
    image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&q=80',
    category: 'mobile',
    technologies: ['React Native', 'Web Audio API', 'Canvas'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 4,
    title: 'Neon Brand Identity',
    description: 'Complete brand identity design for a tech startup with futuristic aesthetics.',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
    category: 'design',
    technologies: ['Figma', 'After Effects', 'Blender'],
    liveUrl: '#',
  },
  {
    id: 5,
    title: 'Cyber Commerce',
    description: 'E-commerce platform with AR product previews and gesture navigation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    category: 'web',
    technologies: ['Next.js', 'AR.js', 'Stripe', 'Prisma'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 6,
    title: 'Hologram UI Kit',
    description: 'A complete design system with holographic and glassmorphism components.',
    image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=800&q=80',
    category: 'design',
    technologies: ['Figma', 'CSS', 'Storybook'],
    liveUrl: '#',
  },
];

const categories: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'web', label: 'Web Apps' },
  { id: '3d', label: '3D / WebGL' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'design', label: 'Design' },
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredProjects = projects.filter(
    (project) => activeCategory === 'all' || project.category === activeCategory
  );

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden bg-muted/30">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div ref={ref} className="section-container relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Portfolio
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            A selection of my recent work showcasing creativity, technical expertise, 
            and attention to detail.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="project-card glass-card group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden rounded-t-xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Hover overlay with links */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60 backdrop-blur-sm">
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-primary text-primary-foreground"
                        aria-label="View live project"
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                    )}
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full glass-card"
                        aria-label="View source code"
                      >
                        <Github size={20} />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05, x: 5 }}
            className="inline-flex items-center gap-2 text-primary font-medium group"
          >
            View all projects
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
