
/**
 * Module dependencies.
 */

var express = require('express'),
    _ = require('underscore'),
    mongo = require('mongodb'),
    hbs = require('hbs'),
    store  = new express.session.MemoryStore;

var db = new mongo.Db('donis', new mongo.Server("127.0.0.1", 27017, {}));
db.open(function(err, p_db) {
  db.emit('connect', db);
});


var app = module.exports = express.createServer();
app.set('db', db);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('db', db);
  app.set('view engine', 'hbs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'theBestWifeAGuyCouldAskFor', store: store }));
});

hbs.registerPartial('index', 'index');

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var routes = require('./routes')(app, db);
var routes = require('./apps/content-admin/routes')(app, db);

app.listen(5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
