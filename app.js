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
    // For testing only, this shouldn't be hard-coded!!
    var inChannel = (message.channel.name === 'bot-configuration' );

    // Don't read commands from the bot account, look for '!' to read for commands
    if ( ! message.author.bot && message.content.startsWith( Bot.prefix ) && inChannel ) {
        console.log( 'Chat Message Received: ' );
        console.log( message.content );

        Bot.msg = message;
        Bot.args = Bot.msg.cleanContent.slice( Bot.prefix.length ).trim().split( / +/g );

        Bot.parseCommand();
    }
});



Bot.init(process.env.BOT_TOKEN);