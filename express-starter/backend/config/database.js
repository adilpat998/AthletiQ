const config = require('./index');

const db = config.db;
const schema = db.schema;
const dbFile = config.dbFile; // This is the path to your SQLite database

module.exports = {
    development: {
        database: "database", // Required for Sequelize (even for SQLite)
        storage: dbFile || "db.sqlite", // Use dbFile from config
        dialect: "sqlite",
        seederStorage: "sequelize",
        logQueryParameters: true,
        typeValidation: true
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            schema
        }
    }
};
