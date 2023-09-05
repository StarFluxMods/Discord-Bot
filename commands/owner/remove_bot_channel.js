const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removebotchannel')
        .setDescription('Removes a bot channel')
        .addChannelOption((option) => option.setName('channel').setDescription('The channel to remove as a bot channel').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.removebotchannel'))) {
            return;
        }

        const channel = interaction.options.getChannel('channel');

        if (await CommandUtils.RemoveBotChannel(channel.id)) {
            interaction.reply({
                content: `Removed <#${channel.id}> as a bot channel.`,
                ephemeral: true,
            });
        } else {
            interaction.reply({
                content: `<#${channel.id}> is not a bot channel.`,
                ephemeral: true,
            });
        }
    },
};
