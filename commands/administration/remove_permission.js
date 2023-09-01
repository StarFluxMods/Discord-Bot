const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removepermission')
		.setDescription('Removes a permission from a role')
        .addRoleOption(option => option.setName('role').setDescription('The role to remove the permission from').setRequired(true))
        .addStringOption(option => option.setName('permission').setDescription('The permission to remove from the role').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.removepermission')) { return; }


        const role = interaction.options.getRole('role');
        const permission = interaction.options.getString('permission');
        const success = await PermissionManager.removePermission(role.id, permission);
        if (success) {
            await interaction.reply({ content: `Removed permission \`${permission}\` from role \`${role.name}\``, ephemeral: true });
        }
        else {
            interaction.reply({ content: `Permission \`${permission}\` does not exist for role \`${role.name}\``, ephemeral: true });
        }
	},
};