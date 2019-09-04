export interface ConnectionOptions {
  connectionString: string; // Connection string
  options?: ConnectionOptions; // Mongoose connect options OPTIONAL
}

export interface Database {
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
}
