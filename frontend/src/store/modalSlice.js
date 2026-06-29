import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    contactModal: { open: false, item: null },
    orderModal: { open: false, item: null },
  },
  reducers: {
    openContactModal(state, action) {
      state.contactModal = { open: true, item: action.payload };
    },
    closeContactModal(state) {
      state.contactModal = { open: false, item: null };
    },
    openOrderModal(state, action) {
      state.orderModal = { open: true, item: action.payload };
    },
    closeOrderModal(state) {
      state.orderModal = { open: false, item: null };
    },
  },
});

export const {
  openContactModal,
  closeContactModal,
  openOrderModal,
  closeOrderModal,
} = modalSlice.actions;

export default modalSlice.reducer;
