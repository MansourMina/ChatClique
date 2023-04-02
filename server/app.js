const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const {wsServer}= require('./websockets/ws')
const app = express();

app.use(morgan('dev'))



const PORT = process.env.PORT ?? 5000

const httpServer = app.listen(PORT)
console.log("The server is now running on " + PORT);

wsServer(httpServer)