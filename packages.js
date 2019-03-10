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

const MixerAPI = require( './lib/mixer' );
var Mixer = new MixerAPI();


const TwitterAPI = require( './lib/twitter' );
var Twitter = new TwitterAPI();

const Errors = require( './content/errors' );


module.exports = {
    Bot : Bot,
    Mixer : Mixer,
    Database : DB,
    Twitter : Twitter,
    Errors : Errors
}