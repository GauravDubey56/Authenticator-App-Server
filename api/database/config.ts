import { DataSourceOptions } from "typeorm";
import { DB_CONNECT_URL } from "../config/constants";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
const DEFAULT_DB_CONFIG: PostgresConnectionOptions | DataSourceOptions = {
  type: "cockroachdb",
  url: DB_CONNECT_URL,
  ssl: true,
  extra: {
    options: "--cluster=eager-goose-2110",
    application_name: "docs_simplecrud_typeorm",
  },
  migrationsTableName: "migrations",
  synchronize: true,
  logging: false,
  entities: ["dist/database/entity/**/*.js"],
  migrations: ["dist/database/migration/**/*.js"],
  timeTravelQueries: true
};

export default DEFAULT_DB_CONFIG;
