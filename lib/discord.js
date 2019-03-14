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

    

/*========================================================================*/
/* SETUP
/* Functions that control bot setup and initialization
/*========================================================================*/
    
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
    
    
    
/*========================================================================*/
/* COMMAND PARSING
/* Functions that control message parsing and command validation.
/*========================================================================*/
/*  Command Format:
/*
/*  Default:    <operator> <group> <context> <...params>
/*      e.g:    add mixer channel <channnelName> <announcementChannel>
/*
/*  Config :    <group> <operator> <context> <...params>
/*      e.g:    config set defaultAnnouncementChannel <announcementChannel>
/*========================================================================*/
    
    parseMessage( message ) {
        // For testing only, this shouldn't be hard-coded!!
        var inChannel = (message.channel.name === 'bot-configuration' );

        // Don't read commands from the bot account, look for '!' to read for commands
        if ( ! message.author.bot && message.content.startsWith( this.prefix ) && inChannel ) {
            this.msg = message;
            this.args = this.msg.cleanContent.slice( this.prefix.length ).trim().split( / +/g );

            this.parseCommand();
            
            return this.validateCommand();
        }
    }
    
    parseCommand() {
        
        switch( this.args[0] ) {
            
            case 'config' :
                this.command = {
                    group : this.args[0],
                    operator : this.args[1],
                    params : this.args.slice(2)
                }
                break;
                
            default :
                this.command = {
                    group : this.args[1],
                    context : this.args[2].trimRight( 's' ),
                    operator : this.args[0],
                    params : this.args.slice(3)
                }
                break;
        }
        
//        console.log( this.command );
    }
    
    validateCommand() {
        var commandGroup = Commands[this.command.group];
        
        if( commandGroup === undefined ){
            this.error({
                title : 'Incorrect Command Parameter',
                content : `Unknown command group <${this.command.group}>`,
            });
            return false;
        }
        
        if( ! commandGroup.Operators.includes( this.command.operator ) ) {
            this.error({ 
                title : 'Incorrect Command Parameter',
                content : `Incorrect operator <${this.command.operator}> for command group <${this.commandgroup}>`
            }); 
            return false;   
        }
        
        return true;
    }
    


/*========================================================================*/
/* MESSAGES
/* Functions that control bot message output, errors and success statements
/*========================================================================*/
    
    reply( content ) {
        this.msg.reply( content );
    }
    
    error( args = { content : '', title : 'Error' } ) {
        var embed = new Discord.RichEmbed()
            .setTitle( args.title )
            .setDescription( args.content )
            .setColor( '0xFF0000' );
  
        this.msg.react( '❌' );
        this.msg.channel.send( embed );
    }
    
    success( args = { content : '', title : 'Success' } ) {
        var embed = new Discord.RichEmbed()
            .setTitle( args.title )
            .setDescription( args.content )
            .setColor( '0x00FF00' );

        this.msg.react( '✅' );
        this.msg.channel.send( embed );
    }
    
    getMessage( channel, messageID ) {
        return new Promise( function( resolve, reject ) {
            channel.fetchMessage( messageID ).then( message => {
                resolve( message );
            }).catch( console.error );
        }).catch( console.log );
    }
    
    updateMessage( message, content ) {
        message.edit( content ).then( message => {
            return message;
        }).catch( console.error );
    }
    
    getChannel( channelName ) {
        console.log( channelName );
        return this.Client.channels.find( ch => ch.name == channelName );
    }
    
    

/*========================================================================*/
/* EMBEDS
/* Functions that control creating and updating Discord Embeds
/*========================================================================*/
    
    
    // BOT EMBEDS
    
    liveEmbed( data ) {
        return new Discord.RichEmbed()
            .setAuthor( data.embedTitle, data.icon, data.url )
            .setTitle( data.url )
            .setURL( data.url )
            .addField( 'Now Playing', data.game )
            .addField( 'Stream Title', data.title )
            .addField( 'Followers', data.followers, true )
            .addField( 'Viewers', data.viewers, true )
            .setColor( data.color )
            .setImage( data.thumbnail )
            .setThumbnail( data.avatar )
            .setFooter( defaults.name, defaults.icons.trw );
    }
    
    offlineEmbed( data ) {
        return new Discord.RichEmbed()
            .setAuthor( data.embedTitle, data.icon, data.url )
            .setTitle( data.url )
            .setURL( data.url )
            .addField( 'Last Played', data.game )
            .addField( 'Followers', data.followers, true )
            .addField( 'Total Views', data.viewers, true )
            .setColor( '#4A4A4A' )
            .setImage( data.thumbnail )
            .setThumbnail( data.avatar )
            .setFooter( defaults.name, defaults.icons.trw );
    }
    
    videoEmbed( data ) {}
    
    listEmbed( data ) {
        var embed = new Discord.RichEmbed()
            .setAuthor( data.embedTitle, data.icon )
            .setColor( data.color )
            .setFooter( defaults.name, defaults.icons.trw );
        
        data.channels.forEach( function( channel ) {
            var fieldContent = `- Channel ID: ${channel.id}` + "\n"
                + `- Channel URL: https://mixer.com/${channel.name}` + "\n"
                + `- Twitter Handle: ${channel.twitter ? channel.twitter.replace( /https\:\/\/twitter\.com\/|https\:\/\/www\.twitter\.com\//gi, '@' ) : 'undefined'}` + "\n"
                + `- Twitter URL: ${channel.twitter ? channel.twitter : 'undefined'}` + "\n"
                + `- Announcement Channel: ${channel.announcementChannel}`;
            
            embed.addField( channel.name, fieldContent ); 
        });
        
        return embed;
    }
    
    configEmbed( data ) {
        var embed = new Discord.RichEmbed()
            .setAuthor( data.embedTitle, defaults.icons.trw )
            .setColor( data.color )
            .setFooter( defaults.name, defaults.icons.trw );
        
        data.config.forEach( function( value, key ) {
            embed.addField( value[0], value[1] );
        });
        
        return embed;
    }
    
    deleteEmbed( message, channel ) {
        channel.fetchMessage( message ).then( embedMessage => {
            embedMessage.delete();
        }).catch( console.error );
    }
    
    
    
    // MIXER EMBEDS
    
    mixerEmbedData( data ) {
        data.url = `https://mixer.com/${data.username}`;
        data.icon = defaults.icons.mixer;
        data.color = defaults.colors.mixer;
        
        return data;
    }
    
    mixerEmbed( data ) {
        data = this.mixerEmbedData( data );
        data.embedTitle = `${data.username} is Live on Mixer`;
        
        var embed = this.liveEmbed( data ),
            channel = this.getChannel( data.announcementChannel );
        
        if( data.announcementMessage && typeof data.announcementMessage == 'string' ) this.deletePreviousEmbed( data.announcementMessage, channel );
        
        return new Promise( function( resolve, reject ) {
            var embedMessage = false;
            
            if( channel ) {
                channel.send( embed ).then( message => { 
                    embedMessage = message; 
                    resolve( embedMessage );
                }).catch( console.error );   
            } else {
                reject({
                    title : 'Announcement Channel is undefined',
                    content : `There is no announcement channel set for ${data.username}`
                });
            }
        }).catch( err => {
            console.error( err );
            
            return ({
                error : true,
                title : err.title,
                content : err.content
            });
        });
    }
    
    updateMixerEmbed( data ) {
        data = this.mixerEmbedData( data );
        data.embedTitle = `${data.username} is Live on Mixer`;
        
        var embed = this.liveEmbed( data ),
            channel = this.getChannel( data.announcementChannel );
         
        this.getMessage( channel, data.announcementMessage ).then( message => {
            message.edit( embed ).then( message => { return message; }).catch( console.error );
        }).catch( console.error );
    }
    
    endMixerEmbed( data ) {
        data = this.mixerEmbedData( data );
        data.embedTitle = `${data.username} is Offline`;
        
        var embed = this.offlineEmbed( data ),
            channel = this.getChannel( data.announcementChannel );
        
        this.getMessage( channel, data.announcementMessage ).then( message => {
            message.edit( embed ).then( message => { return message; }).catch( console.error );
        }).catch( console.error );
    }
    
    listMixerEmbed( channels ) {
        var data = this.mixerEmbedData( {} );
        data.embedTitle = `Current Mixer Channels`;
        data.channels = channels;
        
        var embed = this.listEmbed( data );
        
        this.msg.channel.send( embed ).then ( message => { return message; }).catch( console.error );
    }
    
    
    
    // TWITCH EMBEDS
    
    twitchEmbedData( data ) {
        data.url = `https://twitch.tv/${data.username}`;
        data.icon = defaults.icon.twitch;
        data.color = defaults.colors.twitch;
        
        return data;
    }
    
    twitchEmbed( data ) {
        data = this.twitchEmbedData( data );
        data.embedTitle = `${data.username} is Live on Twitch`;
        
        var embed = this.liveEmbed( data ),
            channel = this.getChannel( data.announcementChannel );
        
        channel.send( embed ).then( message => { return message; }).catch( console.error );
    }
    
    updateTwitchEmbed( data ) {
        data = this.twitchEmbedData( data );
        data.embedTitle = `${data.username} is Live on Twitch`;
        
        var embed = this.liveEmbed( data ),
            message = this.getMessage( data.announcementChannel, data.announcementMessage );
        
        message.edit( embed ).then( message => { return message; }).catch( console.error );
    }
    
    endTwitchEmbed( data ) {
        data = this.twitchEmbedData( data );
        data.embedTitle = `${data.username} is Offline`;
        
        var embed = this.liveEmbed( data ),
            message = this.getMessage( data.announcementChannel, data.announcementMessage );
        
        message.edit( embed ).then( message => { return message; }).catch( console.error );
    }
    
    listTwitchEmbed( channels ) {
        var data = this.twitchEmbedData( {} );
        data.embedTitle = `Current Twitch Channels`;
        data.channels = channels;
        
        var embed = this.listEmbed( data );
        
        this.msg.channel.send( embed ).then ( message => { return message; }).catch( console.error );
    }
    
    
    
    // YOUTUBE EMBEDS
    
    
    
    // CONFIG EMBEDS
    
    listConfigEmbed( config ) {
        var data = {
            embedTitle : 'Bot Configuration',
            color : '#DCDCDC',
            config : config
        };
        
        var embed = this.configEmbed( data );
        
        this.msg.channel.send( embed ).then( message => { return message; }).catch( console.error );
    }
    
    
    
}



module.exports = {Bot: Bot};