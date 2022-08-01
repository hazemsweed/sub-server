const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const currencySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    selling: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

//module.exports = mongoose.model('currency', currencySchema);
module.exports = currencySchema