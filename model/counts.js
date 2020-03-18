const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = {
    autoIndex: false,
    id: false,
    _id: false,
    collection: 'count'
}


const countsSchema = new Schema({
    id: {
        type: String,
        required: true,
    },

    count: {
        type: Number,
        required: true,
    }
}, options)

const model = new countsSchema('count', Schema)

module.exports = model;