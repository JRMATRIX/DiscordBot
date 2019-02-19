// Setup Discord NPM package
const Discord = require('discord.js');
const bot = new Discord.Client();

// Setup Mixer NPM package
const Mixer = require('@mixer/client-node');
const mixerClient = new Mixer.Client( new Mixer.DefaultRequestRunner() );
mixerClient.use(new Mixer.OAuthProvider(mixerClient, {
    clientId: 'd726efa15d16a2c68f7c29e42e88b1f885aa48b0e8cc1c9f',
}));

// Setup FlatFile NPM package
const DB = require('flatfile');

// DB.db('database/mixer.json', ( err, data ) => {
//   if( err ) throw err;
  
//   data.save( err => {
//     if( err ) throw err; 
//   });
// })

/**
 * Discord Command INtegration
bot.on('message', msg => {  
  // Don't read commands from the bot account, look for '!' to read for commands
  if (msg.author.username != 'TRW Bot' && msg.content.substring(0, 1) == '!' && msg.channel.name === 'bot-configuration' ) {
    
    // msg.channel.send( '*Message received in #' + msg.channel.name + '*' );
    
    var args = msg.content.substring(1).split(' ');
    var call = args[0];
    
    if( call == 'trw' ) parse( msg, args );
    
  }
})

function parse( msg, args ) {
  // msg.channel.send( '*Command received*' );
  
  switch( args[1] ) {
  
    case 'mixer' :
      addMixerChannel( msg, args[2], args[3] );
      break;
      
    case 'twitch' :
      
      break;
      
    case 'youtube' :
      
      break;
      
  }
}

function addMixerChannel( msg, username, channel ) {
  msg.channel.send( '*Adding mixer stream ' + username + ' to #' + channel + '*' );
  
  mixerClient.request('GET', `channels/${username}`).then(res => {
      const viewers = res.body.viewersTotal;
      console.log(res.body);
  });
}

bot.login(process.env.BOT_TOKEN);