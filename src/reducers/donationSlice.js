import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService from '../services/api'; // Import your generalized service
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginURL, signupURL} from '../services/constants';

// Async thunk for login
export const donate = createAsyncThunk(
  'donation/donate',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const response = await ApiService({
        method: 'POST',
        url: loginURL,
        data: {email, password},
      });

      const {data} = response;
      console.log(response);
      await AsyncStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      console.error('Login Error:', error.message || error); // Log the error
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);

// Async thunk for signup


const donationSlice = createSlice({
  name: 'donation',
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: false,
    loginError: null,
    signupError: null,
  },
  reducers: {},
  extraReducers: builder => {
    // Login reducers
    builder
      .addCase(donate.pending, state => {
        state.loading = true;
        state.donateError = null;
      })
      .addCase(donate.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(donate.rejected, (state, action) => {
        state.loginError = action.payload;
        state.loading = false;
      });

    
  },
});

export default donationSlice.reducer;
