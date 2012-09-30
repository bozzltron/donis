
/**
 * Module dependencies.
 */

var express = require('express'),
    mongo = require('mongodb'),
    hbs = require('hbs'),
    app = module.exports = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('db', db);
  app.set('view engine', 'hbs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('Alw@ysHaveAlw@ysWill'));
  app.use(express.session());
});

// Connect to mongo
var db = new mongo.Db('donis', new mongo.Server("127.0.0.1", 27017, {}));
db.open(function(err, p_db) {
  db.emit('connect', db);

  // Setup admins
  db.collection('users', function(err, collection) {

    if(err){
      console.log('error', err);
    } else {
      db.createCollection('users', function(err, collection){
        createAdmins(collection);
      });
    }
    
  });   
});

// Define admins
function createAdmins(collection){
  // Update the document with an atomic operator
  collection.update({username:'mtbosworth@gmail.com'}, {$set : {username:'mtbosworth@gmail.com', password:'6e4d5d18de1a83c179a3e6981bdf01ac278fb7b8'}}, {upsert:true});
  collection.update({username:'donis.bosworth@gmail.com'}, {$set : {username:'donis.bosworth@gmail.com', password:'6ef819500b8661caf9c326d341d0079a1dcba499'}}, {upsert:true});
}

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var routes = require('./routes')(app, db);
var routes = require('./apps/content-admin/routes')(app, db);
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
