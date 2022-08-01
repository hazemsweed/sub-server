const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cashPaymentAccountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    accountNum: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    api: {
        type: String,
        required: true
    },
    password: {
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

module.exports = cashPaymentAccountSchema;