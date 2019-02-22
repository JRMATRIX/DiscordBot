/** 
 * Discord NPM package
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 */
const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
  
  // Run the bot in the selected Discord Server
  login : function() {
    bot.login(process.env.BOT_TOKEN);
  },
  
  outputError : function( message, title ) {
    if( ! title ) title = 'Error';
    
    var embed = new Discord.RichEmbed()
      .setTitle( title )
      .setDescription( message )
      .setColor( '0xFF0000' );
    
    return embed;
  },
  
  outputSuccess : function( message, title ) {
    if( ! title ) title = 'Success';
  
    var embed = new Discord.RichEmbed()
      .setTitle( title )
      .setDescription( message )
      .setColor( '0x00FF00' );
    
    return embed;
  },
  
  mixerLiveEmbed : function( data ) {
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
    
    return embed;
  },
  
  mixerUpdateEmbed : function( data ) {
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
    
    return embed;
  },
  
  mixerOfflineEmbed : function( data ) {
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
  },
  
  twitchLiveEmbed : function( data ) {
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is Live on Mixer`, 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', `https://twitch.tv/${data.username}` )
      .setTitle( `https://twitch.tv/${data.username}` )
      .setURL( `https://twitch.tv/${data.username}` )
      .addField( 'Now Playing', `${data.game}` )
      .addField( 'Stream Title', `${data.title}` )
      .addField( 'Followers', `${data.followers}`, true )
      .addField( 'Viewers', `${data.viewers}`, true )
      .setColor( '0x1C78C0' )
      .setImage( `${data.thumbnail}` )
      .setThumbnail( `${data.avatar}` )
      .setFooter( 'The Real World', 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg' )
      .setTimestamp( new Date() );
    
    return embed;
  },
  
  twitchUpdateEmbed : function( data ) {
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is Live on Mixer`, 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', `https://twitch.tv/${data.username}` )
      .setTitle( `https://twitch.tv/${data.username}` )
      .setURL( `https://twitch.tv/${data.username}` )
      .addField( 'Now Playing', `${data.game}` )
      .addField( 'Stream Title', `${data.title}` )
      .addField( 'Followers', `${data.followers}`, true )
      .addField( 'Viewers', `${data.liveViewers}`, true )
      .setColor( '0x1C78C0' )
      .setImage( `${data.thumbnail}` )
      .setThumbnail( `${data.avatar}` )
      .setFooter( 'The Real World', 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg' );
    
    return embed;
  },
  
  twitchOfflineEmbed : function( data ) {
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is now Offline`, 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4', `https://twitch.tv/${data.username}` )
      .setTitle( `https://twitch.tv/${data.username}` )
      .setURL( `https://twitch.tv/${data.username}` )
      .addField( 'Last Played', `${data.game}` )
      .addField( 'Followers', `${data.followers}`, true )
      .addField( 'Viewers', `${data.liveViewers}`, true )
      .setColor( '0x1C78C0' )
      .setImage( `${data.thumbnail}` )
      .setThumbnail( `${data.avatar}` )
      .setFooter( 'The Real World', 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg' )
      .setTimestamp( new Date() );
  }
  
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
    modifyMixerChannelEmbed( data.username, embedMessage );
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
  
  data.embedMessage.edit( embed ).then( newEmbedMessage => { 
    modifyMixerChannelEmbed( data.username, newEmbedMessage );
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
  
  data.embedMessage.edit( embed );
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