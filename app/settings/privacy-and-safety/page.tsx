"use client";
import { Switch } from "@/components/ui/switch";

export default function PrivacyAndSafetySettings() {
  return (
    <div className="bg-background/30 backdrop-blur-sm min-h-screen p-6">
      <h2 className="text-2xl font-semibold mb-6 text-primary neon-text">
        Privacy & Safety
      </h2>
      <div className="max-w-3xl space-y-4">
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-medium text-primary neon-text">
                Who can add you as a friend
              </h3>
              <p className="text-sm text-muted-foreground">
                Control who can send you friend requests
              </p>
            </div>
            <select className="sm:w-1/3 bg-card/50 border border-border rounded-md p-2 text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
              <option>Everyone</option>
              <option>Friends of Friends</option>
              <option>Server Members</option>
              <option>Nobody</option>
            </select>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary neon-text">Allow direct messages</h3>
              <p className="text-sm text-muted-foreground">
                Allow users to message you directly
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary neon-text">Show online status</h3>
              <p className="text-sm text-muted-foreground">Let others see when you're online</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary neon-text">Activity Status</h3>
              <p className="text-sm text-muted-foreground">Show what you're currently doing</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
