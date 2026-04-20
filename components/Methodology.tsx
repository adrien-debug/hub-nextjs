export default function Methodology() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Methodology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A proven framework for building, scaling, and launching world-class ventures
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Incubation Process
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              We identify high-potential concepts and nurture them through our proprietary incubation framework. 
              From ideation to MVP, each venture benefits from our full-stack infrastructure and expert guidance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">1</span>
                </span>
                <span className="text-gray-700">Strategic validation & market analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">2</span>
                </span>
                <span className="text-gray-700">Rapid prototyping on Hearst infrastructure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">3</span>
                </span>
                <span className="text-gray-700">Team assembly & resource allocation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">4</span>
                </span>
                <span className="text-gray-700">Launch & growth acceleration</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="w-16 h-16 bg-accent-dark rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Operational Mastery
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Once live, ventures benefit from centralized piloting, unified team coordination, and real-time 
              workflow integration. Complete control without operational overhead.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">✓</span>
                </span>
                <span className="text-gray-700">Centralized access & expense management</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">✓</span>
                </span>
                <span className="text-gray-700">Real-time data synchronization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">✓</span>
                </span>
                <span className="text-gray-700">AI-driven intelligence layer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-muted rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent text-xs font-bold">✓</span>
                </span>
                <span className="text-gray-700">Seamless tool integration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
