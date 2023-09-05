const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder().setName('linkwhitelist').setDescription('Displays all links in the whitelist'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.linkwhitelist'))) {
            return;
        }

        const whitelist = await CommandUtils.GetLinkWhiteList();
        const embed = {
            title: 'Link Whitelist',
            description: whitelist.join('\n'),
            color: 0x0000ff,
        };

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
