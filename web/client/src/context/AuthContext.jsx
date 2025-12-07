import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@services/authService';
import { customerService } from '@services/customerService';
import { setAuthToken } from '@config/apiClient';

const AuthContext = createContext(null);

// Auth states
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER_DATA: 'UPDATE_USER_DATA',
  UPDATE_PETS: 'UPDATE_PETS',
  UPDATE_SPENDING: 'UPDATE_SPENDING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  pets: null, // Cache pets data
  spending: null, // Cache spending data
  lastFetch: null // Track last fetch time
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      };

    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };

    case AUTH_ACTIONS.UPDATE_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    case AUTH_ACTIONS.UPDATE_PETS:
      return {
        ...state,
        pets: action.payload,
        lastFetch: Date.now()
      };

    case AUTH_ACTIONS.UPDATE_SPENDING:
      return {
        ...state,
        spending: action.payload,
        lastFetch: Date.now()
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Set token in axios headers
          setAuthToken(token);
          
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: { user, token }
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    loadUser();
  }, []);

  // Fetch user data (profile, spending, etc.)
  const fetchUserData = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh (less than 5 minutes old)
      const isCacheValid = state.lastFetch && (Date.now() - state.lastFetch < 5 * 60 * 1000);
      
      if (!force && isCacheValid && state.spending) {
        return; // Use cached data
      }

      const [profileData, spendingData] = await Promise.all([
        customerService.getProfile(),
        customerService.getSpending()
      ]);

      const profileResult = profileData.data || profileData;
      const spendingResult = spendingData.data || spendingData;

      const updatedUserData = {
        ...profileResult
      };

      // Update user in state
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER_DATA,
        payload: updatedUserData
      });

      // Update spending
      dispatch({
        type: AUTH_ACTIONS.UPDATE_SPENDING,
        payload: spendingResult
      });

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...updatedUserData
      }));

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't throw error - let the user continue even if profile fetch fails
    }
  };

  // Fetch pets data with caching
  const fetchPets = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh
      const isCacheValid = state.lastFetch && (Date.now() - state.lastFetch < 5 * 60 * 1000);
      
      if (!force && isCacheValid && state.pets) {
        return state.pets; // Return cached data
      }

      const response = await customerService.pets.getAll();
      const petsData = response.data || response;

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PETS,
        payload: petsData
      });

      return petsData;
    } catch (error) {
      console.error('Error fetching pets:', error);
      return state.pets || []; // Return cached data or empty array
    }
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      // Map frontend data to backend format
      const backendCredentials = {
        TenDangNhap: credentials.username,
        MatKhau: credentials.password
      };
      
      const response = await authService.login(backendCredentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // IMPORTANT: Set token in axios headers immediately
        setAuthToken(token);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token }
        });

        // Fetch additional user data after login
        if (user.VaiTro === 'Khách hàng') {
          // Fetch in background - errors won't cause redirect anymore
          setTimeout(() => {
            fetchUserData().catch(err => {
              console.error('Failed to fetch user data after login:', err);
            });
          }, 1000);
        }
        
        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SIGNUP_START });
    
    try {
      const response = await authService.signup(userData);
      
      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.SIGNUP_SUCCESS });
        return { success: true, message: 'Đăng ký thành công' };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SIGNUP_FAILURE,
          payload: response.message
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      const response = await customerService.updateProfile(profileData);
      
      if (response.success) {
        // Refresh user data
        await fetchUserData();
        return { success: true, message: 'Cập nhật thông tin thành công' };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Cập nhật thất bại';
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    fetchUserData,
    fetchPets,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
