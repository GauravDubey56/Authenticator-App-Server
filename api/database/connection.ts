import { DataSource, DataSourceOptions } from "typeorm";
import DEFAULT_DB_CONFIG from "./config";
import { DB_CONNECT_URL } from "../config/constants";
class DatabaseConnection extends DataSource {
  #dbConnectionUrl: string;
  private static connection: any;
  private constructor(url: string, dbConfig: DataSourceOptions) {
    super(dbConfig);
    this.#dbConnectionUrl = url;
  }
  static getInstance(url?: string) {
    if (!url) {
      url = DB_CONNECT_URL;
    }
    if (this.connection) {
      return this.connection;
    }
    this.connection = new DatabaseConnection(url, DEFAULT_DB_CONFIG);
    return this.connection;
  }
}

export default DatabaseConnection;
