const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Sets up the bot for use'),
	async execute(interaction) {
        const role = await PermissionManager.getRole('*');
        if (role.length > 0) {
            interaction.reply({ content: 'The bot is already set up.', ephemeral: true });
            return;
        }
        else {
            interaction.reply({ content: 'Setting up the bot...', ephemeral: true });
            await PermissionManager.setupMasterPermission('1146088294547992717');
            return;
        }
	},
};
