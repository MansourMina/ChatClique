const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet');
const history = require('connect-history-api-fallback');

const { errorHandler, notFound } = require('./middleware/errorHandler');

require('dotenv').config();
require('colors');

// const { wsServer } = require('./websockets/ws');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));
app.use(history());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT);
console.log(
  `***The server is now running on ${PORT}*** \n ------------------------`,
);

// wsServer(httpServer);
