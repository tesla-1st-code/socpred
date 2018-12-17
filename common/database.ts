import * as Sequelize from 'sequelize';

const ENV = require("../env.json")[process.env.NODE_ENV || "development"];

export let DbContext = new Sequelize(ENV['db_name'], ENV['db_user'], ENV['db_pass'], {
    host: ENV['db_host'],
    port: ENV['db_port'],
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 30,
        min: 0,
        idle: 10000,
        acquire: 40000
    }
});