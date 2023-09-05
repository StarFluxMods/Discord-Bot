const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpreference')
        .setDescription('Sets a preference')
        .addStringOption((option) => option.setName('key').setDescription('The preference key to change').setRequired(true))
        .addStringOption((option) => option.setName('value').setDescription('The value to set the key').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.setpreference'))) {
            return;
        }

        const key = interaction.options.getString('key');
        const value = interaction.options.getString('value');

        const success = await CommandUtils.SetPreference(key, value);

        if (success) {
            await interaction.reply({
                content: `Set preference \`${key}\` to \`${value}\``,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `Updated preference \`${key}\` to \`${value}\``,
                ephemeral: true,
            });
        }
    },
};
