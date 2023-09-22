const { Events } = require('discord.js');
const CommandUtils = require('../modules/command_utils.js');
const PermissionManager = require('../modules/permissions_manager.js');
const PunishmentManager = require('../modules/punishment_manager.js');
const LogUtils = require('../modules/log_utils.js');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (newMessage.author.bot) {
            return;
        }

        if (oldMessage.content === newMessage.content) {
            return;
        }

        const toLower = (w) => w.toLocaleLowerCase();
        const messageLower = toLower(newMessage.content);

        const embed = await LogUtils.CreateEditLog(oldMessage, newMessage, newMessage.author);
        if (embed != null) {
            LogUtils.SendEmbed(newMessage.client, 'chat-logs', embed);
        } else {
            const newEmbed = {
                title: '[EDIT] ' + newMessage.author.username,
                desctiption: 'Something went wrong when creating the edit log. Please check the bot logs.',
            };

            LogUtils.SendEmbed(newMessage.client, 'chat-logs', newEmbed);
        }


        if ((await CommandUtils.GetPreference('enablelinkwhitelist')) === 'true') {
            // Check if the message contains a link
            if (new RegExp('https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_+.~#?&//=]*)').test(messageLower)) {
                if (!(await PermissionManager.hasPermission(newMessage.member, 'permission.links.bypass'))) {
                    let whitelist = await CommandUtils.GetLinkWhiteList();
                    console.log(whitelist);
                    whitelist = whitelist.map(toLower);
                    if (!whitelist.some((w) => messageLower.includes(w))) {
                        await PunishmentManager.warn(newMessage.author, null, 'That link is not allowed in this server');
                        try {
                            await newMessage.author.client.users.send(newMessage.author.id, {
                                embeds: [await PunishmentManager.embedBuilder(newMessage.author, 'That link is not allowed in this server', -1, null, 'warn')],
                            });
                        } catch (error) {
                            console.log(error);
                        }
                        newMessage.delete();
                        return;
                    }
                }
            }
        }

        if ((await CommandUtils.GetPreference('enablephraseblacklist')) === 'true') {
            // Check if the message contains a blacklisted phrase
            if (!(await PermissionManager.hasPermission(newMessage.member, 'permission.blacklist.bypass'))) {
                let blacklist = await CommandUtils.GetPhraseBlackList();
                blacklist = blacklist.map(toLower);
                if (blacklist.some((w) => messageLower.includes(w))) {
                    const phrase = blacklist.find((w) => messageLower.includes(w));
                    const _embed = await LogUtils.CreateModDeleteLog(newMessage, phrase, newMessage.author);
                    await LogUtils.SendEmbed(newMessage.client, 'mod-logs', _embed);

                    await PunishmentManager.warn(newMessage.author, null, 'That phrase is not allowed in this server');

                    try {
                        await newMessage.author.client.users.send(newMessage.author.id, {
                            embeds: [await PunishmentManager.embedBuilder(newMessage.author, 'That phrase is not allowed in this server', -1, null, 'warn')],
                        });
                    } catch (error) {
                        console.log(error);
                    }

                    newMessage.delete();
                    return;
                }
            }
        }
    },
};
