"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface ServerData {
  name: string
  description?: string
  icon?: string
}

interface ServerContextType {
  createServer: (data: ServerData) => Promise<any>
  joinServer: (inviteCode: string) => Promise<any>
  leaveServer: (serverId: string) => Promise<void>
}

const ServerFunctionsContext = createContext<ServerContextType>({
  createServer: async () => ({}),
  joinServer: async () => ({}),
  leaveServer: async () => {},
})

export const ServerFunctionsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const createServer = async (data: ServerData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would create a server in the backend
    // For now, we'll just return a mock server object
    const newServer = {
      id: Date.now().toString(),
      ...data,
    }

    // Don't update localStorage here - let ServerContext handle it
    // The ServerContext will handle localStorage persistence through its useEffect
    
    return newServer
  }
  const joinServer = async (inviteCode: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would validate the invite code with a backend
    // For now, we'll just create a mock server
    if (inviteCode) {
      const newServer = {
        id: Date.now().toString(),
        name: `Server ${inviteCode.substring(0, 4)}`,
        icon: "/placeholder.svg?height=200&amp;width=200",
      }

      // Don't update localStorage here - let ServerContext handle it
      // The ServerContext will handle localStorage persistence through its useEffect

      return newServer
    } else {
      throw new Error("Invalid invite code")
    }
  }
  const leaveServer = async (serverId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would update the backend
    // Don't update localStorage here - let ServerContext handle it
    // The ServerContext will handle localStorage persistence and state updates
  }

  return (
    <ServerFunctionsContext.Provider
      value={{
        createServer,
        joinServer,
        leaveServer,
      }}
    >
      {children}
    </ServerFunctionsContext.Provider>
  )
}

export const useServer = () => useContext(ServerFunctionsContext)
