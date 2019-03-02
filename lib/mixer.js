/*============================================================================*
 * Mixer NPM package
 *
 * Used for connecting and interacting with the Mixer API
 *
 * @minVersion  3.2.0
 *============================================================================*/
const MixerAPI = require('@mixer/client-node');
const { ShortCodeExpireError, OAuthClient } = require('@mixer/shortcode-oauth');
const Client = new MixerAPI.Client( new MixerAPI.DefaultRequestRunner() );
Client.use(new MixerAPI.OAuthProvider( Client, {
    clientId: process.env.MIXER_TOKEN,
    tokens : {
        access: process.env.MIXER_CHAT_TOKEN,
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    }
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
        
        this.chatConnect();
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
        this.Carina.subscribe( `channel:${channel.id}:update`, data => {
            return( data );
        }).catch( console.error ); 
    }
    
    unwatchChannel( channelID ) {
        this.Carina.unsubscribe( `channel:${channelID}:update` );
    }
    
    
    chatAuth() {
        
    }
    
    chatConnect() {
        Client.request( 'GET', 'users/current' ).then( response =>  {
//            console.log( response.body );
            this.userInfo = response.body;

            return new MixerAPI.ChatService( Client ).join( response.body.channel.id );
        }).then( response => {
            this.body = response.body;
//            console.log( this.body );
            
            return this.createChatSocket();
        }).catch( console.error );
    }
    
    createChatSocket() {
        this.chatSocket = new MixerAPI.Socket( Socket, this.body.endpoints ).boot();
        
        this.chatSocket.auth( this.userInfo.channel.id, this.userInfo.id, this.body.authkey ).then( () => {
            
            console.log( 'Chat client connected!' );
            
            this.chatSocket.call( 'clearMessages' );
            this.chatSocket.call( 'msg', ['Hello, World!'] );
            
        }).catch( console.error );
    }
    
}

module.exports = Mixer;