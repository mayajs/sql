export interface SqlOptions {
  host: string
  user: string
  password: string
  database?: string
}

export interface ModelList {
  name: string
  path: string
}

export interface Database {
  connect: () => Promise<any>
  connection: (logs: boolean) => void
  models: (array: ModelList[]) => void
}
