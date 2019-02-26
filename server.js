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

require('events').EventEmitter.defaultMaxListeners = 0;



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
const bot = new Discord.Client({ token : process.env.BOT_TOKEN });

// console.log( bot );

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
 * @minVersion  0.12.0
 */

const Carina = require('carina').Carina;
const ws = require('ws');
// ws.setMaxListeners( 50 );
Carina.WebSocket = ws;
// Carina.socket.setMaxListeners( 50 );
// console.log( Carina );

const ca = new Carina({
    queryString: {
        'Client-ID': process.env.MIXER_TOKEN,
    },
    isBot: true,
    maxEventListeners: 50
}).open();

// ca.setMaxListeners( 50 );
// console.log( ca );
// ca.Carina.socket.ConstellationSocket.setMaxListeners(50);

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
var embeds = [];

const prefix = 'trw';
const errors = require( './errors.js' );



/** 
 * Twitter NPM package
 *
 * Used for posting curated Tweets to Twitter
 *
 * @minVersion  1.7.1
 */
const Twitter = require( 'twitter' );
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

// twitterClient.setMaxListeners( 50 )


/******************************************************************************
 * DISCORD
 ******************************************************************************/

bot.on( 'ready', () => {
  bot.user.setActivity("The Real World Community", {type: "WATCHING"});
})

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
  if ( ! message.author.bot && message.content.startsWith( prefix ) && message.channel.name === 'bot-configuration' ) {
    
    msg = message;
    
    var args = msg.cleanContent.slice( prefix.length ).trim().split( / +/g );

    parse( args );
    
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
  console.log( args );
  
  if( args[0] == 'ping' ) return msg.reply( 'Go ping yourself!' );
  
  if( args[0] == 'testEmbed' ) return mixerLivePost( 39628981 );
  if( args[0] == 'testTweet' ) return testMixerTweet();

  switch( args[1].toLowerCase() ) {

    /**
     * Mixer Commands
     *
     * Accepted Arguments:
     * - args[0] : operator            One of 'add', 'update', 'remove' or 'list'
     * - args[1] : cmd                 'mixer'
     * - args[2] : case                One of 'channel' or 'team'
     * - args[3] : mixerName           The Mixer Channel/Team name
     * - args[4] : announcementChannel The Discord Announcement Channel
     * - args[5] : discordUser         A Discord User for the channel/team
     */
    case 'mixer' :
      if( args[2] === 'channel' ) { mixerChannel( args[0], args[3], args[4], args[5] ); }
      else if( args[2] === 'team' ) { mixerTeam(); }
      else { return createErrorEmbed( "Missing parameter: Parameter 3 should be either 'channel' or 'team'" ); }
      break;

    case 'twitch' :

      break;

    case 'option' :
    case 'options' :
      trwOption( args[0], args[2], args[3] );
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
 * - args[0] : operator            One of 'add', 'update', 'remove' or 'list'
 * - args[1] : cmd                 'mixer'
 * - args[2] : case                One of 'channel' or 'team'
 * - args[3] : mixerName           The Mixer Channel/Team name
 * - args[4] : announcementChannel The Discord Announcement Channel
 * - args[5] : discordUser         A Discord User for the channel/team
 *
 * @param   array               args
 * @since   0.0.1
 * @return  null
 */
function parseMixerArgs( args ) {
  var obj = {};
  
  return obj;
}



// EMBEDS

/**
 * Create Error Embed
 *
 * 
 */
function createErrorEmbed( message, title ) {
  if( ! title ) title = 'TRW Bot Error';
  
  var embed = new Discord.RichEmbed()
    .setTitle( title )
    .setDescription( message )
    .setColor( '0xFF0000' );
  
  msg.react( '❌');
  msg.channel.send( embed );
}

function createSuccessEmbed( message, title ) {
  if( ! title ) title = 'TRW Bot Success';
  
  var embed = new Discord.RichEmbed()
    .setTitle( title )
    .setDescription( message )
    .setColor( '0x00FF00' );
      
  msg.react('✅');
  msg.channel.send( embed );
}

function createMixerLiveEmbed( data ) {
  var embed = new Discord.RichEmbed()
    .setAuthor( `${data.username} is Live on Mixer`, 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', `https://mixer.com/${data.username}` )
    .setTitle( `https://mixer.com/${data.username}` )
    .setURL( `https://mixer.com/${data.username}` )
    .addField( 'Now Playing', `${data.game}` )
    .addField( 'Stream Title', `${data.title}` )
    .addField( 'Followers', `${data.followers}`, true )
    .addField( 'Viewers', `${data.viewers}`, true )
    .setColor( '0x1C78C0' )
    .setImage( `${data.thumbnail}` )
    .setThumbnail( `${data.avatar}` )
    .setFooter( 'The Real World', 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg' )
    .setTimestamp( new Date() );
  
  // data.announcementChannel.send( embed );
  data.announcementChannel.send( embed ).then( embedMessage => { 
    // modifyMixerChannelEmbed( data.username, embedMessage );
    embeds[data.username] = embedMessage; 
  }).catch( console.log );
}

function updateMixerLiveEmbed( data ) {
  var embed = new Discord.RichEmbed()
    .setAuthor( `${data.username} is Live on Mixer`, 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', `https://mixer.com/${data.username}` )
    .setTitle( `https://mixer.com/${data.username}` )
    .setURL( `https://mixer.com/${data.username}` )
    .addField( 'Now Playing', `${data.game}` )
    .addField( 'Stream Title', `${data.title}` )
    .addField( 'Followers', `${data.followers}`, true )
    .addField( 'Viewers', `${data.liveViewers}`, true )
    .setColor( '0x1C78C0' )
    .setImage( `${data.thumbnail}` )
    .setThumbnail( `${data.avatar}` )
    .setFooter( 'The Real World', 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg' );
  
  // data.embedMessage.edit( embed ).then( newEmbedMessage => { 
  //   modifyMixerChannelEmbed( data.username, newEmbedMessage );
  // }).catch( console.log );
  
  embeds[data.username].edit( embed ).then( newEmbedMessage => {
    console.log( embeds[data.username] );
    embeds[data.username] = newEmbedMessage; 
  }).catch( console.log );
}

function createMixerOfflineEmbed( data ) {
  var embed = new Discord.RichEmbed()
    .setAuthor( `${data.username} is now Offline`, 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', `https://mixer.com/${data.username}` )
    .setTitle( `https://mixer.com/${data.username}` )
    .setURL( `https://mixer.com/${data.username}` )
    .addField( 'Last Played', `${data.game}` )
    .addField( 'Followers', `${data.followers}`, true )
    .addField( 'Viewers', `${data.liveViewers}`, true )
    .setColor( '0x1C78C0' )
    .setImage( `${data.thumbnail}` )
    .setThumbnail( `${data.avatar}` )
    .setFooter( 'The Real World', 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg' )
    .setTimestamp( new Date() );
  
  embeds[data.username].edit( embed )
  // data.embedMessage.edit( embed );
}

function createTwitchEmbed( data ) {
  
  var embed = new Discord.RichEmbed()
    .setAuthor( 'JRMATRIX is Live on Twitch', 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', 'https://mixer.com/JRMATRIX' )
    .setTitle( 'https://mixer.com/JRMATRIX' )
    .setURL( 'https://mixer.com/JRMATRIX' )
    .addField( 'Now Playing', '{Game Title}' )
    .addField( 'Stream Title', '{This is the stream title. It can take up to 2 lines on a Mixer embed}' )
    .addField( 'Followers', '318', true )
    .addField( 'Views', '2,926', true )
    .setColor( '0x1C78C0' )
    .setImage( 'https://uploads.mixer.com/thumbnails/hdhepi5a-39628981.jpg' )
    .setThumbnail( 'https://mixer.com/api/v1/users/47436757/avatar?w=256&h=256' )
    .setFooter( 'The Real World', 'https://cdn.discordapp.com/avatars/547391401000828938/26da8949887ea34cbd3ad3edab407b7c.png?size=256' )
    .setTimestamp( new Date() );
  
  data.announcementChannel.send( embed );
  
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
function mixerChannel( operator, username, channel, discordUser ) {
  if( channel === undefined ) {
    var defaultChannel = fetchOption( 'defaultAnnouncementChannel' );
    channel = defaultChannel[0].value;
  }
  
  switch( operator ) {
    
    case 'add':
      addMixerChannel( username, channel, discordUser );
      break;
      
    case 'update':
      updateMixerChannel( username, channel, discordUser );
      break;
      
    case 'remove':
      removeMixerChannel( username );
      break;
      
    case 'list':
      listMixerChannels();
      break;
      
    default:
      createErrorEmbed( `Unknown operator '${operator}'` );
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
function addMixerChannel( username, channel, discordUser ) {  
  mixerClient.request('GET', `channels/${username}`).then(res => {
    
    if( pushMixerChannel( res.body, channel, discordUser ) ) {
      watchMixerChannel( res.body.id );

      createSuccessEmbed( `Added Mixer channel ${username} to ${channel}`, 'Mixer Streamer Added' );
      
    }
  }).catch( err => {
    console.log( err );
    
    
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
function updateMixerChannel( username, announcementChannel, discordUser ) {  
  mixerClient.request('GET', `channels/${username}`).then(res => {
    
    if( modifyMixerChannel( res.body, announcementChannel, discordUser ) ) {
      
      var out = `- Announcement Chanel : ${announcementChannel}\n`
        + `- Discord User : ${discordUser}`;

      createSuccessEmbed( out, `Updated Mixer Channel ${username}` );
      
    }
  }).catch( console.log );
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
    
    ca.unsubscribe(`channel:${res.body.id}:update`, data => { 
      console.log( data );
    });
    
    createErrorEmbed( `Removed Mixer channel ${username} from announcements`, 'Mixer Streamer Removed' );
  });
}

/**
 * List Mixer Channels
 *
 * Outputs a list of all currently active Mixer Channels
 *
 * @since   0.0.1
 * @return  null
 */
function listMixerChannels() {
  var channels = fetchMixerChannels();
  
  if( isEmpty( channels ) ) {
    
    return createErrorEmbed( 'No Mixer Channels Available' );
    
  } else {
    
    var embed = new Discord.RichEmbed()
    .setTitle( 'Mixer Streamers' )
    .setColor( '0x1C78C0' )
    .setThumbnail( 'http://www.logospng.com/images/56/logo-sticker-by-mixer-design-humans-56144.png' );

    channels.forEach( function( channel ) {
      
      var content = `- Channel ID: ${channel.id}\n`
        + `- Channel URL: https://mixer.com/${channel.name}\n`
        + `- Twitter Handle: ${channel.twitter ? channel.twitter.replace( /https\:\/\/twitter\.com\/|https\:\/\/www\.twitter\.com\//gi, '@' ) : 'undefined'}\n`
        + `- Twitter URL: ${channel.twitter ? channel.twitter : 'undefined'}\n`
        + `- Announcement Channel: #${channel.channelName}`;
      
      // embed.addBlankField( false );
      embed.addField( `${channel.name}`, content );
    });

  }
  
  msg.channel.send( embed );
  
}

/**
 * Watch Mixer Channel
 *
 * Uses Carina to watch for live updates from a Mixer
 * Channel
 *
 * @uses    Carina
 * @param   string              channelID
 * @since   0.0.1
 * @return  null
 */
function watchMixerChannel( channelID ) {
  ca.subscribe(`channel:${channelID}:update`, data => {
    console.log( data, channelID );
    
    // if( ( data.online !== undefined ) && ( data.updatedAt !== undefined ) ) {
    
    if( ( data.online !== undefined && data.online == true ) && ( data.updatedAt !== undefined ) ) {
      mixerLivePost( channelID );
    } else if( ( data.online !== undefined && data.online == false ) && ( data.updatedAt !== undefined ) ) {
      mixerOfflineUpdate( channelID );
    } else if ( data.viewersCurrent ) {
      mixerLiveUpdate( channelID );           
    }
    
    // }
  });
}



// @TODO : Add Mixer Team functionality to watch all streamers in a team

function mixerTeam() {}

function addMixerTeam() {}

function updateMixerTeam() {}

function removeMixerTeam() {}

function listMixerTeams() {}



/**
 * Mixer Live Post
 *
 * Collects the required data to send to Discord to generate
 * a Mixer live post embed
 *
 * @uses    MixerClient
 * @param   string              channelID
 * @since   0.0.1
 * @return  null
 */
function mixerLivePost( channelID ) {
  mixerClient.request('GET', `channels/${channelID}`).then(res => {

    var channel = fetchMixerChannel( channelID )[0];
    
    var data = {
      username : res.body.token,
      title : res.body.name,
      thumbnail : res.body.thumbnail ? res.body.thumbnail.url : res.body.bannerUrl,
      game : res.body.type.name,
      avatar : res.body.user.avatarUrl,
      followers : res.body.numFollowers,
      viewers : res.body.viewersTotal,
      liveViewers : res.body.viewersCurrent,
      announcementChannel : bot.channels.find( ch => ch.name === channel.channelName )
    }

    createMixerLiveEmbed( data );
    createMixerTweet( data );

  }); 
}

function mixerLiveUpdate( channelID ) { 
  mixerClient.request('GET', `channels/${channelID}`).then(res => {

    var channel = fetchMixerChannel( channelID )[0];
    
    var data = {
      username : res.body.token,
      title : res.body.name,
      thumbnail : res.body.thumbnail ? res.body.thumbnail.url : res.body.bannerUrl,
      game : res.body.type.name,
      avatar : res.body.user.avatarUrl,
      followers : res.body.numFollowers,
      viewers : res.body.viewersTotal,
      liveViewers : res.body.viewersCurrent,
      announcementChannel : bot.channels.find( ch => ch.name === channel.channelName ),
      embed : channel.embed,
      embedMessage : channel.embedMessage
    }

    if( channel.embedMessage ) updateMixerLiveEmbed( data );

  }); 
}

function mixerOfflineUpdate( channelID ) {
  mixerClient.request('GET', `channels/${channelID}`).then(res => {
     
    var channel = fetchMixerChannel( channelID )[0];
     
    var data = {
      username : res.body.token,
      title : res.body.name,
      thumbnail : res.body.thumbnail ? res.body.thumbnail.url : res.body.bannerUrl,
      game : res.body.type.name,
      avatar : res.body.user.avatarUrl,
      followers : res.body.numFollowers,
      viewers : res.body.viewersTotal,
      announcementChannel : bot.channels.find( ch => ch.name === channel.channelName ),
      embedMessage : channel.embedMessage
    }
     
    if( channel.embedMessage ) createMixerOfflineEmbed( data );
     
  }); 
}



/******************************************************************************
 * TWITCH
 ******************************************************************************/

// @TODO: Integrate Twitch



/******************************************************************************
 * TWITTER
 ******************************************************************************/

/**
 * Create Mixer Tweet
 *
 * Generates content for a new Tweet when a Mixer channel goes live
 *
 * @uses    TwitterClient
 * @param   object              data
 * @since   0.0.1
 * @return  null
 */
function createMixerTweet( data ) {
  var content = `${data.username} is Live on @WatchMixer\n\n`
    + `Playing: ${data.game}\n\n`
    + `Stream Title: ${data.title}\n\n`
    + `Drop by and join their community of ${data.followers} followers!\n\n`
    + `https://mixer.com/${data.username}\n\n`
    + `#HappyStreaming`;
  
  sendTweet( content );
}

/**
 * Send Tweet
 *
 * Posts a new Tweet using pre-generated content
 *
 * @uses    TwitterClient
 * @param   object              data
 * @since   0.0.1
 * @return  null
 */
function sendTweet( content ) {
  twitterClient.post('statuses/update', {status: content},  (error, tweet, response) => {
    if(error) { console.log( error ); return false; }
  });
}

/**
 * Test Mixer Tweet (DEBUGGING)
 *
 * Generates content for a new Test Tweet that mimicks createMixerTweet output
 *
 * @uses    TwitterClient
 * @since   0.0.1
 * @return  null
 */
function testMixerTweet() {
  var content = `MixerStreamer is Live on @WatchMixer!\n\n`
    + `Playing: GameName\n`
    + `Stream Title: StreamTitle\n\n`
    + `Drop by and join their community of 100 followers!\n`
    + `https://mixer.com/MixerStreamer\n\n`
    + `#HappyStreaming`;
  
  sendTweet( content );
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
      createErrorEmbed( `Unknown operator '${operator}'` );
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
  
  createSuccessEmbed( `Set ${option} to ${value}`, 'Updated TRW Bot Options' );
  
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
  
  if( msg ) createSuccessEmbed( `${option} : ${value}`, 'TRW Bot Options' );
  
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
      out = out + "\n";
      out = out + `${option.key} : ${option.value}\n`;
    });

  }
  
  return createSuccessEmbed( out, 'TRW Bot Options' );
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
    createErrorEmbed( errors.mixerChannelExists );
    return false;
  }
  
  DB.get( 'mixer' ).push({
    id: mixerChannel.id,
    name : mixerChannel.token,
    channelName : channel.substr(1),
    twitter : mixerChannel.user.social.twitter
  }).write();
  
  return true;
}

/**
 * @TODO: Make this work
 *
 * Modify Mixer Channel
 *
 * Updates a Mixer Channel to the Database
 *
 * @uses    lowdb
 * @param   object              mixerChannel
 * @param   string              channel
 * @since   0.0.1
 * @return  null
 */
function modifyMixerChannel( mixerChannel, announcementChannel ) {  }

function modifyMixerChannelEmbed( mixerChannel, embedMessage ) {
  if( DB.get('mixer').find({ name : mixerChannel }) ) {
    DB.get('mixer').find({ 
      name : mixerChannel 
    }).assign({
      embedMessage : embedMessage
    }).write();
  }
  
  console.log( `Error: Trying to update unkown Mixer channel ${mixerChannel}` );
  return false;
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
 * Fetch Mixer Channel
 *
 * Fetches a single Mixer Channels from the Database
 *
 * @uses    lowdb
 * @param   string              channelID
 * @since   0.0.1
 * @return  null
 */
function fetchMixerChannel( channelID ) {
  return DB.get( 'mixer' ).filter({id: channelID}).value();
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
function isEmpty( obj ) {
    for( var key in obj ) {
        if( obj.hasOwnProperty( key ) )
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
channels.forEach( function( channel ) { watchMixerChannel( channel.id ); });