import { Sequelize, ModelAttributes, Options } from "sequelize";
import { Database, SqlOptions, ModelList, ISqlUriConnection, ISqlConnection, SchemaObject } from "./interfaces";

class SqlDatabase implements Database {
  private dbInstance: Sequelize;
  private dbName: string;
  private schemas: SchemaObject[] = [];

  get name(): string {
    return this.dbName;
  }

  get instance(): Sequelize {
    return this.dbInstance;
  }

  /**
   * @param {SqlOptions} options
   */
  constructor({ options, name, schemas = [] }: SqlOptions) {
    this.dbName = name;
    this.schemas = schemas;
    this.dbInstance = this.createDbInstance(options);
  }

  /**
   * Creates and connects to the database instance.
   *
   * @returns Promise
   */
  async connect(): Promise<boolean> {
    try {
      await this.dbInstance.sync();

      return true;
    } catch (error) {
      console.error("Unable to sync to the database:", error);

      return false;
    }
  }

  /**
   * Checks if there is an existing database connection.
   *
   * @param  {boolean} logs
   * @returns void
   */
  connection(logs: boolean): void {
    this.dbInstance
      .authenticate()
      .then(() => {
        if (logs) {
          console.log("Connection has been established successfully.");
        }
      })
      .catch(error => {
        console.error("Unable to connect to the database:", error);
      });
  }

  /**
   * Iterates model list.
   *
   * @param  {ModelList[]} models
   * @returns void
   */
  models(): void {
    this.schemas.map(({ name, schema, options = {} }: SchemaObject) => this.dbInstance.define(name, schema, options));
  }

  /**
   * Creates a Sequelize instance.
   *
   * @param  {ISqlUriConnection | ISqlConnection | Options | string} settings
   * @returns Sequelize
   */
  private createDbInstance(settings?: ISqlUriConnection | ISqlConnection | Options | string): Sequelize {
    const { uri, options = {} } = settings as ISqlUriConnection;

    if (uri) {
      return new Sequelize(uri, options);
    }

    const { database, username, password = "" } = settings as ISqlConnection;

    if (database) {
      return new Sequelize(database, username, password, options);
    }

    return new Sequelize(settings as Options);
  }
}

export function Sql(options: SqlOptions): SqlDatabase {
  return new SqlDatabase(options);
}
