var Datastore = require('nedb'), db = new Datastore({ filename: 'data', autoload: true });
var gastos = require('gastos')