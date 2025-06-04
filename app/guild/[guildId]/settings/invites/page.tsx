"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Copy, 
  MoreVertical, 
  Trash2, 
  Users, 
  Bell,
  ArrowRight,
  Settings
} from "@/components/ui/safe-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock invites data
const mockInvites = [
  {
    id: "1",
    code: "ER58DehP",
    inviter: {
      username: "MSS | Assassin",
      avatar: "/placeholder-user.jpg"
    },
    uses: 1,
    maxUses: null as number | null,
    expiresAt: "01:23:35:38",
    createdAt: "2 days ago",
    temporary: false
  }
]

const mockInviters = [
  {
    id: "1",
    username: "AbraX",
    avatar: "/placeholder-user.jpg",
    invites: 5,
    joined: 3
  },
  {
    id: "2", 
    username: "Mamun",
    avatar: "/placeholder-user.jpg",
    invites: 3,
    joined: 2
  },
  {
    id: "3",
    username: "DIHAN",
    avatar: "/placeholder-user.jpg", 
    invites: 2,
    joined: 1
  }
]

export default function InvitesSettingsPage() {
  const { toast } = useToast()
  const [invites, setInvites] = useState(mockInvites)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [inviteSettings, setInviteSettings] = useState({
    maxAge: "86400", // 1 day in seconds
    maxUses: "",
    temporary: false
  })

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(`https://discord.gg/${code}`)
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard"
    })
  }

  const createInviteLink = () => {
    const newInvite = {
      id: Date.now().toString(),
      code: Math.random().toString(36).substring(2, 10),
      inviter: {
        username: "Current User",
        avatar: "/placeholder-user.jpg"
      },
      uses: 0,
      maxUses: inviteSettings.maxUses ? parseInt(inviteSettings.maxUses) : null,
      expiresAt: inviteSettings.maxAge === "0" ? "Never" : "24:00:00:00",
      createdAt: "Just now",
      temporary: inviteSettings.temporary
    }

    setInvites([...invites, newInvite])
    setIsCreateModalOpen(false)
    
    toast({
      title: "Invite Created",
      description: "New invite link has been created successfully"
    })
  }

  const deleteInvite = (inviteId: string) => {
    setInvites(invites.filter(invite => invite.id !== inviteId))
    toast({
      title: "Invite Deleted",
      description: "Invite link has been deleted"
    })
  }

  const revokeInvite = (inviteId: string) => {
    // In a real app, this would revoke the invite on the server
    deleteInvite(inviteId)
    toast({
      title: "Invite Revoked",
      description: "Invite link has been revoked and is no longer valid"
    })
  }

  const pauseInvites = () => {
    toast({
      title: "Invites Paused",
      description: "All invite links have been temporarily disabled"
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Invites</h2>
          <p className="text-muted-foreground">
            Manage invite links for your server
          </p>
        </div>

        {/* Active Invite Links */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active Invite Links</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={pauseInvites}>
                Pause Invites
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create invite link
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Create Invite Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="expire-after">Expire after</Label>
                      <Select value={inviteSettings.maxAge} onValueChange={(value) => 
                        setInviteSettings({...inviteSettings, maxAge: value})
                      }>
                        <SelectTrigger className="bg-card/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="1800">30 minutes</SelectItem>
                          <SelectItem value="3600">1 hour</SelectItem>
                          <SelectItem value="21600">6 hours</SelectItem>
                          <SelectItem value="43200">12 hours</SelectItem>
                          <SelectItem value="86400">1 day</SelectItem>
                          <SelectItem value="604800">7 days</SelectItem>
                          <SelectItem value="0">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="max-uses">Max number of uses</Label>
                      <Select value={inviteSettings.maxUses} onValueChange={(value) => 
                        setInviteSettings({...inviteSettings, maxUses: value})
                      }>
                        <SelectTrigger className="bg-card/50 border-border">
                          <SelectValue placeholder="No limit" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="">No limit</SelectItem>
                          <SelectItem value="1">1 use</SelectItem>
                          <SelectItem value="5">5 uses</SelectItem>
                          <SelectItem value="10">10 uses</SelectItem>
                          <SelectItem value="25">25 uses</SelectItem>
                          <SelectItem value="50">50 uses</SelectItem>
                          <SelectItem value="100">100 uses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createInviteLink}>
                      Create Invite Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Invites Table Header */}
          <div className="bg-card/30 backdrop-blur-sm rounded-t-lg border border-border">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-3">INVITER</div>
              <div className="col-span-2">INVITE CODE</div>
              <div className="col-span-2">USES</div>
              <div className="col-span-2">EXPIRES</div>
              <div className="col-span-2">SETTINGS</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Invites List */}
          <div className="bg-card/20 backdrop-blur-sm rounded-b-lg border-x border-b border-border">
            <div className="divide-y divide-border">
              {invites.map((invite) => (
                <div 
                  key={invite.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/30 transition-colors"
                >
                  {/* Inviter */}
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={invite.inviter.avatar} alt={invite.inviter.username} />
                      <AvatarFallback className="text-xs bg-muted">
                        {invite.inviter.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {invite.inviter.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {invite.createdAt}
                      </div>
                    </div>
                  </div>

                  {/* Invite Code */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {invite.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyInviteCode(invite.code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Uses */}
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {invite.uses}{invite.maxUses ? ` / ${invite.maxUses}` : ""}
                  </div>

                  {/* Expires */}
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {invite.expiresAt}
                  </div>

                  {/* Settings */}
                  <div className="col-span-2">
                    {invite.temporary && (
                      <Badge variant="secondary" className="text-xs">
                        Temporary
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem 
                          className="text-foreground hover:bg-accent cursor-pointer"
                          onClick={() => copyInviteCode(invite.code)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-foreground hover:bg-accent cursor-pointer"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Invite
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive hover:bg-destructive/20 cursor-pointer"
                          onClick={() => revokeInvite(invite.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke Invite
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {invites.length === 0 && (
                <div className="p-8 text-center">
                  <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No active invites</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an invite link to let people join your server
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Create invite link
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invite Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invites by Members</h3>
          
          <div className="bg-card/20 backdrop-blur-sm rounded-lg border border-border">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-4">MEMBER</div>
              <div className="col-span-2">INVITES</div>
              <div className="col-span-2">JOINED</div>
              <div className="col-span-4">INVITE RATIO</div>
            </div>
            
            <div className="divide-y divide-border">
              {mockInviters.map((inviter) => (
                <div 
                  key={inviter.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/30 transition-colors"
                >
                  {/* Member */}
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={inviter.avatar} alt={inviter.username} />
                      <AvatarFallback className="text-xs bg-muted">
                        {inviter.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-foreground">
                      {inviter.username}
                    </div>
                  </div>

                  {/* Invites */}
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {inviter.invites}
                  </div>

                  {/* Joined */}
                  <div className="col-span-2 text-sm text-green-500">
                    {inviter.joined}
                  </div>

                  {/* Ratio */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ 
                            width: `${(inviter.joined / inviter.invites) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((inviter.joined / inviter.invites) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
