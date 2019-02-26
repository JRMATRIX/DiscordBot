/*============================================================================*/
/* TRWBot Server
/*============================================================================*/
/* Simple Keep-Alive Http server for maintaining bot connection
/*============================================================================*/
/* @version     0.1.0
/* @since       0.1.0
/*============================================================================*/
/* @package     TRWBot
/* @author      JRMATRIX <jrm47r1x@gmail.com>
/* @copyright   2019 JRMATRIX
/*============================================================================*/

var http = require('http');

http.createServer( function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);