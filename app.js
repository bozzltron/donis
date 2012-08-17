
/**
 * Module dependencies.
 */

var express = require('express'),
    _ = require('underscore'),
    mongo = require('mongodb');

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
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.register('.html', {
  compile: function (str, options) {
    var template = _.template(str);
    return function (locals) {
      return template(locals);
    };
  }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var routes = require('./routes')(app, db);
var routes = require('./apps/content-admin/routes')(app, db);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
