
/*
 * GET home page.
 */
function routes(app) {

	app.get('/', function(req, res){
	  res.render('index.html', { title: 'My Doula Donis' });
	});


	app.get('/admin', function(req, res){
		app.get('db').collectionNames("", function(err, items) {
	  	res.render('admin.html', { title: 'Admin', items:items });
		});
	});


}

exports.routes = routes;
