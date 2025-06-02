"use client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "@/components/ui/safe-icons";
import { Separator } from "@/components/ui/separator";

export default function MyAccountSettings() {
  const { currentUser, updateProfile } = useAuth();  const [profileData, setProfileData] = useState({
    username: currentUser?.username || "",
    discriminator: currentUser?.discriminator || "0000",
    status: currentUser?.status || "online",
    customStatus: currentUser?.customStatus || "",
    bio: currentUser?.bio || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      // Show toast if needed
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="p-6 bg-background/30 backdrop-blur-sm min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-primary neon-text">My Account</h2>
      <div className="flex flex-col md:flex-row gap-8">        <div className="flex-shrink-0">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-primary/20 neon-glow">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl">
                {profileData.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-primary">Username</Label>
            <Input id="username" name="username" value={profileData.username} onChange={handleChange} className="bg-card/50 border-border text-foreground focus:border-primary/50 focus:ring-primary/20 max-w-md" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userTag" className="text-primary">User Tag</Label>
            <div className="flex items-center gap-2 max-w-md">
              <span className="text-muted-foreground">#</span>
              <Input id="userTag" name="discriminator" value={profileData.discriminator} onChange={handleChange} placeholder="1234" maxLength={4} className="bg-card/50 border-border text-foreground focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <p className="text-xs text-muted-foreground">Your unique 4-digit identifier</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-primary">Status</Label>
            <select id="status" name="status" value={profileData.status} onChange={(e) => setProfileData(prev => ({ ...prev, status: e.target.value as "online" | "idle" | "dnd" | "offline" }))} className="max-w-md bg-card/50 border border-border rounded-md p-2 text-foreground focus:border-primary/50">
              <option value="online">🟢 Active</option>
              <option value="idle">🟡 Idle</option>
              <option value="dnd">🔴 Do Not Disturb</option>
              <option value="offline">⚫ Invisible</option>
            </select>
            <p className="text-xs text-muted-foreground">This appears in your user footer</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customStatus" className="text-primary">Custom Status Message</Label>
            <Input id="customStatus" name="customStatus" value={profileData.customStatus} onChange={handleChange} placeholder="What's happening?" className="bg-card/50 border-border text-foreground focus:border-primary/50 focus:ring-primary/20 max-w-md" />
            <p className="text-xs text-muted-foreground">Optional custom message (shows on hover)</p>
          </div>
          <div className="pt-2">
            <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/80 neon-glow" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2">Saving</span>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <Separator className="my-8 bg-border" />
      <div className="max-w-3xl">
        <h3 className="text-xl font-medium mb-4 text-destructive neon-text">Danger Zone</h3>
        <p className="text-muted-foreground text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <Button variant="destructive" className="bg-destructive hover:bg-destructive/80">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>
    </div>
  );
}
