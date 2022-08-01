const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cashLinkingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    treeAccountID: {
        type: String,
        required: true
    },
    notebookID: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = cashLinkingSchema