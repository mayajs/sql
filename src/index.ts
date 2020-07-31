import { Database, SqlOptions, ModelList } from './interfaces'

class SqlDatabase implements Database {
  constructor(private options: SqlOptions) {}

  connect(): Promise<any> {
    return Promise.resolve()
  }

  connection(logs: boolean): void {
    return
  }

  models(models: ModelList[]): void {
    return
  }
}

export function Sql(options: SqlOptions): SqlDatabase {
  return new SqlDatabase(options)
}
