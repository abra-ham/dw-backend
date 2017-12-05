'use strict'

const json2csv = require('json2csv');
const csv = require('fast-csv');

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
    console.log("aquimero");
    if (!req.files) {
      console.log("here");
      
      return res.status(400).send('Sin archivo')
    }
    
    const dataFile = req.files.file;
    const companyData = [];

    console.log("hello");
    console.log(dataFile);
  
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
        try {
          const result = await db.collection('CompanyData').insert(companyData)
          if (result) {
            res.send(`Se subieron ${companyData.length} registros con exito`);
          } 
        } catch (error) {
          res.send(`Error`);
        }
     });
  })

  app.get('/company-data', async (req, res) => {
    console.log("jajajajajja");
    try {
      const data = await db.collection('CompanyData').find({}).toArray()
      res.json(data)
    } catch (error) {
      res.send({ 'error': error })
    }
  })

  app.get('/company-data/csv', async (req, res) => {
    try {
      const data = await db.collection('CompanyData').find({}).toArray()
      // const fields = [
      //   'avgCompanyIncome',
      //   'avgEmployeeIncome',
      //   'company',
      //   'companyType',
      //   'itEmployees',
      //   'totalItEmployees',
      //   'jobPerks',
      //   'officeCondition',
      //   'avgEmployeeEmotionalStatus',
      //   'avgEmployeeSatisfactionLevel',
      //   'happyEmployees',
      //   'unhappyEmployees'
      // ];


      const fields = ['hola', 'comoestas', 'adios', '_id', 'insertionDate']
      const csv = json2csv({ data: data, fields: fields });
    
      res.set("Content-Disposition", "attachment;filename=companydata.csv");
      res.set("Content-Type", "application/octet-stream");
    
      res.send(csv);
    } catch (error) {
      res.send({ 'error': error })
    }
  })

  app.get('/template', (req, res) => {
    const fields = [
      'avgCompanyIncome',
      'avgEmployeeIncome',
      'company',
      'companyType',
      'itEmployees',
      'totalItEmployees',
      'jobPerks',
      'officeCondition',
      'avgEmployeeEmotionalStatus',
      'avgEmployeeSatisfactionLevel',
      'happyEmployees',
      'unhappyEmployees'
    ];
  
    const csv = json2csv({ data: '', fields: fields });
  
    res.set("Content-Disposition", "attachment;filename=company-template.csv");
    res.set("Content-Type", "application/octet-stream");
  
    res.send(csv);
  })
}


