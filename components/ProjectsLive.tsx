const projects = [
  {
    name: "Onyx Pay",
    category: "Crypto Payment Platform",
    description: "White-label crypto payment platform for luxury retail and hospitality, offering AI-driven reconciliation and branded acceptance with strong operational control.",
    gradient: "from-slate-900 to-slate-700",
    icon: "💳"
  },
  {
    name: "WeMine",
    category: "Mining Platform",
    description: "Crypto platform where users buy NFTs representing automated mining contracts, earning passive income from Bitcoin, Dogecoin, and Litecoin rewards.",
    gradient: "from-orange-600 to-red-600",
    icon: "⛏️"
  },
  {
    name: "NetPool",
    category: "eSIM Provider",
    description: "Next-generation eSIM provider enabling instant mobile connectivity anywhere in just a few clicks, designed to become shareable between users.",
    gradient: "from-blue-600 to-cyan-600",
    icon: "📡"
  },
  {
    name: "Agora Hub",
    category: "Web3 Arena",
    description: "Building the ultimate Web3 arena, a hub for authentic, gamified experiences that connects users, investors, and projects for mutual growth.",
    gradient: "from-purple-600 to-pink-600",
    icon: "🎮"
  },
  {
    name: "Bull21",
    category: "Web3 Growth Agency",
    description: "Web3 growth agency combining gamification, viral content, and community psychology to transform projects into self-reinforcing engagement loops.",
    gradient: "from-green-600 to-emerald-600",
    icon: "🚀"
  }
];

export default function ProjectsLive() {
  return (
    <section id="projects" className="py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-bold">
              ● LIVE PROJECTS
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Active Ventures
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore the applications built on top of the Hearst infrastructure
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative p-8">
                <div className="text-5xl mb-4">{project.icon}</div>
                
                <div className="mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  {project.name}
                </h3>
                
                <p className="text-slate-400 leading-relaxed mb-6">
                  {project.description}
                </p>
                
                <button className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-semibold transition-all group-hover:border-white/20">
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
