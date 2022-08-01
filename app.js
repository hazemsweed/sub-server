var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var config = require('./config');

var indexRouter = require('./routes/index');
var testRouter = require('./routes/testRouter');
var usersRouter = require('./routes/users');
var companyRouter = require('./routes/companyRouter');
var journalAccountRouter = require('./routes/journal_accountRouter');
var notebookJournalRouter = require('./routes/journal_notebookRouter');
var accountTreeRouter = require('./routes/account_treeRouter');
var accountTypeRouter = require('./routes/account_typeRouter');
var currencyRouter = require('./routes/currencyRouter');
var settingRouter = require('./routes/settingRouter');
var linkingRouter = require('./routes/linkingRouter');

var cashRouter = require('./routes/cashRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();
var http = require('http');
var server = http.createServer(app);
server.listen(8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(helmet());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/users', usersRouter);
app.use('/companies', companyRouter);

app.use('/journal_accounts', journalAccountRouter);
app.use('/journal_notebooks', notebookJournalRouter);
app.use('/account_trees', accountTreeRouter);
app.use('/account_types', accountTypeRouter);
app.use('/currency', currencyRouter);
app.use('/setting', settingRouter);


app.use('/cash', cashRouter);
app.use('/linking', linkingRouter);


app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;