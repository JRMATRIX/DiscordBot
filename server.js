const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', msg => {  
  if (msg.author.username != 'TRW Bot' && ) {
    parse( msg );
  }
})

function parse( msg ) {
  
}

client.login(process.env.BOT_TOKEN);