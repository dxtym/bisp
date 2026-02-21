import type { RootState } from "../store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "@/lib/repository/system";

export const STORAGE_KEY = "storage_key";

interface ConnectionState {
  url: string;
  schema: Schema[];
}

const initialState: ConnectionState = {
  url: localStorage.getItem(STORAGE_KEY) || "",
  schema: [],
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
      .addCase(getSchema.fulfilled, (state, action) => {
        state.schema = action.payload;
      })
  },
});

export const { setUrl, clearUrl } = connectionSlice.actions;

export const selectUrl = (state: RootState) => state.connection.url;
export const selectSchema = (state: RootState) => state.connection.schema;

export default connectionSlice.reducer;
