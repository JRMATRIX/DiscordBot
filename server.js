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

// Setup FlatFile NPM package
const DB = require('flatfile');

// DB.db('database/mixer.json', ( err, data ) => {
//   if( err ) throw err;
  
//   data.save( err => {
//     if( err ) throw err; 
//   });
// })

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
    
    var args = msg.content.substring(1).split(' ');
    var call = args[0];
    
    if( call == 'trw' ) parse( msg, args );
    
  }
})

function parse( msg, args ) {
  // msg.channel.send( '*Command received*' );
  
  console.log( args[1] );
  
  switch( args[2] ) {
  
    case 'mixerChannel' :
      mixerChannel( msg, args[1], args[3], args[4] );
      break;
      
    case 'twitchChannel' :
      
      break;
      
  }
}

function mixerChannel( msg, operator, username, channel ) {
  switch( operator ) {
    
    case 'add':
      mixerChannel( msg, username, channel );
      break;
      
    case 'remove':
      
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
  msg.channel.send( '*Adding mixer stream ' + username + ' to #' + channel + '*' );
  
  mixerClient.request('GET', `channels/${username}`).then(res => {
      var channelID = res.body.id;
  });
}

// Run the bot in the selected Discord Server
bot.login(process.env.BOT_TOKEN);