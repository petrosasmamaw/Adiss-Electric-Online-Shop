import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const fetchAdminItems = createAsyncThunk(
  'admin/fetchAdminItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/items');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch items');
    }
  }
);

export const createItem = createAsyncThunk(
  'admin/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/items', itemData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'admin/updateItem',
  async ({ id, ...itemData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/items/${id}`, itemData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'admin/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/items/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete item');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
    modal: { open: false, editItem: null },
  },
  reducers: {
    openItemModal(state, action) {
      state.modal = { open: true, editItem: action.payload };
    },
    closeItemModal(state) {
      state.modal = { open: false, editItem: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createItem.pending, (state) => {
        state.saving = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.modal = { open: false, editItem: null };
      })
      .addCase(createItem.rejected, (state) => {
        state.saving = false;
      })
      .addCase(updateItem.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.modal = { open: false, editItem: null };
      })
      .addCase(updateItem.rejected, (state) => {
        state.saving = false;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { openItemModal, closeItemModal } = adminSlice.actions;
export default adminSlice.reducer;
