const router = require('express').Router()
const fb = require('fast-glob')
module.exports = app => {
  app.use('/api/v1', router)
  fb.sync('**/src/main/routes/**.js').forEach(file => {
    require(`../../../${file}`)(router)
  })
}
