import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@services/authService';

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
  CLEAR_ERROR: 'CLEAR_ERROR'
};

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
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

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token }
        });
        
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

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError
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