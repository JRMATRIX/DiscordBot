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
        console.log( channelName );
        
        return new Promise( function( resolve, reject) {
            Client.request('GET', `channels/${channelName}`).then( res => {
                resolve( res.body );
            }).catch( reject );
        });
    }
    
    
    watchChannel( channelID ) {
        return new Promise( function(resolve, reject ) {
            this.Carina.subscribe( `channel:${channelID}:update`, data => {
                resolve( data );
            }).catch( reject ); 
        });
    }
    
}

module.exports = Mixer;