
/*
 * GET home page.
 */
function routes(app, db) {

  var crypto = require('crypto');

  // Authenticate using our plain-object database of doom!
  function authenticate(username, password, fn) {
    console.log('authenticate');
    // if (!module.parent) console.log('authenticating %s:%s', username, password);

    // Set users
    db.collection('users', function(err, collection) {

      if(err){
        console.log('error', err);
      }

      // Update the document with an atomic operator
      collection.findOne({username:username}, function(err, doc){
        if(err || !doc){
          new Error('Cannot Find User');
        } else {
          console.log('found user name');
          var hash = crypto.createHmac('sha1', username).update(password).digest('hex');
          console.log(hash);
          collection.findOne({username:username, password:hash}, function(err, doc){
            if(err || !doc){
              new Error('invalid password')
            } else {
              console.log('and password');
              return fn(null, doc);
            }
          });            

        }

      });
      
    }); 

  }

  app.get('/admin', function(req, res){
      console.log(req.session);
      req.session = req.session || {user:null};

      if (req.session.user) {

        req.session.success = 'Authenticated as ' + req.session.user.username
      + ' click to <a href="/logout">logout</a>. '
      + ' You may now access <a href="/restricted">/restricted</a>.';
        
        // Return the information of a all collections, using the callback format
        db.collections(function(err, collections) {
          
          res.render(__dirname + '/../views/admin.hbs', { title: 'Admin', items:collections });
          
        });

      } else {
        res.render(__dirname + '/../views/login.hbs', { title: 'Login', success: req.session.success, error:req.session.error  });
      }

  });   

  app.post('/admin', function(req, res){
    console.log('post');
    authenticate(req.body.username, req.body.password, function(err, user){
      console.log('user',user);
      if (user) {
    
          // Store the user's primary key 
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          res.redirect('admin');
    
      } else {
        req.session.error = 'Authentication failed, please check your '
          + ' username and password.'
          + ' (use "tj" and "foobar")';
        res.redirect('admin');
      }
    });

  });     

  app.get('/collection/:name', function(req, res){
    
      // Return the information of a all collections, using the callback format
      db.collection(req.params.name, function(err, collection) {

        collection.find().toArray(function(err, items) {
          res.render(__dirname + '/../views/collection.hbs', { title: req.params.name, collection:req.params.name, items:items });
        });
        
        
      });

  });     

  app.get('/collection/:name/new', function(req, res){
      
    res.render(__dirname + '/../views/new.hbs', { title: req.params.name, collection:req.params.name });

  }); 

  app.post('/collection/:name/new', function(req, res){
    var collectionName = req.params.name;

     // Fetch a collection to insert document into
    var collection = db.collection(req.params.name);

    // Insert a single document
    collection.insert(req.body);

  }); 

  app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
      res.redirect('/');
    });
  });  

}

module.exports = routes;
