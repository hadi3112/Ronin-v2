import RoninMark from '../components/branding/RoninMark.jsx'

export default function ComingSoonPage() {
  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center">
      <RoninMark size="lg" className="mb-8" />
      <h1 className="font-display text-3xl md:text-5xl text-white uppercase tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
        Coming Soon
      </h1>
    </div>
  )
}
