const isDeveloping = process.env.NODE_ENV !== 'production';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var packageJson = require('./package.json');

var indexRoutes = require('./routes/index');
var apiRoutes = require('./routes/api');

var app = express();
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (isDeveloping) {
    var webpack = require('webpack');
    var webpackMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var config = require('./webpack.config.js');

    var compiler = webpack(config);
    var middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
}

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// make special data accessible to all views
app.use(function(req, res, next) {
    res.locals.version = packageJson.version;
    next();
});

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);

        if (res.statusCode === 404) {
            res.render('not-found', {
                message: err.message,
                isFromDownloadRoute: err.isFromDownloadRoute || false
            });
        }
        else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    if (res.statusCode === 404) {
        res.render('not-found', {
            message: err.message,
            isFromDownloadRoute: err.isFromDownloadRoute || false
        });
    }
    else {
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

module.exports = app;
