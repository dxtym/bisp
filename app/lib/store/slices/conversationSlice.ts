import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { IConversation, IMessage } from "@/lib/mongodb/models/conversation";

interface ConversationState {
  conversations: IConversation[];
  activeConversationId: string | null;
  activeConversation: IConversation | null;
  isLoading: boolean;
}

const initialState: ConversationState = {
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  isLoading: false,
};

export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async (userId: string) => {
    const response = await fetch(
      `/api/conversation?userId=${encodeURIComponent(userId)}`
    );
    const result = await response.json();
    if (result.success) {
      return result.data as IConversation[];
    }
    throw new Error("Failed to fetch conversations");
  }
);

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  async (
    { userId, title }: { userId: string; title?: string },
    { dispatch }
  ) => {
    const response = await fetch("/api/conversation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error("Failed to create conversation");
    }

    await dispatch(fetchConversations(userId));
    return result.data as IConversation;
  }
);

export const fetchActiveConversation = createAsyncThunk(
  "conversation/fetchActiveConversation",
  async (conversationId: string) => {
    const response = await fetch(
      `/api/conversation/${encodeURIComponent(conversationId)}`
    );
    const result = await response.json();
    if (result.success) {
      return result.data as IConversation;
    }
    throw new Error("Failed to fetch conversation");
  }
);

export const updateMessages = createAsyncThunk(
  "conversation/updateMessages",
  async ({
    conversationId,
    messages,
  }: {
    conversationId: string;
    messages: IMessage[];
  }) => {
    const response = await fetch(
      `/api/conversation/${encodeURIComponent(conversationId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }
    );

    const result = await response.json();
    if (!result.success) {
      throw new Error("Failed to update messages");
    }

    return { conversationId, messages };
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setActiveConversationId(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
      if (action.payload === null) {
        state.activeConversation = null;
      }
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
      });

    builder.addCase(createConversation.fulfilled, (state, action) => {
      state.activeConversationId = action.payload.conversationId;
    });

    builder
      .addCase(fetchActiveConversation.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
      })
      .addCase(fetchActiveConversation.rejected, (state) => {
        state.activeConversation = null;
      });

    builder.addCase(updateMessages.fulfilled, (state, action) => {
      const { conversationId, messages } = action.payload;

      state.conversations = state.conversations.map((c) =>
        c.conversationId === conversationId ? { ...c, messages } : c
      );

      if (state.activeConversationId === conversationId && state.activeConversation) {
        state.activeConversation = { ...state.activeConversation, messages };
      }
    });
  },
});

export const { setActiveConversationId } = conversationSlice.actions;
export default conversationSlice.reducer;
