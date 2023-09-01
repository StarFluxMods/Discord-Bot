const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linkwhitelistremove')
		.setDescription('Removes a link to the whitelist')
        .addStringOption(option => option.setName('link').setDescription('The link to remove from the whitelist').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.linkwhitelistremove')) { return; }

        const link = interaction.options.getString('link').toLowerCase();

        const result = await CommandUtils.RemoveLinkWhiteList(link);
        if (result) {
            interaction.reply({ content: `Removed \`${link}\` from the link whitelist.`, ephemeral: true });
        }
        else {
            interaction.reply({ content: `Could not find \`${link}\` in the link whitelist.`, ephemeral: true });
        }
	},
};
