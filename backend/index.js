const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
var colors = require('colors');

require('dotenv').config()

const app = express();
const port = 5000

app.use(cors());
app.use(express.json())

// Connection URL
let password = encodeURI(process.env.DB_PASSWORD)
const url = 'mongodb+srv://admin:' + password + '@cluster0-0pgmo.mongodb.net/test?retryWrites=true&w=majority';

// Create a new MongoClient
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => console.log('Connected to database, ready for development.'.cyan))

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.listen(port, () => console.log(`Connected at http://localhost:${port}`.cyan))
