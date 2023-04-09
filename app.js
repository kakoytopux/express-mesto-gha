const express = require('express');
const mongoose = require('mongoose');
const mainRequests = require('./routes/index');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(mainRequests);

app.listen(PORT);
