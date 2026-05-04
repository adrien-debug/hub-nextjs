import Hero from "@/components/Hero";
import StickyNav from "@/components/StickyNav";
import Metrics from "@/components/Metrics";
import About from "@/components/About";
import Methodology from "@/components/Methodology";
import ProjectsLive from "@/components/ProjectsLive";
import Join from "@/components/Join";
import Footer from "@/components/Footer";

/** Home lit la SQLite ; ISR pour refléter les changements admin sans rebuild complet. */
export const revalidate = 60;

export default function Home() {
  return (
    <main id="top">
      <StickyNav />
      <Hero />
      <Metrics />
      <About />
      <Methodology />
      <ProjectsLive />
      <Join />
      <Footer />
    </main>
  );
}
