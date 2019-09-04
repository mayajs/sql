import { ConnectionOptions, Database } from "./interfaces";

class SqlDatabse implements Database {
  connect(): Promise<any> {
    return Promise.resolve();
  }

  connection(logs: boolean): void {
    return;
  }
}

export function Sql(options: ConnectionOptions): SqlDatabse {
  return new SqlDatabse();
}
