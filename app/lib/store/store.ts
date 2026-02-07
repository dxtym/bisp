import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./slices/conversationSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      conversation: conversationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: [
            "conversation.conversations",
            "conversation.activeConversation",
          ],
          ignoredActions: [
            "conversation/fetchConversations/fulfilled",
            "conversation/fetchActiveConversation/fulfilled",
            "conversation/updateMessages/fulfilled",
            "conversation/createConversation/fulfilled",
          ],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
