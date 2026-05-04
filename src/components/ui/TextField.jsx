export default function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
}) {
  return (
    <label htmlFor={id} className="block space-y-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-widest text-ronin-muted">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ronin-cream outline-none transition focus:border-ronin-crimson/60 focus:ring-2 focus:ring-ronin-crimson/25 placeholder:text-ronin-muted/50"
      />
    </label>
  )
}
