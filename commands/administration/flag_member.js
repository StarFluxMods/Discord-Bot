const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const SQLManager = require('../../modules/sql_manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flag')
        .setDescription('Flags a member')
        .addUserOption((option) => option.setName('member').setDescription('The member to flag').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.flag', true, true))) {
            return;
        }

        const member = interaction.options.getMember('member');

        const flaggedMember = await SQLManager.FlaggedMembers.findOne({
            where: {
                UserID: member.id,
            },
        });

        if (flaggedMember != null) {
            interaction.editReply({
                content: `${member} is already flagged.`,
                ephemeral: true,
            });
            return;
        }

        await SQLManager.FlaggedMembers.create({
            UserID: member.id,
        });


        interaction.editReply({
            content: `${member} is now flagged.`,
            ephemeral: true,
        });
    },
};
