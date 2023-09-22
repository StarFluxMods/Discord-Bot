const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const SQLManager = require('../../modules/sql_manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unflag')
        .setDescription('Unflags a member')
        .addUserOption((option) => option.setName('member').setDescription('The member to unflag').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.unflag', true, true))) {
            return;
        }

        const member = interaction.options.getMember('member');

        const flaggedMember = await SQLManager.FlaggedMembers.findOne({
            where: {
                UserID: member.id,
            },
        });

        if (flaggedMember == null) {
            interaction.editReply({
                content: `${member} is not flagged.`,
                ephemeral: true,
            });
            return;
        }

        await flaggedMember.destroy();

        interaction.editReply({
            content: `${member} is no longer flagged.`,
            ephemeral: true,
        });
    },
};
