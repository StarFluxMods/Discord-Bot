const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('phraseblacklistadd')
        .setDescription('Adds a phrase to the blacklist')
        .addStringOption((option) => option.setName('phrase').setDescription('The phrase to add to the blacklist').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.phraseblacklistadd'))) {
            return;
        }

        const phrase = interaction.options.getString('phrase').toLowerCase();

        const result = await CommandUtils.AddPhraseBlackList(phrase);
        if (result) {
            interaction.reply({
                content: `Added \`${phrase}\` to the phrase blacklist.`,
                ephemeral: true,
            });
        } else {
            interaction.reply({
                content: `Updated \`${phrase}\` in the phrase blacklist.`,
                ephemeral: true,
            });
        }
    },
};
