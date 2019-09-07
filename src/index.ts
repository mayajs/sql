import { ConnectionOptions, Database, Schema } from "./interfaces";
import mysql, { Connection } from "mysql";

let db: Connection;

class SqlDatabase implements Database {
  constructor(private options: ConnectionOptions) {}

  connect(): Promise<any> {
    db = mysql.createConnection(this.options);

    return new Promise((resolve: any, reject: any) => {
      db.connect((err: any) => {
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

function Query<T>(query: string, value?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    const callback = (error: any, result: any) => (error ? reject(error) : resolve(result));
    try {
      if (value) {
        db.query(query, value, callback);
        return;
      }
      db.query(query, callback);
    } catch (error) {
      reject(error);
    }
  });
}

function CreateDatabase<T>(name: string): Promise<T> {
  return Query<T>(`CREATE DATABASE ${name}`);
}

function CreateTable<T>(name: string, fields: Schema): Promise<T> {
  const query: string = Object.keys(fields)
    .map(key => {
      const { type, options } = fields[key];
      return `${key} ${type} ${options ? options : ""}`;
    })
    .join();
  return Query<T>(`CREATE TABLE ${name} (${query})`);
}

function Insert<T>(table: string, fields: { [name: string]: any }): Promise<T> {
  const query = Object.keys(fields);
  const values = query.map(key => `'${fields[key]}'`).join();
  return Query<T>(`INSERT INTO ${table} (${query.join()}) VALUES (${values})`);
}

function Select<T>(options: { table: string; columns?: string[]; where?: string; join?: string; orderBy?: string; limit?: number } | string): Promise<T> {
  let query = `SELECT ${options}`;
  if (typeof options !== "string") {
    const { columns, table, join = "", where = "", orderBy = "", limit = "" } = options;
    query = `SELECT ${columns ? `${columns.join(`,`)}` : "*"} FROM ${table} ${join} ${where} ${limit ? `LIMIT ${limit}` : ""} ${
      orderBy ? `ORDER BY ${orderBy}` : ""
    }`;
  }

  return Query<T>(query);
}

function Delete<T>(table: string, condition: string): Promise<T> {
  return Query<T>(`DELETE FROM ${table} WHERE ${condition}`);
}

function Update<T>(table: string, fields: { [name: string]: any }, where: { [name: string]: string }): Promise<T> {
  const filedsKey = Object.keys(fields);
  const whereKey = Object.keys(where);
  const values = filedsKey.map(key => `'${fields[key]}'`).join();
  const condition = whereKey.map((key: any) => `'${whereKey[key]}'`).join();
  return Query<T>(`UPDATE ${table} SET ${values} WHERE ${condition}`);
}

export { Query, Sql, Schema, CreateDatabase, CreateTable, Insert, Select, Delete, Update };
