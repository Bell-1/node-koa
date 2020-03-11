const mongoDB = require('../mongodb/db');
const db = mongoDB.db;
const status = mongoDB.status;
const addOpenedCallback = mongoDB.addOpenedCallback;


function createCollection(name, cols){
	db.createCollection(name, cols)
}
