const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linkwhitelistadd')
		.setDescription('Adds a link to the whitelist')
        .addStringOption(option => option.setName('link').setDescription('The link to add to the whitelist').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.linkwhitelistadd')) { return; }

        const link = interaction.options.getString('link').toLowerCase();

        const result = await CommandUtils.AddLinkWhiteList(link);
        if (result) {
            interaction.reply({ content: `Added \`${link}\` to the link whitelist.`, ephemeral: true });
        }
        else {
            interaction.reply({ content: `Updated \`${link}\` in the link whitelist.`, ephemeral: true });
        }
	},
};
