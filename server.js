const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', msg => {  
  // Don't read commands from the bot account, look for '!' to read for commands
  if (msg.author.username != 'TRW Bot' && msg.content.substring(0, 1) == '!' ) {
    
    var args = msg.content.substring(1).split(' ');
    var call = args[0];
    
    if( call == 'trw' ) parse( msg, args );
    
  }
})

function parse( msg, args ) {
  msg.reply( 'got a command' );
}

client.login(process.env.BOT_TOKEN);