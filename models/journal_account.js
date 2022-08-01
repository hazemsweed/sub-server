const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalAccoutingSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    creditorAccount: {
        type: Schema.Types.ObjectId,
        ref: 'accounting_trees',
    },
    debtorAccount: {
        type: Schema.Types.ObjectId,
        ref: 'accounting_trees',
    },
    notebookId: {
        type: Schema.Types.ObjectId,
        ref: 'journal_notebooks',
    },
    creditor: {
        type: Number,
        required: true
    },
    debtor: {
        type: Number,
        required: true
    },
    equivalent: {
        type: Number,
        required: true
    },
    exchange: {
        type: Number,
        required: true
    },
    systemExchangeCreditor: {
        type: Number,
        required: true
    },
    systemExchangeDebtor: {
        type: Number,
        required: true
    },
    referenceCode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    commonId: {
        type: String,
        required: true,
    },
    isCombined: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

// module.exports = mongoose.model('journal_accountings', journalAccoutingSchema);
module.exports = journalAccoutingSchema;