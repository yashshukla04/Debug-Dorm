import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Link as LinkIcon, Code, Play } from 'lucide-react'

function HomePage() {
  const [repoUrl, setRepoUrl] = useState('')
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleAnalyze = () => {
    if (!repoUrl || isLoading) return
    
    setIsLoading(true)

    // Extract repo name from URL
    const parts = repoUrl.split('/')
    let repoName = parts[parts.length - 1] || parts[parts.length - 2]
    
    // Simple cleaning
    if (repoName?.endsWith('.git')) {
      repoName = repoName.slice(0, -4)
    }

    if (!repoName) repoName = 'unknown-repo'

    // Mock data for preview (Simulate light detection)
    setPreview({
      name: repoName,
      stars: Math.floor(Math.random() * 10000) + 100,
      language: 'JavaScript'
    })

    // Navigate to analysis page after a short delay to show the preview card and spinner
    setTimeout(() => {
        navigate('/analysis', { state: { repoUrl } })
        setIsLoading(false)
    }, 1200)
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-transparent text-white font-inter selection:bg-blue-500/30 overflow-hidden">
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between w-full px-12 py-8 backdrop-blur-sm">
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">G</span>
          </div>
          Codebase <span className="text-blue-500">GPS</span>
        </div>
        <div className="ml-auto flex gap-8 items-center">
          <button className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
            Documentation
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            <Code className="w-4 h-4" /> GitHub
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center w-full px-6 relative z-10">
        <div className="max-w-3xl w-full text-center mx-auto">
          
          <div className="space-y-2 mb-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] opacity-0 animate-entrance">
              Understand Any Codebase
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight opacity-0 animate-entrance delay-200">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Instantly.
              </span>
            </h2>
          </div>

          <p className="text-base md:text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed text-center opacity-0 animate-entrance delay-400">
            Visualize structure. Trace logic. Explore faster.
          </p>

          {/* Repo Input Component */}
          <div className="relative w-full max-w-xl mx-auto group opacity-0 animate-entrance delay-500">
            <div className="flex flex-col md:flex-row gap-2 p-2 bg-white/[0.04] border border-white/10 rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-500 justify-center items-center backdrop-blur-sm">
              <div className="flex-1 flex items-center px-4 w-full">
                <LinkIcon className="w-4 h-4 mr-3 text-gray-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Paste GitHub repo URL"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 py-3 text-sm"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full md:w-auto px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-105 hover:scale-[1.03] active:scale-95 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Repo Preview Card */}
          {preview && (
            <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out w-full flex justify-center">
              <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-left shadow-2xl relative overflow-hidden backdrop-blur-xl group mx-auto">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{preview.name}</h3>
                    <div className="flex items-center gap-5">
                      <span className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        {preview.language}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        ⭐ {preview.stars.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-white/5 text-gray-500 text-[10px] font-black tracking-widest rounded-full border border-white/10">
                    PUBLIC
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[85%] animate-pulse"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 uppercase tracking-widest font-black">
                    <span>Architecture Scanned</span>
                    <span className="text-blue-400">85%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Codebase Intelligence Layer 1.0</p>
      </footer>
    </div>
  )
}

export default HomePage
