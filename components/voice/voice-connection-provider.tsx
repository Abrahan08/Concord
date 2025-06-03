"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { ChannelContext } from "@/context/channel-context"
import { ServerContext } from "@/context/server-context"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import VCConnectBar from "./vc-connect-bar"

interface VoiceConnectionContextType {
  isConnected: boolean
  currentVoiceChannelId: string | null
  disconnect: () => void
  toggleScreenShare: () => void
  isScreenSharing: boolean
}

export const VoiceConnectionContext = createContext<VoiceConnectionContextType>({
  isConnected: false,
  currentVoiceChannelId: null,
  disconnect: () => {},
  toggleScreenShare: () => {},
  isScreenSharing: false,
})

export const useVoiceConnection = () => useContext(VoiceConnectionContext)

export function VoiceConnectionProvider({ children }: { children: ReactNode }) {
  const { 
    currentChannel, 
    currentChannelId, 
    leaveVoiceChannel, 
    joinVoiceChannel, 
    voiceChannelUsers,
    channels,
    setCurrentChannelId 
  } = useContext(ChannelContext)
  const { currentServer } = useContext(ServerContext)
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [currentVoiceChannelId, setCurrentVoiceChannelId] = useState<string | null>(null)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  
  // Check if current channel is a voice channel
  useEffect(() => {
    if (currentChannel?.type === "voice" || currentChannel?.type === "video") {
      setIsConnected(true)
      setCurrentVoiceChannelId(currentChannelId)
      
      // Join voice channel if user is not already in it and we have a currentUser
      if (currentUser && currentChannelId) {
        const userIds = voiceChannelUsers[currentChannelId] || []
        if (!userIds.includes(currentUser.id)) {
          // Call the joinVoiceChannel function from the ChannelContext to track the user
          joinVoiceChannel(currentChannelId, currentUser.id);
          
          // Here's where additional WebRTC/socket logic would be implemented
          // for actual voice communication in a real application
        }
      }
    } else {
      // No channel selected or not a voice/video channel
      setIsConnected(false)
      setCurrentVoiceChannelId(null)
      setIsScreenSharing(false)
    }
  }, [currentChannel, currentChannelId, currentUser, voiceChannelUsers, joinVoiceChannel])
  
  // Disconnect from voice channel
  const disconnect = () => {
    if (currentUser) {
      const channelName = currentChannel?.name || 'voice channel';
      const channelToLeave = currentVoiceChannelId || currentChannelId;
      
      // Only proceed if we have a valid channel to leave
      if (channelToLeave) {
        // Leave the voice channel with the user's ID
        leaveVoiceChannel(channelToLeave, currentUser.id);
        
        // Log for debugging
        console.log("Disconnecting from voice channel:", {
          channelId: channelToLeave,
          userId: currentUser.id,
          currentChannelId,
          isConnected
        });
      }
      
      // Always reset connection state, even if there was no channel to leave
      setIsConnected(false);
      setCurrentVoiceChannelId(null);
      setIsScreenSharing(false);
        
      // Find a suitable text channel in the same server to switch to
      if (currentServer && channels) {
        // Look for a general text channel first
        let generalChannel = channels.find(
          channel => 
            channel.serverId === currentServer.id && 
            channel.type === "text" && 
            channel.name.toLowerCase().includes("general")
        );
        
        // If no general channel, just get the first text channel
        if (!generalChannel) {
          generalChannel = channels.find(
            channel => channel.serverId === currentServer.id && channel.type === "text"
          );
        }
        
        if (generalChannel) {
          // Switch to the general/first text channel
          setCurrentChannelId(generalChannel.id);
        } else {
          // If we can't find any text channel, at least make sure we're not on the voice channel
          if (currentChannel?.type === "voice" || currentChannel?.type === "video") {
            // Try to navigate to main page or anywhere that's not a voice channel
            window.location.href = "/main";
          }
        }
      } else {
        // If there's no server context, we might be in DMs - just go to main
        window.location.href = "/main";
      }
    }
  }
  
  // Cleanup effect when component unmounts or currentChannel changes
  useEffect(() => {
    return () => {
      // If the user is connected to a voice channel when navigating away, disconnect them
      if (isConnected && currentVoiceChannelId && currentUser) {
        leaveVoiceChannel(currentVoiceChannelId, currentUser.id);
      }
    };
  }, [isConnected, currentVoiceChannelId, currentUser, leaveVoiceChannel]);

  const toggleScreenShare = () => {
    setIsScreenSharing(prev => !prev)
  }

  return (
    <VoiceConnectionContext.Provider
      value={{
        isConnected,
        currentVoiceChannelId,
        disconnect,
        toggleScreenShare,
        isScreenSharing,
      }}
    >
      {children}
      {isConnected && currentVoiceChannelId && currentChannel && (
        <VCConnectBar 
          serverName={currentServer?.name || 'Direct Message'}
          channelName={currentChannel.name}
          isConnected={isConnected}
          onDisconnect={disconnect}
          onVideoToggle={toggleScreenShare}
          isScreenSharing={isScreenSharing}
        />
      )}
    </VoiceConnectionContext.Provider>
  )
}
