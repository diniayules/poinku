import { useEffect, useState } from 'react'
import { loadData, saveData } from './storage'
import type { AppData } from './types'
import { Setup } from './screens/Setup'
import { Home } from './screens/Home'
import { ChildDashboard } from './screens/ChildDashboard'
import { PinGate } from './screens/PinGate'
import { ParentMode } from './screens/ParentMode'
import './App.css'

type Screen =
  | { name: 'home' }
  | { name: 'child'; childId: string }
  | { name: 'pin' }
  | { name: 'parent' }

function App() {
  const [data, setData] = useState<AppData>(() => loadData())
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  useEffect(() => {
    saveData(data)
  }, [data])

  const needsSetup = !data.pinHash || data.children.length === 0

  if (needsSetup) {
    return (
      <>
        <Floaters />
        <div className="app">
          <Header />
          <Setup data={data} onFinish={setData} />
        </div>
      </>
    )
  }

  return (
    <>
      <Floaters />
      <div className="app">
        <Header />
        {screen.name === 'home' && (
          <Home
            data={data}
            onPickChild={(childId) => setScreen({ name: 'child', childId })}
            onPickParent={() => setScreen({ name: 'pin' })}
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
            onSuccess={() => setScreen({ name: 'parent' })}
            onCancel={() => setScreen({ name: 'home' })}
          />
        )}
        {screen.name === 'parent' && (
          <ParentMode
            data={data}
            setData={setData}
            onExit={() => setScreen({ name: 'home' })}
          />
        )}
      </div>
    </>
  )
}

function Floaters() {
  return (
    <div className="floaters" aria-hidden="true">
      <span>🪐</span>
      <span>🛸</span>
      <span>🌟</span>
      <span>☄️</span>
      <span>👾</span>
    </div>
  )
}

function Header() {
  return (
    <header className="app-header">
      <div className="app-title">
        <span className="rocket">🚀</span>
        <span>Petualangan Poin</span>
      </div>
    </header>
  )
}

export default App
