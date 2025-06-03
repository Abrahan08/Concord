"use client"

import { useState, useContext, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import GuildSidebar from "@/components/shell/guild-sidebar"
import ChannelSidebar from "@/components/shell/channel-sidebar"
import MainPanel from "@/components/shell/main-panel"
import NotificationsPanel from "@/components/shell/notifications-panel"
import UserFooterBar from "@/components/user/user-footer-bar"
import GuildMembersPanel from "@/components/shell/guild-member-panel"
import { ServerProvider } from "@/context/server-context"
import { ChannelProvider } from "@/context/channel-context"
import { UserProvider } from "@/context/user-context"
import { VoiceConnectionProvider } from "@/components/voice/voice-connection-provider"
import AuthCheck from "@/components/auth/auth-check"
import { redirect } from "next/navigation"
import { ServerContext } from "@/context/server-context"
import type { GuildMember } from "@/components/shell/guild-member-panel"

// Mock data for testing
const mockRoles = [
  { id: "1", name: "Admin", color: "#ff0000", position: 100, permissions: ["all"] },
  { id: "2", name: "Moderator", color: "#00ff00", position: 50, permissions: ["moderate"] },
  { id: "3", name: "Member", color: "#0000ff", position: 10, permissions: ["chat"] },
]

const mockMembers: GuildMember[] = [
  {
    id: "1",
    username: "Alice",
    discriminator: "0001",
    avatar: "/placeholder-user.jpg",
    status: "online",
    customStatus: "Building the future",
    roles: ["1"],
    isBot: false,
    isOwner: true,
    joinedAt: "2023-01-01T00:00:00Z",
    nickname: "Alice Admin",
  },
  {
    id: "2",
    username: "Bob",
    discriminator: "0002",
    avatar: "/placeholder-user.jpg",
    status: "idle",
    customStatus: "Away for lunch",
    roles: ["2"],
    isBot: false,
    isOwner: false,
    joinedAt: "2023-02-01T00:00:00Z",
    nickname: "Bob Mod",
  },
  {
    id: "3",
    username: "Charlie",
    discriminator: "0003",
    avatar: "/placeholder-user.jpg",
    status: "offline",
    roles: ["3"],
    isBot: false,
    isOwner: false,
    joinedAt: "2023-03-01T00:00:00Z",
    lastSeen: "2024-05-30T15:30:00Z",
  },
  {
    id: "4",
    username: "GameBot",
    discriminator: "0000",
    avatar: "/placeholder-user.jpg",
    status: "online",
    customStatus: "Ready to play!",
    roles: [],
    isBot: true,
    isOwner: false,
    joinedAt: "2023-01-15T00:00:00Z",
  },
]

export default function GuildPage() {
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false)
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(true)

  const toggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen)
  }

  const toggleMembersPanel = () => {
    setIsMembersPanelOpen(!isMembersPanelOpen)
  }

  return (
    <AuthCheck>
      {(isAuthenticated) => {
        if (!isAuthenticated) {
          redirect("/login")
          return null
        }

        return (
          <UserProvider>
            <ServerProvider>
              <ChannelProvider>                <GuildContent 
                  isNotificationsPanelOpen={isNotificationsPanelOpen} 
                  toggleNotificationsPanel={toggleNotificationsPanel} 
                  setIsNotificationsPanelOpen={setIsNotificationsPanelOpen}
                  isMembersPanelOpen={isMembersPanelOpen}
                  toggleMembersPanel={toggleMembersPanel}
                  setIsMembersPanelOpen={setIsMembersPanelOpen}
                />
              </ChannelProvider>
            </ServerProvider>
          </UserProvider>
        )
      }}
    </AuthCheck>
  )
}

function GuildContent({
  isNotificationsPanelOpen,
  toggleNotificationsPanel, 
  setIsNotificationsPanelOpen,
  isMembersPanelOpen,
  toggleMembersPanel,
  setIsMembersPanelOpen
}: { 
  isNotificationsPanelOpen: boolean, 
  toggleNotificationsPanel: () => void,
  setIsNotificationsPanelOpen: (value: boolean) => void,
  isMembersPanelOpen: boolean,
  toggleMembersPanel: () => void,
  setIsMembersPanelOpen: (value: boolean) => void
}) {
  const params = useParams()
  const router = useRouter()
  const guildId = params.guildId as string
  const { servers, currentServerId, setCurrentServerId } = useContext(ServerContext)
  
  // Set the current server when the page loads
  useEffect(() => {
    if (guildId && guildId !== currentServerId) {
      // Check if the guild exists in the user's server list
      const guild = servers.find(server => server.id === guildId)
      if (guild) {
        setCurrentServerId(guildId)
      } else {
        // Guild not found, redirect to main page
        router.push("/main")
      }
    }
  }, [guildId, currentServerId, setCurrentServerId, servers, router])
    // Show loading state while setting up the guild
  if (guildId !== currentServerId) {
    return (
      <div className="flex h-screen bg-surface text-white items-center justify-center">        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading guild...</p>
        </div>
      </div>
    )
  }

  // Mock data for guild members and roles - in a real app this would come from the server context
  const mockMembers = [
    {
      id: "1",
      username: "Alice",
      discriminator: "1234",
      avatar: "/placeholder-user.jpg",
      status: "online" as const,
      customStatus: "Playing some games",
      roles: ["admin"],
      isOwner: true,
      joinedAt: "2023-01-15T10:30:00Z",
      nickname: "Admin Alice"
    },
    {
      id: "2", 
      username: "Bob",
      discriminator: "5678",
      avatar: "/placeholder-user.jpg",
      status: "idle" as const,
      roles: ["moderator"],
      joinedAt: "2023-02-20T14:15:00Z",
      customStatus: "Away for lunch"
    },
    {
      id: "3",
      username: "GameBot",
      discriminator: "0000",
      avatar: "/placeholder-user.jpg", 
      status: "online" as const,
      roles: ["bot"],
      isBot: true,
      joinedAt: "2023-01-01T00:00:00Z"
    },
    {
      id: "4",
      username: "Charlie",
      discriminator: "9999",
      avatar: "/placeholder-user.jpg",
      status: "offline" as const,
      roles: ["member"],
      joinedAt: "2023-03-10T09:45:00Z",
      lastSeen: "2023-12-20T16:30:00Z"
    }
  ]

  const mockRoles = [
    {
      id: "admin",
      name: "Administrators", 
      color: "#ff6b6b",
      position: 100,
      permissions: ["all"]
    },
    {
      id: "moderator",
      name: "Moderators",
      color: "#4ecdc4", 
      position: 50,
      permissions: ["moderate"]
    },
    {
      id: "bot",
      name: "Bots",
      color: "#45b7d1",
      position: 25,
      permissions: ["limited"]
    },
    {
      id: "member", 
      name: "Members",
      color: "#ffffff",
      position: 1,
      permissions: ["basic"]
    }
  ]
  return (
    <VoiceConnectionProvider>
      <div className="flex h-screen bg-surface text-white overflow-hidden">
        <GuildSidebar />
        <ChannelSidebar />
        <MainPanel 
          toggleNotificationsPanel={toggleNotificationsPanel} 
          toggleMembersPanel={toggleMembersPanel}
        />
        {isNotificationsPanelOpen && (
          <NotificationsPanel
            isOpen={true}
            onClose={() => setIsNotificationsPanelOpen(false)}
          />
        )}
        {isMembersPanelOpen && (
          <GuildMembersPanel
            members={mockMembers}
            roles={mockRoles}
            isOpen={true}
            onClose={() => setIsMembersPanelOpen(false)}
          />
        )}
        <UserFooterBar />
      </div>
    </VoiceConnectionProvider>
  )
}
