
const APPconfig = require('./admin/config.js').app; // Import APP config
const express = require('express');                 // Import Express Framework
var http = require('http');                        // Import HTTP requests liberary
const morgan = require('morgan');                   // Import HTTP request logger
const parser = require('body-parser');              // Import body-parser middleware for simpler request bodies
const path = require('path')

const app = express();                              // Declaring express as the app framework
const port = process.env.PORT || APPconfig.port;    // Declaring APP Port
const { logEvents , reqLogger } = require('./middlewares/logEvents')


// Initializing server
var server = http.createServer(app);

// this will parse Content-Type: application/json 
app.use(parser.json()); 

// this will parse Content-Type:  application/x-www-form-urlencoded
app.use(parser.urlencoded({ extended: true })); 

// This will declare short logging for morgan HTTP requests
app.use(morgan('dev'))


app.use(reqLogger)


app.get('*', (req,res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

// Running server
server.listen(port, '0.0.0.0', ()=> console.log('Server is running on port: ' + port))


