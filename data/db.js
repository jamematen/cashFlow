const {app} = require('electron');
const Datastore = require('nedb-promises');

const dbFactory = (fileName) => Datastore.create({
  filename: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/data/${fileName}`, 
  timestampData: true,
  autoload: true
});

const db = {
   gastos: dbFactory('gastos.db'),
   //gastos2: dbFactory('gastos2.db')
  
 };
 
 module.exports = db;