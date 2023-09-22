const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder().setName('phraseblacklist').setDescription('Displays all phrases in the blacklist'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.phraseblacklist', true, true))) {
            return;
        }

        const blacklist = await CommandUtils.GetPhraseBlackList();
        const embed = {
            title: 'Phrase Blacklist',
            description: blacklist.join('\n'),
            color: 0x0000ff,
        };

        await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
