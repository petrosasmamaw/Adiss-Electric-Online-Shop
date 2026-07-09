import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to place order');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch orders');
    }
  }
);

export const deleteAdminOrder = createAsyncThunk(
  'orders/deleteAdminOrder',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update status');
    }
  }
);

export const markOrderSeen = createAsyncThunk(
  'orders/markOrderSeen',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${id}/seen`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to mark order as seen');
    }
  }
);

export const markAllOrdersSeen = createAsyncThunk(
  'orders/markAllOrdersSeen',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/orders/mark-all-seen');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to mark all as seen');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    submitting: false,
    success: false,
    error: null,
    lastOrder: null,
    adminOrders: [],
    adminLoading: false,
    adminError: null,
    updatingStatusId: null,
  },
  reducers: {
    resetOrderState(state) {
      state.submitting = false;
      state.success = false;
      state.error = null;
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.submitting = false;
        state.success = true;
        state.lastOrder = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      })
      .addCase(deleteAdminOrder.fulfilled, (state, action) => {
        state.adminOrders = state.adminOrders.filter((o) => o.id !== action.payload);
      })
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updatingStatusId = action.meta.arg.id;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingStatusId = null;
        const idx = state.adminOrders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.adminOrders[idx] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.updatingStatusId = null;
      })
      .addCase(markOrderSeen.fulfilled, (state, action) => {
        const idx = state.adminOrders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.adminOrders[idx] = action.payload;
      })
      .addCase(markAllOrdersSeen.fulfilled, (state, action) => {
        state.adminOrders = action.payload;
      });
  },
});

export const { resetOrderState } = ordersSlice.actions;
export default ordersSlice.reducer;
