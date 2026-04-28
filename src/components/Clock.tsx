import { useEffect, useState } from 'react'
import { useLang } from '../i18n'

const LOCALE: Record<string, string> = {
  id: 'id-ID',
  en: 'en-GB',
}

export function Clock() {
  const lang = useLang()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const locale = LOCALE[lang] ?? 'en-GB'

  const time = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  const date = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  return (
    <div className="app-clock" aria-live="off">
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
    </div>
  )
}
