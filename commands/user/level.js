const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const LevelManager = require('../../modules/levels_manager.js');

module.exports = {
    data: new SlashCommandBuilder().setName('level').setDescription('Provides users level information'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.level', true, false))) {
            return;
        }

        const percent = await LevelManager.GetLevelProgressPercent(interaction.member);
        const x = Math.round(percent / 10);
        const y = 10 - x;

        let bar = '';
        for (let i = 0; i < x; i++) {
            bar += '▰';
        }
        for (let i = 0; i < y; i++) {
            bar += '▱';
        }


        const embed = new EmbedBuilder()
            .setTitle(`${interaction.member.displayName}'s Level`)
            .setDescription(`Level: ${await LevelManager.GetUserLevel(interaction.member)}\nXP: ${await LevelManager.GetUserXP(interaction.member)}\n\n${bar} ${percent}%`)
            .setColor('#00ff00')
            .setThumbnail(interaction.member.user.avatarURL());

        await interaction.editReply({ content: '', embeds: [embed] });

    },
};
