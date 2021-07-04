import { Services } from "@mayajs/router";
import { Options, Sequelize } from "sequelize";
import { SqlOptions, SqlDatabases, SqlConnection, SqlUriConnection, SchemaObject, SqlInstance } from "./interfaces";

export class SqlServices extends Services {
  private list: SqlDatabases;

  constructor() {
    super();
    this.list = {};
  }

  async connect(name: string) {
    const db = this.list[name];
    try {
      const instance = this.createDbInstance(db.options);
      await instance.authenticate();
      this.list[name].instance = instance;
      console.log(`\x1b[32m[mayajs] ${name} is connected!\x1b[0m`);
      return instance;
    } catch (error) {
      console.log(error);
    }
  }

  set options(value: SqlOptions) {
    const { name, ...rest } = value;
    this.list[name] = { ...rest, instance: new Sequelize({ dialect: "mysql" }), models: {} };
  }

  database(name: string): SqlInstance {
    return this.list[name];
  }

  mapSchemas(name: string): void {
    const db = this.list[name];
    if (db.schemas && db.schemas?.length > 0) {
      db.instance.sync({ alter: true });
      db.schemas.map(({ name, schema, options = {} }: SchemaObject) => db.instance.define(name.toLocaleLowerCase(), schema, options));
      db.models = db.instance.models;
    }
  }

  /**
   * Creates a Sequelize instance.
   *
   * @param  {SqlUriConnection | SqlConnection | Options | string} settings
   * @returns Sequelize
   */
  private createDbInstance(settings?: SqlUriConnection | SqlConnection | Options | string): Sequelize {
    const { uri, options = {} } = settings as SqlUriConnection;
    options.logging = false;
    if (uri) {
      return new Sequelize(uri, options);
    }

    const { database, username, password = "" } = settings as SqlConnection;

    if (database) {
      return new Sequelize(database, username, password, options);
    }

    return new Sequelize(settings as Options);
  }
}
