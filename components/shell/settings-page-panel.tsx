"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "@/components/ui/safe-icons";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface SettingsPagePanelProps {
  className?: string;
}

export default function SettingsPagePanel({ className }: SettingsPagePanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const settingsItems = [
    { path: "/settings/my-account", label: "My Account" },
    { path: "/settings/profile", label: "Profile" },
    { path: "/settings/notifications", label: "Notifications" },
    { path: "/settings/appearance", label: "Appearance" },
    { path: "/settings/voice-and-video", label: "Voice & Video" },
    { path: "/settings/privacy-and-safety", label: "Privacy & Safety" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleBack = () => {
    router.push("/main");
  };
  return (
    <div className={cn("w-[322px] bg-card/95 backdrop-blur-xl border-r border-primary/20 flex flex-col h-full min-h-screen", className)}>
      {/* Top Back Button */}
      <div className="p-4 border-b border-primary/20">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Settings Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-primary neon-text">Settings</h1>
        </div>
        <nav className="space-y-1">
          {settingsItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                pathname === item.path
                  ? "bg-primary/20 text-primary border-l-2 border-primary neon-glow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-primary/20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
