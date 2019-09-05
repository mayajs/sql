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

function Insert<T>(name: string, fields: { [name: string]: any }): Promise<T> {
  const query = Object.keys(fields);
  const values = query.map(key => `'${fields[key]}'`).join();
  return Query<T>(`INSERT INTO ${name} (${query.join()}) VALUES (${values})`);
}

function Select<T>(select: string, where?: string, join?: string): Promise<T> {
  return Query<T>(`SELECT ${select} ${join ? join : ""} ${where ? where : ""}`);
}

export { Query, Sql, Schema, CreateDatabase, CreateTable, Insert, Select };
