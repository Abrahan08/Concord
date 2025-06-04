"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useServer } from "@/hooks/use-server"

export interface Server {
  id: string
  name: string
  icon?: string
  description?: string
}

interface ServerContextType {
  servers: Server[]
  currentServerId: string | null
  currentServer: Server | null
  setCurrentServerId: (id: string | null) => void
  addServer: (server: Server) => void
  leaveServer: (serverId: string) => Promise<void>
}

export const ServerContext = createContext<ServerContextType>({
  servers: [],
  currentServerId: null,
  currentServer: null,
  setCurrentServerId: () => {},
  addServer: () => {},
  leaveServer: async () => {},
})

export function ServerProvider({ children }: { children: ReactNode }) {
  const { leaveServer: leaveServerFunc } = useServer()
  // Default mock servers
  const defaultServers: Server[] = [
    {
      id: "1",
      name: "Verdant HQ",
      description: "The official Verdant community server for developers and designers.",
    },
    {
      id: "2",
      name: "Design Team",
      description: "Collaborative space for design discussions and creative workflows.",
    },
    {
      id: "3",
      name: "Gaming Squad",
      description: "Gaming community for multiplayer sessions and tournament coordination.",
    },
    {
      id: "4",
      name: "Book Club",
      description: "Monthly book discussions and literary recommendations.",
    },
  ]
  const [servers, setServers] = useState<Server[]>(() => {
    // Initialize servers from localStorage on first load
    if (typeof window !== 'undefined') {
      const storedServers = localStorage.getItem("verdant_servers")
      if (storedServers) {
        try {
          return JSON.parse(storedServers)
        } catch (error) {
          console.error('Error parsing stored servers:', error)        }
      }
    }
    // Return default servers if no stored data or error
    return defaultServers
  })
    const [currentServerId, setCurrentServerId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const storedCurrentId = localStorage.getItem("verdant_current_server")
      if (storedCurrentId) {
        return storedCurrentId
      }
    }
    // Don't auto-select any server - let it be null initially
    return null
  })
  const handleSetCurrentServerId = (id: string | null) => {
    // Treat empty string as null as well
    const newId = id && id !== "" ? id : null
    setCurrentServerId(newId)
    
    // Store current server ID in localStorage
    if (typeof window !== 'undefined') {
      if (newId) {
        localStorage.setItem("verdant_current_server", newId)
      } else {
        localStorage.removeItem("verdant_current_server")
      }
    }
  }
  // Initialize localStorage with default servers if none exist (only run once)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedServers = localStorage.getItem("verdant_servers")
      if (!storedServers) {
        localStorage.setItem("verdant_servers", JSON.stringify(defaultServers))
      }
    }
  }, []) // Only run once on mount  // Update localStorage whenever servers change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("verdant_servers", JSON.stringify(servers))
    }
  }, [servers])

  // Don't automatically select a server - let the user choose explicitly
  
  const currentServer = currentServerId ? servers.find((server) => server.id === currentServerId) || null : null

  const addServer = (server: Server) => {
    setServers((prevServers) => [...prevServers, server])
  }

  const leaveServer = async (serverId: string) => {
    await leaveServerFunc(serverId)

    // Update local state
    setServers((prevServers) => prevServers.filter((server) => server.id !== serverId))

    // If the current server is being left, switch to another server
    if (currentServerId === serverId) {
      const remainingServers = servers.filter((server) => server.id !== serverId)
      if (remainingServers.length > 0) {
        setCurrentServerId(remainingServers[0].id)
      } else {
        setCurrentServerId(null)
      }
    }
  }

  return (    <ServerContext.Provider
      value={{
        servers,
        currentServerId,
        currentServer,
        setCurrentServerId: handleSetCurrentServerId,
        addServer,
        leaveServer,
      }}
    >
      {children}
    </ServerContext.Provider>
  )
}
