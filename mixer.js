/** 
 * Mixer NPM package
 *
 * Used for connecting and interacting with the Mixer API
 *
 * @minVersion  3.2.0
 */
const Mixer = require('@mixer/client-node');
const mixerClient = new Mixer.Client( new Mixer.DefaultRequestRunner() );
mixerClient.use(new Mixer.OAuthProvider(mixerClient, {
    clientId: process.env.MIXER_TOKEN
}));

/** 
 * Carina NPM package
 *
 * Used for connecting and interacting with the Mixer Constellation API
 *
 * @minVersion  0.12.0
 */

const Carina = require('carina').Carina;
const ws = require('ws');

Carina.WebSocket = ws;

const ca = new Carina({
    queryString: {
        'Client-ID': process.env.MIXER_TOKEN,
    },
    isBot: true,
    maxEventListeners: 50
}).open();

module.exports = {
    
}