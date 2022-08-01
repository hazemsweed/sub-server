const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const notebookjournalSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    creditor: {
        type: Number,
        default: 0,
        required: true
    },
    debtor: {
        type: Number,
        default: 0,
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        required: true,
    },
    references: [{
        ref: 'journal_accountings',
        type: Schema.Types.ObjectId,
    }]
}, {
    timestamps: true
});

// module.exports = mongoose.model('journal_notebooks', notebookjournalSchema);
module.exports = notebookjournalSchema