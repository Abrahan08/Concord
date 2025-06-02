"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, ChevronDown, Settings, MessageCircle, PhoneCall, Inbox, Users, PlusCircle, Video } from "@/components/ui/safe-icons"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipPortal } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Friend } from "@/types"

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

// Mock data for demonstration
const mockFriends: Friend[] = [
  { id: "1", name: "Glitcher", status: "online" },
  { id: "2", name: "Hex Puzzle Adventure", status: "online" },
  { id: "3", name: "Haruto", status: "idle", activity: "Playing Valorant" },
  { id: "4", name: "MSS | Assassin", status: "dnd", activity: "so its being a hectic life" },
  { id: "5", name: "Franz", status: "online", activity: "Playing VALORANT" },
];

export default function DMSidebar() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState("");
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);

  // Load recent conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = localStorage.getItem("recent_conversations");
    if (storedConversations) {
      setRecentConversations(JSON.parse(storedConversations));
    }
  }, []);

  // Function to update recent conversations
  const updateRecentConversation = (friendId: string, lastMessage?: RecentConversation['lastMessage']) => {
    const now = new Date().toISOString();
    setRecentConversations(prev => {
      const filtered = prev.filter(conv => conv.friendId !== friendId);
      const updated = [
        { 
          friendId, 
          lastAccessed: now, 
          lastMessage: lastMessage || prev.find(conv => conv.friendId === friendId)?.lastMessage 
        },
        ...filtered
      ];
      // Keep only the 10 most recent conversations
      const limited = updated.slice(0, 10);
      localStorage.setItem("recent_conversations", JSON.stringify(limited));
      return limited;
    });
  };

  // Get the most recent conversation
  const getMostRecentConversation = (): string | null => {
    if (recentConversations.length === 0) {
      // If no recent conversations, default to first friend
      return mockFriends[0]?.id || null;
    }
    return recentConversations[0].friendId;
  };  const handleFriendClick = (friendId: string) => {
    router.push(`/dm/${friendId}`);
  };
  // Handle Messages button click - redirect to most recent conversation
  const handleMessagesClick = () => {
    const mostRecentFriendId = getMostRecentConversation();
    if (mostRecentFriendId) {
      router.push(`/dm/${mostRecentFriendId}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "idle": return "bg-yellow-500";
      case "dnd": return "bg-destructive";
      default: return "bg-gray-500";
    }
  };

  // Sort friends based on recent conversations
  const sortedFriends = [...mockFriends].sort((a, b) => {
    const aRecent = recentConversations.find(conv => conv.friendId === a.id);
    const bRecent = recentConversations.find(conv => conv.friendId === b.id);
    
    if (aRecent && !bRecent) return -1;
    if (!aRecent && bRecent) return 1;
    if (aRecent && bRecent) {
      return new Date(bRecent.lastAccessed).getTime() - new Date(aRecent.lastAccessed).getTime();
    }
    return 0;
  });

  return (
    <div className="w-[250px] acrylic border-r border-primary/30 flex flex-col">
      <div className="h-12 border-b border-primary/30 flex items-center px-4 shadow-sm">
        <div className="w-full relative">
          <input 
            type="text" 
            placeholder="Find"
            className="w-full bg-gray-800/50 text-sm text-gray-200 py-1 px-2 rounded-md border border-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 placeholder-gray-400"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Search className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-primary" />
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">        <Button 
          variant="ghost" 
          className="flex items-center justify-start text-gray-300 hover:text-white hover:bg-primary/20 rounded-none h-9 px-2 mx-2 my-1"
          onClick={() => router.push('/main')}
        >
          <Users className="w-5 h-5 mr-3 text-secondary" />
          <span className="font-medium">Friends</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center justify-start text-gray-300 hover:text-white hover:bg-primary/20 rounded-none h-9 px-2 mx-2 my-1"
          onClick={handleMessagesClick}
        >
          <MessageCircle className="w-5 h-5 mr-3 text-primary" />
          <span className="font-medium">Messages</span>
        </Button>
        {/*
        <Button 
          variant="ghost" 
          className="flex items-center justify-start text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-none h-9 px-2 mx-2 my-1"
        >
          <PhoneCall className="w-5 h-5 mr-3 text-pink-400" />
          <span className="font-medium">Calls</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex items-center justify-start text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-none h-9 px-2 mx-2 my-1"
        >
          <Inbox className="w-5 h-5 mr-3 text-blue-400" />
          <span className="font-medium">Notifications</span>
        </Button>
        */}
      </div>      <div className="mt-2 px-3">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-2"></div>
        <div className="flex items-center justify-between text-xs text-gray-400 px-1 mb-1">
          <span className="font-semibold tracking-wider neon-text">DIRECT MESSAGES</span>
          <PlusCircle className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
        </div>

        <div className="overflow-y-auto flex-1 py-1">
          {sortedFriends.map((friend) => {
            const recentConv = recentConversations.find(conv => conv.friendId === friend.id);
            return (              <div 
                key={friend.id}
                className="flex items-center p-2 rounded-md cursor-pointer transition-all hover:bg-primary/20 group relative"
                onClick={() => handleFriendClick(friend.id)}
              >
                <div className="relative">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform",
                    friend.status === "online" && "bg-gradient-to-br from-green-500 to-blue-500",
                    friend.status === "idle" && "bg-gradient-to-br from-yellow-500 to-orange-500",
                    friend.status === "dnd" && "bg-gradient-to-br from-red-500 to-pink-500",
                    friend.status === "offline" && "bg-gradient-to-br from-gray-500 to-gray-700"
                  )}>
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.name} className="rounded-full" />
                    ) : (
                      <span>{friend.name.substring(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  <div className={cn(
                    "w-3 h-3 rounded-full absolute right-0 bottom-0 border-2 border-gray-900",
                    getStatusColor(friend.status),
                    friend.status === "online" && "neon-blue-glow scale-90"
                  )}></div>
                </div>
                <div className="ml-2 flex flex-col flex-1 truncate">
                  <span className="text-sm text-gray-200 font-medium">{friend.name}</span>
                  {recentConv?.lastMessage ? (
                    <span className="text-xs text-gray-400 truncate">
                      {recentConv.lastMessage.isMe ? "You: " : ""}{recentConv.lastMessage.content}
                    </span>
                  ) : friend.activity ? (
                    <span className="text-xs text-gray-400 truncate">{friend.activity}</span>
                  ) : null}
                </div>
                
                {/* Call buttons - visible on hover */}
                <div className={cn(
                  "flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  friend.status === "offline" && "pointer-events-none"
                )}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="w-6 h-6 text-gray-400 hover:text-green-400 hover:bg-green-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dm/${friend.id}?call=voice`);
                    }}
                    disabled={friend.status === "offline"}
                  >
                    <PhoneCall className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="w-6 h-6 text-gray-400 hover:text-secondary hover:bg-secondary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dm/${friend.id}?call=video`);
                    }}
                    disabled={friend.status === "offline"}
                  >
                    <Video className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}