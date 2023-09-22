const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userpermissions')
        .setDescription('Displays a users individual permissions')
        .addUserOption((option) => option.setName('user').setDescription('The user to get permissions of').setRequired(true))
        .addBooleanOption((option) => option.setName('includeroles').setDescription('Include Role Permissions')),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.userpermissions', true, true))) {
            return;
        }

        const member = interaction.options.getMember('user');
        const includeRoles = interaction.options.getBoolean('includeroles');

        const permissions = await PermissionManager.getUserPermissions(member);
        const roles = member.roles.cache.map((role) => role.id);
        const rolePermissions = [];
        for (const role of roles) {
            const rolePerms = await PermissionManager.getPermissions(role);
            rolePermissions.push(...rolePerms);
        }
        const allPermissions = [...permissions, ...rolePermissions];
        const uniquePermissions = [...new Set(allPermissions)];

        const embed = {
            title: `Permissions for ${member.user.tag}`,
            description: `User Permissions: ${permissions.length}\nRole Permissions: ${rolePermissions.length}\nTotal Permissions: ${uniquePermissions.length}`,
            fields: [
                {
                    name: 'User Permissions',
                    value: permissions.join('\n'),
                    inline: true,
                },
            ],
            color: 0x0000ff,
        };

        if (includeRoles) {
            embed.fields.push({
                name: 'Role Permissions',
                value: rolePermissions.join('\n'),
                inline: true,
            });
        }

        await interaction.editReply({
            content: '',
            embeds: [embed],
            ephemeral: true,
        });
    },
};
