const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const companyRouter = express.Router();
companyRouter.use(bodyParser.json());
var Company = require('../models/company');
var authenticate = require('../authenticate');

companyRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        Company.findOne({ company: req.user.company })
            .then((company) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(company);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = companyRouter;