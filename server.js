// load express package
var express = require('express');

// create an express object
var app = express();

app.get( '/', function( request, response ){
  response.send( 'Hello node' );
});


// and we can define other routes
app.get( '/html', function( request, response ){
  response.send( '<h1>Hello HTML</h1>' );
});


// or we can set express to serve files from a specific folder:
app.use( express.static( 'public' ) );

// http://expressjs.com/en/starter/basic-routing.html
app.get('/file', function( request, response ) {
  response.sendFile( __dirname + '/public/index.html' );
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
