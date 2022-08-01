const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const authenticate = require('../authenticate');
const cors = require('./cors');
const AccountingTreeSchema = require('../models/accounting_tree');
const JournalAccountSchema = require('../models/journal_account');
const cashBankSchema = require('../models/cash_bank');
const cashBoxSchema = require('../models/cash_box');
const cashcreditCardSchema = require('../models/cash_creditCard');
const cashPaymentSchema = require('../models/cash_paymentAccount');
const AccountingTreeRouter = express.Router();
AccountingTreeRouter.use(bodyParser.json());


AccountingTreeRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        AccountingTree.find().sort({ createdAt: 1 })
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
            })
            .then((accountingTree) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountingTree);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        AccountingTree.create(req.body)
            .then((accountingTree) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountingTree);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


AccountingTreeRouter.route('/:AccountingTreeId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        AccountingTree.findById(req.params.AccountingTreeId)
            .populate({ path: 'operations', model: JournalAccounts })
            .then((accountingTree) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountingTree);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        AccountingTree.findByIdAndUpdate(req.params.AccountingTreeId, {
            $set: req.body
        }, { new: true })
            .then((accountingTree) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountingTree);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        AccountingTree.findByIdAndRemove(req.params.AccountingTreeId)
            .then((accountingTree) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountingTree);
            }, (err) => next(err))
            .catch((err) => next(err));
    })



AccountingTreeRouter.route('/:AccountingTreeId/:route')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        const id = req.params.AccountingTreeId;
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
        AccountingTree.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
            .then(() => {
                coll.findByIdAndUpdate(id, {
                    $set: {
                        name: req.body.name,
                        //currency: req.body.accountCurrency,
                        des: req.body.des
                    }
                }, {new: true}).then((cashRes) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(accountingTree);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const id = req.params.AccountingTreeId;
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
        AccountingTree.findByIdAndRemove(id)
            .then(() => {
                coll.findByIdAndRemove(id)
                .then((cashBank) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cashBank);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
    })
module.exports = AccountingTreeRouter;