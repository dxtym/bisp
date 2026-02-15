import type { RootState } from "../store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "@/lib/repository/system";


interface ConnectionState {
  url: string;
  schema: Schema[];
}

const initialState: ConnectionState = {
  url: "",
  schema: [],
};

export const getSchema = createAsyncThunk(
  "database/getSchema",
  async ({ url }: { url: string }) => {
    try {
      const response = await fetch(`/api/clickhouse/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      throw new Error(`Failed to connect: ${error}`);
    }

    try {
      const response = await fetch(`/api/clickhouse/schema`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSchema.fulfilled, (state, action) => {
        state.schema = action.payload;
      })
  },
});

export const { setUrl } = connectionSlice.actions;

export const selectUrl = (state: RootState) => state.connection.url;
export const selectSchema = (state: RootState) => state.connection.schema;

export default connectionSlice.reducer;
