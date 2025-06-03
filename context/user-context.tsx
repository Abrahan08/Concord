"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { User } from "@/types"

interface UserContextType {
  users: User[]
  currentUser: User | null
}

export const UserContext = createContext<UserContextType>({
  users: [],
  currentUser: null,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const { currentUser: authUser } = useAuth()
  // Mock data
  const mockUsers: User[] = [
    {
      id: "mock_1",
      username: "verdant_user",
      discriminator: "0001",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Welcome to Verdant!",
      status: "online",
    },
    {
      id: "mock_2",
      username: "alex",
      discriminator: "1234",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Always ready for an adventure",
      status: "online",
    },
    {
      id: "mock_3",
      username: "sarah",
      discriminator: "5678",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Coffee lover and coder",
      status: "idle",
    },
    {
      id: "mock_4",
      username: "michael",
      discriminator: "9012",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Gaming enthusiast",
      status: "dnd",
    },
  ]

  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0])
  // Update current user when auth changes
  useEffect(() => {
    if (authUser) {
      const userExists = users.some((user) => user.id === authUser.id)

      if (!userExists) {
        // Add the auth user to the users list if not already there
        setUsers((prev) => [
          ...prev,
          {
            id: authUser.id,
            username: authUser.username,
            discriminator: authUser.discriminator,
            avatar: authUser.avatar,
            bio: authUser.bio,
            status: authUser.status || "online",
          },
        ])
      } else {
        // Update existing user in the users array with latest auth data
        setUsers((prev) => prev.map((user) => 
          user.id === authUser.id 
            ? {
                ...user,
                username: authUser.username,
                discriminator: authUser.discriminator,
                avatar: authUser.avatar,
                bio: authUser.bio,
                status: authUser.status || "online",
              }
            : user
        ))
      }

      // Set the current user
      setCurrentUser({
        id: authUser.id,
        username: authUser.username,
        discriminator: authUser.discriminator,
        avatar: authUser.avatar,
        bio: authUser.bio,
        status: authUser.status || "online",
      })
    } else {
      // Fallback to the first mock user if not authenticated
      setCurrentUser(mockUsers[0])
    }
  }, [authUser])

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
