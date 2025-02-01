'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { CURRENT_LANGUAGE } from '@/config'

interface ContextProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  userInfo: any
  setUserInfo: Dispatch<SetStateAction<any>>
  language: "en" | "zh"
  setLanguage: Dispatch<SetStateAction<"en" | "zh">>
}

const AppContext = createContext<ContextProps>({
  sidebarOpen: false,
  setSidebarOpen: (): boolean => false,
  userInfo: {},
  setUserInfo: (): any => { },
  language: CURRENT_LANGUAGE,
  setLanguage: (): any => { }
})

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>({})
  const [language, setLanguage] = useState<"en" | "zh">(CURRENT_LANGUAGE as "en" | "zh")
  return (
    <AppContext.Provider value={{ sidebarOpen, setSidebarOpen, userInfo, setUserInfo, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppProvider = () => useContext(AppContext)