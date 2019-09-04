import { ConnectionOptions, Database } from "./interfaces";
import mysql, { Connection } from "mysql";

let query: Connection;

class SqlDatabase implements Database {
  constructor(private options: ConnectionOptions) {}

  connect(): Promise<any> {
    query = mysql.createConnection(this.options);

    return new Promise((resolve: any, reject: any) => {
      query.connect((err: any) => {
        return err ? reject(err.stack) : resolve();
      });
    });
  }

  connection(logs: boolean): void {
    return;
  }
}

function Sql(options: ConnectionOptions): SqlDatabase {
  const sql = new SqlDatabase(options);
  return sql;
}

function Query(): Connection {
  return query;
}

export { Query, Sql };
