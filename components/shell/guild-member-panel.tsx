"use client"

import React, { useState, useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Crown, Bot, Shield, ShieldCheck } from "@/components/ui/safe-icons"

export interface GuildMember {
  id: string
  username: string
  discriminator: string
  avatar?: string
  status: "online" | "idle" | "dnd" | "offline"
  customStatus?: string
  roles: string[]
  isBot?: boolean
  isOwner?: boolean
  joinedAt: string
  nickname?: string
  lastSeen?: string // When they were last online
}

interface Role {
  id: string
  name: string
  color: string
  position: number
  permissions: string[]
}

interface Props {
  members: GuildMember[]
  roles: Role[]
  isOpen: boolean
  onClose: () => void
}

const statusColors = {
  online: "bg-green-500",
  idle: "bg-yellow-500", 
  dnd: "bg-destructive",
  offline: "bg-muted-foreground"
}

const statusLabels = {
  online: "Online",
  idle: "Idle", 
  dnd: "Do Not Disturb",
  offline: "Offline"
}

function formatLastSeen(lastSeenDate: string): string {
  const now = new Date()
  const lastSeen = new Date(lastSeenDate)
  const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days}d ago`
  }
}

function groupMembersByRoleAndStatus(members: GuildMember[], roles: Role[]) {
  // Sort roles by position (higher position = higher rank)
  const sortedRoles = [...roles].sort((a, b) => b.position - a.position)
  
  const groups: { [key: string]: GuildMember[] } = {}
  const offlineMembers: GuildMember[] = []
  
  // Separate online and offline members
  const onlineMembers = members.filter(m => m.status !== "offline")
  const allOfflineMembers = members.filter(m => m.status === "offline")
  
  // Group online members by their highest role
  onlineMembers.forEach(member => {
    let assignedGroup = "Online" // Default group for online members
    
    if (member.isBot) {
      assignedGroup = "Bots"
    } else if (member.isOwner) {
      assignedGroup = "Owner"
    } else if (member.roles.length > 0) {
      // Find the highest role this member has
      for (const role of sortedRoles) {
        if (member.roles.includes(role.id)) {
          assignedGroup = role.name
          break
        }
      }
    }
    
    if (!groups[assignedGroup]) {
      groups[assignedGroup] = []
    }
    groups[assignedGroup].push(member)
  })
  
  // Add offline members as a separate group if there are any
  if (allOfflineMembers.length > 0) {
    groups["Offline"] = allOfflineMembers
  }
  
  // Sort members within each group by status, then by username
  Object.keys(groups).forEach(groupName => {
    groups[groupName].sort((a, b) => {
      // For non-offline groups, sort by status first (online first, then idle, then dnd)
      if (groupName !== "Offline") {
        const statusOrder = { online: 0, idle: 1, dnd: 2, offline: 3 }
        const statusDiff = statusOrder[a.status] - statusOrder[b.status]
        if (statusDiff !== 0) return statusDiff
      }
      
      // Then sort by username
      const nameA = a.nickname || a.username
      const nameB = b.nickname || b.username
      return nameA.localeCompare(nameB)
    })
  })
  
  return groups
}

function MemberRow({ member, roles }: { member: GuildMember; roles: Role[] }) {
  const displayName = member.nickname || member.username
  const isOnline = member.status !== "offline"
  
  // Get member's role color (highest role)
  let roleColor = "#ffffff"
  if (member.roles.length > 0) {
    const sortedRoles = [...roles].sort((a, b) => b.position - a.position)
    for (const role of sortedRoles) {
      if (member.roles.includes(role.id) && role.color !== "#000000") {
        roleColor = role.color
        break
      }
    }
  }
    return (
    <div className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-accent/50 cursor-pointer group">
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarImage src={member.avatar} alt={displayName} />
          <AvatarFallback className="text-xs bg-muted">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusColors[member.status]}`} />
      </div>
      
      <div className="flex-1 min-w-0">        <div className="flex items-center gap-1">
          <span 
            className={`text-sm font-medium truncate ${isOnline ? 'text-foreground' : 'text-muted-foreground'}`}
            style={{ color: isOnline ? roleColor : undefined }}
          >
            {displayName}
          </span>
          {member.isOwner && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
          {member.isBot && <Badge variant="secondary" className="text-xs px-1 py-0 h-4">BOT</Badge>}
        </div>
          {member.customStatus && isOnline && (
          <div className="text-xs text-muted-foreground truncate">
            {member.customStatus}
          </div>
        )}
        
        {member.lastSeen && !isOnline && (
          <div className="text-xs text-muted-foreground/70 truncate">
            Last seen {formatLastSeen(member.lastSeen)}
          </div>
        )}
      </div>
    </div>
  )
}

function GroupSection({ 
  title, 
  count, 
  children 
}: { 
  title: string
  count: number
  children: React.ReactNode 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <div className="mb-4">      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full text-left mb-2 hover:text-foreground transition-colors duration-200"
      >
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title} — {count}
        </span>
        <div className={`transform transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}>
          <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      {!isCollapsed && (
        <div className="space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

export default function GuildMembersPanel({ members, roles, isOpen, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members
    
    const query = searchQuery.toLowerCase()
    return members.filter(member => 
      (member.nickname || member.username).toLowerCase().includes(query) ||
      member.username.toLowerCase().includes(query)
    )
  }, [members, searchQuery])
  
  const groupedMembers = useMemo(() => {
    return groupMembersByRoleAndStatus(filteredMembers, roles)
  }, [filteredMembers, roles])
  
  const totalOnline = useMemo(() => {
    return members.filter(m => m.status !== "offline").length
  }, [members])
  
  if (!isOpen) return null
    return (
    <div className="w-60 bg-card/95 backdrop-blur-sm border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-semibold">Members</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-border text-foreground placeholder-muted-foreground h-8"
          />
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          {totalOnline} online • {members.length} members
        </div>
      </div>
      
      {/* Members List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {Object.entries(groupedMembers).map(([groupName, groupMembers]) => (
            <GroupSection 
              key={groupName} 
              title={groupName} 
              count={groupMembers.length}
            >
              {groupMembers.map(member => (
                <MemberRow 
                  key={member.id} 
                  member={member} 
                  roles={roles}
                />
              ))}
            </GroupSection>
          ))}          
          {Object.keys(groupedMembers).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? 'No members found' : 'No members in this guild'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
