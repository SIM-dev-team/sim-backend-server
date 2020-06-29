const Pool = require('pg').Pool;
const Config = require('./api/config/data')

const pool = new Pool(Config.env_data.POSTGRE_DB);

module.exports = pool;