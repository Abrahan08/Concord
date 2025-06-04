"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Shield, 
  Crown, 
  MoreVertical, 
  Users, 
  Edit, 
  Trash2,
  GripVertical
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

// Mock roles data
const mockRoles = [
  {
    id: "president",
    name: "President", 
    color: "#ff0000",
    members: 4,
    position: 100,
    permissions: {
      administrator: true,
      manageServer: true,
      manageRoles: true,
      manageChannels: true,
      kickMembers: true,
      banMembers: true,
      manageMessages: true,
      sendMessages: true,
      readMessages: true
    }
  },
  {
    id: "beginner",
    name: "Beginner",
    color: "#0000ff", 
    members: 4,
    position: 50,
    permissions: {
      administrator: false,
      manageServer: false,
      manageRoles: false,
      manageChannels: false,
      kickMembers: false,
      banMembers: false,
      manageMessages: false,
      sendMessages: true,
      readMessages: true
    }
  },
  {
    id: "valorant",
    name: "Valorant",
    color: "#00ff00",
    members: 11,
    position: 40,
    permissions: {
      administrator: false,
      manageServer: false, 
      manageRoles: false,
      manageChannels: false,
      kickMembers: false,
      banMembers: false,
      manageMessages: false,
      sendMessages: true,
      readMessages: true
    }
  },
  {
    id: "tweetshift",
    name: "TweetShift",
    color: "#808080",
    members: 1,
    position: 30,
    permissions: {
      administrator: false,
      manageServer: false,
      manageRoles: false, 
      manageChannels: false,
      kickMembers: false,
      banMembers: false,
      manageMessages: false,
      sendMessages: true,
      readMessages: true
    }
  },
  {
    id: "bot",
    name: "BOT",
    color: "#808080",
    members: 4,
    position: 20,
    permissions: {
      administrator: false,
      manageServer: false,
      manageRoles: false,
      manageChannels: false,
      kickMembers: false,
      banMembers: false,
      manageMessages: true,
      sendMessages: true,
      readMessages: true
    }
  },
  {
    id: "everyone",
    name: "@everyone",
    color: "#808080",
    members: 80,
    position: 0,
    permissions: {
      administrator: false,
      manageServer: false,
      manageRoles: false,
      manageChannels: false,
      kickMembers: false,
      banMembers: false,
      manageMessages: false,
      sendMessages: true,
      readMessages: true
    }
  }
]

export default function RolesSettingsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [roles, setRoles] = useState(mockRoles)
  const [selectedRole, setSelectedRole] = useState<typeof mockRoles[0] | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleColor, setNewRoleColor] = useState("#0099ff")

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return

    const newRole = {
      id: newRoleName.toLowerCase().replace(/\s+/g, '-'),
      name: newRoleName,
      color: newRoleColor,
      members: 0,
      position: Math.max(...roles.map(r => r.position)) + 1,
      permissions: {
        administrator: false,
        manageServer: false,
        manageRoles: false,
        manageChannels: false,
        kickMembers: false,
        banMembers: false,
        manageMessages: false,
        sendMessages: true,
        readMessages: true
      }
    }

    setRoles([...roles, newRole])
    setNewRoleName("")
    setNewRoleColor("#0099ff")
    setIsCreateModalOpen(false)
    
    toast({
      title: "Role Created",
      description: `${newRoleName} role has been created successfully.`
    })
  }

  const handleDeleteRole = (roleId: string) => {
    if (roleId === "everyone") {
      toast({
        title: "Cannot Delete",
        description: "The @everyone role cannot be deleted.",
        variant: "destructive"
      })
      return
    }

    setRoles(roles.filter(role => role.id !== roleId))
    if (selectedRole?.id === roleId) {
      setSelectedRole(null)
    }
    
    toast({
      title: "Role Deleted",
      description: "Role has been deleted successfully."
    })
  }

  const updateRolePermission = (roleId: string, permission: string, value: boolean) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [permission]: value
            }
          }
        : role
    ))

    if (selectedRole?.id === roleId) {
      setSelectedRole({
        ...selectedRole,
        permissions: {
          ...selectedRole.permissions,
          [permission]: value
        }
      })
    }
  }

  return (
    <div className="flex h-full">
      {/* Roles List */}
      <div className="w-80 border-r border-border bg-card/30">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Roles</h3>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Create Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Enter role name"
                      className="bg-card/50 border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role-color">Role Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="role-color"
                        type="color"
                        value={newRoleColor}
                        onChange={(e) => setNewRoleColor(e.target.value)}
                        className="w-12 h-10 rounded border border-border"
                      />
                      <Input
                        value={newRoleColor}
                        onChange={(e) => setNewRoleColor(e.target.value)}
                        className="bg-card/50 border-border"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Input
            placeholder="Search roles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card/50 border-border text-foreground"
          />
          
          <p className="text-xs text-muted-foreground mt-2">
            Members use the color of the highest role they have on this list. Drag roles to reorder them.
          </p>
        </div>

        {/* Roles List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="space-y-1">
              {filteredRoles
                .sort((a, b) => b.position - a.position)
                .map((role) => (
                <div
                  key={role.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRole?.id === role.id 
                      ? "bg-primary/20 border border-primary/50" 
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-background"
                    style={{ backgroundColor: role.color }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {role.name}
                      </span>
                      {role.id === "everyone" && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {role.members}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive hover:bg-destructive/20 cursor-pointer"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.id === "everyone"}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Role Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedRole ? (
          <div className="p-6">
            <div className="max-w-2xl">
              {/* Role Header */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedRole.color }}
                />
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedRole.name}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {selectedRole.members} members
                </Badge>
              </div>

              {/* Permissions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Permissions</h3>
                  <div className="space-y-4">
                    {/* Administrator */}
                    <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border">
                      <div>
                        <div className="font-medium text-foreground">Administrator</div>
                        <div className="text-sm text-muted-foreground">
                          Members with this permission have all permissions and can also update the server
                        </div>
                      </div>
                      <Switch
                        checked={selectedRole.permissions.administrator}
                        onCheckedChange={(checked) => 
                          updateRolePermission(selectedRole.id, "administrator", checked)
                        }
                        disabled={selectedRole.id === "everyone"}
                      />
                    </div>

                    <Separator />

                    {/* Server Management */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Server Management</h4>
                      
                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Manage Server</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to change the server name and switch regions
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.manageServer}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "manageServer", checked)
                          }
                          disabled={selectedRole.id === "everyone"}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Manage Roles</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to create, edit, and delete roles lower than this one
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.manageRoles}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "manageRoles", checked)
                          }
                          disabled={selectedRole.id === "everyone"}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Manage Channels</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to create, edit, or delete channels
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.manageChannels}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "manageChannels", checked)
                          }
                          disabled={selectedRole.id === "everyone"}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Membership */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Membership</h4>
                      
                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Kick Members</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to remove other members from this server
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.kickMembers}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "kickMembers", checked)
                          }
                          disabled={selectedRole.id === "everyone"}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Ban Members</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to permanently ban other members from this server
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.banMembers}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "banMembers", checked)
                          }
                          disabled={selectedRole.id === "everyone"}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Text Permissions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Text Permissions</h4>
                      
                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Send Messages</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to send messages in text channels
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.sendMessages}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "sendMessages", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Read Message History</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to read previous messages in text channels
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.readMessages}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "readMessages", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-card/30 rounded border border-border">
                        <div>
                          <div className="text-sm font-medium text-foreground">Manage Messages</div>
                          <div className="text-xs text-muted-foreground">
                            Allow members to delete messages from other members
                          </div>
                        </div>
                        <Switch
                          checked={selectedRole.permissions.manageMessages}
                          onCheckedChange={(checked) => 
                            updateRolePermission(selectedRole.id, "manageMessages", checked)
                          }
                          disabled={selectedRole.id === "everyone"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a role to edit</h3>
              <p className="text-muted-foreground">
                Choose a role from the list to view and edit its permissions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
