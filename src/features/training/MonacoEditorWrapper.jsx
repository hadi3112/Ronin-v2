import { useRef } from 'react'
import Editor from '@monaco-editor/react'

/**
 * MonacoEditorWrapper — Web-only Monaco Editor wrapper.
 *
 * Renders a fully interactive Monaco editor instance.
 * Only imported on web (never referenced by expo-shell or Android builds).
 *
 * Props:
 *   language   – Monaco language id  ('python' | 'cpp' | 'javascript')
 *   value      – Controlled or default code string
 *   onChange   – Optional (value: string) => void callback
 *   readOnly   – Disable editing (defaults false)
 */
export default function MonacoEditorWrapper({ language = 'python', value, onChange, readOnly = false }) {
  const editorRef = useRef(null)

  function handleEditorDidMount(editor) {
    editorRef.current = editor
    // Ensure the editor fills its container when the layout shifts
    editor.layout()
  }

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={onChange}
      loading={
        /* Shown while Monaco JS bundles are fetched from CDN */
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#1e1e1e]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-ronin-coral/80" />
          <p className="font-mono text-[11px] text-white/30">Loading Monaco…</p>
        </div>
      }
      options={{
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        fontLigatures: true,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        lineDecorationsWidth: 6,
        renderLineHighlight: 'gutter',
        roundedSelection: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        automaticLayout: true,
        readOnly,
        padding: { top: 12, bottom: 12 },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
          useShadows: false,
        },
        overviewRulerLanes: 0,
      }}
    />
  )
}
