"use client"

import type React from "react"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { ServerContext } from "@/context/server-context"
import { PlusCircle, MessageCircle, Volume2, Monitor, Users } from "@/components/ui/safe-icons"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CreateGuildModal from "@/components/modals/create-guild-modal"
import JoinGuildModal from "@/components/modals/join-guild-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for voice/screen share users - replace with real data
const mockVoiceUsers = [
	{ id: "1", username: "Alice", avatar: "/placeholder-user.jpg", isScreenSharing: false },
	{ id: "2", username: "Bob", avatar: "/placeholder-user.jpg", isScreenSharing: true },
	{ id: "3", username: "Charlie", avatar: "/placeholder-user.jpg", isScreenSharing: false },
]

export default function GuildSidebar() {
	const router = useRouter()
	const { servers, currentServerId, setCurrentServerId } = useContext(ServerContext)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
	const [hoveredServerId, setHoveredServerId] = useState<string | null>(null)
	const handleGuildClick = (serverId: string) => {
		setCurrentServerId(serverId)
		router.push(`/guild/${serverId}`)
	}

	const handleDirectMessages = () => {
		setCurrentServerId("") // Clear current server selection
		router.push("/main")
	}

	const handleCreateGuild = () => {
		setIsCreateModalOpen(true)
	}

	return (
		<>
			<div className="w-[72px] acrylic-dark border-r border-purple-900/30 flex flex-col items-center py-4 overflow-y-auto z-30 relative">
				<TooltipProvider delayDuration={300}>
					{/* Concord Logo - Direct Messages */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className="relative"
								onMouseEnter={() => setHoveredServerId("dm")}
								onMouseLeave={() => setHoveredServerId(null)}
							>
								<button
									className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 flex items-center justify-center mb-4 text-white neon-purple-glow transition-all transform hover:scale-105 animate-float hover:rounded-2xl"
									onClick={handleDirectMessages}
								>
									{/* Concord Logo - Circular C */}
									<div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
										<span className="text-sm font-bold futuristic-text">C</span>
									</div>
								</button>

							</div>
						</TooltipTrigger>
						<TooltipContent
							side="right"
							className="acrylic-light border border-purple-500/50 p-3 ml-2"
							sideOffset={8}
						>
							<div className="flex items-center space-x-2">
								<MessageCircle className="h-4 w-4 text-purple-400" />
								<p className="text-white font-medium">Direct Messages</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-2"></div>

				{/* Server Icons */}
				{servers.map((server) => (
					<TooltipProvider key={server.id} delayDuration={300}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									className="relative"
									onMouseEnter={() => setHoveredServerId(server.id)}
									onMouseLeave={() => setHoveredServerId(null)}
								>
									<button
										className={cn(
											"w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all transform hover:scale-105 hover:rounded-2xl",
											currentServerId === server.id
												? "bg-gradient-to-br from-purple-600 to-pink-500 text-white"
												: "bg-gray-800/80 hover:bg-gray-700/80 text-gray-200",
										)}
										onClick={() => handleGuildClick(server.id)}
									>
										{server.icon ? (
											<img
												src={server.icon}
												alt={server.name}
												className="w-full h-full rounded-full object-cover"
											/>
										) : (
											<span
												className={cn(
													"text-lg font-semibold",
													currentServerId === server.id ? "text-white" : "text-gray-200"
												)}
											>
												{server.name.substring(0, 2).toUpperCase()}
											</span>
										)}
									</button>

									{/* Active server indicator */}
									{currentServerId === server.id && (
										<div className="absolute left-0 top-[40%] transform -translate-y-1/2 w-1 h-7 bg-white rounded-r-full"></div>
									)}

									{/* Hover indicator */}
									{hoveredServerId === server.id && currentServerId !== server.id && (
										<div className="absolute right-0 top-[40%] transform -translate-y-1/2 w-1 h-4 bg-white rounded-l-full"></div>
									)}
								</div>
							</TooltipTrigger>
							<TooltipContent
								side="right"
								className="acrylic-light border border-purple-500/50 p-4 ml-2 min-w-[200px]"
								sideOffset={8}
							>
								<div className="space-y-3">
									{/* Server Name */}
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-400 rounded-full"></div>
										<p className="text-white font-semibold">{server.name}</p>
									</div>

									{/* Voice Chat Section */}
									{mockVoiceUsers.length > 0 && (
										<div className="space-y-2">
											<div className="flex items-center space-x-2 text-gray-300">
												<Volume2 className="h-4 w-4 text-green-400" />
												<span className="text-sm">Voice Chat ({mockVoiceUsers.length})</span>
											</div>

											<div className="flex flex-wrap gap-1">
												{mockVoiceUsers.slice(0, 6).map((user) => (
													<div key={user.id} className="relative">
														<Avatar className="w-6 h-6">
															<AvatarImage src={user.avatar} alt={user.username} />
															<AvatarFallback className="text-xs bg-gray-600">
																{user.username.substring(0, 1).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														{user.isScreenSharing && (
															<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
																<Monitor className="h-2 w-2 text-white" />
															</div>
														)}
													</div>
												))}
												{mockVoiceUsers.length > 6 && (
													<div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
														<span className="text-xs text-white">+{mockVoiceUsers.length - 6}</span>
													</div>
												)}
											</div>

											{/* Screen Share Indicator */}
											{mockVoiceUsers.some((user) => user.isScreenSharing) && (
												<div className="flex items-center space-x-2 text-red-400">
													<Monitor className="h-4 w-4" />
													<span className="text-sm">
														{mockVoiceUsers.filter((user) => user.isScreenSharing).length} sharing screen
													</span>
												</div>
											)}
										</div>
									)}

									{/* Member Count */}
									<div className="flex items-center space-x-2 text-gray-400">
										<Users className="h-4 w-4" />
										<span className="text-sm">Members</span>
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}

				{/* Add Server Button */}
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className="relative"
								onMouseEnter={() => setHoveredServerId("add")}
								onMouseLeave={() => setHoveredServerId(null)}
							>
								<button
									className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 flex items-center justify-center mt-2 text-white neon-blue-glow transition-all transform hover:scale-105 hover:rounded-2xl"
									onClick={handleCreateGuild}
								>
									<PlusCircle className="w-6 h-6" />
								</button>
								{/* Hover indicator */}
								{hoveredServerId === "add" && (
									<div className="absolute right-0 top-[60%] transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent
							side="right"
							className="acrylic-light border border-blue-500/50 p-3 ml-2"
							sideOffset={8}
						>
							<div className="flex items-center space-x-2">
								<PlusCircle className="h-4 w-4 text-blue-400" />
								<p className="text-white font-medium">Create Server</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<CreateGuildModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
			<JoinGuildModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
		</>
	)
}