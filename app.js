var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require("mongoose");
var config = require("./config");
var cors = require('cors')


// connecting to database
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.dbUrl, { useNewUrlParser: true }, (err) => {
  if (err) return console.log(err);
  console.log("DB Successfully Connected")
})
var quizRouter = require("./routes/quizRouter");
var startRouter = require("./routes/startRouter");
var indexRouter = require('./routes/index');
var resultRouter = require("./routes/resultRouter");
var userRouter = require("./routes/users");

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use("/quiz", quizRouter);
app.use("/start", startRouter)
app.use("/result", resultRouter);
app.use("/user", userRouter);









// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.statusCode = err.status || 500
  res.setHeader("Content-Type", 'application/json');

  res.json({ err: err, success: false })
});

module.exports = app;
