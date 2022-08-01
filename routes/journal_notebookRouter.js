const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const JournalAccountSchema = require('../models/journal_account');
const JournalNotebookSchema = require('../models/journal_notebook');
const AccountingTreeSchema = require('../models/accounting_tree');

const NotebookJournalRouter = express.Router();
NotebookJournalRouter.use(bodyParser.json());


NotebookJournalRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        JournalNotebook.find({})
            .populate({ path: 'references', model: JournalAccounts })
            .then((journalNotebooks) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(journalNotebooks);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        JournalNotebook.create(req.body)
            .then((journalNotebook) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(journalNotebook);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

NotebookJournalRouter.route('/:journalNotebookId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        const JournalAccounts = myDB.model('journal_accountings', JournalAccountSchema);
        const AccountingTree = myDB.model('accounting_trees', AccountingTreeSchema);
        JournalNotebook.findById(req.params.journalNotebookId)
        .populate({
            path: 'references', model: JournalAccounts,
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
            .then((journalNotebook) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(journalNotebook);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        JournalNotebook.findById(req.params.journalNotebookId)
            .then((journalNotebook) => {
                if (req.body.name) {
                    journalNotebook.name = req.body.name;
                }
                if (req.body.description) {
                    journalNotebook.description = req.body.description;
                }
                if (req.body.date) {
                    journalNotebook.date = req.body.date;
                }
                journalNotebook.save()
                    .then((newJournalNotebook) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(newJournalNotebook);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            })
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const myDB = mongoose.connection.useDb(ObjectId(req.user.company).toString());
        const JournalNotebook = myDB.model('journal_notebooks', JournalNotebookSchema);
        JournalNotebook.findById(req.params.journalNotebookId)
            .then((journalNotebook) => {
                if (journalNotebook.references.length == 0) {
                    journalNotebook.remove()
                        .then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                status: "success",
                                message: "Deleted Successfully"
                            });
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        statusCode: 403,
                        status: "error",
                        message: "You can't delete a nonempty notebook"
                    });
                }
            })
    });

module.exports = NotebookJournalRouter;