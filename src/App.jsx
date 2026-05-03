export default function App() {
  return (
    <div className="h-screen flex bg-black text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-4">
        <h1 className="text-2xl font-bold text-purple-400 mb-6">
          .Ronin
        </h1>

        <nav className="space-y-3 text-sm">
          <div>Dashboard</div>
          <div>Explore Levels</div>
          <div>Tutorials</div>
          <div>Progress</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome back, Ronin
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl">Level System</div>
          <div className="bg-zinc-900 p-4 rounded-xl">Courses</div>
          <div className="bg-zinc-900 p-4 rounded-xl">XP Tracker</div>
        </div>
      </main>

    </div>
  )
}