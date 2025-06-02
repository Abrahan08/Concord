"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import GuildSidebar from "@/components/shell/guild-sidebar"
import DMSidebar from "@/components/direct-messages/dm-sidebar"
import { ServerProvider } from "@/context/server-context"
import { ChannelProvider } from "@/context/channel-context"
import { UserProvider } from "@/context/user-context"
import AuthCheck from "@/components/auth/auth-check"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Paperclip, Smile, Gift, Send, PhoneCall, Video, Users, MessageCircle } from "@/components/ui/safe-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import UserFooterBar from "@/components/user/user-footer-bar"

// Mock data for the selected friend
const mockFriends = [
  { id: "1", name: "Glitcher", status: "online" },
  { id: "2", name: "Hex Puzzle Adventure", status: "online" },
  { id: "3", name: "Haruto", status: "idle", activity: "Playing Valorant" },
  { id: "4", name: "MSS | Assassin", status: "dnd", activity: "so its being a hectic life" },
  { id: "5", name: "Franz", status: "online", activity: "Playing VALORANT" },
];

const mockMessages = [
  { id: "1", friendId: "1", content: "Hey, how's it going?", timestamp: "Today at 10:30 AM", isMe: false },
  { id: "2", friendId: "1", content: "Not bad, working on the new project!", timestamp: "Today at 10:31 AM", isMe: true },
  { id: "3", friendId: "1", content: "That sounds interesting. Tell me more about it.", timestamp: "Today at 10:32 AM", isMe: false },
  { id: "4", friendId: "1", content: "It's a new chat app, similar to Discord but with some unique features.", timestamp: "Today at 10:32 AM", isMe: true },
  
  { id: "5", friendId: "2", content: "Did you finish the last puzzle?", timestamp: "Yesterday at 8:15 PM", isMe: false },
  { id: "6", friendId: "2", content: "Not yet, still working on it!", timestamp: "Yesterday at 8:17 PM", isMe: true },
  
  { id: "7", friendId: "3", content: "Want to play some games later?", timestamp: "Yesterday at 3:45 PM", isMe: false },
  { id: "8", friendId: "3", content: "Sure, I'll be free after 7!", timestamp: "Yesterday at 3:46 PM", isMe: true },
];

// Recent conversations tracking interface
interface RecentConversation {
  friendId: string
  lastAccessed: string
  lastMessage?: {
    content: string
    timestamp: string
    isMe: boolean
  }
}

export default function DirectMessagePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const friendId = params.friendId as string;
  const [messageInput, setMessageInput] = useState("");
  const [localMessages, setLocalMessages] = useState([...mockMessages]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended" | null>(null);

  const friend = mockFriends.find(f => f.id === friendId);
  const messages = localMessages.filter(m => m.friendId === friendId);

  // Function to update recent conversations
  const updateRecentConversation = (friendId: string, lastMessage?: RecentConversation['lastMessage']) => {
    const storedConversations = localStorage.getItem("recent_conversations");
    const recentConversations: RecentConversation[] = storedConversations ? JSON.parse(storedConversations) : [];
    
    const now = new Date().toISOString();
    const filtered = recentConversations.filter(conv => conv.friendId !== friendId);
    const updated = [
      { 
        friendId, 
        lastAccessed: now, 
        lastMessage: lastMessage || recentConversations.find(conv => conv.friendId === friendId)?.lastMessage 
      },
      ...filtered
    ];
    // Keep only the 10 most recent conversations
    const limited = updated.slice(0, 10);
    localStorage.setItem("recent_conversations", JSON.stringify(limited));
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // Handle call initiation from URL parameters
  useEffect(() => {
    const callParam = searchParams.get('call');
    if (callParam === 'voice' || callParam === 'video') {
      initiateCall(callParam);
    }
  }, [searchParams]);

  // Simulate incoming messages to demonstrate Discord-like behavior
  const simulateIncomingMessage = () => {
    const incomingMessages = [
      "Hey! Just saw your message 👋",
      "Want to hop on a call?",
      "Check out this new game!",
      "How's your day going?",
      "Ready for tonight's session?",
      "Did you see the latest update?",
      "This is so cool! 🔥",
      "Let's catch up soon"
    ];
    
    const randomMessage = incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
    const newMessage = {
      id: `incoming-${Date.now()}`,
      friendId,
      content: randomMessage,
      timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isMe: false
    };
    
    setLocalMessages(prev => [...prev, newMessage]);
    
    // Update recent conversations with incoming message
    updateRecentConversation(friendId, {
      content: randomMessage,
      timestamp: newMessage.timestamp,
      isMe: false
    });
      toast({
      title: "New message received",
      description: `${friend?.name}: ${randomMessage}`,
      duration: 3000
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "idle": return "bg-yellow-500";
      case "dnd": return "bg-destructive";
      default: return "bg-gray-500";
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    
    // Add the new message to local state
    const newMessage = {
      id: `local-${Date.now()}`,
      friendId,
      content: messageInput,
      timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isMe: true
    };
    
    setLocalMessages(prev => [...prev, newMessage]);
    setMessageInput("");
    
    // Update recent conversations
    updateRecentConversation(friendId, {
      content: messageInput,
      timestamp: newMessage.timestamp,
      isMe: true
    });
    
    // In a real app, this would send the message to an API
    console.log("Sending message:", messageInput);
  };

  const initiateCall = (type: "voice" | "video") => {
    setCallType(type);
    setCallStatus("calling");
    setIsCallingModalOpen(true);
    
    // Simulate the call being connected after 2 seconds
    setTimeout(() => {
      setCallStatus("connected");
      // In a real app, this would connect to a WebRTC service
    }, 2000);
  };

  const endCall = () => {
    setCallStatus("ended");
    
    // Close the call modal after a delay
    setTimeout(() => {
      setIsCallingModalOpen(false);
      setCallType(null);
      setCallStatus(null);
    }, 1000);
  };

  return (
    <AuthCheck>
      {(isAuthenticated) => {
        if (!isAuthenticated) {
          redirect("/login")
          return null
        }

        return (
          <UserProvider>
            <ServerProvider>
              <ChannelProvider>                <div className="flex h-screen bg-surface text-white overflow-hidden">
                  <GuildSidebar />
                  <DMSidebar />

                  <div className="flex-1 flex flex-col acrylic-light">
                    {friend ? (
                      <>
                        <div className="h-12 border-b border-primary/30 flex items-center px-4 shadow-sm justify-between acrylic">
                          <div className="flex items-center">
                            <div className="relative mr-2">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-white",
                                friend.status === "online" && "bg-gradient-to-br from-green-500 to-blue-500",
                                friend.status === "idle" && "bg-gradient-to-br from-yellow-500 to-orange-500",
                                friend.status === "dnd" && "bg-gradient-to-br from-red-500 to-pink-500",
                                friend.status === "offline" && "bg-gradient-to-br from-gray-500 to-gray-700"
                              )}>
                                <span>{friend.name.substring(0, 1).toUpperCase()}</span>
                              </div>
                              <div className={cn(
                                "w-2 h-2 rounded-full absolute right-0 bottom-0 border border-gray-900",
                                getStatusColor(friend.status),
                                friend.status === "online" && "neon-blue-glow scale-90"
                              )}></div>
                            </div>
                            <h2 className="font-semibold text-white">{friend.name}</h2>
                          </div>
                          
                          {/* Call buttons */}
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-gray-400 hover:text-green-400 hover:bg-green-500/20"
                              title="Voice Call"
                              onClick={() => initiateCall("voice")}
                              disabled={friend.status === "offline"}
                            >
                              <PhoneCall className="h-5 w-5" />
                            </Button>                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-gray-400 hover:text-secondary hover:bg-secondary/20"
                              title="Video Call"
                              onClick={() => initiateCall("video")}
                              disabled={friend.status === "offline"}
                            >
                              <Video className="h-5 w-5" />
                            </Button>
                            
                            {/* Test button for Discord-like behavior */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/20"
                              title="Simulate Incoming Message (Test)"
                              onClick={simulateIncomingMessage}
                            >
                              <MessageCircle className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-6">
                          {messages.length > 0 ? (
                            <div className="space-y-4">
                              {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                                  <div className={cn(
                                    "max-w-3/4 px-4 py-2 rounded-lg",
                                    message.isMe ? 
                                      "bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white" : 
                                      "acrylic-light text-gray-100"
                                  )}>
                                    <p>{message.content}</p>
                                    <div className={cn(
                                      "text-xs mt-1",
                                      message.isMe ? "text-blue-200" : "text-gray-400"
                                    )}>
                                      {message.timestamp}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div ref={messagesEndRef} />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/50 to-blue-600/50 rounded-full flex items-center justify-center mb-4 neon-purple-glow animate-pulse-glow">
                                <span className="text-2xl">{friend.name.substring(0, 1).toUpperCase()}</span>
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-1 futuristic-text">{friend.name}</h3>
                              <p className="text-gray-400">This is the beginning of your direct message history with {friend.name}.</p>
                            </div>
                          )}
                        </div>                        <div className="px-4 py-3 border-t border-primary/30 acrylic">
                          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                            <div className="relative">                              <Input
                                className="bg-gray-800/50 border-primary/30 text-white pr-64 py-6 focus:border-primary/50 focus:ring-primary/20"
                                placeholder={`Message @${friend.name}`}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                maxLength={5000}                              />
                              {/* Character counter */}
                              <div className="absolute top-1/2 right-48 transform -translate-y-1/2 text-xs text-gray-500">
                                <span className={cn(
                                  messageInput.length > 4800 ? "text-red-400" : 
                                  messageInput.length > 4500 ? "text-yellow-400" : "text-gray-500"
                                )}>
                                  {messageInput.length}/5000
                                </span>
                              </div>
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-primary hover:bg-primary/20">
                                  <Paperclip className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-400 hover:bg-pink-500/20">
                                  <Gift className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20">
                                  <Smile className="h-5 w-5" />
                                </Button>
                                <Button 
                                  type="submit"
                                  size="icon" 
                                  variant="ghost" 
                                  className={cn(
                                    "text-primary hover:text-primary/80 hover:bg-primary/20",
                                    !messageInput.trim() && "opacity-50 cursor-not-allowed"
                                  )}
                                  disabled={!messageInput.trim()}
                                >
                                  <Send className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full flex items-center justify-center neon-purple-glow animate-pulse-glow">
                            <Users className="h-8 w-8 text-purple-300" />
                          </div>
                          <p className="text-xl font-semibold text-center">Friend not found.</p>                        </div>
                      </div>                    )}
                  </div>
                  <UserFooterBar />
                </div>

                {/* Calling Modal */}
                <Dialog open={isCallingModalOpen} onOpenChange={setIsCallingModalOpen}>
                  <DialogContent className="acrylic-dark border-purple-500/40 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center futuristic-text">
                        {callStatus === "calling" && 
                          <span className="neon-text">{callType === "voice" ? "Voice" : "Video"} Calling {friend?.name}...</span>
                        }
                        {callStatus === "connected" && 
                          <span className="neon-text">{callType === "voice" ? "Voice" : "Video"} Call with {friend?.name}</span>
                        }
                        {callStatus === "ended" && 
                          <span className="neon-text">Call Ended</span>
                        }
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex flex-col items-center justify-center p-6">
                      {callType === "video" && callStatus === "connected" ? (
                        <div className="relative w-full aspect-video bg-gray-900/70 rounded-lg overflow-hidden mb-4 border border-blue-500/30">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-pulse-glow">
                              <Video className="h-16 w-16 text-blue-500/70" />
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800/70 rounded-lg border border-purple-500/40 flex items-center justify-center neon-purple-glow">
                            <Video className="h-8 w-8 text-purple-500/70" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center mb-6 neon-purple-glow animate-pulse-glow">
                          <span className="text-4xl text-white font-semibold futuristic-text">
                            {friend?.name.substring(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}
                        <div className="text-lg mb-6">
                        {callStatus === "calling" && (
                          <div className="flex items-center space-x-2">
                            <span className="animate-pulse">Ringing</span>
                            <span className="inline-flex">
                              <span className="animate-ping delay-0">.</span>
                              <span className="animate-ping delay-150">.</span>
                              <span className="animate-ping delay-300">.</span>
                            </span>
                          </div>
                        )}
                        {callStatus === "connected" && (callType === "voice" ? "Voice call in progress" : "Video call in progress")}
                        {callStatus === "ended" && "Call has ended"}
                      </div>
                      
                      <div className="flex space-x-4">
                        {callStatus !== "ended" && (
                          <Button 
                            variant="destructive" 
                            className="rounded-full h-12 w-12 flex items-center justify-center bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 neon-button border-none"
                            onClick={endCall}
                          >
                            <PhoneCall className="h-6 w-6" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </ChannelProvider>
            </ServerProvider>
          </UserProvider>
        )
      }}
    </AuthCheck>
  )
}