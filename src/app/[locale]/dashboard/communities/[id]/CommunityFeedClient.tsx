"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Hash, Users, Send, Settings, Search, Bell, Pin, 
  HelpCircle, Inbox, Smile, PlusCircle, User, ArrowLeft 
} from "lucide-react";
import { createCommunityPost, sendCommunityChat, getCommunityChats } from "@/actions/communities/post";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [activeChannel, setActiveChannel] = useState<"chat" | "posts">("chat");
  const [posts, setPosts] = useState(initialPosts);
  const [postContent, setPostContent] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chats]);

  // Polling for chats
  useEffect(() => {
    let interval: any;
    fetchChats(); // Fetch immediately on mount
    interval = setInterval(fetchChats, 10000); 
    return () => clearInterval(interval);
  }, []);

  async function fetchChats() {
    try {
      const data = await getCommunityChats(community.id);
      setChats(data);
    } catch (err) {
      console.error(err);
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

  // Format date like Discord (Today at 10:23 AM or 11/02/2026)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString() + ` ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR - Channels */}
      <div className="w-60 bg-white dark:bg-slate-950 flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800">
        {/* Community Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors relative group">
          <Link href="/dashboard/communities" className="absolute left-2 text-slate-400 hover:text-slate-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
             <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-extrabold text-slate-900 dark:text-white truncate ml-4 group-hover:ml-6 transition-all">{community.name}</h1>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 px-2 mb-2 hover:text-slate-900 dark:hover:text-white cursor-pointer uppercase">
            Channels
          </div>
          
          <button 
            onClick={() => setActiveChannel("chat")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl group transition-all duration-200 ${
              activeChannel === "chat" 
                ? "bg-primary/10 text-primary dark:text-primary" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Hash className={`w-5 h-5 ${activeChannel === "chat" ? "text-primary" : "text-slate-400"}`} />
            <span className="font-semibold">general-chat</span>
          </button>
          
          <button 
            onClick={() => setActiveChannel("posts")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl group transition-all duration-200 ${
              activeChannel === "posts" 
                ? "bg-primary/10 text-primary dark:text-primary" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Hash className={`w-5 h-5 ${activeChannel === "posts" ? "text-primary" : "text-slate-400"}`} />
            <span className="font-semibold">announcements</span>
          </button>
        </div>

        {/* User Info Area (Bottom Left) */}
        <div className="h-16 bg-slate-50 dark:bg-slate-900 flex items-center px-3 shrink-0 border-t border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white relative shadow-sm">
            {authorType === "ADMIN" ? "A" : "M"}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">You</span>
            <span className="text-xs text-green-600 dark:text-green-500 font-semibold leading-tight mt-0.5">Online</span>
          </div>
          <div className="ml-auto flex gap-1 text-slate-400">
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        
        {/* Top Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 shrink-0 justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Hash className="w-6 h-6 text-slate-400" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {activeChannel === "chat" ? "general-chat" : "announcements"}
            </h2>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              {activeChannel === "chat" ? "Welcome to the community chat!" : "Important updates and posts."}
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
            <button className="p-2 hover:text-primary hover:bg-primary/5 rounded-xl hidden sm:block transition-colors"><Pin className="w-5 h-5" /></button>
            <button className="p-2 hover:text-primary hover:bg-primary/5 rounded-xl hidden sm:block transition-colors"><Bell className="w-5 h-5" /></button>
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className={`p-2 rounded-xl transition-colors ${showMembers ? 'text-primary bg-primary/10' : 'hover:text-primary hover:bg-primary/5'}`}
            >
              <Users className="w-5 h-5" />
            </button>
            
            <div className="relative hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 w-48 focus-within:ring-2 focus-within:ring-primary/50 transition-all border border-slate-200 dark:border-slate-700">
              <input type="text" placeholder="Search" className="bg-transparent text-sm w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <Search className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Chat / Posts Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Messages Container */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeChannel === "chat" ? (
              <>
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {/* Welcome Message */}
                  <div className="mt-4 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800/50">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <Hash className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Welcome to #general-chat!</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">This is the start of the #general-chat channel in {community.name}.</p>
                  </div>
                  
                  {chats.map(chat => {
                    const isMine = chat.authorId === memberProfileId;
                    return (
                      <div key={chat.id} className="flex gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-500 shrink-0 flex items-center justify-center text-white font-bold cursor-pointer shadow-sm group-hover:scale-105 transition-transform duration-300">
                           {isMine ? "You" : chat.authorType === "ADMIN" ? "A" : "M"}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer transition-colors">
                              {isMine ? "You" : chat.authorType === "ADMIN" ? "Community Admin" : "Member"}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{formatTime(chat.createdAt)}</span>
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 w-fit max-w-[85%]">
                            {chat.message}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {chats.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                      <Smile className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">No messages yet. Be the first to say hi!</p>
                    </div>
                  )}
                </div>
                
                {/* Input Area */}
                <div className="px-6 pb-6 pt-2 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
                    <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 mr-3 rounded-xl transition-colors">
                      <PlusCircle className="w-6 h-6" />
                    </button>
                    <form onSubmit={handleSendChat} className="flex-1 flex items-center">
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={e => setChatMessage(e.target.value)}
                        placeholder="Message #general-chat"
                        className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-base"
                      />
                      <button type="submit" className="hidden">Send</button>
                    </form>
                    <div className="flex items-center gap-2 ml-2 text-slate-400">
                      <button className="p-2 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"><Smile className="w-6 h-6" /></button>
                      <button 
                        onClick={handleSendChat} 
                        disabled={isSubmitting || !chatMessage.trim()}
                        className="p-2 bg-primary text-white rounded-xl hover:shadow-[0_0_15px_rgba(255,153,51,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
                      >
                        <Send className="w-5 h-5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // POSTS TAB
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Create Post Input */}
                  <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                    <form onSubmit={handleCreatePost}>
                      <textarea
                        value={postContent}
                        onChange={e => setPostContent(e.target.value)}
                        placeholder="Share a new announcement or post..."
                        className="w-full bg-transparent border-none resize-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-lg"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                        <button type="button" className="p-2 text-slate-400 hover:text-primary bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 rounded-xl transition-colors">
                          <PlusCircle className="w-5 h-5" />
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !postContent.trim()} 
                          className="px-6 py-2.5 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:transform-none"
                        >
                          Post Announcement
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Posts List */}
                  {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm">
                          {post.authorType === "ADMIN" ? "A" : "M"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                            {post.authorType === "ADMIN" ? "Community Admin" : "Member"}
                            {post.authorType === "ADMIN" && (
                              <span className="bg-primary/10 text-primary text-[10px] uppercase px-2 py-0.5 rounded-full font-black tracking-wider border border-primary/20">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-slate-500">
                            {formatTime(post.createdAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-base leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Hash className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Announcements Yet</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">Be the first to share an announcement with the community.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - Members List */}
          {showMembers && (
            <div className="w-64 bg-slate-50 dark:bg-slate-950 shrink-0 border-l border-slate-200 dark:border-slate-800 overflow-y-auto p-4 hidden md:block scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase mb-4 tracking-widest pl-2">
                Members — {community.members?.length || community._count?.members || 1}
              </h3>
              
              <div className="space-y-1">
                {/* Always show current user */}
                <div className="flex items-center gap-3 hover:bg-white dark:hover:bg-slate-900 p-2 rounded-xl cursor-pointer transition-colors shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-800 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shrink-0">
                      {authorType === "ADMIN" ? "A" : "M"}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-50 dark:border-slate-950"></div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white truncate">You</span>
                    <span className="text-xs font-semibold text-primary">Active</span>
                  </div>
                </div>

                {community.members?.map((member: any) => (
                   <div key={member.id} className="flex items-center gap-3 hover:bg-white dark:hover:bg-slate-900 p-2 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800 group">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-50 dark:border-slate-950"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate transition-colors">
                        {member.memberProfile?.user?.name || "Member"}
                      </span>
                      {member.role === "ADMIN" && (
                        <span className="text-[10px] text-primary font-black uppercase tracking-wider">Admin</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
