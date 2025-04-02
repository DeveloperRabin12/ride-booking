const express = require ('express');
const app = express();
const dbConnect = require('./dbs/dbConnect');

dbConnect();

app.get('/', (req, res) => {
    res.send('Hello World');    
});



module.exports = app;