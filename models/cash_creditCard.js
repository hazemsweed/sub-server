const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cashCreditCardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cardNum: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    cvv: {
        type: Number,
        required: true
    },
    secritNum: {
        type: Number,
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

module.exports = cashCreditCardSchema;