/*============================================================================*
 * Mixer NPM package
 *
 * Used for connecting and interacting with the Mixer API
 *
 * @minVersion  3.2.0
 *============================================================================*/
const MixerAPI = require('@mixer/client-node');
const Client = new MixerAPI.Client( new MixerAPI.DefaultRequestRunner() );
Client.use(new MixerAPI.OAuthProvider( Client, {
    clientId: process.env.MIXER_TOKEN
}));

/*============================================================================*
 * Carina NPM package
 *
 * Used for connecting and interacting with the Mixer Constellation API
 *
 * @minVersion  0.12.0
/*============================================================================*/
const Carina = require('carina').Carina;
const Socket = require('ws');
Carina.WebSocket = Socket;




class Mixer {
    
    constructor() {
        this.Carina = new Carina({
            queryString: {
                'Client-ID': process.env.MIXER_TOKEN,
            },
            isBot: true
        }).open();
    }
    
    getChannel( channelName ) {
        return new Promise( function( resolve, reject) {
            Client.request('GET', `channels/${channelName}`).then( res => {
                
                if( res.body.statusCode == 404 ) reject({
                    error: 'Mixer Channel Does Not Exist',
                    message: `Unable to find Mixer Channel for ${channelName}` });
                
                resolve( res.body );
                
            }).catch( console.error );
        });
    }
    
    
    watchChannel( channel ) {
        return new Promise( function(resolve, reject ) {
            this.Carina.subscribe( `channel:${channel.id}:update`, data => {
                resolve( data );
            }).catch( console.error ); 
        });
    }
    
    unwatchChannel( channelID ) {
        this.Carina.unsubscribe( `channel:${channelID}:update` );
    }
    
}

module.exports = Mixer;