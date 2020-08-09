<p align="center"><img src="https://github.com/mayajs/maya/blob/master/maya.svg"></p>
<h1 align="center">SQL Decorators and Modules</h1>

## Installation

- Install Mayajs Sql plugin

```sh
npm i @mayajs/sql
```

- Install [Sequelize](https://sequelize.org/master/manual/getting-started.html). Mayajs uses sequelize as an ORM.

```sh
npm install --save sequelize
```

You'll also have to manually install the driver for your database of choice:

```
# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
```

## Sql

This will creates a MySql Database that will be consume on AppModule class. It accepts an object of settings for mysql connection. This database will be consume by Mayajs in compilation and automatically connects the database when the `start` function is called.

**Import**

```javascript
import { Sql } from "@mayajs/sql";
```

**Implementation**

```javascript
Sql({
  name: "database-name",
  options: {
    database: "sql-database",
    username: "sql-username",
    password: "sql-password",
    options: {
      host: "localhost",
      dialect: "mysql" /* one of 'mariadb' | 'postgres' | 'mssql' */,
    },
  },
  schemas: [
    sample, // Sequelize Schema here
  ],
});
```

Adding `Sql` on `App Decorator`

```javascript
import Sql from "./databases/sql";

@App({
  databases: [Sql],
})
export class AppModule {}
```

## Schema

An interface for table fields. Can be used when creating tables for type checking. Every Schema is an object of fields. Each field has its `type` and `options`.

**Import**

```javascript
import { Schema } from "@mayajs/sql";
```

**Implementation**

```javascript
import { DataTypes } from "sequelize";
import { SqlModel } from "@mayajs/sql";

const schema = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default SqlModel("User", schema, {});
```

# Examples

Check out [live examples](https://github.com/mayajs/sample/crud/sql) for more info.

## Collaborating

See collaborating guides [here.](https://github.com/mayajs/maya/blob/master/COLLABORATOR_GUIDE.md)

## People

Author and maintainer [Mac Ignacio](https://github.com/Mackignacio)
