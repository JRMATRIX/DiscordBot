// load express package
var express = require( "express" );

// create an express object that will 
var app = express();

// when our server receives a request, it needs to know what it should respond
// so we need to 
app.get( "/", function( request, response ){
  response.send( "Hello node" );
});


// and we can define other routes
app.get( "/html", function( request, response ){
  response.send( "<h1>Hello HTML</h1>" );
});


// or we can set express to serve files from a specific folder:
app.use( express.static( "public" ) );

// http://expressjs.com/en/starter/basic-routing.html
app.get( "/file", function( request, response ) {
  response.sendFile( __dirname + "/public/index.html" );
} );

  // we can also respond to a request with data
app.get( "/json", function( request, response ) {
  response.json( {
    key: "value",
    randomNumber: Math.random() * 10
  } )
} );
// here we are returning a simple JS object as JSON, but it could connect to a database to look for special data and return it

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
