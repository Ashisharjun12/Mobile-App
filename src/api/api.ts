import axios from 'axios';

import { useUserAuthStore } from '../store/auth-store';

export const api = axios.create({
  baseURL: 'http://192.168.29.69:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

//collge apis

export const collegeApi = {
     //get all colleges
  getAllColleges: async () => {
    
    const response = await api.get('/college/all', {
    });
    console.log("get collge data", response.data);
    return response.data;
  },

}




//user apis

export const userApi = {
  //register user
  registerUser: async (data: any) => {
    try {
      // Match exactly what backend expects in RegisterUser controller
      const requestData = {
        username: data.username,
        email: data.email,
        password: data.password,
        avatar: data.avatar,
        gender: data.gender,
        age: data.age,
        college: data.college  
      };

      console.log('API registerUser - Sending exact data:', requestData);
      
      const response = await api.post('/user/register', requestData);

      console.log('API registerUser - Success Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API registerUser - Error Details:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  //verify email
  verifyEmail: async (data: any) => {
    const response = await api.post('/user/verify-email', data);
    console.log("verify email response",response.data);
    return response.data;
  },

  //login user
  loginUser: async (data: { email?: string; username?: string; password: string }) => {
    try {
      const response = await api.post('/user/login', data);  // Using /user/login endpoint
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  //logout user
  logoutUser: async () => {
    try {
      const token = useUserAuthStore.getState().token;
      const response = await api.post('/user/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`  // Fixed token format
        },
        withCredentials: true  // Add this to handle cookies properly
      });
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Return a consistent response even if the backend call fails
      return { success: true, message: 'Logged out locally' };
    }
  },

  //get user profile
  getUserProfile: async (id: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.get(`/user/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("user profile response",response.data);
    return response.data;
  },

  //update user profile
  updateUserProfile: async (id: string, data: any) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.put(`/user/update-profile/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("user profile response..",response.data);
    return response.data;
  }

}

interface UsernameResponse {
  success: boolean;
  message: string;
  username: string;
}


//generate username api

export const generateUsername = async (): Promise<UsernameResponse> => {
  try{
    const response = await api.get('/user/generate-username');
    console.log(response.data);
    return response.data;
  }catch(error){
    console.error('Error generating username:', error);
    throw error;
  }
}

//post apis

export const postApi = {
  createPost: async (formData: FormData) => {
    try {
      const token = useUserAuthStore.getState().token;
      const response = await api.post('/post/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Post creation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Post creation error:', error.response?.data);
      throw error;
    }
  },

  //get post by id
  getPostById: async (id: string) => {
    const response = await api.get(`/post/get-post/${id}`);
    console.log("post response",response.data);
    return response.data;
  },

  //get post by userId
  getPostByUserId: async (id: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.get(`/post/get-post-by-author/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log("post response....by userId",response.data);
    return response.data;
  },



}


//follow apis

export const followApi = {
  followUser: async (id: string) => {
    try {
      const token = useUserAuthStore.getState().token;
      console.log("Following user with ID:", id); // Debug log
      
      const response = await api.post(`/follow/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Follow API response:", response.data); // Debug log
      
      return {
        success: true,
        followerCount: response.data.followerCount,
        followingCount: response.data.followingCount,
        ...response.data
      };
    } catch (error) {
      console.error("Follow API error:", error); // Debug log
      throw error;
    }
  },

  unfollowUser: async (id: string) => {
    try {
      const token = useUserAuthStore.getState().token;
      const response = await api.post(`/follow/unfollow/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return {
        success: true,
        followerCount: response.data.followerCount,
        followingCount: response.data.followingCount,
        ...response.data
      };
    } catch (error) {
      console.error("Unfollow API error:", error);
      throw error;
    }
  },

  getFollowStatus: async (id: string) => {
    try {
      const token = useUserAuthStore.getState().token;
      const response = await api.get(`/follow/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return {
        success: true,
        isFollowing: response.data.followStatus,
        ...response.data
      };
    } catch (error) {
      console.error("Get follow status API error:", error);
      throw error;
    }
  },

  //number of followers
  getFollowers : async(id:string)=>{
    try {
      const token = useUserAuthStore.getState().token;
      const response = await api.get(`/follow/follower/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Get followers API response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Get followers API error:", error);
      throw error;
    }
  },

  //get number of following users

  getFollowing : async(id:string)=>{
    try {
      const token = useUserAuthStore.getState().token;
      const response = await api.get(`/follow/following/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Get following API response:", response.data); // Debug log
      return response.data
    } catch (error) {
      console.error("Get following API error:", error);
      throw error;
    }
  },
}


//like apis

export const likeApi = {
  likePost: async (postId: string) => {
    const token = useUserAuthStore.getState().token;
    try {
      const response = await api.post(`/like/post/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return {
        success: true,
        likesCount: response.data.likesCount,
        likedByUser: true
      };
    } catch (error) {
      console.error('Like post error:', error);
      throw error;
    }
  },

  unlikePost: async (postId: string) => {
    const token = useUserAuthStore.getState().token;
    try {
      const response = await api.delete(`/like/post/unlike/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return {
        success: true,
        likesCount: response.data.likesCount,
        likedByUser: false
      };
    } catch (error) {
      console.error('Unlike post error:', error);
      throw error;
    }
  },

  fetchLikeStatus: async (postId: string) => {
    const token = useUserAuthStore.getState().token;
    try {
      const response = await api.get(`/like/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return {
        likesCount: response.data.likesCount,
        likedByUser: response.data.likedByUser
      };
    } catch (error) {
      console.error('Fetch like status error:', error);
      throw error;
    }
  } ,

  //comment like apis

  likeComment: async (commentId: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.post(`/like/comment/${commentId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("like comment response",response.data);
    return response.data;
  },

  unlikeComment: async (commentId: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.delete(`/like/comment/unlike/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("unlike comment response",response.data);
    return response.data;
  },

  fetchLikeForComment: async (commentId: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.get(`/like/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("fetch like for comment response",response.data);
    return response.data;
  }
}

//comment apis

export const commentApi = {
  addComment: async (postId: string, content: string, gifUrl?: string, gifId?: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.post(`/comment/${postId}`, 
      { 
        content,
        gifurl: gifUrl, 
        gifId: gifId
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("add comment response", response.data);
    return response.data;
  },
  editComment: async (commentId: string, content: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.put(`/comment/${commentId}`, { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("edit comment response",response.data);
    return response.data;
  },
  deleteComment: async (commentId: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.delete(`/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("delete comment response",response.data);
    return response.data;
  },
  getSingleComment: async (commentId: string) => {
    const response = await api.get(`/comment/${commentId}`);
    console.log("single comment response",response.data);
    return response.data;
  },
  getAllCommentsForPost: async (postId: string, page: number = 1, limit: number = 10) => {
    const response = await api.get(`/comment/post/${postId}?page=${page}&limit=${limit}`);
    console.log("all comments for post response", response.data);
    return response.data;
  }
}


//reply apis

export const replyApi = {
  //add reply
  addReply: async (commentId: string, content: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.post(`/reply/addreply/${commentId}`, { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("add reply response",response.data);
    return response.data;
  },
  editReply: async (replyId: string, content: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.put(`/reply/editreply/${replyId}`, { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("edit reply response",response.data);
    return response.data;
  },
  deleteReply: async (replyId: string) => {
    const token = useUserAuthStore.getState().token;
    const response = await api.delete(`/reply/deletereply/${replyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("delete reply response",response.data);
    return response.data;
  },
  getAllRepliesForComment: async (commentId: string) => {
    const response = await api.get(`/reply/getall/${commentId}`);
    console.log("all replies for comment response",response.data);
    return response.data;
  }

}


//confessions

export const confessionApi ={
  getConfessionRooms :async()=>{
    const response = await api.get(`/confession/rooms`);
    console.log("get confession rooms response",response.data);
    return response.data;
  }
}