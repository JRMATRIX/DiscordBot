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
                        
                        if( mixerChannel.online == true ) {
                            var data = buildMixerLiveData( mixerChannel.token );
                            var messageID = Bot.mixerEmbed( data );
                            DB.updateMixerEmbedMessage( mixerChannel, messageID );
                        }
                        
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
            
            remove : function( params ) {
                var args = {
                    channelName : params[0] }
                
                if( args.channelName === undefined )
                    return Bot.error({ 
                        title : 'Missing Parameter: Streamer Name',
                        content : 'Please identify the name of the Mixer streamer you would like to add' });
                
                Mixer.getChannel( args.channelName ).then( mixerChannel => {
                    
                    DB.deleteMixerChannel( mixerChannel ).then( res => {
                        return Bot.success({
                                title : 'Mixer Channel Removed',
                                content : `Removed ${mixerChannel.token} from the Watch List. They will no longer be announced` });
                    }).catch( err => {
                        return Bot.error({ 
                            title : err.error,
                            content : err.message }); 
                    });
                    
                }).catch( err => {
                    return Bot.error({
                        title : err.error,
                        content : err.message });
                });
            },
            
            update : function( params ) {
                var args = {
                    channelName : params[0],
                    announcementChannel : params[1].substring(1) }
                
                if( args.channelName === undefined )
                    return Bot.error({ 
                        title : 'Missing Parameter: Streamer Name',
                        content : 'Please identify the name of the Mixer streamer you would like to update' });
                
                Mixer.getChannel( args.channelName ).then( mixerChannel => {
                    
                    DB.updateMixerChannel( mixerChannel, args.announcementChannel ).then( res => {

                        return Bot.success({
                                title : 'Mixer Channel Added',
                                content : `Updated ${mixerChannel.token}. They will be announced in #${args.announcementChannel}` });
                        
                    }).catch( err => {
                        return Bot.error({
                            title : 'Unknown Error',
                            content : `There was an error while updating the channel ${mixerChannel.token} in the Database` });
                    });
                    
                }).catch( err => {
                    return Bot.error({ 
                        title : err.error,
                        content : err.message });
                });
            },
            
            list : function() {
                var channels = DB.getMixerChannelList();
                
                Bot.listMixerEmbed( channels );
//                console.log( channels );
            }
            
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
    var mixerChannels = DB.getMixerChannelList();
    for( var channel of mixerChannels ) { 
        watchMixerChannel( channel );
        
        // Testing for now, this should be randomised!
//        Mixer.hostChannel( channel );
    }
});



Bot.Client.on( 'message', message => {
    if( Bot.parseMessage( message ) ) {
        var cmd = Bot.command;
        Commands[cmd.group][cmd.context][cmd.operator]( cmd.params );
    }
});


function watchMixerChannel( mixerChannel ) {
    Mixer.Carina.subscribe( `channel:${mixerChannel.id}:update`, data => {
        
//        console.log( data );
        
        buildMixerLiveData( mixerChannel.id ).then( channel => {   
            
//            console.log( channel );
            
            if( channel.online == true ) {
                if( data.updatedAt !== undefined ) { // Channel went live, create new embed
                    Bot.mixerEmbed( channel ).then( message => {
                        console.log( 'Creating Mixer Embed:', message.id );
                        DB.updateMixerEmbedMessage( mixerChannel, message.id );
                    }).catch( console.error );
                } else if( data.updatedAt === undefined ) { // Channel is already live, update embed
                   if( channel.announcementMessage === undefined ) {
                        Bot.mixerEmbed( channel ).then( message => {
                            console.log( 'Updating Mixer Embed:', message.id );
                            DB.updateMixerEmbedMessage( mixerChannel, message.id );
                        }).catch( console.error );
                    } else {
                        console.log( 'Ending Mixer Embed:' );
                        Bot.updateMixerEmbed( channel );   
                    } 
                }
            } else if( channel.announcementMessage !== undefined ) { // Channel is offline, update offline embed
                Bot.endMixerEmbed( channel );
            }
            
            
        }).catch( console.error );
    
    }).catch( console.error );
}

function buildMixerLiveData( channelName ) {
    return new Promise( function( resolve, reject ) {
        Mixer.getChannel( channelName ).then( channel => {
            var user = DB.getMixerChannel( channel );
            
            resolve({
                username : channel.token,
                game : channel.type ? channel.type.name : 'Unknown',
                title : channel.name,
                avatar : channel.user.avatarUrl,
                followers : channel.numFollowers,
                viewers : channel.online ? channel.viewersCurrent : channel.viewersTotal,
                thumbnail : channel.thumbnail ? channel.thumbnail.url : channel.bannerUrl,
                announcementChannel : user.announcementChannel,
                announcementMessage : user.announcementMessage,
                online : channel.online
            });
        }).catch( console.error );
    }).catch( console.error );
}



Bot.init(process.env.BOT_TOKEN);