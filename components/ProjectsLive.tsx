const projects = [
  {
    name: "Onyx Pay",
    category: "Crypto Payment Platform",
    description:
      "White-label crypto payment platform for luxury retail and hospitality, offering AI-driven reconciliation and branded acceptance with strong operational control.",
    icon: "💳",
  },
  {
    name: "WeMine",
    category: "Mining Platform",
    description:
      "Crypto platform where users buy NFTs representing automated mining contracts, earning passive income from Bitcoin, Dogecoin, and Litecoin rewards.",
    icon: "⛏️",
  },
  {
    name: "NetPool",
    category: "eSIM Provider",
    description:
      "Next-generation eSIM provider enabling instant mobile connectivity anywhere in just a few clicks, designed to become shareable between users.",
    icon: "📡",
  },
  {
    name: "Agora Hub",
    category: "Web3 Arena",
    description:
      "Building the ultimate Web3 arena, a hub for authentic, gamified experiences that connects users, investors, and projects for mutual growth.",
    icon: "🎮",
  },
  {
    name: "Bull21",
    category: "Web3 Growth Agency",
    description:
      "Web3 growth agency combining gamification, viral content, and community psychology to transform projects into self-reinforcing engagement loops.",
    icon: "🚀",
  },
];

export default function ProjectsLive() {
  return (
    <section id="projects" className="py-32 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-accent-subtle border border-accent-border rounded-full text-accent text-sm font-bold">
              ● LIVE PROJECTS
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Active Ventures</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the applications built on top of the Hearst infrastructure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-accent transition-colors shadow-sm hover:shadow-md"
            >
              <div className="relative p-8">
                <div className="text-5xl mb-4">{project.icon}</div>

                <div className="mb-2">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.name}</h3>

                <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>

                <button
                  type="button"
                  className="w-full px-6 py-3 bg-accent hover:bg-accent-dark text-accent-foreground rounded-lg font-semibold transition-colors group-hover:shadow-md"
                >
                  Explore Project
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
