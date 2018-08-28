// load express package
var express = require( "express" );

// create an express object that will 
var app = express();

// when our server receives a request, it needs to know what it should respond
app.get( "/", function( request, response ) {
  response.send( "<h1>Hello Express :)</h1>" );
} );

// listen for requests :)
app.listen( process.env.PORT );