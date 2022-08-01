const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const testRouter = express.Router();
testRouter.use(bodyParser.json());
var passport = require('passport');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config');
var userSchema = require('../models/user');
var passportLocalMongoose = require('passport-local-mongoose');

const journalAccoutingSchema = new Schema({
    serNumber: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: true
    },
    debit: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

testRouter.all(['/:databaseName', '/:databaseName/get', '/:databaseName/addProduct'], (req, res, next) => {
    const myDB = mongoose.connection.useDb(req.params.databaseName);
    userSchema.plugin(passportLocalMongoose);
    const User = myDB.model('User', userSchema);
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secretKey
    }, (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
    return next();
});


testRouter.route('/:databaseName')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, passport.authenticate('jwt', { session: false }), (req, res, next) => {
        res.json("hello")
        // for (let i = 0; i < 10000; i++) {
        //     const myDB = mongoose.connection.useDb("test213");
        //     const JournalAccouting = myDB.model('Journal-Accouting', testSchema);
        //     console.log(i);
        //     JournalAccouting.create({
        //         serNumber: 1,
        //         date: new Date().toISOString(),
        //         account: i,
        //         credit: 50,
        //         debit: 50,
        //         reference: "product",
        //         category: "finance",
        //         description: `we have added 100 dolar for sallary ${i}`,
        //         name: `hazem ${i}`,
        //     }).then((test) => {
        //         console.log(`Database Created Succfully ${i}`);
        //     }, (err) => next(err))
        //         .catch((err) => next(err));
        // }
    })


testRouter.route('/:databaseName/get')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, passport.authenticate('jwt', { session: false }), (req, res, next) => {
        const myDB = mongoose.connection.useDb(req.params.databaseName);
        const JournalAccouting = myDB.model('Journal-Accouting', journalAccoutingSchema);
        JournalAccouting.find().then((test) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(test);
        }, (err) => next(err))
            .catch((err) => next(err));
    })


testRouter.route('/:databaseName/addProduct')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.cors, passport.authenticate('jwt', { session: false }), (req, res, next) => {
        res.json("hello")
        // for (let i = 0; i < 10000; i++) {
        //     const myDB = mongoose.connection.useDb(req.params.databaseName);
        //     const JournalAccouting = myDB.model('Journal-Accouting', journalAccoutingSchema);
        //     console.log(i);
        //     JournalAccouting.create({
        //         serNumber: 1,
        //         date: new Date().toISOString(),
        //         account: i,
        //         credit: 50,
        //         debit: 50,
        //         reference: "product",
        //         category: "finance",
        //         description: `we have added 100 dolar for sallary ${i}`,
        //         name: `hazem ${i}`,
        //     }).then((test) => {
        //         console.log(`Database Created Succfully ${i}`);
        //     }, (err) => next(err))
        //         .catch((err) => next(err));
        // }
    })

module.exports = testRouter;