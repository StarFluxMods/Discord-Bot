const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('melonloader')
		.setDescription('Provides information on how to uninstall MelonLoader'),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.melonloader')) { return; }

        const embed = new EmbedBuilder()
            .setTitle('How to uninstall MelonLoader')
            .setDescription('To remove MelonLoader from your game, you will need to remove some files in your install folder.\n\n/MelonLoader/\n/Mods/\nNOTICE.txt\nversion.dll');
        interaction.reply({ embeds: [embed] });
    },
};
