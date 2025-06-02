'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface ThemeContextType {
  currentTheme: string
  accentColor: string
  setTheme: (theme: string) => void
  setAccentColor: (color: string) => void
  glowEffects: boolean
  setGlowEffects: (enabled: boolean) => void
  animations: boolean
  setAnimations: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useAppTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeContextProvider')
  }
  return context
}

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme: setNextTheme } = useTheme()
  const [accentColor, setAccentColorState] = useState<string | null>(null)
  const [glowEffects, setGlowEffects] = useState<boolean | null>(null)
  const [animations, setAnimations] = useState<boolean | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAccentColor = localStorage.getItem('accent-color')
      const savedGlowEffects = localStorage.getItem('glow-effects')
      const savedAnimations = localStorage.getItem('animations')

      setAccentColorState(savedAccentColor || 'red')
      setGlowEffects(savedGlowEffects !== null ? savedGlowEffects === 'true' : true)
      setAnimations(savedAnimations !== null ? savedAnimations === 'true' : true)
      setIsReady(true)
    }
  }, [])

  // Apply theme classes to document
  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      document.documentElement.className = theme
    }
  }, [theme])
  // Apply accent color CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined' && accentColor) {
      const root = document.documentElement
      const colors = {
        purple: { primary: '267 75% 64%', secondary: '280 100% 70%' },
        blue: { primary: '217 91% 60%', secondary: '199 89% 48%' },
        pink: { primary: '324 85% 66%', secondary: '320 100% 60%' },
        red: { primary: '0 84% 60%', secondary: '348 83% 47%' },
        orange: { primary: '25 95% 53%', secondary: '43 89% 38%' },
        green: { primary: '120 100% 40%', secondary: '160 84% 39%' },
        cyan: { primary: '189 94% 43%', secondary: '180 100% 50%' },
        gold: { primary: '45 93% 47%', secondary: '43 89% 38%' }
      }
      const selectedColor = colors[accentColor as keyof typeof colors] || colors.red
      root.style.setProperty('--primary', selectedColor.primary)
      root.style.setProperty('--secondary', selectedColor.secondary)
    }
  }, [accentColor])

  // Apply effect preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && glowEffects !== null && animations !== null) {
      const root = document.documentElement
      if (!glowEffects) {
        root.style.setProperty('--disable-glow', '1')
      } else {
        root.style.removeProperty('--disable-glow')
      }
      if (!animations) {
        root.style.setProperty('--disable-animations', '1')
      } else {
        root.style.removeProperty('--disable-animations')
      }
    }
  }, [glowEffects, animations])

  const setTheme = (newTheme: string) => {
    setNextTheme(newTheme)
  }

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    if (typeof window !== 'undefined') {
      localStorage.setItem('accent-color', color)
    }
  }

  const setGlowEffectsWithStorage = (enabled: boolean) => {
    setGlowEffects(enabled)
    if (typeof window !== 'undefined') {
      localStorage.setItem('glow-effects', enabled.toString())
    }
  }

  const setAnimationsWithStorage = (enabled: boolean) => {
    setAnimations(enabled)
    if (typeof window !== 'undefined') {
      localStorage.setItem('animations', enabled.toString())
    }
  }

  if (!isReady || accentColor === null || glowEffects === null || animations === null) {
    return null
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: theme || 'neon',
        accentColor,
        setTheme,
        setAccentColor,
        glowEffects,
        setGlowEffects: setGlowEffectsWithStorage,
        animations,
        setAnimations: setAnimationsWithStorage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}