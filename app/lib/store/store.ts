import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./slices/conversation";
import modalReducer from "./slices/modal";

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      conversation: conversationReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
