const { Events } = require('discord.js');
const CommandUtils = require('../modules/command_utils.js');
const PermissionManager = require('../modules/permissions_manager.js');
const PunishmentManager = require('../modules/punishment_manager.js');
const LogUtils = require('../modules/log_utils.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        // Allow deletion of messages from bots outside of bot channels
        if (message.author.bot) {
            if (!await CommandUtils.IsBotChannel(message.channel.id)) {
                message.react('🗑️');
            }
            return;
        }

        const toLower = w => w.toLocaleLowerCase();
        const messageLower = toLower(message.content);

        // Check if the message contains a link
        if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(messageLower)) {
            if (!await PermissionManager.hasPermission(message.member, 'permission.links.bypass')) {
                let whitelist = await CommandUtils.GetLinkWhiteList();
                whitelist = whitelist.map(toLower);
                if (!whitelist.some(w => messageLower.includes(w))) {
                    await PunishmentManager.warn(message.author, null, 'That link is not allowed in this server');

                    try {
                        await message.author.client.users.send(message.author.id, { embeds: [await PunishmentManager.embedBuilder(message.author, 'That link is not allowed in this server', -1, null, 'warn')] });
                    }
                    catch (error) {
                        console.log(error);
                    }

                    message.delete();
                    return;
                }
            }
        }

        // Check if the message contains a blacklisted phrase
        if (!await PermissionManager.hasPermission(message.member, 'permission.blacklist.bypass')) {
            let blacklist = await CommandUtils.GetPhraseBlackList();
            blacklist = blacklist.map(toLower);
            if (blacklist.some(w => messageLower.includes(w))) {

                const phrase = await blacklist.find(w => messageLower.includes(w));
                const embed = await LogUtils.CreateModDeleteLog(message, phrase, message.author);
                await LogUtils.SendEmbed(message.client, 'mod-logs', embed);

                const deleteembed = await LogUtils.CreateDeleteLog(message, message.author);
                await LogUtils.SendEmbed(message.client, 'chat-logs', deleteembed);
                await PunishmentManager.warn(message.author, null, 'That phrase is not allowed in this server');

                try {
                    await message.author.client.users.send(message.author.id, { embeds: [await PunishmentManager.embedBuilder(message.author, 'That phrase is not allowed in this server', -1, null, 'warn')] });
                }
                catch (error) {
                    console.log(error);
                }

                message.delete();
                return;
            }
        }
	},
};