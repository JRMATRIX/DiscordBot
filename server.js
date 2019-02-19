const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', ( user, userID, channelID, msg, evt ) => {
  if (msg.content === 'ping') {
    msg.reply('pong')
  }
})

client.login(process.env.BOT_TOKEN);