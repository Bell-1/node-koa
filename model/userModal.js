const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = {
	// autoIndex: false,
	// id: false,
	// _id: false,
}
const userSchema = new Schema({
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
    },
    pid: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
    }
}, options);

const userModal = mongoose.model('user', userSchema, 'user');

module.exports = userModal