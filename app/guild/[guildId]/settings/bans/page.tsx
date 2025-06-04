"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, MoreVertical, Bell, User, MessageSquare } from "@/components/ui/safe-icons"

// Mock banned users data
const mockBannedUsers = [
  {
    id: "ban_1",
    user: {
      id: "banned_user_1",
      username: "spammer123",
      discriminator: "4567",
      avatar: null,
    },
    reason: "Spamming and harassment",
    bannedBy: {
      id: "admin_1",
      username: "AdminUser",
      discriminator: "0001",
    },
    bannedAt: "2024-12-01T10:30:00Z",
  },
  {
    id: "ban_2",
    user: {
      id: "banned_user_2",
      username: "troublemaker",
      discriminator: "8901",
      avatar: "/placeholder-user.jpg",
    },
    reason: "Repeated rule violations and toxic behavior",
    bannedBy: {
      id: "mod_1",
      username: "ModeratorX",
      discriminator: "0002",
    },
    bannedAt: "2024-11-28T14:45:00Z",
  },
  {
    id: "ban_3",
    user: {
      id: "banned_user_3",
      username: "rulebreaker",
      discriminator: "2345",
      avatar: null,
    },
    reason: "Sharing inappropriate content",
    bannedBy: {
      id: "admin_1",
      username: "AdminUser",
      discriminator: "0001",
    },
    bannedAt: "2024-11-25T09:15:00Z",
  },
]

export default function BansPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [bannedUsers, setBannedUsers] = useState(mockBannedUsers)
  const [selectedBan, setSelectedBan] = useState<typeof mockBannedUsers[0] | null>(null)
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false)
  const [isBanUserDialogOpen, setIsBanUserDialogOpen] = useState(false)
  const [banUserData, setBanUserData] = useState({
    username: "",
    reason: "",
  })

  const filteredBans = bannedUsers.filter((ban) =>
    ban.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ban.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUnban = async () => {
    if (!selectedBan) return

    try {
      setBannedUsers(bannedUsers.filter(ban => ban.id !== selectedBan.id))
      
      toast({
        title: "User unbanned",
        description: `${selectedBan.user.username} has been unbanned from the server.`,
      })
      
      setIsUnbanDialogOpen(false)
      setSelectedBan(null)
    } catch (error) {
      toast({
        title: "Failed to unban user",
        description: "There was an error unbanning the user.",
        variant: "destructive",
      })
    }
  }

  const handleBanUser = async () => {
    if (!banUserData.username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to ban.",
        variant: "destructive",
      })
      return
    }

    try {
      const newBan = {
        id: `ban_${Date.now()}`,
        user: {
          id: `banned_user_${Date.now()}`,
          username: banUserData.username,
          discriminator: "0000",
          avatar: null,
        },
        reason: banUserData.reason || "No reason provided",
        bannedBy: {
          id: "current_user",
          username: "CurrentUser",
          discriminator: "0001",
        },
        bannedAt: new Date().toISOString(),
      }

      setBannedUsers([newBan, ...bannedUsers])
      
      toast({
        title: "User banned",
        description: `${banUserData.username} has been banned from the server.`,
      })
      
      setBanUserData({ username: "", reason: "" })
      setIsBanUserDialogOpen(false)
    } catch (error) {
      toast({
        title: "Failed to ban user",
        description: "There was an error banning the user.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Bans</h2>
        <p className="text-muted-foreground">
          Manage banned users and their ban reasons. You can unban users or add new bans.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Banned Users</CardTitle>
              <CardDescription>
                {bannedUsers.length} banned user{bannedUsers.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button onClick={() => setIsBanUserDialogOpen(true)}>
              <User className="w-4 h-4 mr-2" />
              Ban User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search banned users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Banned Users List */}
            {filteredBans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No banned users match your search." : "No users are currently banned."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBans.map((ban) => (
                  <div
                    key={ban.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={ban.user.avatar || undefined} />
                        <AvatarFallback>
                          {ban.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {ban.user.username}#{ban.user.discriminator}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            Banned
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {ban.reason}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Bell className="w-3 h-3 mr-1" />
                            Banned {formatDate(ban.bannedAt)} by {ban.bannedBy.username}
                          </span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBan(ban)
                            setIsUnbanDialogOpen(true)
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          Unban User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Unban Dialog */}
      <Dialog open={isUnbanDialogOpen} onOpenChange={setIsUnbanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unban {selectedBan?.user.username}? They will be able to rejoin the server.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnbanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUnban} className="bg-green-600 hover:bg-green-700">
              Unban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={isBanUserDialogOpen} onOpenChange={setIsBanUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Enter the username and reason for banning this user from the server.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username to ban"
                value={banUserData.username}
                onChange={(e) => setBanUserData({ ...banUserData, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for ban..."
                value={banUserData.reason}
                onChange={(e) => setBanUserData({ ...banUserData, reason: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBanUser} variant="destructive">
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
