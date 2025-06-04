"use client"

import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Crown, 
  Shield, 
  ShieldCheck, 
  MoreVertical, 
  X, 
  UserCheck, 
  Volume2, 
  VolumeX 
} from "@/components/ui/safe-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real app this would come from your server/API
const mockMembers = [
  {
    id: "1",
    username: "AbraX",
    discriminator: "1234",
    avatar: "/placeholder-user.jpg",
    status: "online" as const,
    joinedAt: "5 days ago",
    joinedDiscord: "1 year ago",
    roles: ["President"],
    isOwner: true,
    lastActive: "Now"
  },
  {
    id: "2", 
    username: "MD Nahidul Islam Mahir",
    discriminator: "5678",
    avatar: "/placeholder-user.jpg",
    status: "online" as const,
    joinedAt: "12 days ago",
    joinedDiscord: "12 days ago", 
    roles: [],
    isOwner: false,
    lastActive: "2 hours ago"
  },
  {
    id: "3",
    username: "Dihan", 
    discriminator: "9999",
    avatar: "/placeholder-user.jpg",
    status: "online" as const,
    joinedAt: "15 days ago",
    joinedDiscord: "1 year ago",
    roles: [],
    isOwner: false,
    lastActive: "5 minutes ago"
  },
  {
    id: "4",
    username: "DIHAN",
    discriminator: "0001", 
    avatar: "/placeholder-user.jpg",
    status: "online" as const,
    joinedAt: "15 days ago",
    joinedDiscord: "2 months ago",
    roles: [],
    isOwner: false,
    lastActive: "1 hour ago"
  },
  {
    id: "5",
    username: "acnologia",
    discriminator: "9563", 
    avatar: "/placeholder-user.jpg",
    status: "online" as const,
    joinedAt: "15 days ago",
    joinedDiscord: "1 year ago",
    roles: [],
    isOwner: false,
    lastActive: "30 minutes ago"
  },
  {
    id: "6",
    username: "Mamun",
    discriminator: "0026",
    avatar: "/placeholder-user.jpg", 
    status: "online" as const,
    joinedAt: "2 months ago",
    joinedDiscord: "6 years ago",
    roles: ["ZQ First IGL | Bracu Alumni"],
    isOwner: false,
    lastActive: "10 minutes ago"
  }
]

const statusColors = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500", 
  offline: "bg-gray-500"
}

export default function MembersSettingsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return mockMembers
    
    const query = searchQuery.toLowerCase()
    return mockMembers.filter(member => 
      member.username.toLowerCase().includes(query) ||
      member.discriminator.includes(query)
    )
  }, [searchQuery])

  const handleMemberAction = (memberId: string, action: string) => {
    const member = mockMembers.find(m => m.id === memberId)
    if (!member) return

    switch (action) {
      case "kick":
        toast({
          title: "Member Kicked",
          description: `${member.username} has been kicked from the server.`,
        })
        break
      case "ban":
        toast({
          title: "Member Banned",
          description: `${member.username} has been banned from the server.`,
        })
        break
      case "mute":
        toast({
          title: "Member Muted",
          description: `${member.username} has been muted.`,
        })
        break
      case "unmute":
        toast({
          title: "Member Unmuted", 
          description: `${member.username} has been unmuted.`,
        })
        break
      default:
        break
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Members</h2>
          <p className="text-muted-foreground">
            Showing {filteredMembers.length} members of 80
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border text-foreground"
          />
        </div>

        {/* Members Table Header */}
        <div className="bg-card/30 backdrop-blur-sm rounded-t-lg border border-border">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground border-b border-border">
            <div className="col-span-4 flex items-center gap-2">
              <input 
                type="checkbox" 
                className="rounded border-border"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers(filteredMembers.map(m => m.id))
                  } else {
                    setSelectedMembers([])
                  }
                }}
              />
              NAME
            </div>
            <div className="col-span-2">MEMBER SINCE</div>
            <div className="col-span-2">JOINED DISCORD</div>
            <div className="col-span-2">JOIN METHOD</div>
            <div className="col-span-1">ROLES</div>
            <div className="col-span-1">SIGNALS</div>
          </div>
        </div>

        {/* Members List */}
        <ScrollArea className="bg-card/20 backdrop-blur-sm rounded-b-lg border-x border-b border-border max-h-[600px]">
          <div className="divide-y divide-border">
            {filteredMembers.map((member) => (
              <div 
                key={member.id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/30 transition-colors"
              >
                {/* Name & Avatar */}
                <div className="col-span-4 flex items-center gap-3">
                  <input 
                    type="checkbox"
                    className="rounded border-border"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, member.id])
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== member.id))
                      }
                    }}
                  />
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar} alt={member.username} />
                      <AvatarFallback className="text-xs bg-muted">
                        {member.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusColors[member.status]}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground truncate">
                        {member.username}
                      </span>
                      {member.isOwner && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{member.discriminator}
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {member.joinedAt}
                </div>

                {/* Joined Discord */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {member.joinedDiscord}
                </div>

                {/* Join Method */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {Math.random() > 0.5 ? "Invite Link" : "Direct Join"}
                </div>

                {/* Roles */}
                <div className="col-span-1">
                  {member.roles.map((role, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs mr-1 mb-1"
                    >
                      {role}
                    </Badge>
                  ))}
                  {member.roles.length > 1 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.roles.length - 1}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem 
                        className="text-foreground hover:bg-accent cursor-pointer"
                        onClick={() => handleMemberAction(member.id, "mute")}
                      >
                        <VolumeX className="w-4 h-4 mr-2" />
                        Timeout
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-foreground hover:bg-accent cursor-pointer"
                        onClick={() => handleMemberAction(member.id, "unmute")}
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Remove Timeout
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem 
                        className="text-destructive hover:bg-destructive/20 cursor-pointer"
                        onClick={() => handleMemberAction(member.id, "kick")}
                        disabled={member.isOwner}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive hover:bg-destructive/20 cursor-pointer"
                        onClick={() => handleMemberAction(member.id, "ban")}
                        disabled={member.isOwner}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Ban
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Bulk Actions */}
        {selectedMembers.length > 0 && (
          <div className="mt-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedMembers.length} member(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Assign Role
                </Button>
                <Button variant="outline" size="sm">
                  Remove Role  
                </Button>
                <Button variant="destructive" size="sm">
                  Kick Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
