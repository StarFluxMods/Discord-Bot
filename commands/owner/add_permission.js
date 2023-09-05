const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpermission')
        .setDescription('Adds a permission to a role')
        .addRoleOption((option) => option.setName('role').setDescription('The role to add the permission to').setRequired(true))
        .addStringOption((option) => option.setName('permission').setDescription('The permission to add to the role').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.addpermission'))) {
            return;
        }

        const role = interaction.options.getRole('role');
        const permission = interaction.options.getString('permission');
        const success = await PermissionManager.addPermission(role.id, permission);
        if (success) {
            await interaction.reply({
                content: `Added permission \`${permission}\` to role \`${role.name}\``,
                ephemeral: true,
            });
        } else {
            interaction.reply({
                content: `Permission \`${permission}\` already exists for role \`${role.name}\``,
                ephemeral: true,
            });
        }
    },
};
