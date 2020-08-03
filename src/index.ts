import { Sequelize, ModelAttributes } from 'sequelize'

import { Database, SqlOptions, ModelList } from './interfaces'

class SqlDatabase implements Database {
  dbInstance: Sequelize = new Sequelize()

  options: SqlOptions

  /**
   * @param {SqlOptions} options
   */
  constructor(options: SqlOptions) {
    this.options = options
  }

  /**
   * Creates and connects to the database instance.
   *
   * @returns Promise
   */
  async connect(): Promise<boolean> {
    try {
      this.dbInstance = new Sequelize(this.options.options)

      await this.dbInstance.sync()

      return true
    } catch (error) {
      console.error('Unable to sync to the database:', error)

      return false
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
          console.log('Connection has been established successfully.')
        }
      })
      .catch((error) => {
        console.error('Unable to connect to the database:', error)
      })
  }
  /**
   * Iterates model list.
   *
   * @param  {ModelList[]} models
   * @returns void
   */
  models(models: ModelList[]): void {
    models.forEach(async (model) => {
      const instance = await import(model.path)

      const { name, schema } = instance.default ?? instance

      this.addModel(name, schema)
    })
  }
  /**
   * Defines schema to sequelize.
   *
   * @param  {string} name
   * @param  {ModelAttributes} schema
   * @returns void
   */
  addModel(name: string, schema: ModelAttributes): void {
    this.dbInstance.define(name, schema)
  }
}

export function Sql(options: SqlOptions): SqlDatabase {
  return new SqlDatabase(options)
}
