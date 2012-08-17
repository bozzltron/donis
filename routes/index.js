
/*
 * GET home page.
 */
function routes(app, db) {

	app.get('/', function(req, res){
	  res.render('index.html', { title: 'My Doula Donis' });
	});

}

module.exports = routes;
