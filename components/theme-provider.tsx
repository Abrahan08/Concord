'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Theme definitions
export const themes = {
  neon: {
    name: 'Neon',
    description: 'Vibrant neon with purple and blue accents',
    preview: 'from-gray-900/80 to-purple-900/20',
  },
  dark: {
    name: 'Dark',
    description: 'Clean dark theme',
    preview: 'from-gray-900 to-gray-800',
  },
  midnight: {
    name: 'Midnight',
    description: 'Deep blue midnight theme',
    preview: 'from-slate-900 to-blue-900/30',
  },
  matrix: {
    name: 'Matrix',
    description: 'Green matrix-inspired theme',
    preview: 'from-black to-green-900/30',
  },  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Pink and cyan cyberpunk theme',
    preview: 'from-gray-900 to-pink-900/30',
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm orange and purple sunset theme',
    preview: 'from-orange-900 to-purple-900/30',
  },
}

export const accentColors = {
  purple: {
    name: 'Purple',
    value: '#9333ea',
    gradient: 'from-purple-600 to-blue-500',
  },
  blue: {
    name: 'Blue',
    value: '#2563eb',
    gradient: 'from-blue-600 to-cyan-500',
  },
  pink: {
    name: 'Pink',
    value: '#ec4899',
    gradient: 'from-pink-600 to-purple-500',
  },
  red: {
    name: 'Red',
    value: '#dc2626',
    gradient: 'from-red-600 to-pink-500',
  },
  orange: {
    name: 'Orange',
    value: '#ea580c',
    gradient: 'from-amber-500 to-pink-500',
  },
  green: {
    name: 'Green',
    value: '#16a34a',
    gradient: 'from-green-600 to-teal-500',
  },  cyan: {
    name: 'Cyan',
    value: '#0891b2',
    gradient: 'from-cyan-600 to-blue-500',
  },
  gold: {
    name: 'Gold',
    value: '#f59e0b',
    gradient: 'from-yellow-500 to-orange-500',
  },
}

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      themes={['neon', 'dark', 'midnight', 'matrix', 'cyberpunk', 'sunset']}
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
