import { useState } from 'react'
import type { AppData } from '../types'
import type { ParentTab } from '../App'
import { EmojiOrImg } from '../components/EmojiOrImg'
import { useT } from '../i18n'
import type { DictKey } from '../i18n/dict'
import { TEMA_HOME_EMOJI, TEMA_HOME_TITLE_KEY } from '../storage'

type Props = {
  data: AppData
  onPickChild: (childId: string) => void
  onPickParentTab: (tab: ParentTab) => void
}

type MenuItem = {
  tab: ParentTab
  ikon: string
  judulKey: DictKey
  deskripsiKey: DictKey
}

const MENU_ITEMS: MenuItem[] = [
  {
    tab: 'konfirmasi',
    ikon: '✅',
    judulKey: 'tabKonfirmasi',
    deskripsiKey: 'menuKonfirmasiDesc',
  },
  {
    tab: 'tugas',
    ikon: '📝',
    judulKey: 'tugasRutinitas',
    deskripsiKey: 'menuTugasDesc',
  },
  {
    tab: 'hadiah',
    ikon: '🎁',
    judulKey: 'tabHadiah',
    deskripsiKey: 'menuHadiahDesc',
  },
  {
    tab: 'sesuaikan',
    ikon: '⚖️',
    judulKey: 'tabSesuaikan',
    deskripsiKey: 'menuSesuaikanDesc',
  },
  {
    tab: 'pengaturan',
    ikon: '⚙️',
    judulKey: 'tabPengaturan',
    deskripsiKey: 'menuPengaturanDesc',
  },
]

export function Home({ data, onPickChild, onPickParentTab }: Props) {
  const t = useT()
  const [menuOpen, setMenuOpen] = useState(false)

  const pendingCount =
    data.completions.filter((c) => c.status === 'menunggu').length +
    data.proposals.filter((p) => p.status === 'menunggu').length +
    data.rewardClaims.filter((r) => r.status === 'menunggu').length

  return (
    <>
      <div className="screen">
        <h1 className="screen-title">
          {t(TEMA_HOME_TITLE_KEY[data.tema])}{' '}
          <span className="emoji">{TEMA_HOME_EMOJI[data.tema]}</span>
        </h1>
        <p className="screen-subtitle">{t('homeSub')}</p>
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
              <span className="poin">
                ⭐ {c.totalPoin} {t('pointsShort')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="parent-fab"
        onClick={() => setMenuOpen(true)}
        aria-label={t('parentMode')}
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
                <div className="parent-menu-title">{t('parentMode')}</div>
                <div className="parent-menu-sub">
                  {t('parentModeMenuSub')}
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
                        {t(m.judulKey)}
                        {showBadge && (
                          <span className="parent-menu-badge">
                            {pendingCount}
                          </span>
                        )}
                      </span>
                      <span className="parent-menu-item-desk">
                        {t(m.deskripsiKey)}
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
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
