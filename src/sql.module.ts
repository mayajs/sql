import { CustomModule, ModuleWithProviders } from "@mayajs/router";
import { SqlOptions } from "./interfaces";
import { SqlServices } from "./sql.service";

export class SqlModule extends CustomModule {
  static options: SqlOptions;

  static forRoot(options: SqlOptions): ModuleWithProviders {
    this.options = options;
    return { module: SqlModule, providers: [SqlServices], dependencies: [SqlServices], imports: [] };
  }

  constructor(private service: SqlServices) {
    super();
  }

  invoke(): void {
    this.service.options = SqlModule.options;
    this.service.connect(SqlModule.options.name);
    this.service.mapSchemas(SqlModule.options.name);
  }
}
