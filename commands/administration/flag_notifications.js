const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flagnotifications')
        .setDescription('Toggles your flag notifications on or off'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.flagnotifications', true, true))) {
            return;
        }

        const role = await CommandUtils.GetPreference('moderation-notification-role');

        if (interaction.member.roles.cache.has(role)) {
            await interaction.member.roles.remove(role);
            interaction.editReply({
                content: 'You will no longer receive flag notifications.',
                ephemeral: true,
            });
        } else {
            await interaction.member.roles.add(role);
            interaction.editReply({
                content: 'You will now receive flag notifications.',
                ephemeral: true,
            });
        }
    },
};
