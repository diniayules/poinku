import { useState } from 'react'
import type { AppData } from '../types'
import type { ParentTab } from '../App'
import { ParentKonfirmasi } from './parent/ParentKonfirmasi'
import { ParentTugas } from './parent/ParentTugas'
import { ParentHadiah } from './parent/ParentHadiah'
import { ParentSesuaikan } from './parent/ParentSesuaikan'
import { ParentPengaturan } from './parent/ParentPengaturan'

type Props = {
  data: AppData
  setData: (d: AppData) => void
  initialTab?: ParentTab
  onExit: () => void
}

export function ParentMode({
  data,
  setData,
  initialTab = 'konfirmasi',
  onExit,
}: Props) {
  const [tab, setTab] = useState<ParentTab>(initialTab)
  const pending =
    data.completions.filter((c) => c.status === 'menunggu').length +
    data.proposals.filter((p) => p.status === 'menunggu').length +
    data.rewardClaims.filter((r) => r.status === 'menunggu').length

  return (
    <div className="screen">
      <button className="back-btn" onClick={onExit}>
        ← Keluar Mode Orang Tua
      </button>
      <h2 className="screen-title">
        Mode Orang Tua <span className="emoji">🔒</span>
      </h2>

      <div className="tabs">
        <button
          className={`tab ${tab === 'konfirmasi' ? 'active' : ''}`}
          onClick={() => setTab('konfirmasi')}
        >
          Konfirmasi {pending > 0 && `(${pending})`}
        </button>
        <button
          className={`tab ${tab === 'tugas' ? 'active' : ''}`}
          onClick={() => setTab('tugas')}
        >
          Tugas
        </button>
        <button
          className={`tab ${tab === 'hadiah' ? 'active' : ''}`}
          onClick={() => setTab('hadiah')}
        >
          Hadiah
        </button>
        <button
          className={`tab ${tab === 'sesuaikan' ? 'active' : ''}`}
          onClick={() => setTab('sesuaikan')}
        >
          Sesuaikan Poin
        </button>
        <button
          className={`tab ${tab === 'pengaturan' ? 'active' : ''}`}
          onClick={() => setTab('pengaturan')}
        >
          Pengaturan
        </button>
      </div>

      {tab === 'konfirmasi' && (
        <ParentKonfirmasi data={data} setData={setData} />
      )}
      {tab === 'tugas' && <ParentTugas data={data} setData={setData} />}
      {tab === 'hadiah' && <ParentHadiah data={data} setData={setData} />}
      {tab === 'sesuaikan' && (
        <ParentSesuaikan data={data} setData={setData} />
      )}
      {tab === 'pengaturan' && (
        <ParentPengaturan data={data} setData={setData} />
      )}
    </div>
  )
}
