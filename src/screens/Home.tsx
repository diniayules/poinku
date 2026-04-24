import type { AppData } from '../types'

type Props = {
  data: AppData
  onPickChild: (childId: string) => void
  onPickParent: () => void
}

export function Home({ data, onPickChild, onPickParent }: Props) {
  return (
    <div className="screen">
      <h1 className="screen-title">
        Pilih Astronot <span className="emoji">👩‍🚀</span>
      </h1>
      <p className="screen-subtitle">Siapa yang mau lihat poinnya hari ini?</p>
      <div className="home-grid">
        {data.children.map((c) => (
          <button
            key={c.id}
            className="planet-card"
            onClick={() => onPickChild(c.id)}
          >
            <span className="avatar">{c.avatar}</span>
            <span className="nama">{c.nama}</span>
            <span className="poin">⭐ {c.totalPoin} poin</span>
          </button>
        ))}
        <button className="planet-card parent" onClick={onPickParent}>
          <span className="avatar">🔒</span>
          <span className="nama">Orang Tua</span>
          <span className="poin">Atur tugas & poin</span>
        </button>
      </div>
    </div>
  )
}
