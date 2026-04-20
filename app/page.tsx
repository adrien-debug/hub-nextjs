import Hero from "@/components/Hero";
import About from "@/components/About";
import Methodology from "@/components/Methodology";
import ProjectsLive from "@/components/ProjectsLive";
import ProjectsComing from "@/components/ProjectsComing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Methodology />
      <ProjectsLive />
      <ProjectsComing />
      <Footer />
    </main>
  );
}
