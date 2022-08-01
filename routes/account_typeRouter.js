const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const accountTypeRouter = express.Router();
accountTypeRouter.use(bodyParser.json());
const accountTypeSchema = require('../models/account_type');

accountTypeRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.find()
            .then((accountTypes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountTypes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.create(req.body)
            .then((accountType) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountType);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

accountTypeRouter.route('/:accountTypeId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.findById(req.params.accountTypeId)
            .then((accountType) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountType);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.findByIdAndUpdate(req.params.accountTypeId, {
            $set: req.body
        }, { new: true })
            .then((accountType) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountType);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.findByIdAndRemove(req.params.accountTypeId)
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: "success" });
            }, (err) => next(err))
            .catch((err) => next(err));
    });


accountTypeRouter.route('/:accountTypeId/accountDetails')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.findByIdAndUpdate(req.params.accountTypeId, {
            $push: { accountDetails: { name: req.body.name } }
        }).then(() => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(accountType);
        }, (err) => next(err))
            .catch((err) => next(err));
    });

accountTypeRouter.route('/:accountTypeId/accountDetails/:accountDetailId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.findById(req.params.accountTypeId)
            .then((accountType) => {
                if (accountType != null && accountType.accountDetails.id(req.params.accountDetailId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(accountType.accountDetails.id(req.params.accountDetailId));
                }
                else {
                    err = new Error('Account Detail Not Found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const AccountType = myDB.model('account_types', accountTypeSchema);
        AccountType.findByIdAndUpdate(req.params.accountTypeId, {
            $pull: { accountDetails: { _id: req.params.accountDetailId } }
        })
            .then((accountType) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(accountType);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


module.exports = accountTypeRouter;