"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { UserContext } from "./user-context"

export interface Channel {
  id: string
  serverId: string
  name: string
  type: "text" | "voice" | "video"
  private?: boolean
}

export interface Message {
  id: string
  channelId: string
  userId: string
  content: string
  timestamp: string
  user?: {
    id: string
    username: string
    avatar?: string
  }
}

interface ChannelContextType {
  channels: Channel[]
  currentChannelId: string | null
  currentChannel: Channel | null
  messages: Message[]
  setCurrentChannelId: (id: string) => void
  sendMessage: (message: Omit<Message, "user">) => void
  createChannel: (channel: Omit<Channel, "id">) => Promise<Channel>
  deleteChannel: (channelId: string) => Promise<void>
  voiceChannelUsers: { [channelId: string]: string[] }
  joinVoiceChannel: (channelId: string, userId: string) => void
  leaveVoiceChannel: (channelId: string, userId: string) => void
}

export const ChannelContext = createContext<ChannelContextType>({
  channels: [],
  currentChannelId: null,
  currentChannel: null,
  messages: [],
  setCurrentChannelId: () => {},
  sendMessage: () => {},
  createChannel: async () => ({ id: "", serverId: "", name: "", type: "text" }),
  deleteChannel: async () => {},
  voiceChannelUsers: {},
  joinVoiceChannel: () => {},
  leaveVoiceChannel: () => {},
})

export function ChannelProvider({ children }: { children: ReactNode }) {
  const { users } = useContext(UserContext)

  // Mock data
  const defaultChannels: Channel[] = [
    {
      id: "1",
      serverId: "1",
      name: "general",
      type: "text",
    },
    {
      id: "2",
      serverId: "1",
      name: "announcements",
      type: "text",
      private: true,
    },
    {
      id: "3",
      serverId: "1",
      name: "voice-chat",
      type: "voice",
    },
    {
      id: "4",
      serverId: "1",
      name: "team-meeting",
      type: "video",
    },
    {
      id: "5",
      serverId: "2",
      name: "design-general",
      type: "text",
    },
    {
      id: "6",
      serverId: "2",
      name: "design-showcase",
      type: "text",
    },
  ]
  const defaultMessages: Message[] = [
    {
      id: "1",
      channelId: "1",
      userId: "mock_2",
      content: "Hey everyone! Welcome to Verdant HQ!",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "2",
      channelId: "1",
      userId: "mock_3",
      content: "Thanks for the invite! This UI looks amazing.",
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: "3",
      channelId: "1",
      userId: "mock_4",
      content: "I love the green theme! Very Matrix-like.",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "4",
      channelId: "1",
      userId: "mock_1",
      content: "Let's schedule a video call to discuss the new project.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ]
  const [channels, setChannels] = useState<Channel[]>(defaultChannels)
  const [currentChannelId, setCurrentChannelId] = useState<string | null>("1")
  const [messages, setMessages] = useState<Message[]>([])
  const [voiceChannelUsers, setVoiceChannelUsers] = useState<{ [channelId: string]: string[] }>({})

  useEffect(() => {
    // Load channels from localStorage if available
    const storedChannels = localStorage.getItem("verdant_channels")
    if (storedChannels) {
      setChannels(JSON.parse(storedChannels))
    } else {
      // Initialize with default channels if none exist
      localStorage.setItem("verdant_channels", JSON.stringify(defaultChannels))
    }    // Load voice channel users from localStorage if available
    const storedVoiceChannelUsers = localStorage.getItem("verdant_voice_channel_users")
    if (storedVoiceChannelUsers) {      try {
        const parsed = JSON.parse(storedVoiceChannelUsers)
        // Clean any duplicate user IDs and ensure proper types
        const cleanedData: { [channelId: string]: string[] } = {}
        Object.keys(parsed).forEach(channelId => {
          const userIds = parsed[channelId]
          if (Array.isArray(userIds)) {
            // Double deduplication: filter strings and then remove duplicates
            const stringIds = userIds.filter((id: any) => typeof id === 'string')
            cleanedData[channelId] = [...new Set(stringIds)]
          }
        })
        setVoiceChannelUsers(cleanedData)
      } catch (error) {
        console.error("Error parsing voice channel users from localStorage:", error)
        setVoiceChannelUsers({})
      }
    }

    // Load messages from localStorage if available
    const storedMessages = localStorage.getItem("verdant_messages")
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      // Add user data to messages
      const messagesWithUsers = defaultMessages.map((message) => {
        const user = users.find((user) => user.id === message.userId)
        return {
          ...message,
          user: user
            ? {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
              }
            : undefined,
        }
      })
      setMessages(messagesWithUsers)
      localStorage.setItem("verdant_messages", JSON.stringify(messagesWithUsers))
    }
  }, [users])
  // Update localStorage whenever channels or messages change
  useEffect(() => {
    localStorage.setItem("verdant_channels", JSON.stringify(channels))
  }, [channels])

  useEffect(() => {
    localStorage.setItem("verdant_messages", JSON.stringify(messages))
  }, [messages])

  // Update localStorage whenever voice channel users change
  useEffect(() => {
    localStorage.setItem("verdant_voice_channel_users", JSON.stringify(voiceChannelUsers))
  }, [voiceChannelUsers])

  const currentChannel = currentChannelId ? channels.find((channel) => channel.id === currentChannelId) || null : null

  const sendMessage = (message: Omit<Message, "user">) => {
    const user = users.find((user) => user.id === message.userId)
    const newMessage: Message = {
      ...message,
      user: user
        ? {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
          }
        : undefined,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const createChannel = async (channelData: Omit<Channel, "id">): Promise<Channel> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newChannel: Channel = {
      id: Date.now().toString(),
      ...channelData,
    }

    setChannels((prev) => [...prev, newChannel])
    return newChannel
  }

  const deleteChannel = async (channelId: string): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))    // Remove the channel
    setChannels((prev) => prev.filter((channel) => channel.id !== channelId))

    // If the current channel is being deleted, switch to another channel in the same server
    if (currentChannelId === channelId && currentChannel) {
      const serverChannels = channels.filter(
        (channel) => channel.serverId === currentChannel.serverId && channel.id !== channelId,
      )
      if (serverChannels.length > 0) {
        setCurrentChannelId(serverChannels[0].id)
      } else {
        setCurrentChannelId(null)
      }
    }    // Remove all messages for this channel
    setMessages((prev) => prev.filter((message) => message.channelId !== channelId))
  }

  const joinVoiceChannel = (channelId: string, userId: string) => {
    setVoiceChannelUsers((prev) => {
      const current = prev[channelId] || []
      // Check if user is already in channel to prevent duplicates
      if (current.includes(userId)) {
        return prev
      }
        // Additional deduplication: ensure no duplicates in the new array
      const updated = { ...prev, [channelId]: [...new Set([...current, userId])] }
      return updated
    })
  }

  const leaveVoiceChannel = (channelId: string, userId: string) => {
    setVoiceChannelUsers((prev) => {
      const current = prev[channelId] || []
      const updated = { ...prev, [channelId]: current.filter((id) => id !== userId) }
      return updated
    })
  }

  return (
    <ChannelContext.Provider
      value={{
        channels,
        currentChannelId,
        currentChannel,
        messages,
        setCurrentChannelId,
        sendMessage,
        createChannel,
        deleteChannel,
        voiceChannelUsers,
        joinVoiceChannel,
        leaveVoiceChannel,
      }}
    >
      {children}
    </ChannelContext.Provider>
  )
}
