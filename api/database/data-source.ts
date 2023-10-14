import Logger from "../utils/logging";
import DEFAULT_DB_CONFIG from "./config";
import { DataSource } from "typeorm";

const Db = new DataSource(DEFAULT_DB_CONFIG);
Db.initialize()
  .then((resp) => {
    Logger.log(`Database connection successful, init: `, resp.isInitialized);
  })
  .catch((error) => {
    Logger.error("Database connection error", error);
  });
export default Db;
