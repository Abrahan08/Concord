"use client"

import React, { useState } from "react"
import VCConnectBar from "@/components/voice/vc-connect-bar"

export default function TestVCConnectPage() {
  const [serverName, setServerName] = useState("Holo")
  const [channelName, setChannelName] = useState("games")
  
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">VC Connect Bar Test</h1>      <VCConnectBar 
        serverName={serverName}
        channelName={channelName}
        onDisconnect={() => alert("Disconnecting...")}
        onVideoToggle={() => alert("Toggling screen share...")}
      />
        <div className="mt-40 p-4 bg-muted rounded-lg space-y-4">
        <p className="text-foreground">
          The Voice Connection bar should appear at the top of the screen.
        </p>
        
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Change Connection:</h2>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => {
                setServerName("Holo")
                setChannelName("games")
              }}
            >
              Holo / games
            </button>            <button 
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => {
                setServerName("Discord Devs")
                setChannelName("coding-help")
              }}
            >
              Discord Devs / coding-help
            </button>
            <button 
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => {
                setServerName("Discord Developer Community")
                setChannelName("typescript-react-discussions")
              }}
            >
              Long Names
            </button>
            <button 
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => {
                setServerName("Concord Team")
                setChannelName("General")
              }}
            >
              Concord Team / General
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
