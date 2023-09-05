const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder().setName('plogs').setDescription('Provides PlateUp! log location'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.plogs'))) {
            return;
        }

        const embed = new EmbedBuilder().setTitle('How to Find Your PlateUp! Logs').setDescription("Hey there!\nYour PlateUp! logs are located in %localappdata%low/It's Happening/PlateUp and it's called Player.log").setImage('https://cdn.discordapp.com/attachments/1028204180290146386/1047923181199048734/image.png');

        interaction.reply({ embeds: [embed] });
    },
};
