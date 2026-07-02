import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const fetchControls = createAsyncThunk(
  'controls/fetchControls',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/controls');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch controls');
    }
  }
);

export const updateControls = createAsyncThunk(
  'controls/updateControls',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/controls', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update controls');
    }
  }
);

const controlsSlice = createSlice({
  name: 'controls',
  initialState: {
    products_enabled: true,
    price_visible: true,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchControls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchControls.fulfilled, (state, action) => {
        state.loading = false;
        state.products_enabled = action.payload.products_enabled;
        state.price_visible = action.payload.price_visible;
      })
      .addCase(fetchControls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateControls.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateControls.fulfilled, (state, action) => {
        state.saving = false;
        state.products_enabled = action.payload.products_enabled;
        state.price_visible = action.payload.price_visible;
      })
      .addCase(updateControls.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export default controlsSlice.reducer;

