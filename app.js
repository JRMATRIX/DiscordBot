/*============================================================================*/
/* TRWBot
/*============================================================================*/
/* Custom Discord bot used for shouting out Mixer Streams within The Real World 
/* community Discord Server.
/*============================================================================*/
/* @version     0.1.0
/* @since       0.0.1
/*============================================================================*/
/* @package     TRWBot
/* @author      JRMATRIX <jrm47r1x@gmail.com>
/* @copyright   2019 JRMATRIX
/*============================================================================*/



/*============================================================================*/
/* ENVIRONMENT SETUP
/*============================================================================*/

// Override defaultMaxListeners (We're gonna need more than 10!)
// Setting this to 0 allows us as many listeners as the server can cope with
require( 'events' ).EventEmitter.defaultMaxListeners = 0;

// Simple Keep-Alive Server
require( './server' );

// Custom Utility Functions
require( './utilities' );



/*============================================================================*/
/* PACKAGES
/*============================================================================*/

const Application = require( './packages' );

/*============================================================================*
 * Discord Bot
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
const Bot = Application.Bot;



Bot.Client.on( 'message', message => {
    if( Bot.parseMessage( message ) ) {
        
    }
});



Bot.init(process.env.BOT_TOKEN);