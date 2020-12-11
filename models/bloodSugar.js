const mongoose = require('mongoose');

const bloodSugar = new mongoose.Schema({
    time: Number,
    value: Number,
    type: Number
})

export default mongoose.model('bloodSugar', bloodSugar, 'bloodSugar');;