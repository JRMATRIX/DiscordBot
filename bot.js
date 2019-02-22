/** 
 * Discord NPM package
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 */
const Discord = require('discord.js');
const bot = new Discord.Client();

const botOptions = {
  name : 'The Real World',
  icons : {
    trw : 'https://pbs.twimg.com/profile_images/1094303833755402241/TRstEyBz_400x400.jpg',
    mixer : 'https://avatars3.githubusercontent.com/u/11798804?s=400&v=4',
    twitch : 'https://cdn4.iconfinder.com/data/icons/social-media-circle-6/1024/circle-11-512.png'
  },
  colors : {
    error : '#FF0000',
    success : '#00FF00',
    mixer : '#1C78C0',
    twitch : '#6441a5'
  }
}

module.exports = {
  
  // Run the bot in the selected Discord Server
  login : function() {
    bot.login( process.env.BOT_TOKEN );
  },
  
  outputError : function( message, title ) {
    if( ! title ) title = 'Error';
    
    var embed = new Discord.RichEmbed()
      .setTitle( title )
      .setDescription( message )
      .setColor( botOptions.colors.error );
    
    return embed;
  },
  
  outputSuccess : function( message, title ) {
    if( ! title ) title = 'Success';
  
    var embed = new Discord.RichEmbed()
      .setTitle( title )
      .setDescription( message )
      .setColor( botOptions.colors.success );
    
    return embed;
  },
  
  mixerLiveEmbed : function( data ) {
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is Live on Mixer`, botOptions.icons.mixer, `https://mixer.com/${data.username}` )
      .setTitle( `https://mixer.com/${data.username}` )
      .setURL( `https://mixer.com/${data.username}` )
      .addField( 'Now Playing', `${data.game}` )
      .addField( 'Stream Title', `${data.title}` )
      .addField( 'Followers', `${data.followers}`, true )
      .addField( 'Viewers', `${data.viewers}`, true )
      .setColor( botOptions.colors.mixer )
      .setImage( data.thumbnail )
      .setThumbnail( data.avatar )
      .setFooter( botOptions.name, botOptions.icons.trw )
      .setTimestamp( new Date() );
    
    return embed;
  },
  
  mixerUpdateEmbed : function( data ) {
    var url = `https://mixer.com/${data.username}`;
    
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is Live on Mixer`, botOptions.icons.mixer, url )
      .setTitle( url )
      .setURL( url )
      .addField( 'Now Playing', data.game )
      .addField( 'Stream Title', data.title )
      .addField( 'Followers', data.followers, true )
      .addField( 'Viewers', data.liveViewers, true )
      .setColor( botOptions.colors.mixer )
      .setImage( data.thumbnail )
      .setThumbnail( data.avatar )
      .setFooter( botOptions.name, botOptions.icons.trw );
    
    return embed;
  },
  
  mixerOfflineEmbed : function( data ) {
    var url = `https://mixer.com/${data.username}`;
    
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is now Offline`, botOptions.icons.mixer, url )
      .setTitle( url )
      .setURL( url )
      .addField( 'Last Played', data.game )
      .addField( 'Followers', data.followers, true )
      .addField( 'Lifetime Views', data.viewers, true )
      .setColor( botOptions.colors.mixer )
      .setImage( data.thumbnail )
      .setThumbnail( data.avatar )
      .setFooter( botOptions.name, botOptions.icons.trw )
  },
  
  twitchLiveEmbed : function( data ) {
    var url = `https://twitch.tv/${data.username}`;
    
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is Live on Mixer`, botOptions.icons.twitch, url )
      .setTitle( url )
      .setURL( url )
      .addField( 'Now Playing', data.game )
      .addField( 'Stream Title', data.title )
      .addField( 'Followers', data.followers, true )
      .addField( 'Viewers', data.viewers, true )
      .setColor( botOptions.colors.twitch )
      .setImage( data.thumbnail )
      .setThumbnail( data.avatar )
      .setFooter( botOptions.name, botOptions.icons.trw )
      .setTimestamp( new Date() );
    
    return embed;
  },
  
  twitchUpdateEmbed : function( data ) {
    var url = `https://twitch.tv/${data.username}`;
    
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is Live on Mixer`, botOptions.icons.twitch, url )
      .setTitle( url )
      .setURL( url )
      .addField( 'Now Playing', data.game )
      .addField( 'Stream Title', data.title )
      .addField( 'Followers', data.followers, true )
      .addField( 'Viewers', data.liveViewers, true )
      .setColor( botOptions.colors.twitch )
      .setImage( data.thumbnail )
      .setThumbnail( data.avatar )
      .setFooter( botOptions.name, botOptions.icons.trw );
    
    return embed;
  },
  
  twitchOfflineEmbed : function( data ) {
    var url = `https://twitch.tv/${data.username}`;
    
    var embed = new Discord.RichEmbed()
      .setAuthor( `${data.username} is now Offline`, botOptions.icons.twitch, url )
      .setTitle( url )
      .setURL( url )
      .addField( 'Last Played', data.game )
      .addField( 'Followers', data.followers, true )
      .addField( 'Lifetime Views', data.viewers, true )
      .setColor( botOptions.colors.twitch )
      .setImage( data.thumbnail )
      .setThumbnail( data.avatar )
      .setFooter( botOptions.name, botOptions.icons.trw );
  }
  
}