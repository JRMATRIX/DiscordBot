/*============================================================================*
 * Discord NPM package
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
const Discord = require('discord.js');
const Commands = require('../content/commands');


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
    }
    
    init( token ) {
        this.Client.login( token ).then( data => {
          console.log( 'Discord Client successfully authorized' );
        }).catch( console.error );
    }
    
    
    parseMessage( message ) {
        // For testing only, this shouldn't be hard-coded!!
        var inChannel = (message.channel.name === 'bot-configuration' );

        // Don't read commands from the bot account, look for '!' to read for commands
        if ( ! message.author.bot && message.content.startsWith( Bot.prefix ) && inChannel ) {
            console.log( 'Chat Message Received: ' );
            console.log( message.content );

            Bot.msg = message;
            Bot.args = Bot.msg.cleanContent.slice( Bot.prefix.length ).trim().split( / +/g );

            Bot.parseCommand();
        }
    }
    
  
    // Command Format:
    // Default: <operator> <group> <context> <...params>
    // Config : <group> <operator> <context> <...params>
    parseCommand() {
        
        switch( this.args[0] ) {
            
            case 'config' :
                this.command = {
                    group : this.args[0],
                    operator : this.args[1],
                    context : this.args[2],
                    params : this.args.slice(3)
                }
                break;
                
            default :
                this.command = {
                    group : this.args[1],
                    operator : this.args[0],
                    context : this.args[2].trimRight( 's' ),
                    params : this.args.slice(3)
                }
                break;
        }
        
        console.log( this.command, Commands );
    }
    
    
    validateCommand() {
        var commandGroup = Commands[this.command.group];
        console.log( commandGroup );
    }
    
    reply( content ) {
        this.msg.reply( content );
    }
    
}

module.exports = {Bot: Bot};