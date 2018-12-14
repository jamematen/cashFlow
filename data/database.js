var Datastore = require('nedb'), db = new Datastore({ filename: 'data', autoload: true });
var gastos = require('./gastos')

db.insert(gastos, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
  })

  exports.db = db