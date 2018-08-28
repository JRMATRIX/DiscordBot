// load express package
var express = require( "express" );

// create an express object that will 
var app = express();

// when our server receives a request, it needs to know what it should respond
// so we need to 
app.get( "/", function( request, response ) {
  response.send( "<h1>Hello Express :)</h1>" );
} );

// listen for requests :)
var listener = app.listen( process.env.PORT, function() {
  console.log( "Your app is listening on port " + listener.address().port );
} );
