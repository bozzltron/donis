
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongo = require('mongodb');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/users', user.list);

// Connect to mongo
var db = new mongo.Db('donis', new mongo.Server("127.0.0.1", 27017, {}));
app.set('db', db);
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
var routes = require('./routes')(app, db);
var routes = require('./apps/content-admin/routes')(app, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
