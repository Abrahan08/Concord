"use client"

import { useState } from "react"
import { Search, UserCheck, Users } from "@/components/ui/safe-icons"
import { User, UserPlus } from "@/components/ui/safe-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type Friend = {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "idle" | "dnd"
  mutualServers?: number
  mutualFriends?: number
  activity?: string
}

// Mock data for demonstration
const mockOnlineFriends: Friend[] = [
  { id: "1", name: "Glitcher", status: "online", mutualServers: 3, mutualFriends: 5 },
  { id: "5", name: "Franz", status: "online", activity: "Playing VALORANT", mutualServers: 1 },
  { id: "6", name: "Blazing Reshad", status: "online", mutualFriends: 2 },
  { id: "7", name: "Oeshik", status: "online", activity: "Playing Honkai: Star Rail", mutualServers: 2 },
  { id: "8", name: "manameme", status: "online" },
];

const mockAllFriends: Friend[] = [
  ...mockOnlineFriends,
  { id: "3", name: "Haruto", status: "idle", activity: "Playing Valorant", mutualServers: 1 },
  { id: "4", name: "MSS | Assassin", status: "dnd", activity: "so its being a hectic life", mutualFriends: 3 },
  { id: "9", name: "21301591_Abdullah", status: "offline", mutualServers: 4, mutualFriends: 1 },
];

const mockPendingFriends: Friend[] = [
  { id: "11", name: "SHAFIN", status: "online", mutualFriends: 1 },
  { id: "12", name: "SHARD CLASH", status: "offline", mutualServers: 2 },
];

export default function FriendsPanel() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("online")
  const [searchInput, setSearchInput] = useState("")
  const [addFriendInput, setAddFriendInput] = useState("")
  
  const handleAddFriend = () => {
    if (addFriendInput.trim() === "") return;
    
    // In a real app, this would make an API call to add a friend
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${addFriendInput}`,
    })
    
    setAddFriendInput("");
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "idle": return "bg-yellow-500";
      case "dnd": return "bg-destructive";
      default: return "bg-gray-500";
    }
  };

  const handleAcceptFriendRequest = (friendId: string, friendName: string) => {
    toast({
      title: "Friend Request Accepted",
      description: `You are now friends with ${friendName}`,
    });
  };

  const handleIgnoreFriendRequest = (friendId: string, friendName: string) => {
    toast({
      title: "Friend Request Ignored",
      description: `Ignored friend request from ${friendName}`,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent h-full">      <div className="border-b border-primary/30 p-4 acrylic">
        <h2 className="text-xl font-semibold text-white flex items-center mb-4 futuristic-text tracking-wide">
          <Users className="mr-2 h-5 w-5 text-primary" /> <span className="neon-text">Friends</span>
        </h2>
        
        <div className="flex space-x-2">
          <Tabs defaultValue="online" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800/50 p-1 border border-primary/20">
              <TabsTrigger 
                value="online" 
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary/80 data-[state=active]:to-primary/80 data-[state=active]:text-white transition-all duration-300`}
              >
                Online
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary/80 data-[state=active]:to-primary/80 data-[state=active]:text-white transition-all duration-300"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/80 data-[state=active]:to-primary/80 data-[state=active]:text-white transition-all duration-300"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/80 data-[state=active]:to-secondary/80 data-[state=active]:text-white transition-all duration-300"
              >
                Add Friend
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 acrylic-light">        {activeTab !== "add" && (
          <div className="mb-4 relative">
            <Input 
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800/50 border-primary/20 text-white pl-10 focus:border-primary/40 focus:ring-primary/20"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          </div>
        )}
        
        {activeTab === "online" && (          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2 neon-text tracking-wider">Online — {mockOnlineFriends.length}</div>
              <div className="h-px flex-1 mx-2 bg-gradient-to-r from-secondary/30 to-transparent"></div>
            </div>
            {mockOnlineFriends.map((friend) => (
              <FriendItem key={friend.id} friend={friend} />
            ))}
          </div>
        )}
        
        {activeTab === "all" && (          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2 neon-text tracking-wider">All Friends — {mockAllFriends.length}</div>
              <div className="h-px flex-1 mx-2 bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>
            {mockAllFriends.map((friend) => (
              <FriendItem key={friend.id} friend={friend} />
            ))}
          </div>
        )}
        
        {activeTab === "pending" && (          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2 neon-text tracking-wider">Pending — {mockPendingFriends.length}</div>
              <div className="h-px flex-1 mx-2 bg-gradient-to-r from-accent/30 to-transparent"></div>
            </div>            {mockPendingFriends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-primary/20 rounded-md transition-colors border border-primary/10">
                <div className="flex items-center">
                  <div className="relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white",
                      friend.status === "online" ? "from-green-500 to-secondary" : "from-gray-600 to-gray-700"
                    )}>
                      {friend.avatar ? (
                        <img src={friend.avatar} alt={friend.name} className="rounded-full" />
                      ) : (
                        <span>{friend.name.substring(0, 1).toUpperCase()}</span>
                      )}
                    </div>
                    <div className={cn(
                      "w-3 h-3 rounded-full absolute right-0 bottom-0 border-2 border-gray-800",
                      getStatusColor(friend.status),
                      friend.status === "online" && "neon-glow scale-90"
                    )}></div>
                  </div>
                  <div className="ml-2">
                    <div className="text-white font-medium">{friend.name}</div>
                    <div className="text-xs text-gray-400">
                      {friend.mutualFriends && friend.mutualFriends > 0 && `${friend.mutualFriends} mutual friends`}
                      {friend.mutualFriends && friend.mutualFriends > 0 && friend.mutualServers && friend.mutualServers > 0 && ' • '}
                      {friend.mutualServers && friend.mutualServers > 0 && `${friend.mutualServers} mutual servers`}
                      {!friend.mutualFriends && !friend.mutualServers && "Incoming Friend Request"}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                    onClick={() => handleAcceptFriendRequest(friend.id, friend.name)}
                  >
                    Accept
                  </Button>                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-500/30 text-red-400 hover:bg-destructive/20 hover:text-red-300"
                    onClick={() => handleIgnoreFriendRequest(friend.id, friend.name)}
                  >
                    Ignore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
          {activeTab === "add" && (
          <div>
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-6 rounded-lg border border-secondary/20 mb-6">
              <p className="text-center text-gray-400 mb-4">You can add a friend with their Concord Username.</p>
              <div className="flex items-center mb-4">
                <div className="flex-1 relative">
                  <Input 
                    type="text"
                    placeholder="Enter a username"
                    className="w-full bg-gray-800/60 border-secondary/20 text-white pr-10 focus:border-secondary/50 focus:ring-secondary/20"
                    value={addFriendInput}
                    onChange={(e) => setAddFriendInput(e.target.value)}
                  />
                </div>
                <Button 
                  className="ml-2 bg-gradient-to-r from-secondary to-primary hover:from-secondary/80 hover:to-primary/80 neon-button"
                  onClick={handleAddFriend}
                >
                  Send Friend Request
                </Button>
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 mt-6 border border-primary/20">
              <div className="font-semibold mb-1 text-white futuristic-text">PROTIP:</div>
              <div className="text-sm text-gray-400">
                If your friend is already using Concord, you can add them by entering their username. The username is case sensitive!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FriendItem({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-primary/20 rounded-md transition-colors group border border-primary/10">
      <div className="flex items-center">
        <div className="relative">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform",
            friend.status === "online" && "bg-gradient-to-br from-green-500 to-secondary",
            friend.status === "idle" && "bg-gradient-to-br from-yellow-500 to-orange-500",
            friend.status === "dnd" && "bg-gradient-to-br from-destructive to-accent",
            friend.status === "offline" && "bg-gradient-to-br from-gray-500 to-gray-700"
          )}>
            {friend.avatar ? (
              <img src={friend.avatar} alt={friend.name} className="rounded-full" />
            ) : (
              <span>{friend.name.substring(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div className={cn(
            "w-3 h-3 rounded-full absolute right-0 bottom-0 border-2 border-gray-800",
            getStatusColor(friend.status),
            friend.status === "online" && "neon-glow scale-90"
          )}></div>
        </div>
        <div className="ml-2">
          <div className="text-white font-medium">{friend.name}</div>
          <div className="text-xs text-gray-400">
            {friend.activity ? friend.activity : friend.status === "online" ? "Online" : friend.status}
          </div>
        </div>
      </div>
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/20 hover:text-white" title="Message">
          <MessageIcon className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" className="text-secondary hover:bg-secondary/20 hover:text-white" title="More">
          <MoreIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function MoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="19" cy="12" r="1"></circle>
      <circle cx="5" cy="12" r="1"></circle>
    </svg>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "online": return "bg-green-500";
    case "idle": return "bg-yellow-500";
    case "dnd": return "bg-destructive";
    default: return "bg-gray-500";
  }
}