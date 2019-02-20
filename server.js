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

// Setup Discord NPM package
const Discord = require('discord.js');
const bot = new Discord.Client();

// Setup Mixer NPM package
const Mixer = require('@mixer/client-node');
const mixerClient = new Mixer.Client( new Mixer.DefaultRequestRunner() );
mixerClient.use(new Mixer.OAuthProvider(mixerClient, {
    clientId: process.env.MIXER_TOKEN
}));

// Setup Carina NPM package
const Carina = require('carina').Carina;
const ws = require('ws');
Carina.WebSocket = ws;

const ca = new Carina({
    queryString: {
        'Client-ID': process.env.MIXER_TOKEN,
    },
    isBot: true,
}).open();

// Setup lowdb NPM package (Database)
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.data/db.json');

const DB = low(adapter);

DB.defaults({ mixer:[], twitch:[], options:{
  defaultAnnouncementChannel: ''
} }).write();

/**
 * Discord Command Integration
 *
 * Watches Discord for new command messages
 *
 * @uses    Discord
 * @param   \Discord\Message    msg
 * @since   0.0.1
 * @return  null
 */
bot.on('message', msg => {  
  // Don't read commands from the bot account, look for '!' to read for commands
  if (msg.author.username != 'TRW Bot' && msg.content.substring(0, 1) == '!' && msg.channel.name === 'bot-configuration' ) {
    
    var args = msg.cleanContent.substring(1).split(' ');
    var call = args[0];
    
    if( call == 'trw' ) parse( msg, args );
    
  }
})

function parse( msg, args ) {
  // msg.channel.send( '*Command received*' );
  
  // console.log( args[1] );
  
  switch( args[2].toLowerCase() ) {
  
    case 'mixer' :
    case 'mixerchannel' :
      mixerChannel( msg, args[1], args[3], args[4] );
      break;
      
    case 'twitch' :
    case 'twitchchannel' :
      
      break;
      
    case 'option' :
    case 'options' :
      trwOption( msg, args[1], args[3], args[4] );
      break;
      
  }
}

/**
 * MIXER
 */


function mixerChannel( msg, operator, username, channel ) {
  if( ! channel ) channel = getOption( false, 'defaultAnnouncementChannel' );
  console.log( channel );
  
  switch( operator ) {
    
    case 'add':
      addMixerChannel( msg, username, channel );
      break;
      
    case 'remove':
      removeMixerChannel( msg, username );
      break;
      
    case 'list':
      listMixerChannels( msg );
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
 * @param   \Discord\Message    msg
 * @param   string              username
 * @param   string              channel
 * @since   0.0.1
 * @return  null
 */
function addMixerChannel( msg, username, channel ) {  
  mixerClient.request('GET', `channels/${username}`).then(res => {
    pushMixerChannel( res.body, channel );
    
    ca.subscribe(`channel:${res.body.id}:update`, (type, event, data) => {
      console.log(type, event, data);
    });
    
    var out = "```diff\n";
    out = out + "+ Added Mixer channel " + username + " to " + channel + "\n";
    out = out + "```\n";
    
    msg.react('✅');
    msg.channel.send( out );
  });
}

function pushMixerChannel( mixerChannel, channel ) {  
  DB.get( 'mixer' ).push({
    id: mixerChannel.id,
    name : mixerChannel.token,
    channel : channel,
    twitter : null
  }).write();
}

/**
 * Add Mixer Channel
 *
 * Adds a new Mixer Channel to the bot's Watch List
 *
 * @uses    Discord
 * @uses    MixerClient
 * @param   \Discord\Message    msg
 * @param   string              username
 * @since   0.0.1
 * @return  null
 */
function removeMixerChannel( msg, username ) {
  
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

function deleteMixerChannel( channelID ) {
  DB.get( 'mixer' ).remove({id:channelID}).write();
}

function listMixerChannels( msg ) {
  var channels = fetchMixerChannels();
  
  var out = "```md\n";
  
  if( isEmpty( channels ) ) {
    
    out = out + "No Mixer Channels Available\n";
    
  } else {
  
    out = out + "# Mixer channels:\n";

    channels.forEach( function( channel ) {
      out = out + "\n";
      out = out + `* ${channel.name} (ID: ${channel.id})\n`;
      out = out + `  Announcement Channel: ${channel.channel}\n`;
    });

  }
  
  out = out + "```\n";
  
  msg.react('✅');
  msg.channel.send( out );
  
}

function fetchMixerChannels() {
  return DB.get( 'mixer' ).value();
}



/**
 * SETTINGS / OPTIONS
 */

function trwOption( msg, operator, option, value ) {
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

function setOption( msg, option, value ) {
  DB.set( `options.${option}`, value ).write();
  
  // @TODO: Add some check here to see if the option was set correctly
  
  var out = "```md\n";
  out = out + "# Updated options:\n\n";
  out = out + "* Set " + option + " to " + value + "\n";
  out = out + "```\n";
  
  msg.react('✅');
  msg.channel.send( out );
}

function getOption( msg, option ) {
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

function listOptions( msg ) {
  var options = fetchOptions();
  console.log( options );
  
  var out = "```md\n";
  
  if( isEmpty( options ) ) {
    
    out = out + "No TRW Bot Options Available\n";
    
  } else {
  
    out = out + "# TRW Bot Options:\n";

    // options.forEach( function( key, value ) {
    for( var key in options ) {
      out = out + "\n";
      out = out + `* ${key} : ${options[key]}\n`;
    }
    // });

  }
  
  out = out + "```\n";
  
  msg.react('✅');
  msg.channel.send( out );
}

function fetchOptions() {
  return DB.get( 'options' ).value();
}

function fetchOption( option ) {
  return DB.get( `options.${option}` ).value();
}


/**
 * UTILITIES
 */

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


/**
 * MAIN
 */

// Run the bot in the selected Discord Server
bot.login(process.env.BOT_TOKEN);

// Loop through our list of streamers and subscribe them to ca events
var channels = fetchMixerChannels();
channels.forEach( function( channel ) {
    ca.subscribe(`channel:${channel.id}:update`, (type, event, data) => {
      console.log(type, event, data);
    });
});