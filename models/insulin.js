const mongoose = require('mongoose');

const insulin = new mongoose.Schema({
	time: Date,
	value: Number,
})

export default mongoose.model('insulin', insulin, 'insulin');;