export default function DashboardPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Welcome back, Ronin</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-4 rounded-xl">Level System</div>
        <div className="bg-zinc-900 p-4 rounded-xl">Courses</div>
        <div className="bg-zinc-900 p-4 rounded-xl">XP Tracker</div>
      </div>
    </>
  )
}
