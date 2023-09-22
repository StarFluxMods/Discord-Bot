const { SlashCommandBuilder } = require('discord.js');
const LevelsManager = require('../../modules/levels_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setuserxp')
        .setDescription('Sets a users xp')
        .addUserOption((option) => option.setName('user').setDescription('The user to set xp of').setRequired(true))
        .addIntegerOption((option) => option.setName('xp').setDescription('The xp to set').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.setuserxp', true, true))) {
            return;
        }

        const user = interaction.options.getUser('user');
        const xp = interaction.options.getInteger('xp');

        await LevelsManager.SetUserXP(user, xp);
        await LevelsManager.CheckUserLevelChange(user, false);

        interaction.editReply({
            content: `Set ${user}'s xp to ${xp}`,
            ephemeral: true,
        });
    },
};
