import HubLogo from "@/components/HubLogo";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-70" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <HubLogo />
          </div>
          <div className="inline-block">
            <span className="px-4 py-2 bg-accent-subtle border border-accent-border rounded-full text-accent text-sm font-medium">
              HEARST INFRASTRUCTURE ECOSYSTEM
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight">
            Built to run<br />
            <span className="text-accent">the future of work</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Mining at the core. Intelligence, connectivity, data build on top.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <a
              href="#projects"
              className="px-8 py-4 bg-accent hover:bg-accent-dark text-accent-foreground rounded-lg font-semibold transition-colors shadow-md shadow-accent/20"
            >
              Explore Projects
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-white text-accent border-2 border-accent rounded-lg font-semibold transition-colors hover:bg-accent-muted"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-accent/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
