"use client"

import { useEffect } from "react"
import GuildSidebar from "@/components/shell/guild-sidebar"
import DMSidebar from "@/components/direct-messages/dm-sidebar"
import FriendsPanel from "@/components/direct-messages/friends-panel"
import UserFooterBar from "@/components/user/user-footer-bar"
import { ServerProvider } from "@/context/server-context"
import { ChannelProvider } from "@/context/channel-context"
import { UserProvider } from "@/context/user-context"
import { VoiceConnectionProvider } from "@/components/voice/voice-connection-provider"
import AuthCheck from "@/components/auth/auth-check"
import { redirect } from "next/navigation"

export default function MainPage() {
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
              <ChannelProvider>                <div className="flex h-screen bg-surface text-white overflow-hidden">
                  <GuildSidebar />                 
                  <DMSidebar />
                  <FriendsPanel />
                  <VoiceConnectionProvider>
                    <UserFooterBar />
                  </VoiceConnectionProvider>
                </div>
              </ChannelProvider>
            </ServerProvider>
          </UserProvider>
        )
      }}
    </AuthCheck>
  )
}