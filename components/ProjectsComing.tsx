const comingProjects = [
  {
    name: "Thynk",
    tagline: "Your cognitive mirror",
    description: "Decisions and behavioral patterns",
    gradient: "from-indigo-600 to-purple-600",
    icon: "🧠"
  },
  {
    name: "Atlas",
    tagline: "Global intelligence",
    description: "Global data mapping & analytics",
    gradient: "from-cyan-600 to-blue-600",
    icon: "🗺️"
  }
];

export default function ProjectsComing() {
  return (
    <section className="py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold">
              ⚡ THE PIPELINE
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            What&apos;s Next
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            A virtual walkthrough of every venture coming next at Hearst
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {comingProjects.map((project, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-10 hover:border-slate-700 transition-all">
                <div className="text-6xl mb-6">{project.icon}</div>
                
                <h3 className="text-4xl font-bold text-white mb-3">
                  {project.name}
                </h3>
                
                <p className="text-xl text-slate-300 mb-2 font-medium">
                  {project.tagline}
                </p>
                
                <p className="text-slate-400 mb-8">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="flex-1 h-px bg-slate-800"></div>
                  <span className="text-sm font-semibold uppercase tracking-wider">Coming Soon</span>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
