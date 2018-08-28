// load express package
var express = require( "express" );

// create an express object: a Web server
var app = express();

// when our server receives a certain request, it needs to know what it should respond

// when the server gets a request for the root of this domain: "/"
// ( here: "https://hello-node-server.glitch.me/" )
app.get( "/", function( request, response ) {
  response.send( "<h1>Hello :)</h1>" ); // we tell the server to respond with some HTML
} );

// when the server gets a request for "https://hello-node-server.glitch.me/about"
app.get( "/about", function( request, response ) {
  response.send( "<h1>All about Express</h1>" );
} );


// finally we set the server to listen for requests :)
app.listen( process.env.PORT );
// "process.env.PORT"