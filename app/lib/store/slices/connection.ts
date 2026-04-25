import type { RootState } from "@/lib/store/store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Schema, BlobFile } from "@/lib/repository/common";
import { DbType } from "@/lib/db/types";
import { fetchApi } from "@/lib/store/utils";

export const STORAGE_KEY = "storage_key";
export const FILE_STORAGE_KEY = "file_storage_key";

type Mode = "database" | "file";

interface ConnectionState {
  url: string;
  schema: Schema[];
  loading: boolean;
  mode: Mode;
  fileId: string;
  fileName: string;
  blobs: BlobFile[];
  dbType: DbType;
}

function loadFileStorage(): { fileId: string; blobs: BlobFile[] } {
  if (typeof window === "undefined") return { fileId: "", blobs: [] };
  try {
    const raw = localStorage.getItem(FILE_STORAGE_KEY);
    if (!raw) return { fileId: "", blobs: [] };
    return JSON.parse(raw);
  } catch {
    return { fileId: "", blobs: [] };
  }
}

const saved = loadFileStorage();

const initialState: ConnectionState = {
  url: (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null) || "",
  schema: [],
  loading: false,
  mode: "database",
  fileId: saved.fileId,
  fileName: "",
  blobs: saved.blobs,
  dbType: "clickhouse",
};

export const getSchema = createAsyncThunk(
  "database/getSchema",
  async ({ url }: { url: string }) => {
    const data = await fetchApi<Schema[]>(`/api/clickhouse/schema?url=${url}`);
    localStorage.setItem(STORAGE_KEY, url);
    return data;
  }
);

export const uploadFile = createAsyncThunk(
  "database/uploadFile",
  async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    const data = result.data as { fileId: string; fileName: string; schema: Schema[]; blobs: BlobFile[] };
    localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify({ fileId: data.fileId, blobs: data.blobs }));
    return data;
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
    setMode(state, action: PayloadAction<Mode>) {
      state.mode = action.payload;
      if (action.payload === "database") {
        state.fileId = "";
        state.fileName = "";
        state.blobs = [];
        state.schema = [];
        localStorage.removeItem(FILE_STORAGE_KEY);
      } else {
        state.url = "";
        state.schema = [];
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    setDbType(state, action: PayloadAction<DbType>) {
      if (state.dbType === action.payload) return;
      state.dbType = action.payload;
      state.url = "";
      state.schema = [];
      localStorage.removeItem(STORAGE_KEY);
    },
    clearFile(state) {
      state.fileId = "";
      state.fileName = "";
      state.blobs = [];
      state.schema = [];
      localStorage.removeItem(FILE_STORAGE_KEY);
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
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.fileId = action.payload.fileId;
        state.fileName = action.payload.fileName;
        state.schema = action.payload.schema;
        state.blobs = action.payload.blobs;
        state.loading = false;
      })
      .addCase(uploadFile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUrl, clearUrl, setMode, setDbType, clearFile } = connectionSlice.actions;

export const selectUrl = (state: RootState) => state.connection.url;
export const selectSchema = (state: RootState) => state.connection.schema;
export const selectLoading = (state: RootState) => state.connection.loading;
export const selectMode = (state: RootState) => state.connection.mode;
export const selectFileId = (state: RootState) => state.connection.fileId;
export const selectFileName = (state: RootState) => state.connection.fileName;
export const selectBlobs = (state: RootState) => state.connection.blobs;
export const selectDbType = (state: RootState) => state.connection.dbType;

export default connectionSlice.reducer;
