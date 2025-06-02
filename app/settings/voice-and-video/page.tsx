"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mic, Volume2, Monitor } from "@/components/ui/safe-icons";

export default function VoiceAndVideoSettings() {
  // Example state for hardware acceleration (could be expanded for real settings)
  const [hardwareAccel, setHardwareAccel] = useState(true);
  return (
    <div className="p-6 m-0 bg-background/30 backdrop-blur-sm min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-primary neon-text">
        Voice & Video Settings
      </h2>

      <div className="max-w-3xl space-y-6">
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <h3 className="font-medium text-primary mb-4">Input Device</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <Label htmlFor="input-device" className="text-foreground">
                Microphone
              </Label>
              <div className="sm:w-1/2">
                <select
                  id="input-device"
                  className="w-full bg-card/50 border border-border rounded-md p-2 text-foreground focus:border-primary/50"
                >
                  <option>Default Microphone</option>
                  <option>Built-in Microphone</option>
                  <option>Headset Microphone</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Input Volume</h4>
              <div className="flex items-center space-x-4">
                <Mic className="h-5 w-5 text-primary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4 neon-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <h3 className="font-medium text-primary mb-4">Output Device</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <Label htmlFor="output-device" className="text-foreground">
                Speaker
              </Label>
              <div className="sm:w-1/2">
                <select
                  id="output-device"
                  className="w-full bg-card/50 border border-border rounded-md p-2 text-foreground focus:border-primary/50"
                >
                  <option>Default Speaker</option>
                  <option>Built-in Speaker</option>
                  <option>Headphones</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Output Volume</h4>
              <div className="flex items-center space-x-4">
                <Volume2 className="h-5 w-5 text-primary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-4/5 neon-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border">
          <h3 className="font-medium text-primary mb-4">Video Settings</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <Label htmlFor="camera-device" className="text-foreground">
                Camera
              </Label>
              <div className="sm:w-1/2">
                <select
                  id="camera-device"
                  className="w-full bg-card/50 border border-border rounded-md p-2 text-foreground focus:border-primary/50"
                >
                  <option>Default Camera</option>
                  <option>Built-in Camera</option>
                  <option>External Webcam</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Enable Hardware Acceleration</h4>
                <p className="text-sm text-muted-foreground">
                  Improves video performance but uses more resources
                </p>
              </div>
              <Switch
                checked={hardwareAccel}
                onCheckedChange={setHardwareAccel}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2 text-foreground">Screen Share Quality</h4>
              <div className="flex items-center space-x-4">
                <Monitor className="h-5 w-5 text-primary" />
                <select className="flex-1 bg-card/50 border border-border rounded-md p-2 text-foreground focus:border-primary/50">
                  <option>720p (HD)</option>
                  <option>1080p (Full HD)</option>
                  <option>1440p (QHD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
