"use client";
import React from "react";
import SettingsPagePanel from "@/components/shell/settings-page-panel";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SettingsPagePanel />
      <main className="flex-1 bg-background/50">{children}</main>
    </div>
  );
}
