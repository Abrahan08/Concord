"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Shield, Trash2 } from "@/components/ui/safe-icons"

export default function DeleteServerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Mock server data - in real app this would come from context or API
  const currentServer = {
    id: "1",
    name: "Awesome Gaming Server",
    memberCount: 1247,
    channelCount: 15,
    roleCount: 8,
  }

  const handleDeleteServer = async () => {
    if (confirmationText !== currentServer.name) {
      toast({
        title: "Confirmation failed",
        description: "Please type the exact server name to confirm deletion.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Server deleted",
        description: `${currentServer.name} has been permanently deleted.`,
      })

      // Redirect to main page after deletion
      router.push("/main")
    } catch (error) {
      toast({
        title: "Failed to delete server",
        description: "There was an error deleting the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setConfirmationText("")
    }
  }

  const handleTransferOwnership = () => {
    toast({
      title: "Transfer Ownership",
      description: "Ownership transfer feature will be implemented soon.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Delete Server</h2>
        <p className="text-muted-foreground">
          Permanently delete this server and all its data. This action cannot be undone.
        </p>
      </div>

      {/* Warning Alert */}      <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
        <Shield className="h-4 w-4" />
        <AlertTitle>Danger Zone</AlertTitle>
        <AlertDescription>
          The actions in this section are irreversible and destructive. Please proceed with caution.
        </AlertDescription>
      </Alert>

      {/* Server Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Server Information</span>
          </CardTitle>
          <CardDescription>
            Review the server details before proceeding with deletion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Server Name:</span>
              <span className="text-muted-foreground">{currentServer.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Server ID:</span>
              <span className="text-muted-foreground font-mono">{currentServer.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Members:</span>
              <span className="text-muted-foreground">{currentServer.memberCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Channels:</span>
              <span className="text-muted-foreground">{currentServer.channelCount}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Total Roles:</span>
              <span className="text-muted-foreground">{currentServer.roleCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Ownership */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Ownership</CardTitle>
          <CardDescription>
            Transfer server ownership to another member before deletion, or keep it if you want to delete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you want to step down but keep the server alive, you can transfer ownership to a trusted member.
              This will give them full administrative control over the server.
            </p>
            <Button variant="outline" onClick={handleTransferOwnership}>
              Transfer Ownership
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Server */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center space-x-2">
            <Trash2 className="w-5 h-5" />
            <span>Delete Server</span>
          </CardTitle>
          <CardDescription>
            Permanently delete this server and all associated data including messages, channels, roles, and member data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">            <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>This action is irreversible!</strong> Once deleted, all server data including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All messages and chat history</li>
                  <li>All channels and categories</li>
                  <li>All roles and permissions</li>
                  <li>All member data and join dates</li>
                  <li>All server settings and configurations</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                To confirm deletion, you must be the server owner and understand the consequences.
              </p>
              <p className="text-sm text-muted-foreground">
                This server has <strong>{currentServer.memberCount.toLocaleString()} members</strong> who will lose access immediately.
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Server Permanently
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Delete Server</span>
            </DialogTitle>
            <DialogDescription>
              This action will permanently delete <strong>{currentServer.name}</strong> and cannot be undone.
              All data will be lost forever.
            </DialogDescription>
          </DialogHeader>          <div className="space-y-4">
            <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                You are about to delete a server with {currentServer.memberCount.toLocaleString()} members.
                This will immediately remove access for all members.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-sm font-medium">
                Type the server name to confirm: <span className="font-mono text-destructive">{currentServer.name}</span>
              </Label>
              <Input
                id="confirmation"
                placeholder={`Enter "${currentServer.name}" to confirm`}
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="border-destructive/50 focus:border-destructive"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setConfirmationText("")
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteServer}
              disabled={confirmationText !== currentServer.name || isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Server
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
