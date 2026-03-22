export type Table = {
  name: string;
};

export type Column = {
  name: string;
  type: string;
};

export type Schema = {
  table: string;
  columns: Column[];
};

export type BlobFile = {
  name: string;
  url: string;
};
