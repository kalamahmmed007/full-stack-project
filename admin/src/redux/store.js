import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import adminProductReducer from './slices/ProductSlice';
import adminOrderReducer from './slices/OrderSlice';
import adminUserReducer from './slices/UserSlice';
import adminCategoryReducer from './slices/CategorySlice';
import adminCouponReducer from './slices/CouponSlice';
import adminReviewReducer from './slices/ReviewSlice';
import DashboardReducer from './slices/DashboardSlice';
import adminUiReducer from './slices/UiSlice';

const store = configureStore({
    reducer: {
        Auth: AuthReducer,
        Product: adminProductReducer,
        Order: adminOrderReducer,
        User: adminUserReducer,
        Category: adminCategoryReducer,
        Coupon: adminCouponReducer,
        Review: adminReviewReducer,
        Dashboard: DashboardReducer,
        Ui: adminUiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;