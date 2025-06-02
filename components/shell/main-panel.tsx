"use client"

import { useContext } from "react"
import { ChannelContext } from "@/context/channel-context"
import { ServerContext } from "@/context/server-context"
import { Bell, Users, Hash, Volume2, Video } from "@/components/ui/safe-icons"
import ChatPanel from "@/components/chat/chat-panel"
import VideoPanel from "@/components/video/video-panel"
import VoicePanel from "@/components/voice/voice-panel"

interface MainPanelProps {
  toggleNotificationsPanel: () => void
  toggleMembersPanel?: () => void
}

export default function MainPanel({ toggleNotificationsPanel, toggleMembersPanel }: MainPanelProps) {
  const { currentChannel } = useContext(ChannelContext)
  const { currentServer } = useContext(ServerContext)
  if (!currentChannel || !currentServer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <p className="text-xl mb-2">Welcome to Verdant</p>
          <p>Select a channel to get started</p>
        </div>
      </div>
    )
  }

  const getChannelIcon = () => {
    switch (currentChannel.type) {
      case "text":
        return <Hash className="w-5 h-5 mr-2" />
      case "voice":
        return <Volume2 className="w-5 h-5 mr-2" />
      case "video":
        return <Video className="w-5 h-5 mr-2" />
      default:
        return <Hash className="w-5 h-5 mr-2" />
    }
  }
  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-12 border-b border-border flex items-center px-4 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center text-foreground">
          {getChannelIcon()}
          <h2 className="font-semibold">{currentChannel.name}</h2>
        </div>        <div className="ml-auto flex items-center space-x-4">
          <button
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={toggleMembersPanel}
          >
            <Users className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative" onClick={toggleNotificationsPanel}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {currentChannel.type === "text" && <ChatPanel />}
      {currentChannel.type === "voice" && <VoicePanel />}
      {currentChannel.type === "video" && <VideoPanel />}
    </div>
  )
}
