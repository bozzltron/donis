
/*
 * GET home page.
 */
function routes(app, db) {

	app.get('/', function(req, res){
	  res.render('index.hbs', { title: 'My Doula Donis' });
	});

	app.get('/about', function(req, res){
	  res.render('about.hbs', { title: 'About' });
	});

	app.get('/contact', function(req, res){
	  res.render('contact.hbs', { title: 'Contact' });
	});	

	app.post('/contact', function(req, res){
	  // Send Email
	});	

}

module.exports = routes;
