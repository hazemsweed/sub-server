const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    accountDetails: [
        {
            name: {
                type: String,
                required: true
            },
        }
    ],
}, {
    timestamps: true
});

module.exports = accountTypeSchema;