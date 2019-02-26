/*============================================================================*
 * Discord Bot
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
const Discord = require( './discord' );
var Bot = new Discord.Bot({prefix: 'trw'});









module.exports = {
    Discord : Discord,
    Bot : Bot
}