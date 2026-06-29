import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (category, { rejectWithValue }) => {
    try {
      const url =
        category && category !== 'all'
          ? `/items?category=${encodeURIComponent(category)}`
          : '/items';
      const { data } = await api.get(url);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch items');
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedCategory: 'all',
    searchQuery: '',
  },
  reducers: {
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategory, setSearchQuery } = itemsSlice.actions;
export default itemsSlice.reducer;
