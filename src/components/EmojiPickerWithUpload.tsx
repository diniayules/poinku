import { useRef, useState } from 'react'
import { fileToResizedDataURL, isImageValue } from '../lib/image'

type Props = {
  emojis: string[]
  value: string
  onChange: (v: string) => void
  columns?: number
  maxImageSize?: number
}

export function EmojiPickerWithUpload({
  emojis,
  value,
  onChange,
  columns = 6,
  maxImageSize = 256,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const dataUrl = await fileToResizedDataURL(file, maxImageSize)
      onChange(dataUrl)
    } catch (ex) {
      setErr((ex as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const customActive = isImageValue(value)

  return (
    <div className="picker-wrap">
      <div
        className="emoji-picker"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        <button
          type="button"
          className={`upload-tile ${customActive ? 'active' : ''}`}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {customActive ? (
            <img src={value} alt="" className="upload-preview" />
          ) : busy ? (
            <span className="upload-spin">⏳</span>
          ) : (
            <span className="upload-plus">📷＋</span>
          )}
        </button>
        {emojis.map((e) => (
          <button
            key={e}
            type="button"
            className={!customActive && value === e ? 'active' : ''}
            onClick={() => onChange(e)}
          >
            {e}
          </button>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      {err && <p className="pin-error">{err}</p>}
    </div>
  )
}
