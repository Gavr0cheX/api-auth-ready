
const APPconfig = require('./admin/config.js').app; // Import APP config
const express = require('express');                 // Import Express Framework
var http = require('http');                        // Import HTTP requests liberary
const morgan = require('morgan');                   // Import HTTP request logger
const parser = require('body-parser');              // Import body-parser middleware for simpler request bodies
const path = require('path');

const app = express();                              // Declaring express as the app framework
const port = process.env.PORT || APPconfig.port;    // Declaring APP Port
const { logEvents , reqLogger } = require('./middlewares/logEvents');
const verifyJWT = require('./middlewares/verifyJWT');
const cookieParser = require('cookie-parser');

// Initializing server
var server = http.createServer(app);

// this will parse Content-Type: application/json 
app.use(parser.json()); 

// this will parse Content-Type:  application/x-www-form-urlencoded
app.use(parser.urlencoded({ extended: true })); 

// This will declare dev logging for morgan HTTP requests
app.use(morgan('dev'));

// This will activate the logging middleware
app.use(reqLogger);

// This will activate the cookies middleware
app.use(cookieParser())

// Open Routes
app.use('/user/login', require('./routes/user/login'));
app.use('/user/refresh', require('./routes/refresh'));
app.use('/user/logout', require('./routes/user/logout'));

// Authorized Routes
app.use(verifyJWT)
app.use('/admin/users', require('./routes/admin/users'));
app.use('/user/create', require('./routes/user/create'));



app.get('*', (req,res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

// Running server 
server.listen(port, '0.0.0.0', ()=> console.log('Server is running on port: ' + port));


