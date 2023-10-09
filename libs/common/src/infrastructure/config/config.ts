import { ConfigProps } from "../interfaces/config.interface";

export const config = (): ConfigProps => ({
    defaultLanguage: 'en',
    port: parseInt(process.env.PORT || '8080', 10),
    api: {
        apiUrl: process.env.API_URL,
        httpTimeout: 1000,
    },
    database: {
        type: process.env.DB_TYPE || 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'affiliate_refactor_db',
      },
});