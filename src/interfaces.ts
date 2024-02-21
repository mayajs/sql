import { Options, ModelAttributes, ModelOptions, ModelStatic, Model, Sequelize } from "sequelize";

interface SqlInstanceProps {
  options: SqlUriConnection | SqlConnection | Options | string;
  schemas: SchemaObject[];
}

export interface SqlConnection {
  database: string;
  username: string;
  password?: string;
  options?: Options;
}

export interface SqlUriConnection {
  uri: string;
  options?: Options;
}

export interface SqlOptions extends SqlInstanceProps {
  name: string;
}
export interface SqlModelDictionary {
  [key: string]: ModelStatic<Model<any, any>>;
}

export interface SqlInstance extends SqlInstanceProps {
  instance: Sequelize;
  models: SqlModelDictionary;
}

export interface SqlDatabases {
  [x: string]: SqlInstance;
}

export interface SchemaObject {
  name: string;
  schema: ModelAttributes;
  options?: ModelOptions;
}
