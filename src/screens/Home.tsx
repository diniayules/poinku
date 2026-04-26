import { useState } from 'react'
import type { AppData } from '../types'
import type { ParentTab } from '../App'
import { EmojiOrImg } from '../components/EmojiOrImg'

type Props = {
  data: AppData
  onPickChild: (childId: string) => void
  onPickParentTab: (tab: ParentTab) => void
}

type MenuItem = {
  tab: ParentTab
  ikon: string
  judul: string
  deskripsi: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    tab: 'konfirmasi',
    ikon: '✅',
    judul: 'Konfirmasi',
    deskripsi: 'Setujui tugas, usulan, & klaim hadiah anak',
  },
  {
    tab: 'tugas',
    ikon: '📝',
    judul: 'Tugas Rutinitas',
    deskripsi: 'Atur daftar tugas harian anak',
  },
  {
    tab: 'hadiah',
    ikon: '🎁',
    judul: 'Hadiah',
    deskripsi: 'Kelola katalog hadiah & harganya',
  },
  {
    tab: 'sesuaikan',
    ikon: '⚖️',
    judul: 'Sesuaikan Poin',
    deskripsi: 'Tambah bonus atau kurangi poin',
  },
  {
    tab: 'pengaturan',
    ikon: '⚙️',
    judul: 'Pengaturan',
    deskripsi: 'Tambah/hapus anak, ganti PIN',
  },
]

export function Home({ data, onPickChild, onPickParentTab }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const pendingCount =
    data.completions.filter((c) => c.status === 'menunggu').length +
    data.proposals.filter((p) => p.status === 'menunggu').length +
    data.rewardClaims.filter((r) => r.status === 'menunggu').length

  return (
    <>
      <div className="screen">
        <h1 className="screen-title">
          Pilih Astronot <span className="emoji">👩‍🚀</span>
        </h1>
        <p className="screen-subtitle">
          Siapa yang mau lihat poinnya hari ini?
        </p>
        <div className="home-grid">
          {data.children.map((c) => (
            <button
              key={c.id}
              className="planet-card"
              onClick={() => onPickChild(c.id)}
            >
              <span className="avatar">
                <EmojiOrImg value={c.avatar} imgSize={96} />
              </span>
              <span className="nama">{c.nama}</span>
              <span className="poin">⭐ {c.totalPoin} poin</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="parent-fab"
        onClick={() => setMenuOpen(true)}
        aria-label="Mode Orang Tua"
      >
        <span className="parent-fab-ikon">🔒</span>
        {pendingCount > 0 && (
          <span className="parent-fab-badge">{pendingCount}</span>
        )}
      </button>

      {menuOpen && (
        <div
          className="parent-menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="parent-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="parent-menu-head">
              <span className="parent-menu-emoji">🔒</span>
              <div>
                <div className="parent-menu-title">Mode Orang Tua</div>
                <div className="parent-menu-sub">
                  Pilih menu — perlu PIN untuk masuk
                </div>
              </div>
            </div>
            <div className="parent-menu-list">
              {MENU_ITEMS.map((m) => {
                const showBadge =
                  m.tab === 'konfirmasi' && pendingCount > 0
                return (
                  <button
                    key={m.tab}
                    className="parent-menu-item"
                    onClick={() => {
                      setMenuOpen(false)
                      onPickParentTab(m.tab)
                    }}
                  >
                    <span className="parent-menu-item-ikon">{m.ikon}</span>
                    <span className="parent-menu-item-main">
                      <span className="parent-menu-item-judul">
                        {m.judul}
                        {showBadge && (
                          <span className="parent-menu-badge">
                            {pendingCount}
                          </span>
                        )}
                      </span>
                      <span className="parent-menu-item-desk">
                        {m.deskripsi}
                      </span>
                    </span>
                    <span className="parent-menu-chev">›</span>
                  </button>
                )
              })}
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setMenuOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}
