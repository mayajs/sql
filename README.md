<p align="center"><img src="https://github.com/mayajs/maya/blob/master/maya.svg"></p>
<h1 align="center">SQL Decorators and Modules</h1>

## Installation

```sh
npm i @mayajs/sql
```

## Functions

- [Sql](#sql)
- [Schema](#schema)
- [Query](#query)
- [CreateDatabase](#create-database)
- [CreateTable](#create-table)
- [Insert](#Insert)
- [Select](#Select)
- [Update](#Update)
- [Delete](#Delete)

## Sql

This will creates a MySql Database that will be consume on AppModule class. It accepts an object of settings for mysql connection. This database will be consume by Mayajs in compilation and automatically connects the database when the `start` function is called.

**Import**

```javascript
import { Sql } from "@mayajs/sql";
```

**Implementation**

```javascript
Sql({
  host: "your-host-name",
  user: "your-user-name",
  password: "your-user-password",
  database: "your-database-name", // optional
});
```

Adding `Sql` on `App Decorator`

```javascript
@App({
  database: Sql({
    host: env.HOST || "",
    user: env.USER || "",
    password: env.PASSWORD || "",
    database: env.DATABASE || "",
  }),
})
export class AppModule {}
```

## Schema

An interface for table fields. Can be used when creating tables for type checking. Every Schema is an object of fields. Each field has its `type` and `options`.

**Import**

```javascript
import { Schema } from "@mayajs/sql";
```

#### Field

- `type` : **`( String )`** This will set the type of the field.

* `options` : **`( String )`** Sets the following properties : \***\*OPTIONAL\*\***.
  - Attributes
  - Null
  - Default
  - Comments
  - Extra

**Implementation**

```javascript
// Fields to be created
const fields: Schema = {
  id: { type: "INT(6)", options: "UNSIGNED AUTO_INCREMENT PRIMARY KEY" },
  firstname: { type: "VARCHAR(30)", options: "NOT NULL" },
  lastname: { type: "VARCHAR(30)", options: "NOT NULL" },
  email: { type: "VARCHAR(50)", options: "NOT NULL" },
  reg_date: { type: "TIMESTAMP", options: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" },
};
```

## Query

This function is a general purpose for executing query to the database. Its supports all `SQL queries` in the form of string. It will return a `Promise<T>` if the query is succesful and `MySql Error Object` if its failed.

**Import**

```javascript
import { Query } from "@mayajs/sql";
```

**Implementation**

```javascript
// Promise
Query("your-query-here")
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await Query("your-query-here");
  return result;
} catch (error) {
  return error;
}
```

## Create database

This function will create a database. It accepts the `name` of database. It will return an `success object` if the table is successfully created and an `error object` if its failed.

**Parameter**

- `name` : **`( String )`** The name of the database.

**Import**

```javascript
import { CreateDatabase } from "@mayajs/sql";
```

**Implementation**

```javascript
// Promise
CreateDatabase("databse-name")
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await CreateDatabase("databse-name");
  return result;
} catch (error) {
  return error;
}
```

## Create table

This function will create a table in the speficied database. It accepts `name` and `fields` as arguments. It will return an `success object` if the table is successfully created and an `error object` if its failed.

**Parameter**

- `name` : **`( String )`** The name of the table.
- `fields` : **`( Schema )`** Object of fields.

**Import**

```javascript
import { CreateTable } from "@mayajs/sql";
```

**Implementation**

```javascript
// Promise
CreateTable("table-name", fields)
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await CreateTable("table-name", fields);
  return result;
} catch (error) {
  return error;
}
```

## Insert

This function will insert data on a table in the database. It accepts `table` and `fields` as arguments. It will return an `object` if the query is successful and an `error object` if its failed.

**Parameter**

- `name` : **`( String )`** The name of the table.
- `fields` : **`( { [name: string]: any } )`** Fields object.

**Import**

```javascript
import { Insert } from "@mayajs/sql";
```

**Implementation**

```javascript
// Fields to be insert
const fields = {
  firstname: "",
  lastname: "",
  email: "",
};

// Promise
Insert("table-name", fields)
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await Insert("table-name", fields);
  return result;
} catch (error) {
  return error;
}
```

## Select

This function will select data on a table in the database. It accepts `options` for the select query. It will return the result of the query if the query if its successful and an `error object` if its failed.

**Parameter**

- `options` : **`( Object )`** Query options.
  - `table` : **`( String )`** Name of the table.
  - `where` : **`( String )`** Equivalent to `WHERE` clause in SQL query. \***\*OPTIONAL\*\***.
  - `join` : **`( String )`** Equivalent to `JOIN` clause in SQL query. \***\*OPTIONAL\*\***.
  - `orderBy` : **`( String )`** Equivalent to `ORDER BY` clause in SQL query. \***\*OPTIONAL\*\***.
  - `limit` : **`( Number )`** Equivalent to `LIMIT` clause in SQL query. \***\*OPTIONAL\*\***.

**Import**

```javascript
import { Select } from "@mayajs/sql";
```

**Implementation**

```javascript
// Select OPTIONS
const options = {
  table: "* FROM customers",
  where: "id=1",
  join: "products ON customers.favorite_product = products.id",
  orderBy: "id DESC",
  limit: 100,
};

// Promise
Select(options)
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await Select(options);
  return result;
} catch (error) {
  return error;
}
```

## Update

This function will update data on a table in the database. It accepts `table` name, `fields` object and an optional `where` condition. It will return the result of the query if its successful and an `error object` if its failed.

**Parameter**

- `table` : **`( String )`** Name of the table.
- `fields` : **`( { [name: string]: any } )`** Fields object.
- `where` : **`( String )`** Equivalent to `WHERE` clause in SQL query.

**Import**

```javascript
import { Update } from "@mayajs/sql";
```

**Implementation**

```javascript
const table = "test";
const fields = {
  firstname: "",
  lastname: "",
  email: "",
};
const where = "id=1";

// Promise
Update(table, fields, where)
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await Update(table, fields, where);
  return result;
} catch (error) {
  return error;
}
```

## Delete

This function will delete data on a table in the database. It accepts `table` name and an optional `where` condition. It will return the result of the query if its successful and an `error object` if its failed.

**Parameter**

- `table` : **`( String )`** Name of the table.
- `where` : **`( String )`** Equivalent to `WHERE` clause in SQL query.

**Import**

```javascript
import { Delete } from "@mayajs/sql";
```

**Implementation**

```javascript
// Promise
Delete("test", "id=1")
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/Await
try {
  const result = await Delete("test", "id=1");
  return result;
} catch (error) {
  return error;
}
```
