const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convertlevels')
        .setDescription('Converts Mee6 Levels to Llama levels')
        .addUserOption((option) => option.setName('user').setDescription('The user to convert').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.convertlevels'))) {
            return;
        }

        const user = await interaction.options.getMember('user');

        if (user) {
            await CommandUtils.ConvertMee6LevelsToLlamaLevels(user);
            interaction.reply({
                content: '<@' + user.id + '> has been converted.',
                ephemeral: true,
            });
        }
    },
};
