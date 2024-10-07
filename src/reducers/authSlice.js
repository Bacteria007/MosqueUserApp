import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../services/api'; // Import your generalized service
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginURL, signupURL } from '../services/constants';

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await ApiService({
        method: 'POST',
        url: loginURL,
        data: { email, password }
      });

      const { data } = response;
      console.log(response);
      await AsyncStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      console.error('Login Error:', error.message || error); // Log the error
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await ApiService({
        method: 'POST',
        url: signupURL,
        data: { email, password }
      });

      const { token, user } = response;
      await AsyncStorage.setItem('token', token);
      return user;
    } catch (error) {
      console.error('Signup Error:', error.message || error);
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: false,
    loginError: null,
    signupError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Login reducers
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.payload;
        state.loading = false;
      });

    // Signup reducers
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.signupError = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupError = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
