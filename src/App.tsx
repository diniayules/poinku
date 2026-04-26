import { useEffect, useState } from 'react'
import { TEMA_FLOATERS, TEMA_IKON, loadData, saveData } from './storage'
import type { AppData } from './types'
import { Setup } from './screens/Setup'
import { Home } from './screens/Home'
import { ChildDashboard } from './screens/ChildDashboard'
import { PinGate } from './screens/PinGate'
import { ParentMode } from './screens/ParentMode'
import './App.css'

export type ParentTab =
  | 'konfirmasi'
  | 'tugas'
  | 'hadiah'
  | 'sesuaikan'
  | 'pengaturan'

type Screen =
  | { name: 'home' }
  | { name: 'child'; childId: string }
  | { name: 'pin'; targetTab: ParentTab }
  | { name: 'parent'; initialTab: ParentTab }

function App() {
  const [data, setData] = useState<AppData>(() => loadData())
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  useEffect(() => {
    saveData(data)
  }, [data])

  useEffect(() => {
    document.documentElement.dataset.tema = data.tema
  }, [data.tema])

  const needsSetup = !data.pinHash || data.children.length === 0

  if (needsSetup) {
    return (
      <>
        <Floaters tema={data.tema} />
        <div className="app">
          <Header tema={data.tema} />
          <Setup data={data} onFinish={setData} />
        </div>
      </>
    )
  }

  return (
    <>
      <Floaters tema={data.tema} />
      <div className="app">
        <Header tema={data.tema} />
        {screen.name === 'home' && (
          <Home
            data={data}
            onPickChild={(childId) => setScreen({ name: 'child', childId })}
            onPickParentTab={(tab) =>
              setScreen({ name: 'pin', targetTab: tab })
            }
          />
        )}
        {screen.name === 'child' && (
          <ChildDashboard
            data={data}
            childId={screen.childId}
            setData={setData}
            onBack={() => setScreen({ name: 'home' })}
          />
        )}
        {screen.name === 'pin' && (
          <PinGate
            pinHash={data.pinHash!}
            onSuccess={() =>
              setScreen({ name: 'parent', initialTab: screen.targetTab })
            }
            onCancel={() => setScreen({ name: 'home' })}
          />
        )}
        {screen.name === 'parent' && (
          <ParentMode
            data={data}
            setData={setData}
            initialTab={screen.initialTab}
            onExit={() => setScreen({ name: 'home' })}
          />
        )}
      </div>
    </>
  )
}

function Floaters({ tema }: { tema: AppData['tema'] }) {
  const items = TEMA_FLOATERS[tema]
  return (
    <div className="floaters" aria-hidden="true">
      {items.map((e, i) => (
        <span key={i}>{e}</span>
      ))}
    </div>
  )
}

function Header({ tema }: { tema: AppData['tema'] }) {
  return (
    <header className="app-header">
      <div className="app-title">
        <span className="rocket">{TEMA_IKON[tema]}</span>
        <span>Petualangan Poin</span>
      </div>
    </header>
  )
}

export default App
