/*============================================================================*
 * Discord NPM package
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
const Discord = require('discord.js');


const defaults = {
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



/*========================================================================*/
/* Class: Bot
/*
/* Defines bot interactions and behaviours for the system
/*========================================================================*/
/* @since       0.1.0
/*========================================================================*/
/* @access      public
/* @param       (object)    args
/*========================================================================*/
class Bot {
    
    constructor( args = {} ) {
        this.setup( args.prefix );
    }
    
    setup( prefix ) {
        this.Client = new Discord.Client();
        this.prefix = prefix;
        this.listen();
    }
    
    init( token ) {
        this.Client.login( token ).then( data => {
          console.log( 'Discord Client successfully authorized' );
        }).catch( console.error );
    }
    
    listen() {
        this.Client.on( 'message', message => {
            // For testing only, this shouldn't be hard-coded!!
            var inChannel = (message.channel.name === 'bot-configuration' );
            
            // Don't read commands from the bot account, look for '!' to read for commands
            if ( ! message.author.bot && message.content.startsWith( this.prefix ) && inChannel ) {
                console.log( 'Chat Message Received: ' );
                console.log( message.content );

                this.msg = message;
                this.args = this.msg.cleanContent.slice( this.prefix.length ).trim().split( / +/g );

                this.parseCommand();
            }
        });
    }
    
  
    // Command Format:
    // <operator> <group> <context> <...args>
    parseCommand() {
        console.log( this.args );
      
        var command = {
            operator : this.args[0],
            group : this.args[1],
            context : this.args[2].trimRight( 's' )
        }
        
        console.log( command );
    }
    
}

module.exports.Bot = Bot;