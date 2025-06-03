"use client"

import type React from "react"

import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "@/components/ui/safe-icons"
import { useServer } from "@/hooks/use-server"
import { ServerContext } from "@/context/server-context"

interface CreateGuildModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateGuildModal({ isOpen, onClose }: CreateGuildModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { createServer } = useServer()
  const { addServer, setCurrentServerId } = useContext(ServerContext)
  const [isLoading, setIsLoading] = useState(false)
  const [guildData, setGuildData] = useState({
    name: "",
    description: "",
    icon: "/placeholder.svg?height=200&width=200",
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGuildData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    // Clear form when modal closes (Discord-like behavior)
    setGuildData({
      name: "",
      description: "",
      icon: "/placeholder.svg?height=200&width=200",
    })
    onClose()
  }
    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setGuildData((prev) => ({ ...prev, icon: event.target?.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Only include icon if it's not the default placeholder
      const serverData = {
        name: guildData.name,
        description: guildData.description,
        ...(guildData.icon !== "/placeholder.svg?height=200&width=200" && { icon: guildData.icon })
      }
      
      const newServer = await createServer(serverData)
      
      // Add the server to the context so it appears in the sidebar immediately
      addServer(newServer)
      
      // Auto-select the newly created guild (Discord-like behavior)
      setCurrentServerId(newServer.id)
      
      toast({
        title: "Guild created",
        description: `${guildData.name} has been created successfully.`,
      })
      
      // Clear the form for next use
      setGuildData({
        name: "",
        description: "",
        icon: "/placeholder.svg?height=200&width=200",
      })
        onClose()
      
      // Navigate to the new guild
      router.push(`/guild/${newServer.id}`)
    } catch (error) {
      toast({
        title: "Failed to create guild",
        description: "There was an error creating your guild. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-surface text-white border-gray-700 sm:max-w-md">        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Create a New Guild</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">              <Avatar className="h-24 w-24 border-4 border-gray-700">
                <AvatarImage src={guildData.icon || "/placeholder.svg"} alt="Guild icon" />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {guildData.name ? guildData.name.substring(0, 2).toUpperCase() : "G"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="guild-icon-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Upload className="h-6 w-6" />
                <input
                  id="guild-icon-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleIconChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">Upload a guild icon</p>
          </div>

          <div className="space-y-4">            <div className="space-y-2">
              <Label htmlFor="guild-name">Guild Name</Label>              <Input
                id="guild-name"
                name="name"
                value={guildData.name}
                onChange={handleChange}
                placeholder="My Awesome Guild"
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>            <div className="space-y-2">
              <Label htmlFor="guild-description">Description (Optional)</Label>
              <Input
                id="guild-description"
                name="description"
                value={guildData.description}
                onChange={handleChange}
                placeholder="What's this guild about?"
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <DialogFooter>            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading || !guildData.name.trim()}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2">Creating</span>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                </span>
              ) : (
                "Create Guild"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
