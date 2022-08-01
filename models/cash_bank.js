const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cashBankSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    },
    iban: {
        type: String,
        required: true
    },
    accountNum: {
        type: Number,
        required: true
    },
    signinInfo: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: true,
    },
    children: {
        type: Array,
        default: []
    },
    operations: [{
        ref: 'journal_accountings',
        type: Schema.Types.ObjectId,
    }],
}, {
    timestamps: true
});

module.exports = cashBankSchema;