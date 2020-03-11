const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	gender: {
		type: Number,
		required: true
	},
	pwd: {
		type: String,
		required: true,
	}
});

const adminModel = mongoose.model('admin', adminSchema, 'admin');

module.exports = adminModel