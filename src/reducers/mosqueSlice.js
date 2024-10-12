import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService from '../services/api'; // Import your generalized service
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET, mosqueInfoURL, signupURL} from '../services/constants';

// Async thunk for login
export const getMosqueInofo = createAsyncThunk(
  'mosque/mosque-info',
  async ({rejectWithValue}) => {
    try {
      const response = await ApiService({
        method: GET,
        url: mosqueInfoURL,
      });

      const {data} = response;
      console.log(response);
      return data;
    } catch (error) {
      console.error('Login Error:', error.message || error); // Log the error
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    mosqueLoading: false,
    mosqueError: false,
    mosqueInfo: null,
  },
  reducers: {},
  extraReducers: builder => {
    // Login reducers
    builder
      .addCase(getMosqueInofo.pending, state => {
        state.loading = true;
        state.mosqueError = null;
      })
      .addCase(getMosqueInofo.fulfilled, (state, action) => {
        state.mosqueError = true;
        state.mosqueInfo = action.payload;
        state.loading = false;
      })
      .addCase(getMosqueInofo.rejected, (state, action) => {
        state.mosqueError = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
