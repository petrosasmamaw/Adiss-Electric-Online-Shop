import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast(state, action) {
      state.toasts = [action.payload, ...state.toasts].slice(0, 3);
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export function showToast(message, type = 'success', duration = 3000) {
  return (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(addToast({ id, message, type, duration }));
    setTimeout(() => dispatch(removeToast(id)), duration);
  };
}

export default toastSlice.reducer;
