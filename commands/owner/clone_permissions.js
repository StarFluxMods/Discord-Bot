const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clonepermissions')
        .setDescription('Clones permisson from one role to another')
        .addRoleOption((option) => option.setName('role').setDescription('The role to get the permission from').setRequired(true))
        .addRoleOption((option) => option.setName('role2').setDescription('The role to add the permission to').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.clonepermissions', true, true))) {
            return;
        }

        const role = interaction.options.getRole('role');
        const role2 = interaction.options.getRole('role2');

        const permissions = await PermissionManager.getPermissions(role.id);

        for (const permission of permissions) {
            await PermissionManager.addPermission(role2.id, permission);
        }

        await interaction.editReply(`Cloned permissions from ${role.name} to ${role2.name}`);
    },
};
