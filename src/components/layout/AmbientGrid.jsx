export default function AmbientGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(243, 50, 50, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(243, 50, 50, 0.05) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    />
  )
}
