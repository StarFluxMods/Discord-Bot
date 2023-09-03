const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolepermissions')
		.setDescription('Displays a roles individual permissions')
        .addRoleOption(option => option.setName('role').setDescription('The role to get permissions of').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.rolepermissions')) { return; }

        const role = interaction.options.getRole('role');

        const permissions = await PermissionManager.getPermissions(role);

        const embed = {
            title: `Permissions for ${role.name}`,
            description: `Permissions: ${permissions.length}`,
            fields: [
                {
                    name: 'Permissions',
                    value: permissions.join('\n'),
                    inline: true,
                },
            ],
            color: 0x0000ff,
        };

        await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
