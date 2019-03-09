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

const Require = require( './packages' );

/*============================================================================*
 * Discord Bot
 *
 * Used for connecting and interacting with Discord channels
 *============================================================================*/
const Bot = Require.Bot;

/*============================================================================*
 * Mixer Interface
 *
 * Uses the Mixer API and Constellations Interface for communicating with and 
 * listening to Mixer API endpoints and Channels
 *============================================================================*/
const Mixer = Require.Mixer;

/*============================================================================*
 * Application Database
 *
 * Used for persistent storage of application data through a lodash database
 *============================================================================*/
const DB = Require.Database;

/*============================================================================*
 * Application Errors
 *
 * Standard Error output for commands
 *============================================================================*/
const Errors = Require.Errors;



/*============================================================================*/
/* APPLICATION
/*============================================================================*/



/*============================================================================*
 * Application Commands
 *
 * An object containing command functions for the bot to run
 *
 * Command Formats : 
 *      trw <add|remove|update|list> mixer channel(s) <channelName> <announcementChannel>
 *      trw config <get|set|list> <optionName> <optionValue>
 *============================================================================*/
const Commands = {
    
    
    
    /*========================================================================*
     * Mixer Commands
     *
     * Commands for adding and modifying Mixer Channels and Teams.
     *
     * @todo : Implement Mixer Teams
     *========================================================================*/
    mixer : {
        
        
        
        /*====================================================================*
         * Mixer Channel Commands
         *
         * Commands for adding and modifying Mixer Channels.
         *====================================================================*/
        channel : {
            
            /*================================================================*
             * Add Mixer Channel
             *
             * Adds a new Mixer Channel into the announcement list.
             *
             * @param   (object)    params  Command parameters
             *
             * Expects :
             *      channelName
             *      announcementChannel
             *      @TODO: discordUser (optional) 
             *================================================================*/
            add : function( params ) {
                var args = {
                    channelName : params[0],
                    announcementChannel : params[1],
                    discordUser : params[2] }
                
                if( args.channelName === undefined )
                    return Bot.error( Errors.mixer.channel.add.channelName );
                
                if( args.announcementChannel === undefined )
                    return Bot.error( Errors.mixer.channel.add.announcementChannel );
                
                args.announcementChannel = args.announcementChannel.replace( '#', '' );
                
                Mixer.getChannel( args.channelName ).then( mixerChannel => {
                    
                    DB.addMixerChannel( mixerChannel, args.announcementChannel ).then( res => {
                        
                        if( res.error ) return Bot.error( res );
                        
                        // @todo: Resolve with promise
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
                    
                }).catch( err => {
                    return Bot.error({ 
                        title : err.error,
                        content : err.message });
                });
            },
            
            /*================================================================*
             * Remove Mixer Channel
             *
             * Removes a Mixer Channel from the announcement list.
             *
             * @param   (object)    params  Command parameters
             *
             * Expects :
             *      channelName
             *================================================================*/
            remove : function( params ) {
                var args = {
                    channelName : params[0] }
                
                if( args.channelName === undefined )
                    return Bot.error( Errors.mixer.channel.remove.channelName );
                
                // Fetch the Mixer Channel data from the Mixer API
                Mixer.getChannel( args.channelName ).then( mixerChannel => {
                    
                    // Remove the channel from the Constellations watch list
                    unwatchMixerChannel( mixerChannel ).then( status => {
                        
                        if( status.error ) return Bot.error( status );
                        
                        // Remove the channel from the Database
                        DB.deleteMixerChannel( mixerChannel ).then( res => {
                            if( res.error ) return Bot.error( res );    
                            return Bot.success( status );
                        }).catch( err => {
                            // Database removal hasn't worked. Return Unknown Error
                            return Bot.error({ title : 'Unknown Error', content : err.message }); 
                        });
                        
                    }).catch( err => {
                        // Carina has returned an error. Return error message
                        console.error( err ); 
                        Bot.error( err );
                    });
                    
                }).catch( err => {
                    // Mixer couldn't find the channel. Output error message
                    return Bot.error({ title : err.error, content : err.message });
                });
            },
            
            /*================================================================*
             * Update Mixer Channel
             *
             * Updates a Mixer Channel in the announcement list.
             *
             * @param   (object)    params  Command parameters
             *
             * Expects :
             *      channelName
             *      announcementChannel
             *      @TODO: discordUser (optional)
             *================================================================*/
            update : function( params ) {
                var args = {
                    channelName : params[0],
                    announcementChannel : params[1] }
                
                if( args.channelName === undefined )
                    return Bot.error( Errors.mixer.channel.update.channelName );
                
                // Get the Mixer channel data from the API
                Mixer.getChannel( args.channelName ).then( mixerChannel => {
                    
                    // Check if a new announcementChannel has been set
                    if( args.announcementChannel === undefined ) {
                        
                        // If the database channel already has an announcementChannel set, continue to use that
                        DB.getMixerChannel( mixerChannel.id ).then( ch => {
                            
                            // If there's no announcement channel set, use the default channel
                            if( ch.announcementChannel && ch.announcementChannel !== undefined ) {
                                args.announcementChannel = ch.announcementChannel;
                            } //else { args.announcementChannel = DB.getMixerAnnouncementChannel(); }
                            
                            if( args.announcementChannel === undefined )
                                return Bot.error( Errors.mixer.channel.update.announcementChannel );
                            
                            // Update the database with the new announcementChannel
                            DB.updateMixerChannel( mixerChannel, args.announcementChannel ).then( res => {
                        
                                return Bot.success({
                                    title : 'Mixer Channel Added',
                                    content : `Updated ${mixerChannel.token}. They will be announced in #${args.announcementChannel}` });

                            }).catch( err => { return Bot.error( err ); });

                        }).catch( err => {
                            
                            // Return error if the channel isn't already in the database
                            return Bot.error({
                                title : 'Unable to find Mixer Channel',
                                content : `The Mixer Channel for ${args.channelName} is not currently in the database. Please add the channel before updating` });
                            
                        });
                    }
                    
                }).catch( err => { 
                    return Bot.error({ 
                        title : 'Unknown Error', 
                        content : err.message }); 
                });
            },
            
            /*================================================================*
             * List Mixer Channels
             *
             * Lists all of the available Mixer Channels that are currently in 
             * the announcement list.
             *================================================================*/
            list : function() {
                var channels = DB.getMixerChannelList();
                Bot.listMixerEmbed( channels );
            }
            
        },
        
        
        
        /*====================================================================*
         * Mixer Team Commands
         *
         * Commands for adding and modifying Mixer Teams.
         *
         * @TODO : Check Mixer API for Teams
         *====================================================================*/
        team : {
            
            add : function() {},
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        }
        
    },
    
    
    
    /*========================================================================*
     * Twitch Commands
     *
     * Commands for adding and modifying Twitch Channels and Teams.
     *
     * @todo : Implement Twitch API
     *========================================================================*/
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
    
    
    
    /*========================================================================*
     * YouTube Commands
     *
     * Commands for adding and modifying YouTube Channels.
     *
     * @todo : Implement YouTube API
     *========================================================================*/
    youtube : {
        
        channel : {
            
            add : function() {},
            
            remove : function() {},
            
            update : function() {},
            
            list : function() {}
            
        }
        
    },
    
    
    
    /*========================================================================*
     * Config Commands
     *
     * Commands for adding and modifying Bot Configuration options.
     *========================================================================*/
    config : {
        
        /*================================================================*
         * Set Config Option
         *
         * Updates a config option value in the Database.
         *
         * @param   (object)    params  Command parameters
         *
         * Expects :
         *      optionName
         *      optionValue
         *================================================================*/
        set : function( params ) {
            var args = {
                optionName : params[0],
                optionValue : params[1] }
            
            if( args.optionName === undefined )
                return Bot.error( Errors.config.set.optionName );
            
            if( args.optionValue === undefined )
                return Bot.error( Errors.config.set.optionValue );
            
            // Check that the option is available to set in the Database
            DB.hasOption( args.optionName ).then( () => {
                
                // Update the requested option value
                DB.setOption( args.optionName, args.optionValue ).then( () => {
                    
                    Bot.success({
                        title : 'Config Option Updated',
                        content : `${args.optionName} successfully updated to ${args.optionValue}`
                    });
                    
                }).catch( err => { Bot.error( err ); })
            
            }).catch( err => { Bot.error( err ); });
        },
        
        /*================================================================*
         * Get Config Option
         *
         * Retrieves a config option value from the Database.
         *
         * @param   (object)    params  Command parameters
         *
         * Expects :
         *      optionName
         *================================================================*/
        get : function( params ) {
            var args = { 
                optionName : params[0] };
            
            if( args.optionName == undefined )
                return Bot.error( Errors.config.get.optionName );
            
            // Check that the option is available to set in the Database
            DB.hasOption( args.optionName ).then( () => {
                
                // Update the requested option value
                DB.getOption( args.optionName ).then( optionValue => {
                    
                    Bot.success({
                        title : 'Bot Configuration',
                        content : `**${args.optionName}**: ${args.optionValue}`
                    });
                    
                }).catch( err => { Bot.error( err ); })
            
            }).catch( err => { Bot.error( err ); });
        },
        
        /*================================================================*
         * List Config Options
         *
         * Outputs a list of currently set config options.
         *================================================================*/
        list : function() {
            var options = DB.getOptionsList();
            Bot.listConfigEmbed( options );
        }
        
    }
    
}



/*============================================================================*
 * Watch Mixer Channel
 *
 * Uses Carina to monitor a Mixer Channel's activity and run the relevant bot 
 * method.
 *
 * @todo : Integrate Twitter to post when the channel goes live
 *============================================================================*/
function watchMixerChannel( mixerChannel ) {
    return new Promise( function( resolve, reject ) {
        Mixer.Carina.subscribe( `channel:${mixerChannel.id}:update`, data => {
            
            console.log( data );
        
            buildMixerLiveData( mixerChannel.id ).then( channel => {   

                if( channel.online == true ) {
                    
                    // Channel went live, create new embed
                    if( data.updatedAt !== undefined ) {

                        Bot.mixerEmbed( channel ).then( message => {
                            console.log( 'Creating Mixer Embed:', message.id );
                            DB.updateMixerEmbedMessage( mixerChannel, message.id );
                            
                            resolve({
                                title : 'Mixer Embed Created',
                                content : 'Channel went live, created new Mixer embed' });
                            
                        }).catch( err => {
                            reject( err );
                            console.error( err ); 
                        });

                    } 
                    
                    // Channel is already live, update embed
                    else if( data.updatedAt === undefined ) { 
                        
                        // Merge current viewers into Mixer Channel API data
                        if( data.viewersCurrent ) channel.viewers = data.viewersCurrent;

                        // No current announcement message, create a new embed
                        if( channel.announcementMessage === undefined ) {

                            Bot.mixerEmbed( channel ).then( message => {
//                                console.log( 'Creating Mixer Embed:', message.id );
                                DB.updateMixerEmbedMessage( mixerChannel, message.id );
                                
                                resolve({
                                    title : 'Mixer Embed Created',
                                    content : 'Channel updated, created new Mixer embed' });
                                
                            }).catch( err => {
                                reject( err );
                                console.error( err ); 
                            });

                        // Announcement message already exists, update current embed
                        } else {
//                            console.log( 'Updating Mixer Embed:' );
                            Bot.updateMixerEmbed( channel );   
                            
                            resolve({
                                title : 'Mixer Embed Updated',
                                content : 'Channel updated, updated Mixer embed' });
                        } 
                    }
                
                // Channel is offline, update offline embed
                } else if( channel.announcementMessage !== undefined ) { 

                    console.log( 'Ending Mixer Embed:' );
                    Bot.endMixerEmbed( channel );
                    
                    resolve({
                        title : 'Mixer Embed Updated',
                        content : 'Channel went offline, updated Mixer embed' });
                    
                }

            }).catch( err =>  {
                reject( err );
                console.error( err ); 
            });

        }).catch( err =>  {
            reject( err );
            console.error( err ); 
        });
        
    }).catch( err => {
        error.log( err );
        
        reject({
            title : 'Unknown Error',
            content : `Something went wrong while adding ${mixerChannel.token} to the announcement list`
        });
    });
}



/*============================================================================*
 * Unwatch Mixer Channel
 *
 * Removes a Mixer Channel from the Carina watch list.
 *============================================================================*/
function unwatchMixerChannel( mixerChannel ) {
    return new Promise( function( resolve, reject ) {
        Mixer.Carina.unsubscribe( `channel:${mixerChannel.id}:update` ).then( () => {
            
            resolve({
                title : 'Mixer Channel Removed',
                content : `The Mixer Channel for ${mixerChannel.token} has been removed from the announcement list`
            });

        }); 
    }).catch( err => {
        error.log( err );
        
        return({
            error : true, 
            title : 'Unknown Error',
            content : `Something went wrong while removing ${mixerChannel.token} from the announcement list`
        });
    });
}



/*============================================================================*
 * Build Mixer Live Data
 *
 * Creates a data object used to pass to the Discord Embed.
 *============================================================================*/
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



/*============================================================================*
 * Bot Ready State
 *
 * Defines functions to run when the bot connects to Discord.
 *============================================================================*/
Bot.Client.on( 'ready', () => {
    var mixerChannels = DB.getMixerChannelList();
    for( var channel of mixerChannels ) { 
        watchMixerChannel( channel );
    }
});



/*============================================================================*
 * Bot Message Received
 *
 * Defines functions to run when the bot receives a Discord Message.
 *============================================================================*/
Bot.Client.on( 'message', message => {
    if( Bot.parseMessage( message ) ) {
        var cmd = Bot.command;
        Commands[cmd.group][cmd.context][cmd.operator]( cmd.params );
    }
});


/*============================================================================*
 * Initialise the Discord Bot
 *
 * @param   string  BOT_TOKEN   The Discord Bot's Application ID
 *============================================================================*/
Bot.init( process.env.BOT_TOKEN );