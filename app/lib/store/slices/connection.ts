import type { RootState } from "../store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "@/lib/repository/system";

export const STORAGE_KEY = "storage_key";

interface ConnectionState {
  url: string;
  schema: Schema[];
  loading: boolean;
}

const initialState: ConnectionState = {
  url: (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null) || "",
  schema: [],
  loading: false,
};

export const getSchema = createAsyncThunk(
  "database/getSchema",
  async ({ url }: { url: string }) => {
    try {
      const response = await fetch(`/api/clickhouse/schema?url=${url}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      localStorage.setItem(STORAGE_KEY, url);
      return result.data as Schema[];
    } catch (error) {
      throw new Error(`Failed to get schema: ${error}`);
    }
  }
);

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setUrl(state, action: PayloadAction<string>) {
      state.url = action.payload;
    },
    clearUrl(state) {
      state.url = "";
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSchema.fulfilled, (state, action) => {
        state.schema = action.payload;
        state.loading = false;
      })
      .addCase(getSchema.rejected, (state) => {
        state.loading = false;
      })
  },
});

export const { setUrl, clearUrl } = connectionSlice.actions;

export const selectUrl = (state: RootState) => state.connection.url;
export const selectSchema = (state: RootState) => state.connection.schema;
export const selectLoading = (state: RootState) => state.connection.loading;

export default connectionSlice.reducer;
