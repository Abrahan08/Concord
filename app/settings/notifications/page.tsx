"use client";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSettings() {
  return (
    <div className="p-6 bg-background/30 backdrop-blur-sm min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-primary neon-text">
        Notification Settings
      </h2>
      <div className="max-w-3xl space-y-4">
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">
                Enable Desktop Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new messages
              </p>
            </div>
            <Switch />
          </div>
        </div>
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">Message Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get notified for direct messages
              </p>
            </div>
            <Switch />
          </div>
        </div>
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">Server Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get notified for server events
              </p>
            </div>
            <Switch />
          </div>
        </div>
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">Friend Requests</h3>
              <p className="text-sm text-muted-foreground">
                Get notified when someone sends you a friend request
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
