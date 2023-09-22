const { Events } = require('discord.js');
const LogUtils = require('../modules/log_utils.js');
const CommandUtils = require('../modules/command_utils.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        await LogUtils.SendMessage(member.client, 'welcome', 'Hey <@' + member.id + '>, Welcome to the **Unofficial PlateUp Modding** server!\n\nWe are not affiliated, associated, endorsed by, or in any way officially connected with the **PlateUp Team**, or the **Yogscast Team**. Any modding is at your own risk and discretion');

        const embed = await LogUtils.CreateJoinLog(member);
        LogUtils.SendEmbed(member.client, 'user-logs', embed);

        const created = Math.floor(member.user.createdTimestamp / 1000);
        const current = Math.floor(Date.now() / 1000);
        const difference = current - created;
        const createdString = await CommandUtils.SecondsToTimeString(difference);

        if (difference < 604800) {
            CommandUtils.SendModerationNotification('Suspicious Member', 'Username: ' + member.user.tag + '\nCreated: ' + createdString + ' ago', member.client);
        }

    },
};
