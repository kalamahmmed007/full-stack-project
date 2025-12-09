import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/adminAuthSlice';
import adminProductReducer from './slices/adminProductSlice';
import adminOrderReducer from './slices/adminOrderSlice';
import adminUserReducer from './slices/adminUserSlice';
import adminCategoryReducer from './slices/adminCategorySlice';
import adminCouponReducer from './slices/adminCouponSlice';
import adminReviewReducer from './slices/adminReviewSlice';
import adminDashboardReducer from './slices/adminDashboardSlice';
import adminUiReducer from './slices/adminUiSlice';

const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
        adminProduct: adminProductReducer,
        adminOrder: adminOrderReducer,
        adminUser: adminUserReducer,
        adminCategory: adminCategoryReducer,
        adminCoupon: adminCouponReducer,
        adminReview: adminReviewReducer,
        adminDashboard: adminDashboardReducer,
        adminUi: adminUiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;