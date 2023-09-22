const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder().setName('botchannels').setDescription('Lists Bot Channels'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.botchannels', true, true))) {
            return;
        }

        const botChannels = await CommandUtils.GetBotChannels();

        if (botChannels.length === 0) {
            interaction.editReply({
                content: 'There are no bot channels.',
                ephemeral: true,
            });
            return;
        }

        const botChannelList = botChannels.map((channel) => `<#${channel}>`).join('\n');

        interaction.editReply({
            content: `Bot Channels:\n${botChannelList}`,
            ephemeral: true,
        });
    },
};
