import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { followApi } from "../api/api";
import { MMKVStorage } from "./mmkv";

interface FollowState {
  following: Record<string, boolean>;
  followCounts: Record<string, { followers: number; following: number }>;
  isInitialized: boolean;
  toggleFollow: (followeeId: string) => Promise<void>;
  setFollowStatus: (followeeId: string, status: boolean) => void;
  setFollowCounts: (userId: string, followers: number, following: number) => void;
  initializeFollowing: (followingMap: Record<string, boolean>) => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      following: {},
      followCounts: {},
      isInitialized: false,

      toggleFollow: async (followeeId: string) => {
        const currentState = get().following[followeeId] || false;
        
        // Immediately update UI
        set((state) => ({
          following: {
            ...state.following,
            [followeeId]: !currentState
          }
        }));

        try {
          const response = await (currentState 
            ? followApi.unfollowUser(followeeId)
            : followApi.followUser(followeeId));

          if (response.success) {
            set((state) => ({
              followCounts: {
                ...state.followCounts,
                [followeeId]: {
                  followers: response.followerCount,
                  following: response.followingCount
                }
              }
            }));
          }
        } catch (error) {
          // Revert only on error
          set((state) => ({
            following: {
              ...state.following,
              [followeeId]: currentState
            }
          }));
          throw error;
        }
      },

      setFollowStatus: (followeeId: string, status: boolean) => {
        set((state) => ({
          following: {
            ...state.following,
            [followeeId]: status
          }
        }));
      },

      setFollowCounts: (userId: string, followers: number, following: number) => {
        set((state) => ({
          followCounts: {
            ...state.followCounts,
            [userId]: { followers, following }
          }
        }));
      },

      initializeFollowing: (followingMap: Record<string, boolean>) => {
        set({ 
          following: followingMap,
          isInitialized: true
        });
      },
    }),
    {
      name: "follow-store",
      storage: createJSONStorage(() => MMKVStorage),
    }
  )
);


