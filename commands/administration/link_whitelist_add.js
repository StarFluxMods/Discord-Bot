const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('linkwhitelistadd')
        .setDescription('Adds a link to the whitelist')
        .addStringOption((option) => option.setName('link').setDescription('The link to add to the whitelist').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.linkwhitelistadd', true, true))) {
            return;
        }

        const link = interaction.options.getString('link').toLowerCase();

        const result = await CommandUtils.AddLinkWhiteList(link);
        if (result) {
            interaction.editReply({
                content: `Added \`${link}\` to the link whitelist.`,
                ephemeral: true,
            });
        } else {
            interaction.editReply({
                content: `Updated \`${link}\` in the link whitelist.`,
                ephemeral: true,
            });
        }
    },
};
