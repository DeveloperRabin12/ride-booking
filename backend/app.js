const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const express = require('express');
const app = express();
const cookieparser = require('cookie-parser'); //importing cookie-parser to parse cookies
const dbConnect = require('./dbs/dbConnect'); //importing dbConnect function from dbConnect.js
const userRoutes = require('./routes/userRoutes'); //importing userRoutes from userRoutes.js
const riderRoutes = require('./routes/riderRoutes'); //importing riderRoutes from riderRoutes.js


//calling dbConnect function to connect to the database
dbConnect();

app.use(cookieparser()); //using cookie-parser middleware to parse cookies
app.use(express.json()); //using express.json() middleware to parse json data
app.use(express.urlencoded({ extended: true })); //using express.urlencoded() middleware to parse urlencoded data

app.get('/', (req, res) => {
    res.send('thisis root page');    
});

app.use('/users', userRoutes); //using userRoutes for /user endpoint
app.use('/riders',riderRoutes);

module.exports = app; //exporting the app to use in server.js
