// Powered by OnSpace.AI — Global App Context for تك توكي
import React, { createContext, useState, ReactNode } from 'react';
import { mockUser, mockFamilyMembers, mockPosts, mockRideHistory, mockWalletTransactions, mockNotifications } from '@/constants/mockData';

interface AppContextType {
  user: typeof mockUser;
  familyMembers: typeof mockFamilyMembers;
  posts: typeof mockPosts;
  rideHistory: typeof mockRideHistory;
  walletTransactions: typeof mockWalletTransactions;
  notifications: typeof mockNotifications;
  unreadNotifications: number;
  activeRide: null | { status: string; driver: any; eta: number };
  setActiveRide: (ride: any) => void;
  togglePostLike: (postId: string) => void;
  markNotificationsRead: () => void;
  updateFamilyPermission: (memberId: string, perm: string, value: boolean | string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState(mockUser);
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [posts, setPosts] = useState(mockPosts);
  const [rideHistory] = useState(mockRideHistory);
  const [walletTransactions] = useState(mockWalletTransactions);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeRide, setActiveRide] = useState<null | any>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const togglePostLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateFamilyPermission = (memberId: string, perm: string, value: boolean | string) => {
    setFamilyMembers(prev => prev.map(m =>
      m.id === memberId
        ? { ...m, permissions: { ...m.permissions, [perm]: value } }
        : m
    ));
  };

  return (
    <AppContext.Provider value={{
      user,
      familyMembers,
      posts,
      rideHistory,
      walletTransactions,
      notifications,
      unreadNotifications,
      activeRide,
      setActiveRide,
      togglePostLike,
      markNotificationsRead,
      updateFamilyPermission,
    }}>
      {children}
    </AppContext.Provider>
  );
}
