
/*
 * GET home page.
 */
function routes(app, db) {

	app.get('/admin', function(req, res){
      console.log(req.session);

      if(req.session) {
        
        // Return the information of a all collections, using the callback format
        db.collections(function(err, collections) {
          
          res.render(__dirname + '/../views/admin.hbs', { title: 'Admin', items:collections });
          
        });

      } else {
        res.render(__dirname + '/../views/login.hbs', { title: 'Login' });
      }

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

}

module.exports = routes;
