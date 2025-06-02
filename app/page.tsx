'use client'
import { redirect } from "next/navigation"
import AuthCheck from "@/components/auth/auth-check"

export default function Home() {
  return (
    <AuthCheck>
      {(isAuthenticated) => {
        if (!isAuthenticated) {
          redirect("/login")
          return null;
        } else {
          redirect("/main")
          return null;
        }
      }}
    </AuthCheck>
  )
}
