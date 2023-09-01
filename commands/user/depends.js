const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('depends')
		.setDescription('Explains how to find your mod dependencies'),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.depends')) { return; }

        const embed = new EmbedBuilder()
            .setTitle('Mod Dependenciess')
            .setDescription('Most most require libraries to function correctly, this collection contains all the most used libraries needed for your mods to run!\n\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=2927296802 ')
            .setImage('https://cdn.discordapp.com/attachments/1146076640884031599/1147116604765765683/depends.png');

        interaction.reply({ embeds: [embed] });
    },
};
