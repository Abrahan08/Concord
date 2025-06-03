"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { PhoneOff, Monitor } from "@/components/ui/safe-icons"

interface VCConnectBarProps {
  serverName: string
  channelName: string
  isConnected?: boolean
  onDisconnect?: () => void
  onVideoToggle?: () => void  // For screen sharing
  isScreenSharing?: boolean
}

export default function VCConnectBar({
  serverName,
  channelName,
  isConnected = true,
  onDisconnect = () => {},
  onVideoToggle = () => {},
  isScreenSharing = false,
}: VCConnectBarProps) {
  // Add state to track when disconnect is triggered for animation
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const handleDisconnect = () => {
    setIsDisconnecting(true);
    // Add a slight delay before actual disconnect for animation
    setTimeout(() => {
      onDisconnect();
    }, 300);
  };  return (    <div className="fixed bottom-[74px] left-0 z-50 pointer-events-none">      <div
        className={cn(
          "pointer-events-auto",
          "rounded-xl bg-card/95 backdrop-blur-xl",
          "border border-border/50 shadow-xl",
          "flex items-start justify-between",
          "transition-all duration-300 ease-in-out",
          isDisconnecting
            ? "border-destructive/50 shadow-destructive/20 scale-95 opacity-90"
            : "hover:shadow-primary/10 hover:border-primary/30",
          "min-w-[280px] max-w-[500px] w-[314px] ml-1 mb-1.5",
          "px-4 py-3.5"
        )}
        style={{
          boxShadow: isDisconnecting
            ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 70, 70, 0.1)"
            : "0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)"
        }}
      >{/* Voice Status and Channel Info */}        <div className="flex flex-col py-0.5">          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors",
              isDisconnecting ? "bg-destructive" : "bg-green-500"
            )}></div>
            <span className={cn(
              "text-sm font-medium transition-colors",
              isDisconnecting ? "text-destructive" : "text-green-500"
            )}>
              {isDisconnecting ? "Disconnecting..." : "Voice Connected"}
            </span>
          </div><div className="flex flex-col mt-1">            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{serverName}</span>
              <span className="text-sm text-muted-foreground">/</span>
            </div>
            <div className="pl-1">
              <span className="text-sm font-semibold text-foreground truncate max-w-[200px] block">{channelName}</span>
            </div>
          </div>        </div>        {/* Voice Controls */}        <div className="flex items-center self-center ml-2 mt-2">          {/* Button Group with dividers between buttons */}
          <div className="flex rounded-lg bg-muted/30 overflow-hidden border border-border/30 shadow-sm">            {/* Screen Share */}            <button              className={cn(
                "p-2 pt-2.5 pb-2.5 transition-all duration-200 active:scale-95",
                isScreenSharing 
                  ? "bg-green-500/30 text-green-500 hover:bg-green-500/40"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
              title={isScreenSharing ? "Stop Screen Share" : "Screen Share"}
              onClick={onVideoToggle}
            >
              <Monitor className="h-4 w-4" />
            </button>            {/* Divider */}
            <div className="w-px bg-border/30"></div>
            
            {/* Disconnect */}            <button
              className={cn(
                "p-2 pt-2.5 pb-2.5 transition-all duration-200 active:scale-95",
                isDisconnecting
                  ? "bg-destructive/70 text-destructive-foreground"
                  : "hover:bg-destructive/40 text-destructive hover:text-destructive"
              )}
              title="Disconnect"
              onClick={handleDisconnect}
              aria-label="Disconnect from voice channel"
              disabled={isDisconnecting}
            >
              <PhoneOff className={cn("h-4 w-4", isDisconnecting && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
