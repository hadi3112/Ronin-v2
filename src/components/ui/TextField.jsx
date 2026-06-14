import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
}) {
  // By default, show the password text as requested
  const [showPassword, setShowPassword] = useState(type === 'password' ? true : false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type

  return (
    <label htmlFor={id} className="block space-y-1.5 text-left relative">
      <span className="text-xs font-medium uppercase tracking-widest text-ronin-muted">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ronin-cream outline-none transition-all duration-300 focus:border-ronin-crimson/80 focus:ring-1 focus:ring-ronin-crimson/50 focus:shadow-[0_0_20px_rgba(232,37,58,0.5)] placeholder:text-ronin-muted/50 ${isPasswordField ? 'pr-12' : ''}`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setShowPassword(!showPassword)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ronin-muted hover:text-ronin-cream transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </label>
  )
}
