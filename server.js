'use strict'

const express = require('express')
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient
const socket = require('socket.io')
const cors = require('cors')
const db = require('./config/db')

const app = express()
const port = 5432

app.use(cors())
app.use(fileUpload())

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);

  require('./routes')(app, database);

  app.listen(port, () => {
    console.log(`API disponible en el puerto ${port}`);
  })
})



