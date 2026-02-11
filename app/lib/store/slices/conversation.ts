import type { IConversation, IMessage } from "@/lib/mongodb/models/conversation";
import type { RootState } from "../store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ConversationState {
  conversations: IConversation[];
  conversation: IConversation | null;
  isLoading: boolean;
}

const initialState: ConversationState = {
  conversations: [],
  conversation: null,
  isLoading: false,
};

export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async (userId: string) => {
    try {
      const response = await fetch(`/api/conversation?user_id=${userId}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data as IConversation[];
    } catch (error) {
      throw new Error(`Failed to fetch conversations: ${error}`);
    }
  }
);

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  async ({ userId, title }: { userId: string; title: string }) => {
    try {
      const response = await fetch("/api/conversation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data as IConversation;
    } catch (error) {
      throw new Error(`Failed to create conversation: ${error}`);
    }
  }
);

export const addMessage = createAsyncThunk(
  "conversation/addMessage",
  async ({ conversationId, message }: { conversationId: string; message: IMessage }) => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return { conversationId, message };
    } catch (error) {
      throw new Error(`Failed to add message: ${error}`);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<IConversation>) {
      state.conversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.conversation = action.payload;
      })

      .addCase(addMessage.fulfilled, (state, action) => {
        if (state.conversation && state.conversation.id === action.payload.conversationId) {
          state.conversation.messages.push(action.payload.message);
        }
      })
  },
});

export const {
  setConversation,
} = conversationSlice.actions;

export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectConversation = (state: RootState) => state.conversation.conversation;
export const selectIsLoading = (state: RootState) => state.conversation.isLoading;

export default conversationSlice.reducer;
