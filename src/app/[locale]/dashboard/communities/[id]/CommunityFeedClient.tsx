"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Image as ImageIcon } from "lucide-react";
import { createCommunityPost, sendCommunityChat, getCommunityChats } from "@/actions/communities/post";
import { toast } from "sonner";
import "@/styles/designTokens.css";

export default function CommunityFeedClient({ 
  community,
  initialPosts,
  memberProfileId,
  authorType
}: {
  community: any;
  initialPosts: any[];
  memberProfileId: string;
  authorType: "MEMBER" | "ADMIN";
}) {
  const [activeTab, setActiveTab] = useState<"POSTS" | "CHAT">("POSTS");
  const [posts, setPosts] = useState(initialPosts);
  const [postContent, setPostContent] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple polling for chats when in CHAT tab
  useEffect(() => {
    let interval: any;
    if (activeTab === "CHAT") {
      fetchChats();
      interval = setInterval(fetchChats, 3000); // poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  async function fetchChats() {
    try {
      const data = await getCommunityChats(community.id);
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!postContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await createCommunityPost(community.id, postContent, []);
      if (res.success) {
        setPosts([res.post, ...posts]);
        setPostContent("");
        toast.success("Post created!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await sendCommunityChat(community.id, chatMessage);
      if (res.success) {
        setChats([...chats, res.chat]);
        setChatMessage("");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("POSTS")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === "POSTS" ? "text-primary" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
        >
          Community Posts
          {activeTab === "POSTS" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("CHAT")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === "CHAT" ? "text-primary" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
        >
          Live Chat
          {activeTab === "CHAT" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      {activeTab === "POSTS" ? (
        <div className="space-y-6 animate-fade-in">
          {/* Create Post */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-glass border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleCreatePost}>
              <textarea
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                placeholder="Share something with the community..."
                className="w-full bg-transparent border-none resize-none focus:ring-0 p-2 text-slate-900 dark:text-white placeholder:text-slate-400"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="p-2 text-slate-400 hover:text-primary transition rounded-lg hover:bg-primary/10">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !postContent.trim()}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover-lift transition disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                    {post.authorType === "ADMIN" ? "A" : "M"}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {post.authorType === "ADMIN" ? "Community Admin" : "Member"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{post.content}</p>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No posts yet. Be the first to post!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-glass border border-slate-200 dark:border-slate-800 h-[600px] flex flex-col animate-fade-in">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chats.map(chat => {
              const isMine = chat.authorId === memberProfileId;
              return (
                <div key={chat.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                  }`}>
                    <p className="text-sm">{chat.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            {chats.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 rounded-b-xl">
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                disabled={isSubmitting || !chatMessage.trim()}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 hover-lift transition"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
