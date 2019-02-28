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




Bot.Client.on( 'message', message => {
    if( Bot.parseMessage( message ) ) {
        var cmd = Bot.command;
//        console.log( cmd );
        Commands[cmd.group][cmd.context][cmd.operator]( cmd.params );
    }
});


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
                    
                    // Return error message if channel doesn't exist
//                    if( mixerChannel.statusCode == 404 )
//                            return Bot.error({
//                                title : 'Mixer Channel Does Not Exist',
//                                content : `Unable to find Mixer Channel for ${args.channelName}` });
                    
                    if( DB.mixerChannelExists( mixerChannel ) )

                        return Bot.error({
                            title : 'Mixer Channel Exists',
                            content : `The Mixer Channel for ${mixerChannel.token} has already been added` });
                    
                    
                    
                    console.log( mixerChannel );
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



Bot.init(process.env.BOT_TOKEN);