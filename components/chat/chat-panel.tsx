"use client"

import type React from "react"

import { useState, useRef, useEffect, useContext } from "react"
import { UserContext } from "@/context/user-context"
import { ChannelContext } from "@/context/channel-context"
import { PlusCircle, AtSign, Smile, Send } from "@/components/ui/safe-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "@/lib/date"

export default function ChatPanel() {
  const { currentUser } = useContext(UserContext)
  const { currentChannel, messages, sendMessage } = useContext(ChannelContext)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageText.trim() && currentUser && currentChannel) {
      sendMessage({
        id: Date.now().toString(),
        channelId: currentChannel.id,
        userId: currentUser.id,
        content: messageText,
        timestamp: new Date().toISOString(),
      })
      setMessageText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  if (!currentChannel) return null

  const channelMessages = messages.filter((message) => message.channelId === currentChannel.id)

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {channelMessages.map((message) => (            <div key={message.id} className="flex items-start group">
              <Avatar className="h-10 w-10 mr-3 mt-0.5">
                {message.user?.avatar && 
                 !message.user.avatar.includes('placeholder') && 
                 !message.user.avatar.includes('height=') && 
                 !message.user.avatar.includes('width=') && (
                  <AvatarImage
                    src={message.user.avatar}
                    alt={message.user?.username || "User"}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {message.user?.username.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline">
                  <h4 className="font-medium text-foreground mr-2">{message.user?.username || "Unknown User"}</h4>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(message.timestamp))}</span>
                </div>
                <div className="mt-1 text-foreground whitespace-pre-wrap break-words">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>      <div className="p-4 border-t border-border">        <form onSubmit={handleSendMessage} className="flex items-end">
          <div className="flex-1 bg-muted/50 rounded-md border border-primary/30 focus-within:border-primary/50">            <div className="flex items-center px-2 py-1 border-b border-primary/20">
              <button className="text-muted-foreground hover:text-foreground mr-2">
                <PlusCircle className="w-4 h-4" />
              </button>
            </div><div className="p-0">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${currentChannel.name}`}
                maxLength={5000}
                className="min-h-[20px] max-h-[60px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-foreground placeholder:text-muted-foreground px-2 py-1"
              />
              {/* Character counter */}
              <div className="px-2 pb-0 flex justify-end">
                <span className={cn(
                  "text-xs",
                  messageText.length > 4800 ? "text-destructive" : 
                  messageText.length > 4500 ? "text-yellow-400" : "text-muted-foreground"
                )}>
                  {messageText.length}/5000
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center space-x-2">
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <AtSign className="w-4 h-4" />
                </button>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <Smile className="w-4 h-4" />
                </button>
              </div>              <Button
                type="submit"
                size="sm"
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  !messageText.trim() && "opacity-50 cursor-not-allowed",
                )}
                disabled={!messageText.trim()}
              >
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
