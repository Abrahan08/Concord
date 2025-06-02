// Test script to verify Discord-like recent conversation tracking
// This script can be run in the browser console to test the functionality

// Helper function to add test recent conversations (Discord-like behavior)
function addTestRecentConversations() {
  const testConversations = [
    {
      friendId: "2",
      lastAccessed: new Date().toISOString(), // Most recent - Hex Puzzle Adventure
      lastMessage: {
        content: "Just solved the hardest puzzle yet! 🧩",
        timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    },
    {
      friendId: "1", 
      lastAccessed: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago - Glitcher
      lastMessage: {
        content: "The new features look amazing!",
        timestamp: "Today at " + new Date(Date.now() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    },
    {
      friendId: "5",
      lastAccessed: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago - Franz
      lastMessage: {
        content: "GG! That was a great match",
        timestamp: "Today at " + new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }
    },
    {
      friendId: "3",
      lastAccessed: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago - Haruto
      lastMessage: {
        content: "Want to queue up for ranked?",
        timestamp: "Today at " + new Date(Date.now() - 600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    }
  ];
  
  localStorage.setItem("recent_conversations", JSON.stringify(testConversations));
  console.log("Discord-like test conversations added:", testConversations);
  console.log("Order: Hex Puzzle Adventure → Glitcher → Franz → Haruto");
  
  // Refresh the page to see the changes
  window.location.reload();
}

// Simulate sending a message to move a conversation to top
function simulateMessage(friendId, content, isMe = true) {
  const conversations = JSON.parse(localStorage.getItem("recent_conversations") || "[]");
  
  // Remove existing conversation with this friend
  const filtered = conversations.filter(conv => conv.friendId !== friendId);
  
  // Add conversation to top with new message
  const newConversation = {
    friendId,
    lastAccessed: new Date().toISOString(),
    lastMessage: {
      content,
      timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe
    }
  };
  
  const updated = [newConversation, ...filtered].slice(0, 10);
  localStorage.setItem("recent_conversations", JSON.stringify(updated));
  
  console.log(`Simulated ${isMe ? 'sent' : 'received'} message from friend ${friendId}:`, content);
  console.log("Conversation moved to top!");
  
  window.location.reload();
}

// Test the Discord-like behavior with different scenarios
function testDiscordBehavior() {
  console.log("Testing Discord-like DM behavior...");
  console.log("1. Setting up initial conversations");
  addTestRecentConversations();
  
  setTimeout(() => {
    console.log("2. Simulating message from Haruto (should move to top)");
    simulateMessage("3", "Hey, ready for that game?", false);
  }, 2000);
}

// Helper function to clear recent conversations
function clearRecentConversations() {
  localStorage.removeItem("recent_conversations");
  console.log("Recent conversations cleared");
  window.location.reload();
}

// Helper function to view current recent conversations
function viewRecentConversations() {
  const conversations = localStorage.getItem("recent_conversations");
  if (conversations) {
    const parsed = JSON.parse(conversations);
    console.log("Current recent conversations (Discord-like order):");
    parsed.forEach((conv, index) => {
      const friendNames = {
        "1": "Glitcher",
        "2": "Hex Puzzle Adventure", 
        "3": "Haruto",
        "4": "MSS | Assassin",
        "5": "Franz"
      };
      console.log(`${index + 1}. ${friendNames[conv.friendId]} - "${conv.lastMessage?.content}" (${conv.lastMessage?.isMe ? 'You' : 'Them'})`);
    });
  } else {
    console.log("No recent conversations found");
  }
}

console.log("Discord-like conversation test functions loaded:");
console.log("- addTestRecentConversations() - Add test data with realistic order");
console.log("- simulateMessage(friendId, content, isMe) - Simulate message to move conversation to top");
console.log("- testDiscordBehavior() - Run full Discord behavior test");
console.log("- clearRecentConversations() - Clear all data");
console.log("- viewRecentConversations() - View current data in order");
