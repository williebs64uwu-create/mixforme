import { Mic2, Settings, User } from 'lucide-react'

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                MixForMe
              </h1>
              <p className="text-xs text-gray-500">Professional Vocal Mixing</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-sm transition-all duration-200 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all duration-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
