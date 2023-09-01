const { Events } = require('discord.js');
const LogUtils = require('../modules/log_utils.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        if (message.author.bot) { return; }
        const deleteembed = await LogUtils.CreateDeleteLog(message, message.author);
        await LogUtils.SendEmbed(message.client, 'chat-logs', deleteembed);
	},
};
