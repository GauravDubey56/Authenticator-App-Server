require('dotenv').config()
export const MONGO_URI: string = process.env.MONGO_URI || '';
export const JWT_SECRET: string = process.env.JWT_SECRET || '';
export const ENC_TOKEN: string = process.env.ENC_TOKEN || '';