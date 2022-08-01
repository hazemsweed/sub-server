const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountingTreeSchema = new Schema({
  code: {
    type: Number,
    required: true,
  },
  accountCurrency: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
  },
  accountDetail: {
    type: String,
    default: ''
  },
  name: {
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
  description: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  collectionName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
}
);

// var AccountingTree = mongoose.model('accounting_tree', accountingTreeSchema);
module.exports = accountingTreeSchema;
