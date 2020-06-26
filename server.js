const express = require('express');
const app = express();

//Import Routes
const routes = require('./api/routes');

app.use('/', routes);

app.listen(3000, () => {
    console.log(`Server started on port: 3000`);
});