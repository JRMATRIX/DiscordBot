/**
 * The Real World Community Announcement Bot
 *
 * Custom Mixer and Discord bot used for shouting out Mixer Streams
 * within The Real World community Discord Server.
 *
 * @package      the-real-world
 * @version      0.0.1
 * @author       JRMATRIX
 * @authorEmail  jrm47r1x@gmail.com
 * @since        19/02/2019
 */



/******************************************************************************
 * NPM Packages
 ******************************************************************************/

/** 
 * Discord NPM package
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 */
const Discord = require('discord.js');
const bot = new Discord.Client();

/** 
 * Mixer NPM package
 *
 * Used for connecting and interacting with the Mixer API
 *
 * @minVersion  3.2.0
 */
const Mixer = require('@mixer/client-node');
const mixerClient = new Mixer.Client( new Mixer.DefaultRequestRunner() );
mixerClient.use(new Mixer.OAuthProvider(mixerClient, {
    clientId: process.env.MIXER_TOKEN
}));

/** 
 * Carina NPM package
 *
 * Used for connecting and interacting with the Mixer Constellation API
 *
 * @minVersion  0.11.2
 */

const Carina = require('carina').Carina;
const ws = require('ws');
Carina.WebSocket = ws;

const ca = new Carina({
    queryString: {
        'Client-ID': process.env.MIXER_TOKEN,
    },
    isBot: true,
}).open();


/** 
 * lowdb NPM package
 *
 * Used for local persistent data storage
 *
 * @minVersion  1.0.0
 */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.data/db.json');

const DB = low(adapter);

DB.defaults({ mixer:[], twitch:[], options:[] }).write();

var msg = null;

const errors = require( './errors.js' );


/******************************************************************************
 * DISCORD
 ******************************************************************************/

/**
 * Discord Command Integration
 *
 * Watches Discord for new command messages
 *
 * @uses    Discord
 * @since   0.0.1
 * @return  null
 */
bot.on('message', message => {  
  // Don't read commands from the bot account, look for '!' to read for commands
  if ( ! message.author.bot && message.content.substring(0, 1) == '!' && message.channel.name === 'bot-configuration' ) {
    
    msg = message;
    
    var args = msg.cleanContent.substring(1).split(' ');
    var call = args[0];
    
    if( call == 'trw' ) parse( args );
    
  }
})

/**
 * Discord Command Parser
 *
 * Parses a Discord message for commands
 *
 * @uses    Discord
 * @param   array               args
 * @since   0.0.1
 * @return  null
 */
function parse( args ) {
  // msg.channel.send( '*Command received*' );

  // console.log( args[1] );
  
  if( args[1] == 'ping' ) return msg.reply( 'Go ping yourself!' );
  
  if( args[1] == 'testEmbed' ) return createMixerEmbed();

  switch( args[2].toLowerCase() ) {

    case 'mixer' :
    case 'mixerchannel' :
      mixerChannel( args[1], args[3], args[4] );
      break;

    case 'twitch' :
    case 'twitchchannel' :

      break;

    case 'option' :
    case 'options' :
      trwOption( args[1], args[3], args[4] );
      break;

  }
}

/**
 * @TODO: IMPLEMENT THIS
 *
 * Discord Mixer Argument Parser
 *
 * Parses arguments passed to the mixer commands
 *
 * Expects:
 * arg[1] : operator            One of 'add', 'update', 'remove' or 'list'
 * arg[2] : cmd                 One of 'mixer' or 'mixerChannel'
 * arg[3] : mixerChannel        The Mixer Channel name
 * arg[4] : announcementChannel The Discord Announcement Channel
 * arg[5] : discordUsername     The Discord Username of the Mixer Channel Owner
 * arg[6] : twitterHandle       A Twitter Handle for the user
 *
 * @param   array               args
 * @since   0.0.1
 * @return  null
 */
function parseMixerArgs( args ) {
  var obj = {};
  
  return obj;
}

function createErrorEmbed( message, title ) {
  if( ! title ) title = 'TRW Bot Error';
  
  var embed = new Discord.RichEmbed()
    .setTitle( title )
    .setDescription( message )
    .setColor( '0xFF0000' );
  
  msg.channel.send( embed );
}

function createSuccessEmbed( message, title ) {
  if( ! title ) title = 'TRW Bot Success';
  
  var embed = new Discord.RichEmbed()
    .setTitle( title )
    .setDescription( message )
    .setColor( '0x00FF00' );
  
  msg.channel.send( embed );
}

function createMixerEmbed( data ) {
  
  var embed = new Discord.RichEmbed()
    .setTitle( 'Test Embed' )
    .setDescription( 'This is a test embed' )
    .setColor( '0x00FF00' );
  
  msg.channel.send( embed );
  
}


/******************************************************************************
 * MIXER
 ******************************************************************************/

/**
 * Mixer Channel
 *
 * Parses an action to take for a Mixer Channel request
 *
 * @param   string              operator
 * @param   string              username
 * @param   string              channel
 * @since   0.0.1
 * @return  null
 */
function mixerChannel( operator, username, channel ) {
  if( ! channel ) {
    var defaultChannel = fetchOption( 'defaultAnnouncementChannel' );
    channel = defaultChannel[0].value;
  }
  
  switch( operator ) {
    
    case 'add':
      addMixerChannel( username, channel );
      break;
      
    case 'update':
      updateMixerChannel( username, channel );
      break;
      
    case 'remove':
      removeMixerChannel( username );
      break;
      
    case 'list':
      listMixerChannels();
      break;
      
    default:
      var out = "```diff\n";
      out = out + "- Error: Unknown operator " + operator + "\n";
      out = out + "```\n";
      
      msg.react( '❌');
      msg.channel.send( out );
      break;
      
  }
}

/**
 * Add Mixer Channel
 *
 * Adds a new Mixer Channel to the bot's Watch List
 *
 * @uses    Discord
 * @uses    MixerClient
 * @param   string              username
 * @param   string              channel
 * @since   0.0.1
 * @return  null
 */
function addMixerChannel( username, channel ) {  
  mixerClient.request('GET', `channels/${username}`).then(res => {
    
    if( pushMixerChannel( res.body, channel ) ) {
    
      ca.subscribe(`channel:${res.body.id}:update`, (type, event, data) => {
        console.log(type, event, data);
      });

      var out = "```diff\n";
      out = out + "+ Added Mixer channel " + username + " to " + channel + "\n";
      out = out + "```\n";

      msg.react('✅');
      msg.channel.send( out );
      
    }
  });
}

/**
 * Update Mixer Channel
 *
 * Updates a Mixer Channel in the bot's Watch List
 *
 * @uses    Discord
 * @uses    MixerClient
 * @param   string              username
 * @param   string              channel
 * @since   0.0.1
 * @return  null
 */
function updateMixerChannel( username, channel ) {  
  
}

/**
 * Remove Mixer Channel
 *
 * Removes a Mixer Channel from the bot's Watch List
 *
 * @uses    Discord
 * @uses    MixerClient
 * @param   string              username
 * @since   0.0.1
 * @return  null
 */
function removeMixerChannel( username ) {
  
  mixerClient.request('GET', `channels/${username}`).then(res => {
    deleteMixerChannel( res.body.id );
    
    ca.unsubscribe(`channel:${res.body.id}:update`);
    
    var out = "```diff\n";
    out = out + "- Removed Mixer channel " + username + " from announcements";
    out = out + "```\n";
    
    msg.react('✅');
    msg.channel.send( out );
  });
  
  // console.log( channel );
}

/**
 * Lits Mixer Channels
 *
 * Outputs a list of all currently active Mixer Channels
 *
 * @since   0.0.1
 * @return  null
 */
function listMixerChannels() {
  var channels = fetchMixerChannels();
  
  // var out = "```md\n";
  
  if( isEmpty( channels ) ) {
    
    return createErrorEmbed( 'No Mixer Channels Available' );
    // out = out + "No Mixer Channels Available\n";
    
  } else {
  
    // out = out + "# Mixer channels:\n";
    var out = '';

    channels.forEach( function( channel ) {
      out = out + "\n";
      out = out + `**${channel.name} *(ID: ${channel.id})***\n`;
      out = out + `    - **Announcement Channel**: ${channel.channel}\n`;
    });

  }
  
  // out = out + "```\n";
  
  msg.react('✅');
  return createSuccessEmbed( out, 'Mixer Streamers' );
  // msg.channel.send( out );
  
}



/******************************************************************************
 * SETTINGS / OPTIONS
 ******************************************************************************/

/**
 * TRW Bot Option
 *
 * Parses an action to take for a Bot Option request
 *
 * @param   string              operator
 * @param   string              option
 * @param   string              value
 * @since   0.0.1
 * @return  null
 */
function trwOption( operator, option, value ) {
  switch( operator ) {
    
    case 'set':
      setOption( msg, option, value );
      break;
      
    case 'get':
      getOption( msg, option );
      break;
      
    case 'list':
      listOptions( msg );
      break;
      
    default:
      var out = "```diff\n";
      out = out + "- Error: Unknown operator " + operator + "\n";
      out = out + "```\n";
      
      msg.react( '❌');
      msg.channel.send( out );
      break;
      
  }
}

/**
 * Set Bot Option
 *
 * Sets or updates a Bot Option
 *
 * @param   string              option
 * @param   mixed               value
 * @since   0.0.1
 * @return  null
 */
function setOption( option, value ) {
  pushOption( option, value );
  
  // @TODO: Add some check here to see if the option was set correctly
  
  var out = "```md\n";
  out = out + "# Updated options:\n\n";
  out = out + "* Set " + option + " to " + value + "\n";
  out = out + "```\n";
  
  msg.react('✅');
  msg.channel.send( out );
}

/**
 * Get Bot Option
 *
 * Outputs a Bot Option value
 *
 * @param   string              option
 * @since   0.0.1
 * @return  mixed
 */
function getOption( option ) {
  var value = fetchOption( option );
  
  var out = "```css\n";
  out = out + "# " + option + " : " + value + "\n";
  out = out + "```\n";
  
  if( msg ) {
    msg.react('✅');
    msg.channel.send( out );
  }
  
  return value;
}

/**
 * List Bot Options
 *
 * Lists all currently assigned Bot Options
 *
 * @since   0.0.1
 * @return  object|null
 */
function listOptions() {
  var options = fetchOptions();
  console.log( options );
  
  // var out = "```md\n";
  
  if( isEmpty( options ) ) {
    
    return createErrorEmbed( 'No TRW Bot Options Available' );
    // out = out + "No TRW Bot Options Available\n";
    
  } else {
  
    var out = '';

    options.forEach( function( option ) {
    // for( var key in options ) {
      out = out + "\n";
      out = out + `**${option.key}** : ${option.value}\n`;
    // }
    });

  }
  
  msg.react('✅');
  return createSuccessEmbed( out, 'TRW Bot Options' );
  // msg.channel.send( out );
}



/******************************************************************************
 * Database
 ******************************************************************************/

/**
 * Push Mixer Channel
 *
 * Pushes a Mixer Channel to the Database
 *
 * @uses    lowdb
 * @param   object              mixerChannel
 * @param   string              channel
 * @since   0.0.1
 * @return  null
 */
function pushMixerChannel( mixerChannel, channel ) {  
  
  if( DB.get( 'mixer' ).find({ id: mixerChannel.id }).value() ) {
    // msg.react( '❌');
    createErrorEmbed( errors.mixerChannelExists );
    
    return false;
  }
  
  DB.get( 'mixer' ).push({
    id: mixerChannel.id,
    name : mixerChannel.token,
    channelName : channel,
    channelID : msg.guild.channels.find( ch => ch.name === channel.substr(1) ),
    twitter : null
  }).write();
  
  return true;
}

/**
 * Delete Mixer Channel
 *
 * Deletes a Mixer Channel from the Database
 *
 * @uses    lowdb
 * @param   string              channelID
 * @since   0.0.1
 * @return  null
 */
function deleteMixerChannel( channelID ) {
  DB.get( 'mixer' ).remove({id:channelID}).write();
}

/**
 * Fetch Mixer Channels
 *
 * Fetches all Mixer Channels from the Database
 *
 * @uses    lowdb
 * @since   0.0.1
 * @return  null
 */
function fetchMixerChannels() {
  return DB.get( 'mixer' ).value();
}

/**
 * Push Bot Option
 *
 * Updates a Bot Option in the database
 *
 * @uses    lowdb
 * @param   string              option
 * @param   mixed               value
 * @since   0.0.1
 * @return  null
 */
function pushOption( option, value ) {
   DB.get( 'options' ).push({
    key: option,
    value : value
  }).write(); 
}

/**
 * Fetch Bot Options
 *
 * Fetches all Bot Options from the database
 *
 * @uses    lowdb
 * @since   0.0.1
 * @return  object|null
 */
function fetchOptions() {
  return DB.get( 'options' ).value();
}

/**
 * Fetch Bot Option
 *
 * Fetches a sing Bot Option from the database
 *
 * @uses    lowdb
 * @param   string              option
 * @since   0.0.1
 * @return  mixed
 */
function fetchOption( option ) {
  return DB.get( 'options' ).filter({key: option}).value();
}



/******************************************************************************
 * UTILITIES
 ******************************************************************************/

/**
 * Is Empty
 *
 * Checks if the passed in object has properties
 *
 * @param   object              obj
 * @since   0.0.1
 * @return  boolean
 */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}



/******************************************************************************
 * MAIN
 ******************************************************************************/

// Run the bot in the selected Discord Server
bot.login(process.env.BOT_TOKEN);

// Loop through our list of streamers and subscribe them to ca events
var channels = fetchMixerChannels();
channels.forEach( function( channel ) {
    ca.subscribe(`channel:${channel.id}:update`, (type, event, data) => {
      console.log(type, event, data);
    });
});