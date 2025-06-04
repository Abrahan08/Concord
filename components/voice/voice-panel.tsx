"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { UserContext } from "@/context/user-context"
import { ChannelContext } from "@/context/channel-context"
import {
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Users,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Monitor,
  Camera,
  UserSquare2,
} from "@/components/ui/safe-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VoicePanel() {
  const { currentUser, users } = useContext(UserContext)
  const { currentChannel, voiceChannelUsers } = useContext(ChannelContext)

  const [isMicOn, setIsMicOn] = useState(true)
  const [isDeafened, setIsDeafened] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("voice")

  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLVideoElement>(null)
  // Get real participants from voice channel users
  const participants = currentChannel 
    ? (voiceChannelUsers[currentChannel.id] || [])
        // Deduplicate user IDs
        .filter((userId, index, array) => array.indexOf(userId) === index)
        .filter(userId => userId !== currentUser?.id) // Exclude current user
        .map(userId => {
          const user = users.find(u => u.id === userId)
          if (!user) return null
          return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            isSpeaking: Math.random() > 0.5, // Random speaking state for demo
            isMuted: Math.random() > 0.7, // Random muted state for demo
            hasCamera: true,
            isCameraOn: false,
          }
        })
        .filter((p): p is NonNullable<typeof p> => p !== null) // Remove null entries with type guard
    : []

  // Handle camera toggle
  const toggleCamera = async () => {
    try {
      if (isCameraOn) {
        // Turn off camera
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }
        setIsCameraOn(false)
      } else {
        // Turn on camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setIsCameraOn(true)
        // If screen sharing is on, turn it off
        if (isScreenSharing) {
          toggleScreenShare()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  // Handle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Turn off screen sharing
        if (screenRef.current && screenRef.current.srcObject) {
          const tracks = (screenRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
          screenRef.current.srcObject = null
        }
        setIsScreenSharing(false)
      } else {
        // Turn on screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (screenRef.current) {
          screenRef.current.srcObject = stream
        }
        setIsScreenSharing(true)
        // If camera is on, turn it off
        if (isCameraOn) {
          toggleCamera()
        }
      }
    } catch (error) {
      console.error("Error sharing screen:", error)
    }
  }

  // Clean up media streams when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
      if (screenRef.current && screenRef.current.srcObject) {
        const tracks = (screenRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  if (!currentChannel) return null

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-gray-800 px-4 py-2">
          <TabsList className="bg-gray-800 p-1">
            <TabsTrigger value="voice" className="data-[state=active]:bg-primary">
              <Volume2 className="h-4 w-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-primary">
              <Video className="h-4 w-4 mr-2" />
              Video
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="voice" className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Voice Connected</h2>
            <p className="text-gray-400">You're in {currentChannel.name}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full max-w-3xl">
            {/* Current user */}
            <div className="flex flex-col items-center">
              <div className={cn("relative mb-2", isMicOn && "animate-pulse")}>                <Avatar className="h-20 w-20">
                  {/* Only show AvatarImage if we have a real avatar (not placeholder) */}
                  {currentUser?.avatar && !currentUser.avatar.includes('placeholder') && !currentUser.avatar.includes('height=') && !currentUser.avatar.includes('width=') ? (
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser?.username || "You"}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {currentUser?.username.substring(0, 2).toUpperCase() || "Y"}
                  </AvatarFallback>
                </Avatar>{!isMicOn && (
                  <div className="absolute -bottom-1 -right-1 bg-destructive rounded-full p-1">
                    <MicOff className="h-4 w-4" />
                  </div>
                )}
                {isCameraOn && (
                  <div className="absolute -bottom-1 -left-1 bg-primary rounded-full p-1">
                    <Camera className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="font-medium">{currentUser?.username || "You"}</p>
              <p className="text-xs text-gray-400">{isMicOn ? "Speaking" : "Muted"}</p>
            </div>

            {/* Other participants */}
            {participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center">
                <div className={cn("relative mb-2", participant.isSpeaking && !participant.isMuted && "animate-pulse")}>                    <Avatar className="h-20 w-20">
                      {/* Only show AvatarImage if we have a real avatar (not placeholder) */}
                      {participant.avatar && !participant.avatar.includes('placeholder') && !participant.avatar.includes('height=') && !participant.avatar.includes('width=') ? (
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.username}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {participant.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>{participant.isMuted && (
                    <div className="absolute -bottom-1 -right-1 bg-destructive rounded-full p-1">
                      <MicOff className="h-4 w-4" />
                    </div>
                  )}
                  {participant.isCameraOn && (
                    <div className="absolute -bottom-1 -left-1 bg-primary rounded-full p-1">
                      <Camera className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <p className="font-medium">{participant.username}</p>
                <p className="text-xs text-gray-400">
                  {participant.isMuted ? "Muted" : participant.isSpeaking ? "Speaking" : "Silent"}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="flex-1 flex flex-col">
          <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
            {/* Current user video */}
            {(isCameraOn || isScreenSharing) && (
              <div className="col-span-1 md:col-span-2 aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                {isCameraOn && (
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
                )}
                {isScreenSharing && (
                  <video ref={screenRef} autoPlay muted playsInline className="w-full h-full object-contain"></video>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                  {currentUser?.username || "You"} {!isMicOn && "(Muted)"}
                  {isScreenSharing && " (Screen)"}
                </div>
              </div>
            )}

            {/* Placeholder when no video */}
            {!isCameraOn && !isScreenSharing && (
              <div className="col-span-1 md:col-span-2 aspect-video bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <UserSquare2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Turn on your camera or share your screen</p>
                </div>
              </div>
            )}

            {/* Participant videos would go here */}
            {participants
              .filter((p) => p.isCameraOn)
              .map((participant) => (
                <div key={participant.id} className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">{participant.username}'s video</p>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                    {participant.username} {participant.isMuted && "(Muted)"}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Users className="w-5 h-5 mr-2" />
          {participants.length + 1}
        </Button>
        <div className="flex space-x-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>              <TooltipTrigger asChild>
                <Button
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
            <Tooltip>              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("rounded-full w-10 h-10", isDeafened ? "bg-destructive hover:bg-destructive/80" : "bg-gray-700")}
                  onClick={() => setIsDeafened(!isDeafened)}
                >
                  {isDeafened ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDeafened ? "Undeafen" : "Deafen"}</p>
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
                    isCameraOn ? "bg-primary hover:bg-primary/90" : "bg-gray-700",
                  )}
                  onClick={toggleCamera}
                >
                  {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCameraOn ? "Turn off camera" : "Turn on camera"}</p>
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
                  onClick={toggleScreenShare}
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
                <p>Disconnect</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="w-[72px]"></div> {/* Spacer to balance the layout */}
      </div>
    </div>
  )
}
