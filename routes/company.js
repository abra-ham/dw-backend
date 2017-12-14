'use strict'

const json2csv = require('json2csv');
const csv = require('fast-csv')

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
     .on("data", function(data){
        data['insertionDate'] = new Date()
          
        companyData.push(data);
     })
     .on("end", function(){
        //mongoInsert
        try {
          const result = db.collection('CompanyData').insert(companyData)
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
      const data = await db.collection('CompanyData').find({}).toArray()
      res.json(data)
    } catch (error) {
      res.send({ 'error': error })
    }
  })

  app.get('/company-data/csv', async (req, res) => {
    try {
      let data = await db.collection('CompanyData').find({}).toArray()
      let fields = []

      if (data.length > 0) {
        fields = Object.keys(data[0]).filter(elem => {
          if (elem != '_id' || elem != 'insertionDate') { 
            console.log("elem");
            return true
          }
        })
      }

      const csv = json2csv({ data, fields });
    
      res.set("Content-Disposition", `attachment;filename=data${new Date()}.csv`);
      res.set("Content-Type", "application/octet-stream");
    
      res.send(csv);
    } catch (error) {
      res.send({ 'error': error })
    }
  })

  app.get('/template', (req, res) => {
    const fields = ['happy', 'neutral', 'unhappy'];
  
    const csv = json2csv({ data: '', fields: fields });
  
    res.set("Content-Disposition", "attachment;filename=template.csv");
    res.set("Content-Type", "application/octet-stream");
  
    res.send(csv);
  })
}


