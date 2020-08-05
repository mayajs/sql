import { Sequelize, ModelAttributes, Options, ModelOptions } from "sequelize";
import { Database, SqlOptions, ISqlUriConnection, ISqlConnection, SchemaObject, SqlModelDictionary } from "./interfaces";

const logger = {
  gray: (message: string) => console.log(`\x1b[32m[mayajs]\x1b[0m ${message}`),
  green: (message: string) => console.log(`\x1b[32m[mayajs] ${message}\x1b[0m`),
  yellow: (message: string) => console.log(`\x1b[33m[mayajs] ${message}\x1b[0m`),
};

class SqlDatabase implements Database {
  private dbInstance!: Sequelize;
  private dbName: string;
  private schemas: SchemaObject[] = [];
  private connectionOptions: string | ISqlUriConnection | ISqlConnection | Options;
  private logs!: boolean;
  private isConnected = false;

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
    this.connectionOptions = options;
  }

  /**
   * Creates and connects to the database instance.
   *
   * @returns Promise<boolean>
   */
  async connect(): Promise<any> {
    try {
      this.dbInstance = this.createDbInstance(this.connectionOptions);

      // @ts-ignore:disable-next-line
      this.dbInstance.beforeConnect(async (config: any) => {
        if (!this.isConnected) {
          const name = this.dbName[0].toUpperCase() + this.dbName.slice(1);
          logger.yellow(`Waiting for ${name} sql database to connect.`);
        }
      });

      return this.dbInstance.authenticate();
    } catch (error) {
      console.error("Unable to sync to the database:", error);
    }
  }

  /**
   * Checks if there is an existing database connection.
   *
   * @param  {boolean} logs
   * @returns void
   */
  connection(logs: boolean): void {
    this.logs = logs;

    // @ts-ignore:disable-next-line
    this.dbInstance.afterConnect(async (config: any) => {
      if (!this.isConnected) {
        this.isConnected = true;
        const name = this.dbName[0].toUpperCase() + this.dbName.slice(1);
        logger.green(`${name} database is connected.`);
      }
    });
  }

  /**
   * Iterates schema list and define individual model.
   *
   * @returns SqlModelDictionary
   */
  models(): SqlModelDictionary {
    this.dbInstance.sync({ alter: true });
    this.schemas.map(({ name, schema, options = {} }: SchemaObject) => this.dbInstance.define(name.toLocaleLowerCase(), schema, options));
    return this.dbInstance.models;
  }

  /**
   * Creates a Sequelize instance.
   *
   * @param  {ISqlUriConnection | ISqlConnection | Options | string} settings
   * @returns Sequelize
   */
  private createDbInstance(settings?: ISqlUriConnection | ISqlConnection | Options | string): Sequelize {
    const { uri, options = {} } = settings as ISqlUriConnection;
    options.logging = (...msg) => {
      if (this.logs) {
        logger.gray(msg[0]);
      }
    };

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

export function SqlModel(name: string, schema: ModelAttributes, options: ModelOptions = {}): SchemaObject {
  return { name, schema, options };
}
