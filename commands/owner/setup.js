const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Sets up the bot for use')
        .addRoleOption(option => option.setName('role').setDescription('Master Role').setRequired(true)),
	async execute(interaction) {
        const role = await PermissionManager.getRole('*');
        if (role.length > 0) {
            interaction.reply({ content: 'The bot is already set up.', ephemeral: true });
            return;
        }
        else {

            const _role = interaction.options.getRole('role');

            interaction.reply({ content: 'Setting up the bot...', ephemeral: true });
            await PermissionManager.setupMasterPermission(_role.id);
            return;
        }
	},
};
