import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ModalState {
  isOpen: boolean;
  table: Record<string, unknown>[];
}

const initialState: ModalState = {
  isOpen: false,
  table: [],
};

export const executeQuery = createAsyncThunk(
  "modal/executeQuery",
  async (query: string) => {
    try {
      const response = await fetch("/api/clickhouse/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data?.data as Record<string, unknown>[];
    } catch (error) {
      throw new Error(`Failed to execute query: ${error}`);
    }
  }
);

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state) {
      state.isOpen = true;
    },
    closeModal(state) {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(executeQuery.fulfilled, (state, action: PayloadAction<Record<string, unknown>[]>) => {
      state.table = action.payload;
    });
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
