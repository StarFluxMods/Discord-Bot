const { Events } = require('discord.js');
const LogUtils = require('../modules/log_utils.js');

module.exports = {
        name: Events.GuildMemberRemove,
	async execute(member) {
                const embed = await LogUtils.CreateLeaveLog(member);
                LogUtils.SendEmbed(member.client, 'user-logs', embed);
	},
};
