import { Options } from "sequelize";

export interface ISqlConnection {
  database: string;
  username: string;
  password?: string;
  options?: Options;
}

export interface ISqlUriConnection {
  uri: string;
  options?: Options;
}

export interface SqlOptions {
  name?: string;
  schemas?: any[];
  options?: Options;
}

export interface ModelList {
  name: string;
  path: string;
}

export interface Database {
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
  models: (array: ModelList[]) => void;
}
