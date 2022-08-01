const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const JournalAccountSchema = require('../models/journal_account');
const JournalNotebookSchema = require('../models/journal_notebook');
const AccountingTreeSchema = require('../models/accounting_tree');
const JournalAccountsRouter = express.Router();
JournalAccountsRouter.use(bodyParser.json());


JournalAccountsRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        JournalAccounts.find({})
            .populate({ path: 'creditorAccount', model: AccountingTree })
            .populate({ path: 'debtorAccount', model: AccountingTree })
            .then((journalAccounts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(journalAccounts);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

JournalAccountsRouter.route('/:commonId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        JournalAccounts.find({ commonId: req.params.commonId })
            .populate({ path: 'creditorAccount', model: AccountingTree })
            .populate({ path: 'debtorAccount', model: AccountingTree })
            .then((journalAccounts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(journalAccounts);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


JournalAccountsRouter.route('/:notebookId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        JournalNotebook.findByIdAndUpdate(req.params.notebookId, {
            $push: { references: { $each: req.body.itemsToMove } }
        }).then(() => {
            JournalNotebook.findByIdAndUpdate(req.body.oldNotebookId, {
                $pull: { references: { $in: req.body.itemsToMove } }
            }, { new: true })
                .then((oldNotebook) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(oldNotebook);
                })
        }, (err) => next(err))
            .catch((err) => next(err))
    });



JournalAccountsRouter.route('/single/:notebookId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        JournalAccounts.create(req.body)
            .then((journalAccount) => {
                JournalNotebook.findByIdAndUpdate(req.params.notebookId, {
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
            }, (err) => next(err))
            .catch((err) => next(err));
    });

JournalAccountsRouter.route('/combined/:notebookId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        JournalAccounts.insertMany(req.body.data)
            .then(async (journalAccounts) => {
                journalAccounts.forEach(async journalAccount => {
                    await JournalNotebook.findByIdAndUpdate(req.params.notebookId, {
                        $push: { references: journalAccount._id },
                    }).then(async () => {
                        await AccountingTree.findByIdAndUpdate(journalAccount.creditorAccount, {
                            $push: { operations: journalAccount._id }
                        }).then(async () => {
                            await AccountingTree.findByIdAndUpdate(journalAccount.debtorAccount, {
                                $push: { operations: journalAccount._id }
                            }, { new: true })
                        })
                    })
                })
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json('Success');
            }, (err) => next(err))
            .catch((err) => next(err));
    });


JournalAccountsRouter.route('/:notebookId/:journalAccountId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const uid = req.params.journalAccountId;
        await JournalAccounts.findById(uid)
            .then(async (journalAccount) => {
                const { creditorAccount, debtorAccount } = journalAccount;
                const newCreditorAccount = req.body.creditorAccount;
                const newDebtorAccount = req.body.debtorAccount;
                const { debtor, creditor, equivalent, exchange, systemExchangeCreditor, systemExchangeDebtor } = req.body;
                if (creditorAccount != newCreditorAccount || debtorAccount != newDebtorAccount) {
                    if (creditorAccount != newCreditorAccount) {
                        await AccountingTree.findByIdAndUpdate(creditorAccount, {
                            $pull: { operations: uid },
                        }).then(async () => {
                            await AccountingTree.findByIdAndUpdate(newCreditorAccount, {
                                $push: { operations: uid },
                            }).then(async () => {
                                await JournalAccounts.findByIdAndUpdate(uid, {
                                    $set: {
                                        creditorAccount: newCreditorAccount,
                                        creditor: creditor,
                                        debtor: debtor,
                                        equivalent: equivalent,
                                        exchange: exchange,
                                        systemExchangeCreditor: systemExchangeCreditor,
                                        systemExchangeDebtor: systemExchangeDebtor,
                                        category: req.body.category,
                                        date: req.body.date,
                                        description: req.body.description,
                                    }
                                }).then((res) => {
                                    console.log(res);
                                })
                            })
                        })
                    }
                    if (debtorAccount != newDebtorAccount) {
                        AccountingTree.findByIdAndUpdate(debtorAccount, {
                            $pull: { operations: uid },
                        }).then(() => {
                            AccountingTree.findByIdAndUpdate(newDebtorAccount, {
                                $push: { operations: uid },
                            }).then(() => {
                                JournalAccounts.findByIdAndUpdate(uid, {
                                    $set: {
                                        debtorAccount: newDebtorAccount,
                                        creditor: creditor,
                                        debtor: debtor,
                                        equivalent: equivalent,
                                        exchange: exchange,
                                        systemExchangeCreditor: systemExchangeCreditor,
                                        systemExchangeDebtor: systemExchangeDebtor,
                                        category: req.body.category,
                                        date: req.body.date,
                                        description: req.body.description,
                                    }
                                }).then((res) => {
                                    console.log(res);
                                })
                            })
                        })
                    }
                }
                else {
                    JournalAccounts.findByIdAndUpdate(uid, {
                        $set: {
                            creditor: creditor,
                            debtor: debtor,
                            equivalent: equivalent,
                            exchange: exchange,
                            systemExchangeCreditor: systemExchangeCreditor,
                            systemExchangeDebtor: systemExchangeDebtor,
                            category: req.body.category,
                            date: req.body.date,
                            description: req.body.description,
                        }
                    }).then((res) => {
                        console.log(res);
                    })
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: 'success',
                    message: 'Saved Successfully'
                });
            }, (err) => next(err))
            .catch((err) => next(err))
    })


JournalAccountsRouter.route('/:notebookId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
//check this router if it is needed =================================================================================
//     .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//         const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
//         const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
//         const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
//         const uid = req.params.journalAccountId;
//         JournalAccounts.findById(uid)
//             .then((journalAccount) => {
//                 const { creditorAccount, debtorAccount } = journalAccount;
//                 const newCreditorAccount = req.body.creditorAccount;
//                 const newDebtorAccount = req.body.debtorAccount;
//                 const newCreditor = req.body.creditor;
//                 const newDebtor = req.body.debtor;
//                 if (creditorAccount != newCreditorAccount) {
//                     AccountingTree.findByIdAndUpdate(creditorAccount, {
//                         $pull: { operations: uid },
//                     }).then(() => {
//                         AccountingTree.findByIdAndUpdate(newCreditorAccount, {
//                             $push: { operations: uid },
//                         }).then(() => {
//                             JournalAccounts.findByIdAndUpdate(uid, {
//                                 $set: {
//                                     creditorAccount: newCreditorAccount,
//                                     creditor: newCreditor,
//                                     debtor: newDebtor
//                                 }
//                             })
//                         })
//                     })
//                 }
//                 else {
//                     JournalAccounts.findByIdAndUpdate(uid, {
//                         $set: {
//                             creditor: newCreditor,
//                             debtor: newDebtor
//                         }
//                     }).then(() => {
//                         console.log('else 1');
//                     })
//                 }
//                 if (debtorAccount != newDebtorAccount) {
//                     AccountingTree.findByIdAndUpdate(debtorAccount, {
//                         $pull: { operations: uid },
//                     }).then(() => {
//                         AccountingTree.findByIdAndUpdate(newDebtorAccount, {
//                             $push: { operations: uid },
//                         }).then(() => {
//                             JournalAccounts.findByIdAndUpdate(uid, {
//                                 $set: {
//                                     debtorAccount: newDebtorAccount,
//                                     creditor: newCreditor,
//                                     debtor: newDebtor
//                                 }
//                             })
//                         })
//                     })
//                 }
//                 else {
//                     JournalAccounts.findByIdAndUpdate(uid, {
//                         $set: {
//                             creditor: newCreditor,
//                             debtor: newDebtor
//                         }
//                     }).then(() => {
//                         console.log('else 2');
//                     })
//                 }
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({
//                     status: 'success',
//                     message: 'Saved Successfully'
//                 });
//             }, (err) => next(err))
//             .catch((err) => next(err))
//     })

    // Delete single or combined normal journal accounts;
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const notebookId = req.params.notebookId;
        const array = req.body.accounts;
        const commonId = array[0].commonId;
        JournalAccounts.deleteMany({ commonId: commonId })
            .then(async () => {
                for (let i in array) {
                    const { creditorAccount, debtorAccount } = array[i];
                    const uid = array[i]._id;
                    await AccountingTree.findByIdAndUpdate(creditorAccount._id, {
                        $pull: { operations: uid },
                    }).then(async () => {
                        await AccountingTree.findByIdAndUpdate(debtorAccount._id, {
                            $pull: { operations: uid },
                        }).then(async () => {
                            await JournalNotebook.findByIdAndUpdate(notebookId, {
                                $pull: { references: uid },
                            })
                        })
                    })
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: 'success' });
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = JournalAccountsRouter;