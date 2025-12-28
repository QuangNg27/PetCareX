import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "@services/authService";
import { customerService } from "@services/customerService";
import { serviceService } from "@services/serviceService";
import { reviewService } from "@services/reviewService";
import { setAuthToken } from "@config/apiClient";

const AuthContext = createContext(null);

// Auth states
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  SIGNUP_START: "SIGNUP_START",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  SIGNUP_FAILURE: "SIGNUP_FAILURE",
  LOGOUT: "LOGOUT",
  LOAD_USER: "LOAD_USER",
  UPDATE_USER_DATA: "UPDATE_USER_DATA",
  UPDATE_PETS: "UPDATE_PETS",
  UPDATE_SPENDING: "UPDATE_SPENDING",
  UPDATE_APPOINTMENTS: "UPDATE_APPOINTMENTS",
  UPDATE_VACCINATION_PACKAGES: "UPDATE_VACCINATION_PACKAGES",
  UPDATE_REVIEWS: "UPDATE_REVIEWS",
  UPDATE_ALL_REVIEWS: "UPDATE_ALL_REVIEWS",
  CLEAR_ERROR: "CLEAR_ERROR",
  INITIALIZED: "INITIALIZED",
};

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,
  pets: null, // Cache pets data
  spending: null, // Cache spending data
  appointments: null, // Cache appointments data
  vaccinationPackages: null, // Cache vaccination packages data
  reviews: null, // Cache my reviews data
  allReviews: null, // Cache all reviews data
  lastFetch: null, // Track last fetch time
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };

    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case AUTH_ACTIONS.UPDATE_PETS:
      return {
        ...state,
        pets: action.payload,
        lastFetch: Date.now(),
      };

    case AUTH_ACTIONS.UPDATE_SPENDING:
      return {
        ...state,
        spending: action.payload,
        user: {
          ...state.user,
          spending: action.payload, // Also update in user object
        },
        lastFetch: Date.now(),
      };

    case AUTH_ACTIONS.UPDATE_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload,
        lastFetch: Date.now(),
      };

    case AUTH_ACTIONS.UPDATE_VACCINATION_PACKAGES:
      return {
        ...state,
        vaccinationPackages: action.payload,
        lastFetch: Date.now(),
      };

    case AUTH_ACTIONS.UPDATE_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
        lastFetch: Date.now(),
      };
    case AUTH_ACTIONS.UPDATE_ALL_REVIEWS:
      return {
        ...state,
        allReviews: action.payload,
        lastFetch: Date.now(),
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.INITIALIZED:
      return {
        ...state,
        initialized: true,
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
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);

          // Set token in axios headers
          setAuthToken(token);

          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: { user, token },
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();
    // mark auth as initialized so components don't redirect prematurely
    dispatch({ type: AUTH_ACTIONS.INITIALIZED });
  }, []);

  // Fetch user data (profile, spending, etc.)
  const fetchUserData = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh (less than 5 minutes old)
      const isCacheValid =
        state.lastFetch && Date.now() - state.lastFetch < 5 * 60 * 1000;

      if (!force && isCacheValid && state.spending) {
        return; // Use cached data
      }

      const [profileData, spendingData] = await Promise.all([
        customerService.getProfile(),
        customerService.getSpending(),
      ]);

      const profileResult = profileData.data || profileData;
      const spendingResult = spendingData.data || spendingData;

      const updatedUserData = {
        ...profileResult,
      };

      // Update user in state
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER_DATA,
        payload: updatedUserData,
      });

      // Update spending
      dispatch({
        type: AUTH_ACTIONS.UPDATE_SPENDING,
        payload: spendingResult,
      });

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...updatedUserData,
        })
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Don't throw error - let the user continue even if profile fetch fails
    }
  };

  // Fetch pets data with caching
  const fetchPets = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh
      const isCacheValid =
        state.lastFetch && Date.now() - state.lastFetch < 5 * 60 * 1000;

      if (!force && isCacheValid && state.pets) {
        return state.pets; // Return cached data
      }

      const response = await customerService.pets.getAll();
      const petsData = response.data || response;

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PETS,
        payload: petsData,
      });

      return petsData;
    } catch (error) {
      console.error("Error fetching pets:", error);
      return state.pets || []; // Return cached data or empty array
    }
  };

  // Fetch appointments data with caching
  const fetchAppointments = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh
      const isCacheValid =
        state.lastFetch && Date.now() - state.lastFetch < 5 * 60 * 1000;

      if (!force && isCacheValid && state.appointments) {
        return state.appointments; // Return cached data
      }

      // Get pets first
      const petsData = await fetchPets();
      if (!petsData || petsData.length === 0) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_APPOINTMENTS,
          payload: [],
        });
        return [];
      }

      // Get medical and vaccination history for all pets
      const appointmentsPromises = petsData.map(async (pet) => {
        try {
          const [medicalHistory, vaccinationHistory] = await Promise.all([
            customerService.pets
              .getMedicalHistory(pet.MaTC)
              .catch(() => ({ data: [] })),
            customerService.pets
              .getVaccinationHistory(pet.MaTC)
              .catch(() => ({ data: [] })),
          ]);

          const medicalAppts = (medicalHistory.data || []).map((item) => ({
            id: `exam-${item.MaKB}`,
            MaLichHen: `KB${item.MaKB}`,
            type: "examination",
            NgayHen: item.NgayKham,
            TenDichVu: "Khám sức khỏe",
            TenThuCung: pet.Ten,
            LoaiThuCung: `${pet.Loai} ${pet.Giong}`,
            TenChiNhanh: item.TenCN || "Chưa cập nhật",
            TenBacSi: item.TenBacSi || "Chưa cập nhật",
            TrieuChung: item.TrieuChung,
            ChanDoan: item.ChanDoan,
            NgayTaiKham: item.NgayTaiKham,
            ThuocDaDung: item.ThuocDaDung || [],
          }));

          // Deduplicate vaccination records by MaTP (group records with same MaTP)
          const vaccinationMap = new Map();
          (vaccinationHistory.data || []).forEach((item) => {
            const key = item.MaTP;
            if (!vaccinationMap.has(key)) {
              vaccinationMap.set(key, item);
            }
          });

          const vaccinationAppts = Array.from(vaccinationMap.values()).map(
            (item) => {
              // Create vaccines array if exists
              const vaccines = item.Vaccines && item.Vaccines.length > 0
                ? item.Vaccines.map((v) => ({
                    TenVaccine: v.TenVaccine || "Chưa cập nhật",
                    LieuLuong: v.LieuLuong || "Chưa cập nhật",
                    TrangThai: v.TrangThai || "Chưa cập nhật",
                    LoaiVaccine: v.LoaiVaccine || "Chưa cập nhật",
                  }))
                : [];

              return {
                id: `vacc-${item.MaTP}`,
                MaLichHen: `TP${item.MaTP}`,
                type: "vaccination",
                NgayHen: item.NgayTiem,
                TenDichVu: "Tiêm phòng vắc-xin",
                TenThuCung: pet.Ten,
                LoaiThuCung: `${pet.Loai} ${pet.Giong}`,
                TenChiNhanh: item.TenCN || "Chưa cập nhật",
                TenBacSi: item.TenBacSi || "Chưa cập nhật",
                GoiTiem: {
                  MaGoi: item.MaGoi || null,
                  UuDai: item.UuDai || 0,
                  CacVacxin: vaccines,
                },
              };
            }
          );

          return [...medicalAppts, ...vaccinationAppts];
        } catch (error) {
          console.error(
            `Error loading appointments for pet ${pet.MaTC}:`,
            error
          );
          return [];
        }
      });

      const allAppointments = (await Promise.all(appointmentsPromises)).flat();

      // Sort by date (most recent first)
      const sortedAppointments = allAppointments
        .filter((apt) => apt.NgayHen)
        .sort((a, b) => new Date(b.NgayHen) - new Date(a.NgayHen));

      dispatch({
        type: AUTH_ACTIONS.UPDATE_APPOINTMENTS,
        payload: sortedAppointments,
      });

      return sortedAppointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return state.appointments || []; // Return cached data or empty array
    }
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // Map frontend data to backend format
      const backendCredentials = {
        TenDangNhap: credentials.username,
        MatKhau: credentials.password,
      };

      const response = await authService.login(backendCredentials);

      if (response.success) {
        const { user, token } = response.data;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // IMPORTANT: Set token in axios headers immediately
        setAuthToken(token);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        // Fetch additional user data after login
        if (user.VaiTro === "Khách hàng") {
          // Fetch in background - errors won't cause redirect anymore
          setTimeout(() => {
            fetchUserData().catch((err) => {
              console.error("Failed to fetch user data after login:", err);
            });
          }, 1000);
        }

        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
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
        return { success: true, message: "Đăng ký thành công" };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SIGNUP_FAILURE,
          payload: response.message,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update user profile
  // Fetch vaccination packages data with caching
  const fetchVaccinationPackages = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh
      const isCacheValid =
        state.lastFetch && Date.now() - state.lastFetch < 5 * 60 * 1000;

      if (!force && isCacheValid && state.vaccinationPackages) {
        return state.vaccinationPackages; // Return cached data
      }

      const response = await serviceService.vaccinationPackages.getAll();

      // Handle different response structures
      let packagesData;
      if (response.success && response.data) {
        packagesData = response.data.packages || response.data;
      } else if (Array.isArray(response)) {
        packagesData = response;
      } else {
        packagesData = response.data || response;
      }

      dispatch({
        type: AUTH_ACTIONS.UPDATE_VACCINATION_PACKAGES,
        payload: packagesData,
      });

      return packagesData;
    } catch (error) {
      console.error("Error fetching vaccination packages:", error);
      // Return empty array on error instead of cached data to show empty state
      dispatch({
        type: AUTH_ACTIONS.UPDATE_VACCINATION_PACKAGES,
        payload: [],
      });
      return [];
    }
  };

  // Fetch reviews data with caching
  const fetchReviews = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh
      const isCacheValid =
        state.lastFetch && Date.now() - state.lastFetch < 5 * 60 * 1000;

      if (!force && isCacheValid && state.reviews) {
        return state.reviews; // Return cached data
      }

      const response = await reviewService.getMyReviews();
      const reviewsData = response.data || response;

      dispatch({
        type: AUTH_ACTIONS.UPDATE_REVIEWS,
        payload: reviewsData,
      });

      return reviewsData;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return state.reviews || []; // Return cached data or empty array
    }
  };

  // Fetch all reviews data with caching
  const fetchAllReviews = async (force = false) => {
    try {
      // Check if we have cached data and it's fresh
      const isCacheValid =
        state.lastFetch && Date.now() - state.lastFetch < 5 * 60 * 1000;

      if (!force && isCacheValid && state.allReviews) {
        return state.allReviews; // Return cached data
      }

      const response = await reviewService.getAllReviews();
      const allReviewsData = response.data || response;

      dispatch({
        type: AUTH_ACTIONS.UPDATE_ALL_REVIEWS,
        payload: allReviewsData,
      });

      return allReviewsData;
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      return state.allReviews || []; // Return cached data or empty array
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await customerService.updateProfile(profileData);

      if (response.success) {
        // Refresh user data
        await fetchUserData();
        return { success: true, message: "Cập nhật thông tin thành công" };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Cập nhật thất bại";
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
    fetchAppointments,
    fetchVaccinationPackages,
    fetchReviews,
    fetchAllReviews,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
