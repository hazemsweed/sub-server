const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const myDB = mongoose.connection.useDb("main-database");
module.exports = myDB.model('companies', companySchema);