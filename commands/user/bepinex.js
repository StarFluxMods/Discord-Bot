const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bepinex')
		.setDescription('Provides information on how to uninstall BepInEx'),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.bepinex')) { return; }

        const embed = new EmbedBuilder()
            .setTitle('How to uninstall BepInEx')
            .setDescription('To remove BepInEx from your game, you will need to remove some files in your install folder.\n\n/BepInEx/\nchangelog.txt\ndoorstop_config.ini\nwinhttp.dll');
        interaction.reply({ embeds: [embed] });
    },
};
