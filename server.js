const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const pool = require('./db');
const Config = require('./api/config/data');
const routes = require('./api/routes')

const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('views', path.join(__dirname, 'views'));
app.use("/", routes)

app.listen(Config.env_data.PORT, () => {
    console.log(`Server started on port ${Config.env_data.PORT}`);
    pool.connect()
        .then(() => console.log('connected to the database...'))
        .catch(() => console.log('error connecting to the database ...'));
});