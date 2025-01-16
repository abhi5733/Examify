const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connection } = require('./db');
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json


app.get('/', (req, res) => {
  res.send('Welcome to the MCQ Generation API');
});

const port = process.env.PORT


// Start server
app.listen(port, async () => {
    try{
await connection
console.log(`Mongo DB connected`);
    }catch(err){
console.log(`Connection failed ${err}`);
    }

  });