import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Background3D } from "@/components/Background3D";

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent relative selection:bg-primary selection:text-white">
      {/* Custom double cursor element */}
      <CustomCursor />

      {/* Persistent full-page interactive 3D background */}
      <Background3D />

      {/* Navigation menu */}
      <Navigation />

      <main>
        {/* Hero Banner with WebGL network animation */}
        <HeroSection />

        {/* Profile Bio details */}
        <AboutSection />

        {/* Developer Toolkit skills */}
        <SkillsSection />

        {/* Timeline Pipeline selected projects list */}
        <ProjectsSection />

        {/* Large CTA Contact block */}
        <ContactSection />
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
};

export default Index;
