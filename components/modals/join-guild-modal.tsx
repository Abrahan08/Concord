"use client"

import type React from "react"

import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useServer } from "@/hooks/use-server"
import { ServerContext } from "@/context/server-context"

interface JoinGuildModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JoinGuildModal({ isOpen, onClose }: JoinGuildModalProps) {
    const router = useRouter()
  const { toast } = useToast()
  const { joinServer } = useServer()
  const { addServer, setCurrentServerId } = useContext(ServerContext)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState("")

  const handleClose = () => {
    // Clear form when modal closes (Discord-like behavior)
    setInviteCode("")
    onClose()
  }
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newServer = await joinServer(inviteCode)
      
      // Add the server to the context so it appears in the sidebar immediately
      addServer(newServer)
      
      // Auto-select the newly joined guild (Discord-like behavior)
      setCurrentServerId(newServer.id)
      
      toast({
        title: "Guild joined",
        description: "You have successfully joined the guild.",
      })
        // Clear the invite code for next use
      setInviteCode("")
      
      handleClose()
      
      // Navigate to the new guild
      router.push(`/guild/${newServer.id}`)
    } catch (error) {
      toast({
        title: "Failed to join guild",
        description: "Invalid invite code or the guild doesn't exist.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-surface text-white border-gray-700 sm:max-w-md"><DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Join a Guild</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter an invite code"
              required
              className="bg-gray-800 border-gray-700"
            />
            <p className="text-sm text-gray-400">
              Invite codes look like: <span className="font-mono">aBcD1234</span>
            </p>
          </div>

          <DialogFooter>            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading || !inviteCode.trim()}>              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2">Joining</span>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                </span>
              ) : (
                "Join Guild"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
