const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const authenticate = require('../authenticate');
const cors = require('./cors');
const SettingSchema = require('../models/setting');

const SettingRouter = express.Router();
SettingRouter.use(bodyParser.json());


SettingRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const setting = myDB.model('setting', SettingSchema);
        setting.find({})
            .then((setting) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(setting);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const setting = myDB.model('setting', SettingSchema);
        setting.create(req.body)
            .then((setting) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(setting);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


SettingRouter.route('/:settingId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const setting = myDB.model('setting', SettingSchema);
        setting.findById(req.params.settingId)
            .then((setting) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(setting);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const setting = myDB.model('setting', SettingSchema);
        setting.findByIdAndUpdate(req.params.settingId, {
            $set: req.body
        }, { new: true })
            .then((setting) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(setting);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported here!!' + req.params.dishId);
    })

module.exports = SettingRouter;

