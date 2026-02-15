import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./slices/conversation";
import modalReducer from "./slices/modal";
import connectionReducer from "./slices/connection";

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      conversation: conversationReducer,
      connection: connectionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
