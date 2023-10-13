import DEFAULT_DB_CONFIG from "./config";
import { DataSource } from "typeorm";

const DataSourceInstance = new DataSource(DEFAULT_DB_CONFIG);
export default DataSourceInstance;
