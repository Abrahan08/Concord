"use client"

import { cn } from "@/lib/utils"

import { useState, useContext } from "react"
import { UserContext } from "@/context/user-context"
import { ChannelContext } from "@/context/channel-context"
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Settings, Users } from "@/components/ui/safe-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function VideoPanel() {
  const { currentUser } = useContext(UserContext)
  const { currentChannel } = useContext(ChannelContext)

  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // Mock participants
  const participants = [
    { id: "1", username: "Alex", avatar: "/placeholder.svg?height=100&width=100" },
    { id: "2", username: "Sarah", avatar: "/placeholder.svg?height=100&width=100" },
    { id: "3", username: "Michael", avatar: "/placeholder.svg?height=100&width=100" },
  ]

  if (!currentChannel) return null

  return (
    <div className="flex-1 flex flex-col bg-gray-900 relative">
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
          <Users className="w-4 h-4 mr-2" />
          {participants.length + 1} Participants
        </Button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-4 items-center justify-center">
        {/* Main user video */}
        <div className="col-span-2 lg:col-span-1 aspect-video bg-gray-800 rounded-lg overflow-hidden relative flex items-center justify-center">
          {isVideoOn ? (
            <div className="w-full h-full bg-gray-700">
              {/* This would be replaced with actual video stream */}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Your camera</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={currentUser?.avatar || "/placeholder.svg?height=100&width=100"}
                  alt={currentUser?.username || "You"}
                />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {currentUser?.username.substring(0, 2).toUpperCase() || "Y"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-white font-medium">{currentUser?.username || "You"}</h3>
              <p className="text-gray-400 text-sm">Camera off</p>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
            {currentUser?.username || "You"} {!isMicOn && "(Muted)"}
          </div>
        </div>

        {/* Participant videos */}
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage
                  src={participant.avatar || "/placeholder.svg?height=100&width=100"}
                  alt={participant.username}
                />
                <AvatarFallback className="bg-primary text-white">
                  {participant.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-white font-medium">{participant.username}</h3>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              {participant.username}
            </div>
          </div>
        ))}
      </div>

      <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center justify-center px-4">
        <div className="flex space-x-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>                <Button
                  variant="outline"
                  size="icon"
                  className={cn("rounded-full w-10 h-10", isMicOn ? "bg-gray-700" : "bg-destructive hover:bg-destructive/80")}
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMicOn ? "Mute" : "Unmute"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>                <Button
                  variant="outline"
                  size="icon"
                  className={cn("rounded-full w-10 h-10", isVideoOn ? "bg-gray-700" : "bg-destructive hover:bg-destructive/80")}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVideoOn ? "Turn off camera" : "Turn on camera"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full w-10 h-10",
                    isScreenSharing ? "bg-primary hover:bg-primary/90" : "bg-gray-700",
                  )}
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  <Monitor className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 bg-gray-700">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 bg-destructive hover:bg-destructive/80">
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Leave call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
