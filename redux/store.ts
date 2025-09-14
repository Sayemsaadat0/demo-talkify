import { configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./features/authSlice";
// import dashboardPropertysReducer from "./features/dashboardProductSlice";
// import dashboardPropertysReducer from "./features/dashboardPropertySlice";
import dashboardPropertysReducer from "./features/dashboardPropertySlice"
import affiliateReducer from "./features/affiliateSlice";
import layoutReducer from "./features/layoutSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","dashboardPropertys"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  dashboardPropertys: dashboardPropertysReducer,
  affiliate: affiliateReducer,
  layout: layoutReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
