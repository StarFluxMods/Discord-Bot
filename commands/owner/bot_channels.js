const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder().setName('botchannels').setDescription('Lists Bot Channels'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.botchannels'))) {
            return;
        }

        const botChannels = await CommandUtils.GetBotChannels();

        if (botChannels.length === 0) {
            interaction.reply({
                content: 'There are no bot channels.',
                ephemeral: true,
            });
            return;
        }

        const botChannelList = botChannels.map((channel) => `<#${channel}>`).join('\n');

        interaction.reply({
            content: `Bot Channels:\n${botChannelList}`,
            ephemeral: true,
        });
    },
};
