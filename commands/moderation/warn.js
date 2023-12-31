const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');
const LogUtils = require('../../modules/log_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a member')
        .addUserOption((option) => option.setName('member').setDescription('The member to warn').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for the warning')),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.warn', true, true))) {
            return;
        }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (await PermissionManager.hasPermission(target, 'permission.warn-immune')) {
            await interaction.editReply({
                content: 'You cannot warn this member',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.client.users.send(target.id, {
                embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'warn')],
            });
        } catch (error) {
            console.log(error);
        }

        await interaction.editReply({
            embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'warn')],
            ephemeral: true,
        });
        await LogUtils.SendEmbed(target.client, 'mod-logs', await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'warn'));

        await PunishmentManager.warn(target, interaction.member, reason);
    },
};
