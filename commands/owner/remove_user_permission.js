const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeuserpermission')
        .setDescription('Removes a permission from a user')
        .addUserOption((option) => option.setName('user').setDescription('The user to remove the permission from').setRequired(true))
        .addStringOption((option) => option.setName('permission').setDescription('The permission to remove from the user').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.removeuserpermission'))) {
            return;
        }

        const member = interaction.options.getMember('user');
        const permission = interaction.options.getString('permission');
        const success = await PermissionManager.removePermissionFromUser(member.id, permission);
        if (success) {
            await interaction.reply({
                content: `Removed permission \`${permission}\` from user \`${member.user.tag}\``,
                ephemeral: true,
            });
        } else {
            interaction.reply({
                content: `Permission \`${permission}\` does not exist for user \`${member.user.tag}\``,
                ephemeral: true,
            });
        }
    },
};
