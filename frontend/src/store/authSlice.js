import { createSlice } from '@reduxjs/toolkit';
import { isTokenValid } from '../utils/token';

const storedToken = localStorage.getItem('ae_admin_token');
const validStoredToken = isTokenValid(storedToken) ? storedToken : null;
if (!validStoredToken) {
  localStorage.removeItem('ae_admin_token');
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: validStoredToken,
    isAuthenticated: !!validStoredToken,
  },
  reducers: {
    setAdminToken(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('ae_admin_token', action.payload);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ae_admin_token');
    },
  },
});

export const { setAdminToken, logout } = authSlice.actions;
export default authSlice.reducer;
