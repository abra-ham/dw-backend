const companyDataModule = require('./company')

module.exports = (app, db) => {
  companyDataModule(app, db)
}