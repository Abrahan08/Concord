"use client"

import { ReactNode, useContext, useEffect } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { ServerContext } from "@/context/server-context"
import { cn } from "@/lib/utils"
import { Settings, Users, Shield, UserPlus, X, Trash2 } from "@/components/ui/safe-icons"

interface GuildSettingsLayoutProps {
  children: ReactNode
}

const settingsTabs = [
  {
    id: "general",
    name: "General",
    icon: Settings,
    description: "Basic information about your server"
  },
  {
    id: "members", 
    name: "Members",
    icon: Users,
    description: "Manage server members"
  },
  {
    id: "roles",
    name: "Roles", 
    icon: Shield,
    description: "Manage roles and permissions"
  },
  {
    id: "invites",
    name: "Invites",
    icon: UserPlus, 
    description: "Manage invite links"
  },  {
    id: "bans",
    name: "Bans",
    icon: X,
    description: "Manage banned users"
  },
  {
    id: "delete",
    name: "Delete",
    icon: Trash2,
    description: "Delete this server"
  }
]

export default function GuildSettingsLayout({ children }: GuildSettingsLayoutProps) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const guildId = params.guildId as string
  
  // Extract current tab from pathname
  const pathSegments = pathname.split('/')
  const currentTab = pathSegments[pathSegments.length - 1] || "general"
  
  const { servers, currentServer, setCurrentServerId } = useContext(ServerContext)

  // Find the current guild
  const currentGuild = currentServer?.id === guildId ? currentServer : servers.find(server => server.id === guildId)

  useEffect(() => {
    // Set the current server if it's not already set
    if (guildId && (!currentServer || currentServer.id !== guildId)) {
      setCurrentServerId(guildId)
    }
  }, [guildId, currentServer, setCurrentServerId])

  // Show loading if servers aren't loaded yet
  if (servers.length === 0) {
    return (
      <div className="flex h-screen bg-background text-foreground items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading servers...</p>
        </div>
      </div>
    )
  }

  const handleTabClick = (tabId: string) => {
    router.push(`/guild/${guildId}/settings/${tabId}`)
  }

  const handleBackToGuild = () => {
    router.push(`/guild/${guildId}`)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Settings Sidebar */}
      <div className="w-72 bg-card/95 backdrop-blur-sm border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <button
            onClick={handleBackToGuild}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Server
          </button>          <h1 className="text-xl font-bold text-foreground">Server Settings</h1>
          <p className="text-sm text-muted-foreground">{currentGuild?.name || "Loading..."}</p>
        </div>

        {/* Settings Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = currentTab === tab.id
              
              return (                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                    isActive
                      ? "bg-primary/20 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
