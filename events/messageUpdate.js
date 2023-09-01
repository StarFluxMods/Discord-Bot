const { Events } = require('discord.js');
const CommandUtils = require('../modules/command_utils.js');
const PermissionManager = require('../modules/permissions_manager.js');
const PunishmentManager = require('../modules/punishment_manager.js');
const LogUtils = require('../modules/log_utils.js');


module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {

        const toLower = w => w.toLocaleLowerCase();
        const messageLower = toLower(newMessage.content);

        const embed = await LogUtils.CreateEditLog(oldMessage, newMessage, newMessage.author);
        LogUtils.SendEmbed(newMessage.client, 'chat-logs', embed);

        // Check if the message contains a link
        if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(messageLower)) {
            if (!await PermissionManager.hasPermission(newMessage.member, 'permission.links.bypass')) {
                let whitelist = await CommandUtils.GetLinkWhiteList();
                console.log(whitelist);
                whitelist = whitelist.map(toLower);
                if (!whitelist.some(w => messageLower.includes(w))) {
                    const deleteembed = await LogUtils.CreateDeleteLog(newMessage, newMessage.author);
                    await LogUtils.SendEmbed(newMessage.client, 'chat-logs', deleteembed);
                    await PunishmentManager.warn(newMessage.author, null, 'That link is not allowed in this server');

                    try {
                        await newMessage.author.client.users.send(newMessage.author.id, { embeds: [await PunishmentManager.embedBuilder(newMessage.author, 'That link is not allowed in this server', -1, null, 'warn')] });
                    }
                    catch (error) {
                        console.log(error);
                    }

                    newMessage.delete();
                    return;
                }
            }
        }

        // Check if the message contains a blacklisted phrase
        if (!await PermissionManager.hasPermission(newMessage.member, 'permission.blacklist.bypass')) {
            let blacklist = await CommandUtils.GetPhraseBlackList();
            blacklist = blacklist.map(toLower);
            if (blacklist.some(w => messageLower.includes(w))) {

                const phrase = blacklist.find(w => messageLower.includes(w));
                const _embed = await LogUtils.CreateModDeleteLog(newMessage, phrase, newMessage.author);
                await LogUtils.SendEmbed(newMessage.client, 'mod-logs', _embed);

                const deleteembed = await LogUtils.CreateDeleteLog(newMessage, newMessage.author);
                await LogUtils.SendEmbed(newMessage.client, 'chat-logs', deleteembed);

                await PunishmentManager.warn(newMessage.author, null, 'That phrase is not allowed in this server');

                try {
                    await newMessage.author.client.users.send(newMessage.author.id, { embeds: [await PunishmentManager.embedBuilder(newMessage.author, 'That phrase is not allowed in this server', -1, null, 'warn')] });
                }
                catch (error) {
                    console.log(error);
                }

                newMessage.delete();
                return;
            }
        }
	},
};
