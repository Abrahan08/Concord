"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface AuthCheckProps {
  children: (isAuthenticated: boolean) => React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || isLoading) {
    // Show loading state or nothing while checking auth
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children(isAuthenticated)}</>
}
