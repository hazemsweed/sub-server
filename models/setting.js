const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    language: {
        type: String,
        required: true,
        default: 'ar'
    },
    decimalPoint: {
        type: String,
        required: true
    },
    decimalFormat: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

//module.exports = mongoose.model('currency', currencySchema);
module.exports = settingSchema;