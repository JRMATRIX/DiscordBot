/*============================================================================*
 * lowdb NPM package
 *
 * Used for local persistent data storage
 *
 * @minVersion  1.0.0
 *============================================================================*/
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')



const defaults = {
    mixer : {
        channels : [],
        teams : []
    },
    
    twitch : {
        channels : [],
        teams : []
    },
    
    youtube : {
        channels : []
    },
    
    config : {
        defaultAnnouncementChannel : null,
        mixerAnnouncementChannel : null,
        twitchAnnouncementChannel : null,
        youtubeAnnouncementChannel : null
    }
}



const Adapter = new FileSync( '.data/db.json', defaults );
const DB = low( Adapter );



class Database {
    
    constructor() { 
        this.setDefaultOptions();
    }
    
    
    
/*========================================================================*/
/* MIXER
/* Functions that control Mixer channel and team data
/*========================================================================*/
    
    mixerChannelExists( mixerChannel ) {
        return DB.get( 'mixer.channels' ).find({ id: mixerChannel.id }).value();
    }
    
    addMixerChannel( mixerChannel, announcementChannel ) {
        var exists = this.mixerChannelExists( mixerChannel );
        
        return new Promise( function( resolve, reject ) {
            if( ! exists ) {
                resolve( DB.get( 'mixer.channels' ).push({
                    id : mixerChannel.id,
                    name : mixerChannel.token,
                    announcementChannel : announcementChannel,
                    twitter : mixerChannel.user.social.twitter
                }).write() );
            } else { 
                reject({
                    error : true,
                    title : 'Mixer Channel Exists',
                    content : `The Mixer Channel for ${mixerChannel.token} has already been added` });
            }
        }).catch( err => { console.error( err ); return err; });
    }
    
    updateMixerChannel( mixerChannel, announcementChannel ) {
        var exists = this.mixerChannelExists( mixerChannel );
        
        return new Promise( function( resolve, reject ) {
            if( exists ) {
                var channel = DB.get( 'mixer.channels' ).find({ id: mixerChannel.id });

                channel.assign({
                    name : mixerChannel.token,
                    twitter : mixerChannel.user.social.twitter
                });

                if( announcementChannel !== undefined )
                    channel.assign({ announcementChannel : announcementChannel.id });

                resolve( channel.write() );
            } else { 
                reject({
                    error : true,
                    title : 'Mixer Channel Does Not Exist',
                    content : `The Mixer Channel for ${mixerChannel.token} doesn't exists in the Database` });
            }
        }).catch( err => { console.error( err ); return err; });
    }
    
    updateMixerEmbedMessage( mixerChannel, messageID ) {
        if( this.mixerChannelExists( mixerChannel ) ) {
            var channel = DB.get( 'mixer.channels' )
                .find({ id: mixerChannel.id })
                .assign({
                    announcementMessage : messageID 
                }).write();
        } else { return false; }
    }
    
    getMixerChannel( mixerChannel ) {
        return new Promise( function( resolve, reject ) {
            
            var ch = DB.get( 'mixer.channels' ).find({ id: mixerChannel.id }).value();
            
            if( ch === undefined ) {
                reject({
                    title : 'Unknown Error',
                    content : `Something went wrong retrieving Mixer Channel ${mixerChannel.token} from the Database` });
            } else { resolve( ch ); }
            
        }).catch(err => {
            error.log( err );
            return({
                error : true,
                title : err.title,
                content : err.content });
        });
    }
    
    getMixerChannelList() {
        return DB.get( 'mixer.channels' ).value();
    }
    
    deleteMixerChannel( mixerChannel ) {
        var exists = this.mixerChannelExists( mixerChannel );
        
        return new Promise( function( resolve, reject ) {
            if( exists ) {
                resolve( DB.get( 'mixer.channels' ).remove({ id: mixerChannel.id }).write() );
            } else {
                reject({
                    error : true,
                    title : 'Channel Does Not Exist',
                    content : `The Mixer Channel for ${mixerChannel.token} is not in the bot announcement list. It may have already been removed`
                });
            }
        }).catch( err => { console.error( err ); return( err ); });
    }
    
    
    
    mixerTeamExists( mixerTeam ) {
        return DB.get( 'mixer.teams' ).find({ id: mixerTeam.id }).value();
    }
    
    addMixerTeam( mixerTeam, announcementChannel ) {
        if( ! this.mixerTeamExists() ) {
            return DB.get( 'mixer.teams' ).push({
                id: mixerTeam.id,
                name : mixerTeam.token,
                announcementChannel : announcementChannel.id
            }).write();
        } else{ return false; }
    }
    
    updateMixerTeam( mixerTeam, announcementChannel ) {
        if( this.mixerTeamExists( mixerTeam ) ) {
            var team = DB.get( 'mixer.teams' ).find({ id: mixerTeam.id });
            
            team.assign({ name : mixerTeam.token });
            
            if( announcementChannel !== undefined )
                team.assign({ announcementChannel : announcementChannel.id });
            
            return team.write();
        } else { return false; }
    }
    
    getMixerTeam( mixerTeam ) {
        return DB.get( 'mixer.teams' ).find({ id: mixerTeam.id }).value();
    }
    
    getMixerTeamList() {
        return DB.get( 'mixer.teams' ).value();
    }
    
    deleteMixerTeam( mixerTeam ) {
        return DB.get( 'mixer.teams' ).remove({ id: mixerTeam.id }).write();
    }
    
    
    
    getMixerAnnouncementChannel() {
        var defaultAnnouncementChannel = this.getDefaultAnnouncementChannel();
        var mixerAnnouncementChannel = this.getOption( 'mixerAnnouncementChannel' );
        
        if( mixerAnnouncementChannel && mixerAnnouncementChannel !== undefined )
            return mixerAnnouncementChannel;
        
        if( defaultAnnouncementChannel && defaultAnnouncementChannel !== undefined )
            return defaultAnnouncementChannel;
        
        return false;
    }
    
    
    
/*========================================================================*/
/* TWITCH
/* Functions that control Twitch channel and team data
/*========================================================================*/
/* @TODO : Implement the Twitch API to store local data references
/*========================================================================*/
    
    twitchChannelExists( twitchChannel ) {}
    
    addTwitchChannel( twitchChannel, announcementChannel ) {}
    
    updateTwitchChannel( twitchChannel, announcementChannel ) {}
    
    getTwitchChannel( twitchChannel ) {
        return DB.get( 'twitch.channels' ).find({ id: twitchChannel.id }).value();
    }
    
    getTwitchChannelList() {
        return DB.get( 'twitch.channels' ).value();
    }
    
    deleteTwitchChannel( twitchChannel ) {
        return DB.get( 'twitch.channels' ).remove({ id: twitchChannel.id }).value();
    }
    
    
    
    twitchTeamExists( twitchTeam ) {}
    
    addTwitchTeam( twitchTeam, announcementChannel ) {}
    
    updateTwitchTeam( twitchTeam, announcementChannel ) {}
    
    getTwitchTeam( twitchTeam ) {
        return DB.get( 'twitch.teams' ).find({ id: twitchChannel.id }).value();
    }
    
    getTwitchTeamList() {
        return DB.get( 'twitch.teams' ).value();
    }
    
    deleteTwitchTeam( twitchTeam ) {
        return DB.get( 'twitch.teams' ).remove({ id: twitchTeam.id }).value();
    }
    
    
    
/*========================================================================*/
/* YOUTUBE
/* Functions that control YouTube channel data
/*========================================================================*/
/* @TODO : Implement the YouTube API to store local data references
/*========================================================================*/
    
    youtubeChannelExists( youtubeChannel ) {}
    
    addYoutubeChannel( youtubeChannel, announcementChannel ) {}
    
    updateYoutubeChannel( youtubeChannel, announcementChannel ) {}
    
    deleteYoutubeChannel( youtubeChannel ) {}
    
    
    
/*========================================================================*/
/* CONFIG
/* Functions that control Bot Configuration data
/*========================================================================*/
    
    setDefaultOptions() {
        var defaultOptions = Object.entries( defaults.config );
        
//        console.log( defaultOptions );
        
        defaultOptions.forEach( function( value, key ) {
            var set = DB.has( `config.${key}` ).value();
            
            console.log( key, value );
            
            if( set === false || set === undefined ) {
                console.log( `config.${key} is not set. Settings default value` );
                DB.set( `config.${key}`, value ).write(); 
            } 
        });
    }
    
    hasOption( option ) {
        return new Promise( function( resolve, reject ) {
            
            var value = DB.has( `config.${option}` ).value();
            
            if( value && value !== undefined ) {
                resolve( true );
            } else {
                reject({
                    error : true,
                    title : 'No Config Option Available',
                    content : `The option ${option} does not exist, please check that you spelled the option name correctly` });
            }
            
        }).catch( err => { error.log( err ); return( err ); });
    }
    
    getOption( option ) {
        return new Promise( function( resolve, reject ) {
            var value = DB.get( `config.${option}` ).value(); 
            
            if( value && value !== undefined ) {
                resolve( value ); 
            } else {
                reject({
                    error : true,
                    title : 'Undefined Value',
                    content : `There was no assigned for ${option} in the Database` });
            }
            
        }).catch( err => { error.log( err ); return err; });
    }
    
    setOption( option, value ) {
        return new Promise( function( resolve, reject ) {
            var update = DB.set( `config.${option}`, value ).write(); 
            
            this.getOption( option ).then( res => {
                if( res == value ) {
                    resolve( true );
                } else {
                    reject({
                        error : true,
                        title : 'Error Updating Config',
                        content : `Something went wrong while updating ${option} to ${value} in the Database` });
                }
            });
        }).catch( err => { error.log( err ); return err; });
    }
    
    getOptionsList() {
        var options = DB.get( 'config' ).value();
//        return Array.from( Object.keys( options ), k => options[ k ] );
        return Object.entries( options );
    }
    
    
    
    getDefaultAnnouncementChannel() {
        return this.getOption( 'defaultAnnouncementChannel' );
    }
    
    
}

module.exports = Database;