const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamefolder')
		.setDescription('Provides PlateUp! Game Folder location'),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.gamefolder')) { return; }

        const embed = new EmbedBuilder()
            .setTitle('How to Find Your PlateUp! Folder')
            .setDescription('Hey There!\nThe folder your PlateUp! game will be in a different location most times!\nSo the easiest way to find it is through Steam!\n\n\nSimply go into PlateUp! > Properties > Local  Files > Browse')
            .setImage('https://cdn.discordapp.com/attachments/1028204180290146386/1047932374949826590/image.png');

        interaction.reply({ embeds: [embed] });
    },
};
