const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addbotchannel')
		.setDescription('Adds a bot channel')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to set as a bot channel').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.addbotchannel')) { return; }

        const channel = interaction.options.getChannel('channel');

        if (await CommandUtils.AddBotChannel(channel.id)) {
            interaction.reply({ content: `Added <#${channel.id}> as a bot channel.`, ephemeral: true });
        }
        else {
            interaction.reply({ content: `<#${channel.id}> is already a bot channel.`, ephemeral: true });
        }
	},
};
