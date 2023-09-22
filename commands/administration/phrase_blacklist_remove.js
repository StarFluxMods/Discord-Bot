const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('phraseblacklistremove')
        .setDescription('Removes a phrase to the blacklist')
        .addStringOption((option) => option.setName('phrase').setDescription('The phrase to remove from the blacklist').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.phraseblacklistremove', true, true))) {
            return;
        }

        const phrase = interaction.options.getString('phrase').toLowerCase();

        const result = await CommandUtils.RemovePhraseBlackList(phrase);
        if (result) {
            interaction.editReply({
                content: `Removed \`${phrase}\` from the phrase blacklist.`,
                ephemeral: true,
            });
        } else {
            interaction.editReply({
                content: `Could not find \`${phrase}\` in the phrase blacklist.`,
                ephemeral: true,
            });
        }
    },
};
