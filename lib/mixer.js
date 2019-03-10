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

const ShortcodeClient = new OAuthClient({
    clientId: process.env.MIXER_TOKEN,
    scopes: ['channel:follow:self', 
             'channel:update:self',
             'chat:bypass_catbot',
             'chat:bypass_links',
             'chat:bypass_slowchat',
             'chat:change_ban',
             'chat:change_role',
             'chat:chat',
             'chat:clear_messages',
             'chat:connect',
             'chat:edit_options',
             'chat:purge',
             'chat:remove_message',
             'chat:timeout'
    ]
});

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



const attempt = () => ShortcodeClient.getCode().then( code => {
    console.log( `Go to mixer.com/go and enter ${code.code}` );
    return code.waitForAccept();
}).catch( err => {
    if( err instanceof ShortCodeExpireError ) {
        return attempt();
    } 

    throw err;
});




class Mixer {
    
    constructor() {
        this.Carina = new Carina({
            queryString: {
                'Client-ID': process.env.MIXER_TOKEN,
            },
            isBot: true
        }).open();       
    }
    
    attemptConnection( tokens = false ) {
        var _class = this;
        
        return new Promise( function( resolve, reject ) {
        
            if( ! tokens ) {
                attempt().then( tokens => {
//                    console.log( `token data`, tokens.data );

                    _class.setupClient( tokens );   
                    resolve( tokens );
                }); 
            } else {
                _class.setupClient( tokens );
                resolve( tokens );
            }
            
        }).catch( err => {
            console.error( err );
            return err;
        });
    }
    
    setupClient( tokens ) {
        Client.use( new MixerAPI.OAuthProvider( Client, {
            clientId: process.env.MIXER_TOKEN,
            tokens : {
                access: tokens.data.accessToken,
                refresh: tokens.data.refreshToken,
                expires: tokens.data.expiresAt
            }
        }));
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
            console.log( this.body );
            
            return this.createChatSocket();
        }).catch( console.error );
    }
    
    createChatSocket() {
        this.channel = new MixerAPI.Socket( Socket, this.body.endpoints ).boot();
        
        this.channel.auth( this.userInfo.channel.id, this.userInfo.id, this.body.authkey ).then( () => {
            
            console.log( 'Chat client connected!' );
            
            this.channel.call( 'clearMessages' );
            this.channel.call( 'msg', ['Hello, World!'] );
            this.channel.call( 'msg', ['/me Test Message: #TheRealWorld Streamer @JRMATRIX just went live at https://mixer.com/JRMATRIX! '] );
            
            if( this.channelToHost !== undefined ) {
                this.hostChannel( this.channelToHost ); }
            
        }).catch( console.error );
    }
    
    setHostChannel( channel ) {
        this.channelToHost = channel;
    }
    
    hostChannel( channel ) {
//        this.channel.call( 'msg', [`/host @${channel.name}` ] ).then( res => {
//            
//            console.log( res );
//            
//            this.host = new MixerAPI.Socket( Socket, this.body.endpoints ).boot();
//            this.host.auth( channel.id, this.userInfo.id, this.body.authkey ).then( () => {
//                this.host.call( 'msg', [ `/me You're now being hosted by #TheRealWorld!` ] );
//            }).catch( console.error );
//        }).catch( console.error );
        
        console.log( this.channel );
        
//        Client.request( 'PUT', `channels/${channel.id}/hostee` ).then( response => {
//            console.log( response.body );
//        }).catch( err => {
//            console.log( 'Unable to host target channel:' );
//            console.error( err ); });
    }
    
}

module.exports = Mixer;