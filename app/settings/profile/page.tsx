"use client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSettings() {
  const { currentUser } = useAuth();  const [profileData, setProfileData] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
  });return (
    <div className="p-6 bg-background/30 backdrop-blur-sm min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-primary neon-text">Profile</h2>
      <p className="text-muted-foreground mb-6">This is how others see you on Concord. You can customize your profile information here.</p>
      <div className="max-w-3xl bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-border">
        <h3 className="text-lg font-medium mb-4 text-primary">Profile Preview</h3>        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Avatar className="h-16 w-16 border-2 border-primary/30 neon-glow">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              {profileData.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-semibold text-foreground">{profileData.username}</div>
            <div className="text-sm text-muted-foreground">Online</div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-primary">Custom Status</Label>
            <Input placeholder="What's happening?" className="bg-card/50 border-border text-foreground focus:border-primary/50 focus:ring-primary/20 mt-1" />
          </div>
          <div>
            <Label className="text-primary">About Me</Label>
            <textarea 
              rows={3} 
              placeholder="Tell others about yourself" 
              className="w-full bg-card/50 border border-border text-foreground rounded-md p-2 focus:border-primary/50 focus:ring-primary/20 mt-1 resize-none" 
              defaultValue={profileData.bio}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
