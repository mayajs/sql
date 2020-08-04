import { Sequelize, ModelAttributes, Options } from "sequelize";
import { Database, SqlOptions, ModelList, ISqlUriConnection, ISqlConnection } from "./interfaces";

class SqlDatabase implements Database {
  private dbInstance: Sequelize;
  private dbName: string;

  /**
   * @param {SqlOptions} options
   */
  constructor({ options, name, schemas = [] }: SqlOptions) {
    this.dbName = name;
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
  models(models: ModelList[]): void {
    models.forEach(async model => {
      const instance = await import(model.path);

      const { name, schema } = instance.default ?? instance;

      this.addModel(name, schema);
    });
  }
  /**
   * Defines schema to sequelize.
   *
   * @param  {string} name
   * @param  {ModelAttributes} schema
   * @returns void
   */
  addModel(name: string, schema: ModelAttributes): void {
    this.dbInstance.define(name, schema);
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
