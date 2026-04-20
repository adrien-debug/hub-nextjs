import Hero from "@/components/Hero";
import About from "@/components/About";
import Methodology from "@/components/Methodology";
import IncubationPipeline from "@/components/IncubationPipeline";
import ProjectsLive from "@/components/ProjectsLive";
import ProjectsComing from "@/components/ProjectsComing";
import Footer from "@/components/Footer";

/** Home lit la SQLite ; ISR pour refléter les changements admin sans rebuild complet. */
export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Methodology />
      <IncubationPipeline />
      <ProjectsLive />
      <ProjectsComing />
      <Footer />
    </main>
  );
}
