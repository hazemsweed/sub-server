const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cashBoxSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    des: {
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

module.exports = cashBoxSchema;