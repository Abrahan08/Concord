"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { User } from "@/types"

interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("verdant_user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock login - in a real app, this would validate with a backend
    if (email && password) {
      const user: User = {
        id: "1",
        username: email.split("@")[0],
        discriminator: "0001",
        email: email,
        avatar: "/placeholder.svg?height=200&width=200",
        status: "online",
      }
      setCurrentUser(user)
      localStorage.setItem("verdant_user", JSON.stringify(user))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock signup - in a real app, this would create a user in the backend
    if (username && email && password) {
      const user: User = {
        id: Date.now().toString(),
        username,
        discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
        email,
        avatar: "/placeholder.svg?height=200&width=200",
        status: "online",
      }
      // In a real app, we would not log in the user immediately after signup
      // but for this demo, we'll store the user data
      localStorage.setItem("verdant_user", JSON.stringify(user))
    } else {
      throw new Error("Invalid user data")
    }
  }

  const logout = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Clear user data
    setCurrentUser(null)
    localStorage.removeItem("verdant_user")
  }

  const updateProfile = async (userData: Partial<User>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      setCurrentUser(updatedUser)
      localStorage.setItem("verdant_user", JSON.stringify(updatedUser))
    } else {
      throw new Error("No user logged in")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
