
/*
 * GET home page.
 */
function routes(app, db) {

	app.get('/', function(req, res){
	  res.render('index.html', { title: 'My Doula Donis' });
	});


	app.get('/admin', function(req, res){

      // Return the information of a all collections, using the callback format
      db.collections(function(err, collections) {
        console.log('collections', collections);
        res.render('admin.html', { title: 'Admin', items:collections });
        
      });

  });		

	app.get('/collection/:name', function(req, res){

      // Return the information of a all collections, using the callback format
      db.collection(req.param.name, function(err, collection) {
        console.log('collections', collection);
        res.render('collection.html', { title: req.param.name, collection:req.param.name, items:collection });
        
      });

  });		  


}

module.exports = routes;
