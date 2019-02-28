/*============================================================================*/
/* TRWBot
/*============================================================================*/
/* Custom Discord bot used for shouting out Mixer Streams within The Real World 
/* community Discord Server.
/*============================================================================*/
/* @version     0.1.0
/* @since       0.0.1
/*============================================================================*/
/* @package     TRWBot
/* @author      JRMATRIX <jrm47r1x@gmail.com>
/* @copyright   2019 JRMATRIX
/*============================================================================*/



/*============================================================================*/
/* ENVIRONMENT SETUP
/*============================================================================*/

// Override defaultMaxListeners (We're gonna need more than 10!)
// Setting this to 0 allows us as many listeners as the server can cope with
require( 'events' ).EventEmitter.defaultMaxListeners = 0;

// Simple Keep-Alive Server
require( './server' );

// Custom Utility Functions
require( './utilities' );



/*============================================================================*/
/* PACKAGES
/*============================================================================*/

const Application = require( './packages' );

/*============================================================================*
 * Discord Bot
 *
 * Used for connecting and interacting with Discord channels
 *
 * @minVersion  11.4.2
 *============================================================================*/
const Bot = Application.Bot;

const DB = Application.Database;

const Mixer = Application.Mixer;


const Commands = {
    
    mixer : {
        
        channel : {
            
            add : function( params ) {
                var args = {
                    channelName : params[0],
                    announcementChannel : params[1].substring(1) }
                
                if( args.channelName === undefined )
                    return Bot.error({ 
                        title : 'Missing Parameter: Streamer Name',
                        content : 'Please identify the name of the Mixer streamer you would like to add' });
                
                Mixer.getChannel( args.channelName ).then( mixerChannel => {
                    
                    DB.addMixerChannel( mixerChannel, args.announcementChannel ).then( res => {
                        
                        watchMixerChannel( mixerChannel );
                        
                        return Bot.success({
                                title : 'Mixer Channel Added',
                                content : `Added ${mixerChannel.token} to the Watch List. They will be announced in #${args.announcementChannel}` });
                        
                    }).catch( err => {
                        return Bot.error({
                            title : 'Unknown Error',
                            content : `There was an error while adding the channel ${mixerChannel.token} to the Database` });
                    });
                    
//                    console.log( mixerChannel );
                }).catch( err => {
                    return Bot.error({ 
                        title : err.error,
                        content : err.message });
                });
            },
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        },
        
        team : {
            
            add : function() {},
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        }
        
    },
    
    twitch : {
        
        channel : {
            
            add : function() {},
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        },
        
        team : {
            
            add : function() {},
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        }
        
    },
    
    youtube : {
        
        channel : {
            
            add : function() {},
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        }
        
    },
    
    config : {
        
        set : function() {},
        
        get : function() {},
        
        list : function() {}
        
    }
    
}



Bot.Client.on( 'ready', () => {
   
    var channels = DB.getMixerChannelList();
    
//    channels.forEach( );
    
    for( var channel of channels ) {
        console.log( channel );
    }
    
});



Bot.Client.on( 'message', message => {
    if( Bot.parseMessage( message ) ) {
        var cmd = Bot.command;
//        console.log( cmd );
        Commands[cmd.group][cmd.context][cmd.operator]( cmd.params );
    }
});


function watchMixerChannel( mixerChannel ) {
    Mixer.Carina.subscribe( `channel:${mixerChannel.id}:update`, data => {
        
        if( data.online !== undefined ) {
            
            if( data.online == true ) {
                
            } else {
                
            }
            
        }
    
    }).catch( console.error );
}



Bot.init(process.env.BOT_TOKEN);