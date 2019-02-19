const Discord = require('discord.js');
const Mixer = require('@mixer/client-node');

const bot = new Discord.Client();

bot.on('message', msg => {  
  // msg.channel.send( '*Message received in ' + msg.channel.name + '*' );
  
  // Don't read commands from the bot account, look for '!' to read for commands
  if (msg.author.username != 'TRW Bot' && msg.content.substring(0, 1) == '!' ) {
    
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
  msg.channel.send( '*Adding mixer stream ' + username + ' to ' + channel + '*' );
}

bot.login(process.env.BOT_TOKEN);