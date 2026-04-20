const comingProjects = [
  {
    name: "Thynk",
    tagline: "Your cognitive mirror",
    description: "Decisions and behavioral patterns",
    icon: "🧠",
  },
  {
    name: "Atlas",
    tagline: "Global intelligence",
    description: "Global data mapping & analytics",
    icon: "🗺️",
  },
];

export default function ProjectsComing() {
  return (
    <section className="py-32 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-accent-subtle border border-accent-border rounded-full text-accent text-sm font-bold">
              ⚡ THE PIPELINE
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">What&apos;s Next</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A virtual walkthrough of every venture coming next at Hearst
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {comingProjects.map((project, index) => (
            <div key={index} className="group relative">
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-accent transition-colors shadow-sm hover:shadow-md">
                <div className="text-6xl mb-6">{project.icon}</div>

                <h3 className="text-4xl font-bold text-gray-900 mb-3">{project.name}</h3>

                <p className="text-xl text-accent mb-2 font-medium">{project.tagline}</p>

                <p className="text-gray-600 mb-8">{project.description}</p>

                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex-1 h-px bg-accent-border" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-accent">Coming Soon</span>
                  <div className="flex-1 h-px bg-accent-border" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
