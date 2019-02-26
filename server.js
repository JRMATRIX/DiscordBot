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
/* @copyright   2018 Direwolf Design
/*============================================================================*/



/*============================================================================*/
/* ENVIRONMENT OVERRIDES
/*============================================================================*/

// Override defaultMaxListeners (We're gonna need more than 10!)
// Setting this to 0 allows us as many listeners as the server can cope with
require('events').EventEmitter.defaultMaxListeners = 0;

require('./utilities');



/*============================================================================*/
/* NPM PACKAGES
/*============================================================================*/

/*============================================================================*
 * Discord NPM package
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
// const Discord = require( './discord' );
// const Bot = new Discord.Bot({prefix: 'trw'});

// console.log( Bot );

const Application = require( './requirements' );
const Bot = Application.Bot;


Bot.init(process.env.BOT_TOKEN);