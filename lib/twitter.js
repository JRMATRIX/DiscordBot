/*============================================================================*
 * Twitter NPM packages
 *
 * Used for connecting and interacting with the Twitter APIs
 *============================================================================*/
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const twitterWebhooks = require( 'twitter-webhooks' );
const https = require( 'https' );

const TwitterAPI = require( 'twitter' );
const TwitterClient = new TwitterAPI({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});


class Twitter {
    
    constructor() {}
     
    sendTweet( content ) {
        TwitterClient.post( 'statuses/update', { status: content }, ( error, tweet, response ) => {
            if( error ) { console.error( error ); return false; }
        }
    }
    
}



module.exports = Twitter;