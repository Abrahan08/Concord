"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mic, MicOff, Headphones, Settings, UserCircle, Edit, LogOut, Eye, UserCheck, Copy } from "@/components/ui/safe-icons"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useAppTheme } from "@/hooks/use-theme"

export default function UserFooterBar() {
  const router = useRouter()
  const { currentUser, updateProfile } = useAuth()
  const { currentTheme, accentColor } = useAppTheme()
  const [muted, setMuted] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false)
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [popoverOpen])
  // Use real user data from auth context
  const username = currentUser?.username || "User"
  const discriminator = currentUser?.discriminator || "0000"
  const userStatus = currentUser?.status || "online"
  const bio = currentUser?.bio || ""
  const customStatus = currentUser?.customStatus || ""
  // Map status to display text
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "online":
        return "Active"
      case "idle":
        return "Idle"
      case "dnd":
        return "Do Not Disturb"
      case "offline":
        return "Invisible"
      default:
        return "Active"
    }
  }

  // Map status to theme-aware color classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "idle":
        return "text-yellow-400"
      case "dnd":
        return "text-destructive"
      case "offline":
        return "text-muted-foreground"
      default:
        return "text-green-400"
    }
  }

  // Map status to theme-aware background color classes
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-destructive"
      case "offline":
        return "bg-muted-foreground"
      default:
        return "bg-green-500"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateProfile({ status: newStatus as any })
      setPopoverOpen(false)
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const copyUserId = async () => {
    if (currentUser?.id) {
      await navigator.clipboard.writeText(currentUser.id)
      setPopoverOpen(false)
    }
  }

  return (
    <div className="fixed bottom-1 left-0 z-50 pointer-events-none">      {/* User Popover */}
      {popoverOpen && (        <div
          ref={popoverRef}
          className="absolute bottom-16 left-0 ml-5 z-[60] w-80 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 p-0 pointer-events-auto"
          style={{
            boxShadow: "0 16px 64px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
        >          {/* Banner */}
          <div 
            className="h-20 w-full rounded-t-2xl bg-gradient-to-br from-primary/70 via-secondary/50 to-accent/70 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
          </div>
            {/* Avatar and status */}          <div className="relative flex items-start px-6 -mt-12">            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-card shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-card shadow-sm",
                getStatusBgColor(userStatus)
              )}></div>
            </div>
          </div>
            {/* Username and tag */}
          <div className="px-6 mt-4">
            <div className="text-xl font-bold text-foreground">{username}</div>
            <div className="text-base text-muted-foreground mb-1">#{discriminator}</div>
            <div className="text-sm text-foreground mb-3">{getStatusDisplay(userStatus)}</div>
            
            {customStatus && (
              <div className="flex items-center gap-2 mb-4">
                <div className="text-sm text-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
                  {customStatus}
                </div>
              </div>
            )}

            {bio && (
              <div className="mb-4">
                <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">About Me</div>
                <div className="text-sm text-foreground">{bio}</div>
              </div>
            )}          </div>
            {/* Divider */}
          <div className="mx-6 mb-3 h-px bg-border"></div>
          
          {/* Status Options */}
          <div className="px-6 mb-3">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-2">Status</div>            <div className="space-y-1">
              {[
                { value: "online", label: "Active", color: "bg-green-500" },
                { value: "idle", label: "Idle", color: "bg-yellow-500" },
                { value: "dnd", label: "Do Not Disturb", color: "bg-destructive" },
                { value: "offline", label: "Invisible", color: "bg-muted-foreground" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    userStatus === status.value 
                      ? "bg-primary/30 text-foreground neon-glow" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full", status.color)}></div>
                  <span className="text-sm">{status.label}</span>
                  {userStatus === status.value && (
                    <UserCheck className="w-4 h-4 ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>          </div>
            {/* Divider */}
          <div className="mx-6 mb-3 h-px bg-border"></div>
          
          {/* Actions */}
          <div className="px-6 pb-6 space-y-2">
            <button 
              onClick={() => {
                router.push("/settings/profile")
                setPopoverOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground font-medium transition-colors neon-glow"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
            
            <button 
              onClick={() => {
                router.push("/settings")
                setPopoverOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <UserCircle className="w-4 h-4" />
              Account Settings
            </button>
            
            <button 
              onClick={copyUserId}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy User ID
            </button>
            
            <button 
              onClick={() => handleStatusChange("offline")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-4 h-4" />
              Switch to Invisible
            </button>
          </div>
        </div>
      )}      {/* Footer Bar */}
      <div        className={cn(
          "pointer-events-auto",
          "rounded-xl bg-card/95 backdrop-blur-xl",
          "border border-border/50 shadow-xl",
          "flex items-center justify-between px-4 py-4",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-primary/10 hover:border-primary/30",
          "min-w-[280px] max-w-[500px] w-[314px] ml-1"
        )}
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >        {/* User Info Section */}        <div className="flex items-center gap-3 min-w-0 flex-1">          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-border/30 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-semibold">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Status dot with dynamic color */}
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card shadow-sm",
              getStatusBgColor(userStatus)
            )}></div>
          </div>

          <div className="min-w-0 flex-1">            <div 
              className="flex flex-col group cursor-pointer"
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              <span className="font-semibold text-foreground text-sm truncate">
                {username}
              </span>
              <span
                className={cn(
                  "text-xs font-medium group-hover:hidden",
                  getStatusColor(userStatus)
                )}
              >
                {getStatusDisplay(userStatus)}
              </span>
              <span className="text-xs text-muted-foreground hidden group-hover:block">
                #{discriminator}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center gap-1">
          {/* Voice Controls */}          <button
            className={cn(
              "p-2 rounded-md transition-all duration-200",
              "hover:bg-muted/50 active:scale-95",
              muted
                ? "text-destructive bg-destructive/20 hover:bg-destructive/30"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <button
            className={cn(
              "p-2 rounded-md transition-all duration-200",
              "hover:bg-muted/50 active:scale-95",
              deafened
                ? "text-destructive bg-destructive/20 hover:bg-destructive/30"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={deafened ? "Undeafen" : "Deafen"}
            onClick={() => setDeafened(!deafened)}
          >
            <Headphones className="h-4 w-4" />
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-md transition-all duration-200 hover:bg-muted/50 active:scale-95 text-muted-foreground hover:text-foreground"
            title="User Settings"
            onClick={handleSettingsClick}
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
