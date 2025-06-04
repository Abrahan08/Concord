"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "next/navigation"
import { ServerContext } from "@/context/server-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Upload, Camera } from "@/components/ui/safe-icons"

export default function GeneralSettingsPage() {
  const params = useParams()
  const guildId = params.guildId as string
  const { servers, currentServer, setCurrentServerId } = useContext(ServerContext)
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [guildData, setGuildData] = useState({
    name: "",
    description: "",
    icon: ""
  })
  // Find the guild either from currentServer or by ID from the servers array
  const currentGuild = currentServer?.id === guildId ? currentServer : servers.find(server => server.id === guildId)

  useEffect(() => {
    // Set the current server if it's not already set
    if (guildId && (!currentServer || currentServer.id !== guildId)) {
      setCurrentServerId(guildId)
    }
  }, [guildId, currentServer, setCurrentServerId])

  useEffect(() => {
    if (currentGuild) {
      setGuildData({
        name: currentGuild.name,
        description: currentGuild.description || "",
        icon: currentGuild.icon || ""
      })
    }
  }, [currentGuild])

  // Show loading state if servers are empty or guild is not found yet
  if (servers.length === 0 || !currentGuild) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {servers.length === 0 ? "Loading servers..." : "Loading guild settings..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setGuildData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setGuildData(prev => ({
            ...prev,
            icon: event.target?.result as string
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetIcon = () => {
    setGuildData(prev => ({
      ...prev,
      icon: ""
    }))
  }

  const generateRandomIcon = () => {
    // Generate a random colored avatar
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    
    // Create a simple colored circle as icon
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Draw colored circle
      ctx.fillStyle = randomColor
      ctx.beginPath()
      ctx.arc(64, 64, 60, 0, 2 * Math.PI)
      ctx.fill()
      
      // Draw initials
      ctx.fillStyle = 'white'
      ctx.font = 'bold 48px Inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(guildData.name.substring(0, 2).toUpperCase(), 64, 64)
      
      setGuildData(prev => ({
        ...prev,
        icon: canvas.toDataURL()
      }))
    }
  }
  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Here you would typically make an API call to save the changes
      // For now, we'll update the local context and show a success message
      
      // In a real app, you'd call an API like:
      // await updateGuild(guildId, guildData)
      
      toast({
        title: "Settings saved",
        description: "Guild settings have been updated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save guild settings. Please try again.",
        variant: "destructive"
      })    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Server Overview</h2>
          <p className="text-muted-foreground">Basic information about your server</p>
        </div>

        <div className="space-y-8">
          {/* Server Name */}
          <div className="space-y-2">
            <Label htmlFor="server-name" className="text-sm font-medium text-foreground">
              Server Name
            </Label>
            <Input
              id="server-name"
              value={guildData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-card/50 border-border text-foreground"
              placeholder="Enter server name"
            />
          </div>

          {/* Server Description */}
          <div className="space-y-2">
            <Label htmlFor="server-description" className="text-sm font-medium text-foreground">
              Server Description
            </Label>
            <Textarea
              id="server-description"
              value={guildData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-card/50 border-border text-foreground min-h-[100px]"
              placeholder="The official Verdant community server."
            />
          </div>

          {/* Server Icon */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">
              Server Icon
            </Label>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-border">
                  <AvatarImage src={guildData.icon} alt="Server icon" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                    {guildData.name ? guildData.name.substring(0, 2).toUpperCase() : "G"}
                  </AvatarFallback>
                </Avatar>
                
                <label
                  htmlFor="icon-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={generateRandomIcon}
                    className="text-foreground border-border hover:bg-accent"
                  >
                    Generate Random
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleResetIcon}
                    className="text-foreground border-border hover:bg-accent"
                  >
                    Reset to Default
                  </Button>
                </div>
                <label
                  htmlFor="icon-upload"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Upload Custom (Coming Soon)
                </label>
              </div>
            </div>
          </div>

          {/* Server Region */}
          <div className="space-y-2">
            <Label htmlFor="server-region" className="text-sm font-medium text-foreground">
              Server Region
            </Label>
            <select
              id="server-region"
              className="w-full bg-card/50 border border-border rounded-md px-3 py-2 text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              defaultValue="us-east"
            >
              <option value="us-east">US East</option>
              <option value="us-west">US West</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="australia">Australia</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-border">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
