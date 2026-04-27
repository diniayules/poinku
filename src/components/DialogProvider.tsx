import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type DialogVariant = 'default' | 'danger' | 'success' | 'info'

export type DialogConfig = {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: DialogVariant
  emoji?: string
}

type Internal = DialogConfig & {
  type: 'confirm' | 'alert'
  resolve: (v: boolean) => void
}

type DialogApi = {
  confirm: (cfg: DialogConfig) => Promise<boolean>
  alert: (cfg: DialogConfig) => Promise<void>
}

const Ctx = createContext<DialogApi | null>(null)

export function useDialog(): DialogApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDialog requires DialogProvider')
  return ctx
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Internal | null>(null)

  const confirm = useCallback((cfg: DialogConfig) => {
    return new Promise<boolean>((resolve) => {
      setActive({ ...cfg, type: 'confirm', resolve })
    })
  }, [])

  const alertFn = useCallback((cfg: DialogConfig) => {
    return new Promise<void>((resolve) => {
      setActive({
        ...cfg,
        type: 'alert',
        resolve: () => resolve(),
      })
    })
  }, [])

  function close(value: boolean) {
    if (!active) return
    active.resolve(value)
    setActive(null)
  }

  const variant = active?.variant ?? 'default'

  return (
    <Ctx.Provider value={{ confirm, alert: alertFn }}>
      {children}
      {active && (
        <div
          className="dialog-overlay"
          onClick={() => close(active.type === 'alert' ? true : false)}
        >
          <div
            className={`dialog dialog-${variant}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {active.emoji && (
              <div className="dialog-emoji">{active.emoji}</div>
            )}
            {active.title && (
              <h3 className="dialog-title">{active.title}</h3>
            )}
            <p className="dialog-msg">{active.message}</p>
            <div className="dialog-actions">
              {active.type === 'confirm' && (
                <button
                  className="btn btn-ghost"
                  onClick={() => close(false)}
                >
                  {active.cancelText ?? 'Batal'}
                </button>
              )}
              <button
                className={`btn ${
                  variant === 'danger' ? 'btn-danger' : ''
                } ${variant === 'success' ? 'btn-success' : ''}`}
                onClick={() => close(true)}
                autoFocus
              >
                {active.confirmText ?? 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
