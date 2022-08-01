const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const authenticate = require('../authenticate');
const cors = require('./cors');
const CurrencySchema = require('../models/currency');
const CurrencyRouter = express.Router();
CurrencyRouter.use(bodyParser.json());


CurrencyRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const Currency = myDB.model('currency', CurrencySchema);
        Currency.find({})
            .then((Currency) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Currency);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const Currency = myDB.model('currency', CurrencySchema);
        console.log(req.body);
        Currency.create(req.body)
            .then((Currency) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Currency);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


CurrencyRouter.route('/:CurrencyId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const Currency = myDB.model('currency', CurrencySchema);
        Currency.findById(req.params.CurrencyId)
            .then((Currency) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Currency);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const Currency = myDB.model('currency', CurrencySchema);
        Currency.findByIdAndUpdate(req.params.CurrencyId, {
            $set: req.body
        }, { new: true })
            .then((Currency) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Currency);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const Currency = myDB.model('currency', CurrencySchema);
        Currency.findByIdAndRemove(req.params.CurrencyId)
            .then((Currency) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Currency);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


//get currency by selling price
CurrencyRouter.route('/getBySelling/:sellingPrice')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const Currency = myDB.model('currency', CurrencySchema);
        Currency.findOne({ selling: req.params.sellingPrice })
            .then((Currency) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Currency);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = CurrencyRouter;