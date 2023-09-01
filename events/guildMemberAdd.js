const { Events } = require('discord.js');
const LogUtils = require('../modules/log_utils.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
        await LogUtils.SendMessage(member.client, 'welcome', 'Hey <@' + member.id + '>, Welcome to the **Unofficial PlateUp Modding** server!\n\nWe are not affiliated, associated, endorsed by, or in any way officially connected with the **PlateUp Team**, or the **Yogscast Team**. Any modding is at your own risk and discretion');

        const embed = await LogUtils.CreateJoinLog(member);
        LogUtils.SendEmbed(member.client, 'user-logs', embed);
	},
};
