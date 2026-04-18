import type { IConversation, IMessage } from "@/lib/mongodb/models/conversation";
import type { RootState } from "@/lib/store/store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchApi } from "@/lib/store/utils";

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
  (userId: string) =>
    fetchApi<IConversation[]>(`/api/conversation?user_id=${userId}`)
);

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  ({ userId, title }: { userId: string; title: string }) =>
    fetchApi<IConversation>("/api/conversation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title }),
    })
);

export const addMessage = createAsyncThunk(
  "conversation/addMessage",
  async ({ conversationId, message }: { conversationId: string; message: IMessage }) => {
    await fetchApi(`/api/conversation/${conversationId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return { conversationId, message };
  }
);

export const updateConversationTitle = createAsyncThunk(
  "conversation/updateConversationTitle",
  ({ conversationId, title }: { conversationId: string; title: string }) =>
    fetchApi<IConversation>(`/api/conversation/${conversationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
);

export const removeConversation = createAsyncThunk(
  "conversation/removeConversation",
  async (conversationId: string) => {
    await fetchApi(`/api/conversation/${conversationId}`, { method: "DELETE" });
    return conversationId;
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
      .addCase(fetchConversations.pending, (state) => { state.isLoading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchConversations.rejected, (state) => { state.isLoading = false; })

      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.conversation = action.payload;
      })

      .addCase(updateConversationTitle.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.conversations.findIndex((c) => c.id === updated.id);
        if (index !== -1) state.conversations[index] = updated;
        if (state.conversation?.id === updated.id) state.conversation = updated;
      })

      .addCase(addMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        const index = state.conversations.findIndex((c) => c.id === conversationId);
        if (index !== -1) state.conversations[index].messages.push(message);
        if (state.conversation?.id === conversationId) state.conversation.messages.push(message);
      })

      .addCase(removeConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter((c) => c.id !== action.payload);
        if (state.conversation?.id === action.payload) state.conversation = null;
      });
  },
});

export const { setConversation } = conversationSlice.actions;

export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectConversation = (state: RootState) => state.conversation.conversation;
export const selectIsLoading = (state: RootState) => state.conversation.isLoading;

export default conversationSlice.reducer;
