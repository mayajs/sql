export interface ConnectionOptions {
  host: string;
  user: string;
  password: string;
  database?: string;
}

export interface Database {
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
}

export interface ITransaction {
  begin: () => Promise<any>;
  commit: () => Promise<any>;
  rollback: () => Promise<any>;
}

export interface Schema {
  [k: string]: Field;
}

interface Field {
  type: string;
  options?: string;
}
