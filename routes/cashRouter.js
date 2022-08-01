const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const authenticate = require('../authenticate');
const cors = require('./cors');
const cashRouter = express.Router();
cashRouter.use(bodyParser.json());

const cashBoxSchema = require('../models/cash_box');
const cashBankSchema = require('../models/cash_bank');
const cashCreditCard = require('../models/cash_creditCard');
const cashPaymentSchema = require('../models/cash_paymentAccount');
const AccountingTreeSchema = require('../models/accounting_tree');
const JournalAccountSchema = require('../models/journal_account');
const JournalNotebookSchema = require('../models/journal_notebook');

cashRouter.route('/:routeType')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        var coll;
        if(req.params.routeType == 'cashBox') {
            coll = myDB.model('cashBox', cashBoxSchema);
        }
        if(req.params.routeType == 'cashBank') {
            coll = myDB.model('cashBank', cashBankSchema);
        }
        if(req.params.routeType == 'cashCreditCard') {
            coll = myDB.model('cashCreditCard', cashCreditCard);
        }
        if(req.params.routeType == 'cashPayment') {
            coll = myDB.model('cashPayment', cashPaymentSchema);
        }
        coll.find({})
        .populate({
            path: 'operations', model: JournalAccounts,
            populate: [
                {
                    path: 'creditorAccount',
                    model: AccountingTree
                },
                {
                    path: 'debtorAccount',
                    model: AccountingTree
                }
            ]
        }).then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        var coll;
        console.log(req.params.routeType);
        if(req.params.routeType == 'cashBox') {
            console.log(req.params.routeType);
            coll = myDB.model('cashBox', cashBoxSchema);
        }
        if(req.params.routeType == 'cashBank') {
            coll = myDB.model('cashBank', cashBankSchema);
        }
        if(req.params.routeType == 'cashCreditCard') {
            coll = myDB.model('cashCreditCard', cashCreditCard);
        }
        if(req.params.routeType == 'cashPayment') {
            coll = myDB.model('cashPayment', cashPaymentSchema);
        }
        coll.create(req.body)
            .then((response) => {
                AccountingTree.create({
                    _id: response._id,
                    code: req.body.code,
                    accountCurrency: req.body.currency,
                    accountType: 'نقد',
                    accountDetail: 'النقدية بالصندوق والخزينة',
                    name: req.body.name,
                    description: req.body.des,
                    parentId: req.body.treeAccountID,
                    source: req.body.source,
                    collectionName: req.body.collectionName
                }).then((treeRes) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(treeRes);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })


cashRouter.route('/:routeType/:Id')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        var coll;
        if(req.params.routeType == 'cashBox') {
            coll = myDB.model('cashBox', cashBoxSchema);
        }
        if(req.params.routeType == 'cashBank') {
            coll = myDB.model('cashBank', cashBankSchema);
        }
        if(req.params.routeType == 'cashCreditCard') {
            coll = myDB.model('cashCreditCard', cashCreditCard);
        }
        if(req.params.routeType == 'cashPayment') {
            coll = myDB.model('cashPayment', cashPaymentSchema);
        }
        coll.findById(req.params.Id)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        var coll;
        if(req.params.routeType == 'cashBox') {
            coll = myDB.model('cashBox', cashBoxSchema);
        }
        if(req.params.routeType == 'cashBank') {
            coll = myDB.model('cashBank', cashBankSchema);
        }
        if(req.params.routeType == 'cashCreditCard') {
            coll = myDB.model('cashCreditCard', cashCreditCard);
        }
        if(req.params.routeType == 'cashPayment') {
            coll = myDB.model('cashPayment', cashPaymentSchema);
        }
        coll.findByIdAndUpdate(req.params.Id, {
            $set: req.body
        }, { new: true })
            .then(() => {
                AccountingTree.findByIdAndUpdate(req.params.Id, {
                $set:{           
                    //accountCurrency: req.body.currency,
                    name: req.body.name,
                    description: req.body.des,
                }
                }, {new: true})
                .then((treeRes) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(treeRes);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const id = req.params.Id;
        const treeAccount = myDB.model('accounting_trees', AccountingTreeSchema)
        var coll;
        if(req.params.routeType == 'cashBox') {
            coll = myDB.model('cashBox', cashBoxSchema);
        }
        if(req.params.routeType == 'cashBank') {
            coll = myDB.model('cashBank', cashBankSchema);
        }
        if(req.params.routeType == 'cashCreditCard') {
            coll = myDB.model('cashCreditCard', cashCreditCard);
        }
        if(req.params.routeType == 'cashPayment') {
            coll = myDB.model('cashPayment', cashPaymentSchema);
        }
        coll.findByIdAndRemove(id)
            .then(() => {
                treeAccount.findByIdAndRemove(id)
                .then((treeRes) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(treeRes);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })


cashRouter.route('/:routeType/addJournalAccounts')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        var coll;
        if(req.params.routeType == 'cashBox') {
            coll = myDB.model('cashBox', cashBoxSchema);
        }
        if(req.params.routeType == 'cashBank') {
            coll = myDB.model('cashBank', cashBankSchema);
        }
        if(req.params.routeType == 'cashCreditCard') {
            coll = myDB.model('cashCreditCard', cashCreditCard);
        }
        if(req.params.routeType == 'cashPayment') {
            coll = myDB.model('cashPayment', cashPaymentSchema);
        }
        JournalAccounts.create(req.body)
            .then((journalAccount) => {
                coll.findByIdAndUpdate(req.body.cashAccountId, {
                    $push: { operations: journalAccount._id },
                }).then(() => {
                    JournalNotebook.findByIdAndUpdate(req.body.notebookId, {
                        $push: { references: journalAccount._id },
                    }).then(() => {
                        AccountingTree.findByIdAndUpdate(journalAccount.creditorAccount, {
                            $push: { operations: journalAccount._id }
                        }).then(() => {
                            AccountingTree.findByIdAndUpdate(journalAccount.debtorAccount, {
                                $push: { operations: journalAccount._id }
                            }, { new: true })
                                .then((accountingTree) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(accountingTree);
                                })
                        })
                    })
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })


//This router if creditor and debtor accounts were cash accounts
cashRouter.route('/addJournalAccounts/BothAreTheSame')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        var coll_creditor;
        var coll_debtor;
        if(req.body.creditorCollectionName == 'cashBox') {
            coll_creditor = myDB.model('cashBox', cashBoxSchema);
        }
        else if(req.body.creditorCollectionName == 'cashBank') {
            coll_creditor = myDB.model('cashBank', cashBankSchema);
        }
        else if(req.body.creditorCollectionName == 'cashCreditCard') {
            coll_creditor = myDB.model('cashCreditCard', cashCreditCard);
        }
        else if(req.body.creditorCollectionName == 'cashPayment') {
            coll_creditor = myDB.model('cashPayment', cashPaymentSchema);
        }

        if(req.body.debtorCollectionName == 'cashBox') {
            coll_debtor = myDB.model('cashBox', cashBoxSchema);
        }
        else if(req.body.debtorCollectionName == 'cashBank') {
            coll_debtor = myDB.model('cashBank', cashBankSchema);
        }
        else if(req.body.debtorCollectionName == 'cashCreditCard') {
            coll_debtor = myDB.model('cashCreditCard', cashCreditCard);
        }
        else if(req.body.debtorCollectionName == 'cashPayment') {
            coll_debtor = myDB.model('cashPayment', cashPaymentSchema);
        }

        JournalAccounts.create(req.body)
            .then((journalAccount) => {
                coll_creditor.findByIdAndUpdate(req.body.creditorAccount, {
                    $push: { operations: journalAccount._id },
                }).then(() => {
                    coll_debtor.findByIdAndUpdate(req.body.debtorAccount, {
                            $push: {operations: journalAccount._id},
                    }).then(() => {
                        JournalNotebook.findByIdAndUpdate(req.body.notebookId, {
                            $push: { references: journalAccount._id },
                        }).then(() => {
                            AccountingTree.findByIdAndUpdate(journalAccount.creditorAccount, {
                                $push: { operations: journalAccount._id }
                            }).then(() => {
                                AccountingTree.findByIdAndUpdate(journalAccount.debtorAccount, {
                                    $push: { operations: journalAccount._id }
                                }, { new: true })
                                    .then((accountingTree) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(accountingTree);
                                    })
                            })
                        })
                    })
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })


        //delete abnormal journal accounts (cash journal accounts) 
cashRouter.route('/journal_accounts/delete')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const account = req.body.account;
        const notebookId = account.notebookId;
        const { creditorAccount, debtorAccount } = account;
        JournalAccounts.findByIdAndRemove(account._id)
            .then(async () => {
                await AccountingTree.findByIdAndUpdate(creditorAccount._id, {
                    $pull: { operations: account._id },
                }).then(async () => {
                    await AccountingTree.findByIdAndUpdate(debtorAccount._id, {
                        $pull: { operations: account._id },
                    }).then(async () => {
                        await JournalNotebook.findByIdAndUpdate(notebookId, {
                            $pull: { references: account._id },
                        }).then(async () => {
                            if(creditorAccount.source == 'cash') {
                                var coll;
                                if(creditorAccount.collectionName == 'cashBox') {
                                    coll = myDB.model('cashBox', cashBoxSchema);
                                }
                                if(creditorAccount.collectionName == 'cashBank') {
                                    coll = myDB.model('cashBank', cashBankSchema);
                                }
                                if(creditorAccount.collectionName == 'cashCreditCard') {
                                    coll = myDB.model('cashCreditCard', cashCreditCard);
                                }
                                if(creditorAccount.collectionName == 'cashPayment') {
                                    coll = myDB.model('cashPayment', cashPaymentSchema);
                                }
                                await coll.findByIdAndUpdate(creditorAccount._id, {
                                    $pull: { operations: account._id },
                                })
                            }
                            if(debtorAccount.source == 'cash') {
                                var coll;
                                if(debtorAccount.collectionName == 'cashBox') {
                                    coll = myDB.model('cashBox', cashBoxSchema);
                                }
                                if(debtorAccount.collectionName == 'cashBank') {
                                    coll = myDB.model('cashBank', cashBankSchema);
                                }
                                if(debtorAccount.collectionName == 'cashCreditCard') {
                                    coll = myDB.model('cashCreditCard', cashCreditCard);
                                }
                                if(debtorAccount.collectionName == 'cashPayment') {
                                    coll = myDB.model('cashPayment', cashPaymentSchema);
                                }
                                await coll.findByIdAndUpdate(debtorAccount._id, {
                                    $pull: { operations: account._id },
                                })
                            }

                        })
                    })
                })
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: 'success' });
            }, (err) => next(err))
            .catch((err) => next(err));
});

module.exports = cashRouter;