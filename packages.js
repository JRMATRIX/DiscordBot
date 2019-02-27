/*============================================================================*
 * Discord Bot
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
const Discord = require( './lib/discord' );
var Bot = new Discord.Bot({prefix: 'tb'});


const Database = require( './lib/database' );
var DB = new Database();


module.exports = {
    Bot : Bot,
    Database : DB
}