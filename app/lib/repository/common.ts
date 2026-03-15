export type Table = {
  name: string;
};

export type Column = {
  name: string;
  type: string;
};

export type Schema = {
  table: string;
  columns: string[];
};
