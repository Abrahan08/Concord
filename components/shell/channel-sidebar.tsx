"use client"

import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { ServerContext } from "@/context/server-context"
import { ChannelContext } from "@/context/channel-context"
import { UserContext } from "@/context/user-context"
import { Settings, Plus, ChevronDown, ChevronRight, Lock, Hash, Volume2, Video, MoreVertical } from "@/components/ui/safe-icons"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ChannelSidebar() {  const router = useRouter()
  const { toast } = useToast()
  const { currentServer, leaveServer } = useContext(ServerContext)
  const { channels, currentChannelId, setCurrentChannelId, createChannel, deleteChannel, voiceChannelUsers, joinVoiceChannel, leaveVoiceChannel } = useContext(ChannelContext)
  const { users, currentUser } = useContext(UserContext)

  const [categoryStates, setCategoryStates] = useState({
    text: true,
    voice: true,
    video: true,
  })

  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [newChannelData, setNewChannelData] = useState({
    name: "",
    type: "text" as "text" | "voice" | "video",
    private: false,
  })

  const toggleCategory = (category: keyof typeof categoryStates) => {
    setCategoryStates({
      ...categoryStates,
      [category]: !categoryStates[category],
    })
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Hash className="w-5 h-5 mr-2 text-gray-400" />
      case "voice":
        return <Volume2 className="w-5 h-5 mr-2 text-gray-400" />
      case "video":
        return <Video className="w-5 h-5 mr-2 text-gray-400" />
      default:
        return <Hash className="w-5 h-5 mr-2 text-gray-400" />
    }
  }

  const handleCreateChannel = async () => {
    if (!currentServer) return

    try {
      await createChannel({
        serverId: currentServer.id,
        name: newChannelData.name,
        type: newChannelData.type,
        private: newChannelData.private,
      })

      toast({
        title: "Channel created",
        description: `#${newChannelData.name} has been created.`,
      })

      setNewChannelData({
        name: "",
        type: "text",
        private: false,
      })

      setIsCreateChannelModalOpen(false)
    } catch (error) {
      toast({
        title: "Failed to create channel",
        description: "There was an error creating the channel.",
        variant: "destructive",
      })
    }
  }
  const handleDeleteChannel = async (channelId: string) => {
    if (confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      try {
        await deleteChannel(channelId)
        toast({
          title: "Channel deleted",
          description: "The channel has been deleted.",
        })
      } catch (error) {
        toast({
          title: "Failed to delete channel",
          description: "There was an error deleting the channel.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteServer = async () => {
    if (!currentServer) return
    
    if (confirm(`Are you sure you want to delete "${currentServer.name}"? This action cannot be undone and you will lose all channels and data.`)) {
      try {
        await leaveServer(currentServer.id)
        toast({
          title: "Server deleted",
          description: `${currentServer.name} has been deleted.`,
        })
        router.push('/main') // Redirect to main page after deletion
      } catch (error) {
        toast({
          title: "Failed to delete server",
          description: "There was an error deleting the server.",
          variant: "destructive",
        })
      }
    }
  }

  if (!currentServer) return null

  const textChannels = channels.filter((channel) => channel.serverId === currentServer.id && channel.type === "text")
  const voiceChannels = channels.filter((channel) => channel.serverId === currentServer.id && channel.type === "voice")
  const videoChannels = channels.filter((channel) => channel.serverId === currentServer.id && channel.type === "video")

  return (
    <>      <div className="w-[250px] acrylic border-r border-primary/30 flex flex-col">        <div className="h-12 border-b border-primary/30 flex items-center px-4 font-semibold">
          <h2 className="flex-1 truncate text-white futuristic-text">{currentServer?.name}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="acrylic-light border-primary/30 text-white">
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:bg-destructive/20 hover:text-destructive/80 focus:bg-destructive/20 focus:text-destructive/80"
                onClick={handleDeleteServer}
              >
                Delete Server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* Text Channels */}
          <Collapsible open={categoryStates.text} className="mb-2">
            <CollapsibleTrigger asChild>
              <div
                onClick={() => toggleCategory("text")}                className="flex items-center w-full text-xs font-semibold text-gray-400 hover:text-white py-1 px-1 cursor-pointer group hover:bg-primary/10 rounded-md transition-colors"
              >
                {categoryStates.text ? (
                  <ChevronDown className="w-3 h-3 mr-1 text-primary group-hover:text-primary/80" />
                ) : (
                  <ChevronRight className="w-3 h-3 mr-1 text-primary group-hover:text-primary/80" />
                )}
                <span className="neon-text tracking-wider">TEXT CHANNELS</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 mt-1">
              {textChannels.map((channel) => (
                <div key={channel.id} className="group relative">
                  <button                    className={cn(
                      "flex items-center w-full rounded-md py-1 px-2 my-1 text-gray-400 hover:bg-primary/20 hover:text-white transition-colors",
                      currentChannelId === channel.id && "bg-primary/30 text-white"
                    )}
                    onClick={() => setCurrentChannelId(channel.id)}
                  >
                    {getChannelIcon(channel.type)}
                    <span className="truncate">{channel.name}</span>
                    {channel.private && <Lock className="w-3 h-3 ml-1 opacity-70" />}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>                    <DropdownMenuContent className="acrylic-light border-primary/30 text-white">
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive hover:bg-destructive/20 hover:text-destructive/80 focus:bg-destructive/20 focus:text-destructive/80"
                        onClick={() => handleDeleteChannel(channel.id)}
                      >
                        Delete Channel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Voice Channels */}          <Collapsible open={categoryStates.voice} className="mb-2">
            <div className="flex items-center w-full">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex items-center flex-1 text-xs font-semibold text-gray-400 hover:text-white py-1 px-1 cursor-pointer group hover:bg-secondary/10 rounded-md transition-colors"
                  onClick={() => toggleCategory("voice")}
                >
                  {categoryStates.voice ? (
                    <ChevronDown className="w-3 h-3 mr-1 text-secondary group-hover:text-secondary/80" />
                  ) : (
                    <ChevronRight className="w-3 h-3 mr-1 text-secondary group-hover:text-secondary/80" />
                  )}
                  <span className="neon-text tracking-wider">VOICE CHANNELS</span>
                </button>
              </CollapsibleTrigger>
              <button
                className="ml-auto text-gray-400 hover:text-secondary/80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  setNewChannelData({ name: "", type: "voice", private: false })
                  setIsCreateChannelModalOpen(true)
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>            <CollapsibleContent className="space-y-0.5 mt-1">              {voiceChannels.map((channel) => {
                const userIds = voiceChannelUsers[channel.id] || []
                
                // First, ensure we only have valid string IDs and remove duplicates
                const uniqueUserIds = [...new Set(userIds.filter(id => typeof id === 'string' && id.trim() !== ''))]
                
                // Create a Map to ensure we only get one user object per ID
                const userMap = new Map()
                users.forEach(user => {
                  if (uniqueUserIds.includes(user.id)) {
                    userMap.set(user.id, user)
                  }
                })
                
                // Convert map back to array, maintaining the order of uniqueUserIds
                const deduplicatedUsers = uniqueUserIds.map(id => userMap.get(id)).filter(Boolean)
                
                const isInChannel = currentUser && uniqueUserIds.includes(currentUser.id)
                
                return (
                  <div key={channel.id} className="group relative">
                    <button
                      className={cn(
                        "flex items-center w-full rounded-md py-1 px-2 my-1 text-gray-400 hover:bg-secondary/20 hover:text-white transition-colors",
                        currentChannelId === channel.id && "bg-secondary/30 text-white"
                      )}
                      onClick={() => {
                        setCurrentChannelId(channel.id)
                        if (currentUser && !isInChannel) {
                          joinVoiceChannel(channel.id, currentUser.id)
                        }
                      }}
                    >
                      {getChannelIcon(channel.type)}
                      <span className="truncate">{channel.name}</span>
                      {channel.private && <Lock className="w-3 h-3 ml-1 opacity-70" />}
                    </button>
                    <div className="flex items-center gap-2 mt-1 ml-8">
                      {currentUser && isInChannel && (
                        <button
                          className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive hover:bg-destructive/40 transition-colors"
                          onClick={() => leaveVoiceChannel(channel.id, currentUser.id)}
                        >
                          Leave
                        </button>
                      )}
                    </div>                    {deduplicatedUsers.length > 0 && (
                      <div className="flex flex-col gap-1 mt-1 ml-8">
                        {deduplicatedUsers.map((user: any) => (
                          <div key={`voice-${channel.id}-${user.id}`} className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user.avatar || "/placeholder.svg?height=100&width=100"} alt={user.username} />
                              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-white">{user.username}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="acrylic-light border-secondary/30 text-white">
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive hover:bg-destructive/20 hover:text-destructive focus:bg-destructive/20 focus:text-destructive"
                          onClick={() => handleDeleteChannel(channel.id)}
                        >
                          Delete Channel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Video Channels */}          <Collapsible open={categoryStates.video} className="mb-2">
            <div className="flex items-center w-full">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex items-center flex-1 text-xs font-semibold text-gray-400 hover:text-white py-1 px-1 cursor-pointer group hover:bg-accent/10 rounded-md transition-colors"
                  onClick={() => toggleCategory("video")}
                >
                  {categoryStates.video ? (
                    <ChevronDown className="w-3 h-3 mr-1 text-accent group-hover:text-accent" />
                  ) : (
                    <ChevronRight className="w-3 h-3 mr-1 text-accent group-hover:text-accent" />
                  )}
                  <span className="neon-text tracking-wider">VIDEO CHANNELS</span>
                </button>
              </CollapsibleTrigger>
              <button
                className="ml-auto text-gray-400 hover:text-accent transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  setNewChannelData({ name: "", type: "video", private: false })
                  setIsCreateChannelModalOpen(true)
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <CollapsibleContent className="space-y-0.5 mt-1">
              {videoChannels.map((channel) => (
                <div key={channel.id} className="group relative">
                  <button                    className={cn(
                      "flex items-center w-full rounded-md py-1 px-2 my-1 text-gray-400 hover:bg-accent/20 hover:text-white transition-colors",
                      currentChannelId === channel.id && "bg-accent/30 text-white"
                    )}
                    onClick={() => setCurrentChannelId(channel.id)}
                  >
                    {getChannelIcon(channel.type)}
                    <span className="truncate">{channel.name}</span>
                    {channel.private && <Lock className="w-3 h-3 ml-1 opacity-70" />}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="acrylic-light border-accent/30 text-white">                      <DropdownMenuItem
                        className="cursor-pointer text-destructive hover:bg-destructive/20 hover:text-destructive focus:bg-destructive/20 focus:text-destructive"
                        onClick={() => handleDeleteChannel(channel.id)}
                      >
                        Delete Channel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Create Channel Modal */}
      <Dialog open={isCreateChannelModalOpen} onOpenChange={setIsCreateChannelModalOpen}>        <DialogContent className="acrylic-dark text-white border-primary/40">
          <DialogHeader>
            <DialogTitle className="text-center futuristic-text text-2xl neon-text">Create Channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel-name" className="text-gray-200">Channel Name</Label>              <Input
                id="channel-name"
                value={newChannelData.name}
                onChange={(e) => setNewChannelData({ ...newChannelData, name: e.target.value })}
                placeholder="new-channel"
                className="bg-gray-800/50 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Channel Type</Label>
              <RadioGroup
                value={newChannelData.type}
                onValueChange={(value) => setNewChannelData({ ...newChannelData, type: value as any })}
                className="flex flex-col space-y-2"
              >                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="channel-type-text" className="border-primary/40 text-primary" />
                  <Label htmlFor="channel-type-text" className="flex items-center cursor-pointer">
                    <Hash className="w-4 h-4 mr-2 text-primary" />
                    Text Channel
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="voice" id="channel-type-voice" className="border-secondary/40 text-secondary" />
                  <Label htmlFor="channel-type-voice" className="flex items-center cursor-pointer">
                    <Volume2 className="w-4 h-4 mr-2 text-secondary" />
                    Voice Channel
                  </Label>
                </div>
                <div className="flex items-center space-x-2">                  <RadioGroupItem value="video" id="channel-type-video" className="border-accent/40 text-accent" />
                  <Label htmlFor="channel-type-video" className="flex items-center cursor-pointer">
                    <Video className="w-4 h-4 mr-2 text-accent" />
                    Video Channel
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="channel-private"
                checked={newChannelData.private}
                onChange={(e) => setNewChannelData({ ...newChannelData, private: e.target.checked })}
                className="rounded border-gray-700 bg-gray-800/50"
              />
              <Label htmlFor="channel-private" className="flex items-center cursor-pointer">
                <Lock className="w-4 h-4 mr-2 text-gray-400" />
                Private Channel
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateChannelModalOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChannel}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 neon-button"
              disabled={!newChannelData.name.trim()}
            >
              Create Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
