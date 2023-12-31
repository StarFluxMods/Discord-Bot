const { SlashCommandBuilder } = require('discord.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');
const LogUtils = require('../../modules/log_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a member')
        .addStringOption((option) => option.setName('member').setDescription('The member to unban').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for the unban')),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.unban', true, true))) {
            return;
        }

        const target = await CommandUtils.GetMember(interaction.guild, interaction.options.getString('member'));
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const result = await PunishmentManager.unban(interaction.guild, target, interaction.member, reason);

        if (!result) {
            await interaction.editReply({
                content: 'This member is not banned',
                ephemeral: true,
            });
            return;
        }

        await interaction.editReply({
            embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'unban')],
            ephemeral: true,
        });
        await LogUtils.SendEmbed(target.client, 'mod-logs', await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'unban'));
    },
};
