export default function About() {
  return (
    <section id="about" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Who We Are
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Redefining Digital Infrastructure
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Hearst is building the first seamless bridge between complex engineering and user experience. 
              Our ecosystem is proudly built and scaled, eliminating third-party reliance by owning the entire 
              technology stack.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From custom silicon optimization to bespoke consensus protocols, we control every layer. 
              This is the foundation for a new era of decentralized, unstoppable compute.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-700 font-medium">Stack Ownership</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-700 font-medium">Third-Party Reliance</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-green-600 mb-2">7+</div>
              <div className="text-gray-700 font-medium">Live Projects</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-gray-700 font-medium">Scalability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
