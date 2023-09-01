const { Events } = require('discord.js');
const SQLManager = require('../modules/sql_manager.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		// Initialize the SQLManager
		SQLManager.Preferences.sync();
		SQLManager.Permissions.sync();
		SQLManager.UserPermissions.sync();
		SQLManager.PunishmentHistory.sync();
		SQLManager.Bans.sync();
		SQLManager.Mutes.sync();
		SQLManager.Kicks.sync();
		SQLManager.Warnings.sync();
		SQLManager.BotChannels.sync();
		SQLManager.LinkWhitelist.sync();
		SQLManager.PhraseBlacklist.sync();
	},
};