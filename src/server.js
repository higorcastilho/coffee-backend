require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/connection')

const app = express()
app.use(cors())
app.use(express.json())
dbConnection()

const {
  stripeRoutes
} = require('./routes/index')

app.use(stripeRoutes)

app.listen(5000, () => {
  console.log('Server running...')
})
