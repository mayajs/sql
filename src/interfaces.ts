import { Options, ModelCtor, Model, ModelAttributes, ModelOptions } from "sequelize";

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
  name: string;
  schemas?: any[];
  options: ISqlUriConnection | ISqlConnection | Options | string;
}

export interface ModelList {
  name: string;
  path: string;
}

export interface SqlModelDictionary {
  [key: string]: ModelCtor<Model<any, any>>;
}

export interface Database {
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
  models: () => void;
}

export interface SchemaObject {
  name: string;
  schema: ModelAttributes;
  options: ModelOptions;
}
