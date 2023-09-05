const { Events } = require('discord.js');
const CommandUtils = require('../modules/command_utils.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(messageReaction) {
        if (messageReaction.emoji.name === '🗑️') {
            if (messageReaction.count > 1) {
                if (!(await CommandUtils.IsBotChannel(messageReaction.message.channel.id))) {
                    if (messageReaction.message.author.id == messageReaction.message.client.user.id) {
                        messageReaction.message.delete();
                    }
                }
            }
            return;
        }
    },
};
