const mongoose = require('mongoose')
// const { DB_URI } = process.env

const dbConnection = () => {
  // mongoose.connect(DB_URI, {
  mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB Connected')
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  dbConnection
}
