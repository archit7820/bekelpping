import { create } from 'zustand';

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string;
  tags?: string[];
  location?: string;
  impactScore: number;
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  totalImpactScore: number;
  averageImpactScore: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  impactStreak: number;
}

export interface ImpactMetrics {
  weeklyAverage: number;
  monthlyAverage: number;
  topPerformingPosts: Post[];
  categoryPerformance: { [category: string]: number };
  weeklyTrend: { date: string; score: number }[];
  totalPosts: number;
  impactGrowth: number; // percentage change from last period
}

interface ImpactStore {
  // User state
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Posts state
  posts: Post[];
  userPosts: Post[];
  feedPosts: Post[];
  
  // Impact metrics
  impactMetrics: ImpactMetrics | null;
  
  // Friends state
  friends: User[];
  friendsActivity: Post[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  addPost: (post: Post) => void;
  updatePostImpactScore: (postId: string, score: number) => void;
  setImpactMetrics: (metrics: ImpactMetrics) => void;
  setFriends: (friends: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed getters
  getTotalImpactScore: () => number;
  getAverageImpactScore: () => number;
  getTopPerformingPosts: (limit?: number) => Post[];
}

export const useImpactStore = create<ImpactStore>((set, get) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  posts: [],
  userPosts: [],
  feedPosts: [],
  impactMetrics: null,
  friends: [],
  friendsActivity: [],
  isLoading: false,
  error: null,
  
  // Actions
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
  
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts],
    userPosts: [post, ...state.userPosts],
  })),
  
  updatePostImpactScore: (postId, score) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId ? { ...post, impactScore: score } : post
    ),
    userPosts: state.userPosts.map(post => 
      post.id === postId ? { ...post, impactScore: score } : post
    ),
  })),
  
  setImpactMetrics: (metrics) => set({ impactMetrics: metrics }),
  
  setFriends: (friends) => set({ friends }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  // Computed getters
  getTotalImpactScore: () => {
    const { userPosts } = get();
    return userPosts.reduce((total, post) => total + post.impactScore, 0);
  },
  
  getAverageImpactScore: () => {
    const { userPosts } = get();
    if (userPosts.length === 0) return 0;
    return userPosts.reduce((total, post) => total + post.impactScore, 0) / userPosts.length;
  },
  
  getTopPerformingPosts: (limit = 3) => {
    const { userPosts } = get();
    return [...userPosts]
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, limit);
  },
}));