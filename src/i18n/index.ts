import { createContext, useContext } from 'react'
import { dict, type DictKey, type Lang } from './dict'

type Vars = Record<string, string | number>

export type TFn = (key: DictKey, vars?: Vars) => string

const LangContext = createContext<Lang>('id')

export const LangProvider = LangContext.Provider

export function useLang(): Lang {
  return useContext(LangContext)
}

export function useT(): TFn {
  const lang = useLang()
  return (key, vars) => {
    const entry = dict[key]
    let s = entry[lang]
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, String(v))
      }
    }
    return s
  }
}

export type { DictKey, Lang }

export const LANG_LABEL: Record<Lang, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
}

export const LANG_FLAG: Record<Lang, string> = {
  id: '🇮🇩',
  en: '🇬🇧',
}

export const LANG_OPSI: Lang[] = ['id', 'en']
