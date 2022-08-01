const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const authenticate = require('../authenticate');
const cors = require('./cors');
const linkingSchema = require('../models/cash_linking');

const linkingRouter = express.Router();
linkingRouter.use(bodyParser.json());


linkingRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const linking = myDB.model('linking', linkingSchema);
        linking.find({})
            .then((link) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(link);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const linking = myDB.model('linking', linkingSchema);
        console.log(req.body);
        linking.create(req.body)
            .then((link) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(link);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


linkingRouter.route('/:linkingId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const linking = myDB.model('linking', linkingSchema);
        linking.findById(req.params.linkingId)
            .then((link) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(link);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const linking = myDB.model('linking', linkingSchema);
        linking.findByIdAndUpdate(req.params.linkingId, {
            $set: req.body
        }, { new: true })
            .then((link) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(link);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const linking = myDB.model('linking', linkingSchema);
        linking.findByIdAndRemove(req.params.linkingId)
            .then((link) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(link);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = linkingRouter;