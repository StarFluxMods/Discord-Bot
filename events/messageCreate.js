const { Events, EmbedBuilder } = require('discord.js');
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

        // Check if the message is a KitchenDesigner link
        if (message.content.toLowerCase().includes('plateuptools.com/kitchen-designer')) {
            if (!(message.channel.id === await CommandUtils.GetPreference('kitchendesigner-channel'))) {
                message.delete();
                return;
            }
            else {
                const designid = message.content.split('?d=')[1].split('==')[0];
                const imageURL = 'https://plateuptools.com/.netlify/functions/og/' + designid;
                const viewURL = 'https://plateuptools.com/kitchen-designer/view?d=' + designid;

                const embed = new EmbedBuilder()
                .setTitle('KitchenDesigner Link')
                .setURL(viewURL)
                .setImage(imageURL)
                .setColor('#00b0f4')
                .setFooter({
                    text: message.author.username,
                    iconURL: await message.author.avatarURL(),
                })
                .setTimestamp();

                message.channel.send({ embeds: [embed] });
                message.delete();
                return;
            }
        }
	},
};