import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import categoriesReducer from './categoriesSlice';
import ordersReducer from './ordersSlice';
import modalReducer from './modalSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import toastReducer from './toastSlice';

const store = configureStore({
  reducer: {
    items: itemsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    modal: modalReducer,
    auth: authReducer,
    admin: adminReducer,
    toast: toastReducer,
  },
});

export default store;
