"use client"

import { redirect } from "next/navigation"

export default function GuildSettingsPage() {
  // Redirect to the general settings tab by default
  redirect("./settings/general")
}
