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
    
    config : {}
}





const Adapter = new FileSync('.data/db.json', { mixer:[], twitch:[], youtube:[], config:[] });
const DB = low( Adapter );


class Database {
    
    constructor() { }
    
    
    
/*========================================================================*/
/* MIXER
/* Functions that control Mixer channel and team data
/*========================================================================*/
    
    mixerChannelExists( mixerChannel ) {
        return DB.get( 'mixer.channels' ).find({ id: mixerChannel.id }).value();
    }
    
    addMixerChannel( mixerChannel, announcementChannel ) {
        if( ! this.mixerChannelExists() ) {
            return DB.get( 'mixer.channels' ).push({
                id : mixerChannel.id,
                name : mixerChannel.token,
                announcementChannel : announcementChannel.id,
                twitter : mixerChannel.user.social.twitter
            }).write();
        } else { return false; }
    }
    
    updateMixerChannel( mixerChannel, announcementChannel ) {
        if( this.mixerChannelExists( mixerChannel ) ) {
            var channel = DB.get( 'mixer.channels' ).find({ id: mixerChannel.id });
            
            channel.assign({
                name : mixerChannel.token,
                twitter : mixerChannel.user.social.twitter
            });
               
            if( announcementChannel !== undefined )
                channel.assign({ announcementChannel : announcementChannel.id });
            
            return channel.write();
        } else { return false; }
    }
    
    getMixerChannel( mixerChannel ) {
        return DB.get( 'mixer.channels' ).find({ id: mixerChannel.id }).value();
    }
    
    getMixerChannelList() {
        return DB.get( 'mixer.channels' ).value();
    }
    
    deleteMixerChannel( mixerChannel ) {
        DB.get( 'mixer.channels' ).remove({ id: mixerChannel.id }).write();
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
    
    hasOption( option ) {
        return DB.has( `config.${option}` ).value();
    }
    
    getOption( option ) {
        return DB.get( `config.${option}` ).value();
    }
    
    setOption( option, value ) {
        return DB.set( `config.${option}`, value ).write();
    }
    
    getOptionsList() {
        return DB.get( 'config' ).value();
    }
    
    
}

module.exports = Database;