import { MongoClient } from "mongodb";
import { MONGO_URI, DB_NAME } from "../utils/config";
export const getDbClient = (url: string) => {
    return new MongoClient(url);
}

export const getDbConnection = async () => {
    const client = getDbClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    return db;
}