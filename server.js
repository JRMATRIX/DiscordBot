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
    clientId: 'd726efa15d16a2c68f7c29e42e88b1f885aa48b0e8cc1c9f',
}));

// Setup lowdb NPM package (Database)
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.data/db.json');

const DB = low(adapter);

DB.defaults({ mixer:[], twitch:[], options:[] }).write();

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
      
  }
}

function mixerChannel( msg, operator, username, channel ) {
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
      msg.channel.send(`*Error: Unknown operator ${operator}*`);
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

function getMixerChannel( username ) {
  
}



/**
 * SETTINGS / OPTIONS
 */




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




// Run the bot in the selected Discord Server
bot.login(process.env.BOT_TOKEN);