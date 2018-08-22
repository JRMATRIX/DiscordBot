// load express package
var express = require('express');

// create an express object
var app = express();

app.get( '/', function( request, response ){
  response.send( '<h1>Hello client</h1>' );
});

/*
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
*/

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
