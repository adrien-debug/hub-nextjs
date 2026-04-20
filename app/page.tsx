export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Hub
          </h1>
          <p className="text-xl text-gray-600">
            Frontend Next.js sur le port 6000
          </p>
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Bienvenue
            </h2>
            <p className="text-gray-600">
              Votre application Next.js est configurée et fonctionne sur localhost:6000
            </p>
          </div>
          
          <div className="flex gap-4">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Documentation Next.js
            </a>
            <a
              href="/api"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Test API Route
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
