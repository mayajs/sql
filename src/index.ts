import { Sequelize, ModelAttributes, Options, ModelOptions } from "sequelize";
import { Database, SqlOptions, ISqlUriConnection, ISqlConnection, SchemaObject, SqlModelDictionary } from "./interfaces";

const logger = {
  gray: (message: string) => console.log(`\x1b[32m[mayajs]\x1b[0m ${message}`),
  green: (message: string) => console.log(`\x1b[32m[mayajs] ${message}\x1b[0m`),
  yellow: (message: string) => console.log(`\x1b[33m[mayajs] ${message}\x1b[0m`),
};

let models: SqlModelDictionary = {};

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
    const name = this.dbName[0].toUpperCase() + this.dbName.slice(1);
    const connecting = setInterval(
      this.onConnecting(logs, () => clearInterval(connecting)),
      1000,
    );

    this.logs = logs;
    this.dbInstance = this.createDbInstance(this.connectionOptions);

    // @ts-ignore:disable-next-line
    this.dbInstance.beforeConnect(this.beforeConnect(name));

    // @ts-ignore:disable-next-line
    this.dbInstance.afterConnect(this.afterConnect(name));
  }

  /**
   * Iterates schema list and define individual model.
   *
   * @returns SqlModelDictionary
   */
  models(): SqlModelDictionary {
    this.dbInstance.sync({ alter: true });
    this.schemas.map(({ name, schema, options = {} }: SchemaObject) => this.dbInstance.define(name.toLocaleLowerCase(), schema, options));
    models = this.dbInstance.models;
    return models;
  }

  private onConnecting(logs: boolean, onConnect: () => void): () => void {
    return () => {
      if (this.isConnected) {
        return onConnect();
      }

      if (logs) {
        console.log(`\x1b[33m[mayajs] Waiting for ${this.dbName} database to connect.\x1b[0m`);
      }
    };
  }

  private beforeConnect(name: string): () => void {
    return () => {
      if (!this.isConnected) {
        logger.yellow(`Waiting for ${name} database to connect.`);
      }
    };
  }

  private afterConnect(name: string): () => void {
    return () => {
      if (!this.isConnected) {
        this.isConnected = true;
        logger.green(`${name} database is connected.`);
      }
    };
  }

  /**
   * Creates a Sequelize instance.
   *
   * @param  {ISqlUriConnection | ISqlConnection | Options | string} settings
   * @returns Sequelize
   */
  private createDbInstance(settings?: ISqlUriConnection | ISqlConnection | Options | string): Sequelize {
    const { uri, options = {} } = settings as ISqlUriConnection;
    options.logging = false;

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

export function Models(name: string): any {
  return (target: any, key: string): any => {
    // property value
    let value = target[key];

    // property getter method
    const getter = () => {
      return models[name];
    };

    // property setter method
    const setter = (newVal: string) => {
      value = models[newVal];
    };

    // Delete property.
    if (delete target[key]) {
      // Create new property with getter and setter
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter,
      });
    }
  };
}
