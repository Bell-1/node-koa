'use strict';

const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('config-lite')(__dirname);
let status = 'closed'; // closed opened error
let openedCallBack = []; // 连接成功回调

mongoose.connect(config.dbs, {
	useNewUrlParser: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
	console.log(chalk.green('连接数据库成功'));
	status = 'opened';
	openedCallBack.forEach(cb => status === 'opened' && cb());
})

db.on('error', function (error) {
	status = 'error';
	console.error(chalk.red('Error in MongoDb connection: ' + error));
	mongoose.disconnect();
});

db.on('close', function () {
	status = 'closed';
	console.log(chalk.red('数据库断开，重新连接数据库'));
	mongoose.connect(config.dbs, {
		server: {
			auto_reconnect: true
		}
	});
});


/**
 * 添加成功回调
 * @param {*} cb 
 */
function addOpenedCallback(cb) {
	if(typeof cb === 'function'){
		openedCallBack.push(cb);
	}
}	

module.exports = {
	db,
	status,
	addOpenedCallback,
};