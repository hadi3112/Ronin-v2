import ReactMarkdown from 'react-markdown'
import NeonButton from '../ui/NeonButton.jsx'

export default function TextLessonRenderer({ contentMarkdown, onComplete, nextLabel = "Continue" }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="prose prose-invert prose-ronin w-full max-w-none rounded-2xl border border-white/10 bg-black/40 p-8 shadow-lg backdrop-blur-md">
        <ReactMarkdown
          components={{
            pre: ({ node, ...props }) => (
              <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 shadow-inner my-6 overflow-x-auto">
                <pre {...props} className="text-sm font-mono text-ronin-cream" />
              </div>
            ),
            code: ({ node, inline, ...props }) => 
              inline ? (
                <code {...props} className="rounded bg-ronin-crimson/20 px-1 py-0.5 text-ronin-crimson" />
              ) : (
                <code {...props} />
              ),
            h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold text-ronin-cream mt-8 mb-4" />,
            p: ({ node, ...props }) => <p {...props} className="text-ronin-muted mb-4 leading-relaxed" />,
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-6">
                <table {...props} className="w-full text-left text-sm text-ronin-muted border-collapse" />
              </div>
            ),
            th: ({ node, ...props }) => <th {...props} className="border-b border-white/10 p-3 font-semibold text-ronin-cream bg-white/5" />,
            td: ({ node, ...props }) => <td {...props} className="border-b border-white/5 p-3" />,
          }}
        >
          {contentMarkdown}
        </ReactMarkdown>
      </div>
      <div className="mt-8 flex justify-end">
        <NeonButton variant="crimson" onClick={onComplete} className="px-8">
          {nextLabel}
        </NeonButton>
      </div>
    </div>
  )
}
