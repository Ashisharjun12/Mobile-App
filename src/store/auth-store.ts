import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKVStorage } from './mmkv';

//for user
interface User {
  id: string;
  username: string;
  avatar: string;
  profile: {
    bio: string;
    gender: string;
    status: string;
    collegeId: string;
  };
  email: string;
  password: string;
  collegeId: string;
}


interface UserAuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  registerUser: (user: User, token: string) => void;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  setUser: (user: User) => void;
}

export const useUserAuthStore = create<UserAuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      registerUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
      loginUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
      logoutUser: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        set((state) => ({
          ...state,
          user
        }));
      },
    }),
    {
      name: 'user-auth',
      storage: createJSONStorage(() => MMKVStorage),
    }
  )
);


 
// Helper function to check authentication status
export const checkAuth = () => {
  const userAuth = useUserAuthStore.getState();
 
  
  return {
    isUserAuthenticated: userAuth.isAuthenticated,
    userToken: userAuth.token,
  };
};

// Helper function to get stored tokens
export const getStoredTokens = async () => {
  const userToken = await MMKVStorage.getItem('user-auth.token');

  
  return {
    userToken: userToken ? JSON.parse(userToken) : null,
   
  };
};
