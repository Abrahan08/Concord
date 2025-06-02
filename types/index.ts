// Central type definitions for the Verdant app

export interface User {
  id: string
  username: string
  discriminator: string
  email?: string // Optional for auth users
  avatar?: string
  bio?: string
  status: "online" | "idle" | "dnd" | "offline"
  customStatus?: string // Added customStatus property
}

export interface Channel {
  id: string
  name: string
  type: "text" | "voice" | "announcement"
}

export interface Server {
  id: string
  name: string
  icon?: string
  channels: Channel[]
}

export interface Message {
  id: string
  content: string
  timestamp: string
  userId: string
  channelId: string
  user?: User
}

export interface Friend {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "idle" | "dnd"
  activity?: string
}
