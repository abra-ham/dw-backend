'use strict'

const json2csv = require('json2csv');

// const data = {
//   avgCompanyIncome: '',
//   avgEmployeeIncome:'',
//   company: '',
//   companyType: 'startup etc0',
//   itEmployees:'',
//   totalItEmployees: 0,
//   jobPerks:'',
//   officeCondition: '',
//   avgEmployeeEmotionalStatus: 1,
//   avgEmployeeSatisfactionLevel: 2,
// }

module.exports = (app, db) => {
  app.post('/company-data', (req, res) => {
    if (!req.files) {
      return res.status(400).send('Sin archivo')
    }
    
    const dataFile = req.files.file;
    const companyData = [];
         
    csv
     .fromString(dataFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
     })
     .on("data", (data) => {
        data['insertionDate'] = new Date()
          
        companyData.push(data);
     })
     .on("end", async () => {
        //mongoInsert
        try {
          const result = await db.collection('CompanyData').insert(data)
          if (result) {
            res.send(`Se subieron ${companyData.length} registros con exito`);
          } 
        } catch (error) {
          res.send(`Error`);
        }
     });
  })

  app.get('/company-data', async (req, res) => {
    try {
      const data = await db.collection('CompanyData').find({})
      res.json(item)
    } catch (error) {
      res.send({ 'error': error })
    }
  })

  app.get('/company-data/csv', async (req, res) => {
    try {
      const data = await db.collection('CompanyData').find({})
      const fields = [];
      const csv = json2csv({ data: '', fields: fields });
    
      res.set("Content-Disposition", "attachment;filename=authors.csv");
      res.set("Content-Type", "application/octet-stream");
    
      res.send(csv);
    } catch (error) {
      res.send({ 'error': error })
    }
  })

  app.get('/template', (req, res) => {
    const fields = [];
  
    const csv = json2csv({ data: '', fields: fields });
  
    res.set("Content-Disposition", "attachment;filename=authors.csv");
    res.set("Content-Type", "application/octet-stream");
  
    res.send(csv);
  })
}


