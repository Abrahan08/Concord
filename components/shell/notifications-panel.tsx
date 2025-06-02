"use client"

import { X, UserPlus, MessageSquare, PhoneCall } from "@/components/ui/safe-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const notifications = [
    {
      id: 1,
      type: "friend",
      title: "Alex is now online",
      description: "Your friend is now available",
      time: "2 minutes ago",
      icon: <UserPlus className="w-5 h-5 text-primary" />,
    },
    {
      id: 2,
      type: "message",
      title: "New message from Sarah",
      description: "Hey, are you free to chat?",
      time: "10 minutes ago",
      icon: <MessageSquare className="w-5 h-5 text-primary" />,
    },
    {
      id: 3,
      type: "call",
      title: "Missed call from Dev Team",
      description: "You missed a group call",
      time: "1 hour ago",
      icon: <PhoneCall className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <div
      className={cn(
        "w-[300px] bg-card/95 backdrop-blur-sm border-l border-border flex flex-col transition-all duration-300 ease-in-out z-50 absolute right-0 h-[955px]",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/50">
        <h2 className="font-semibold text-foreground">Notifications</h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors duration-200" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recent</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/90">
            Mark all as read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-card hover:bg-accent transition-colors duration-200 rounded-md p-3 border border-border/50">
              <div className="flex items-start">
                <div className="bg-muted rounded-md p-2 mr-3">{notification.icon}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2">{notification.time}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
