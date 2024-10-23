import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET, loginURL, signupURL, verifyTokenURL} from '../services/constants';

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const response = await ApiService({
        method: 'POST',
        url: loginURL,
        data: {email, password,role:'user'},
      });

      const {data} = response;
      console.log(data.token);
      await AsyncStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Login Error:', error.message || error); // Log the error
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);
export const loginWithToken = createAsyncThunk(
  'auth/loginWithToken',
  async (token, {rejectWithValue}) => {
    try {
      // Optionally verify token with backend
      const response = await ApiService({
        method: GET,
        url: verifyTokenURL, // Optional: Verify token validity with backend
        data: {token}, // Send the token to the server for verification
      });

      const {data} = response; // Get user data if token is valid
      return data.user; // Return the user data to set in Redux
    } catch (error) {
      return rejectWithValue('Token expired');
    }
  },
);

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async ({email, password, name}, {rejectWithValue}) => {
    try {
      const response = await ApiService({
        method: 'POST',
        url: signupURL,
        data: {email, password, name, role: 'user'},
      });

      const {data} = response;
      console.log({data});

      await AsyncStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Signup Error:', error.message || error);
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      await AsyncStorage.removeItem('token');
      
      return true;
    } catch (error) {
      return rejectWithValue(
        error.message || 'An error occurred during logout',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: false,
    loginError: null,
    signupError: null,
    token: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.token = action.payload.token;
    },
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    // Login reducers
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.payload;
        state.isLoggedIn = false;
        state.loading = false;
      });

    // Signup reducers
    builder
      .addCase(signup.pending, state => {
        state.loading = true;
        state.signupError = null;
        state.token = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoggedIn = true; // Set to true on successful signup
        state.user = action.payload.user;
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupError = action.payload;
        state.loading = false;
        state.token = null;
      });
    builder
      .addCase(loginWithToken.pending, state => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload; // Set the token
        state.loading = false;
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.loginError = action.payload;
        state.loading = false;
      });

    // Handle logout
    builder
      .addCase(logout.fulfilled, state => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        console.error('Logout failed:', action.payload);
        state.isLoggedIn = true;
      });
  },
});


export default authSlice.reducer;
