const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');
const LogUtils = require('../../modules/log_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member')
        .addUserOption((option) => option.setName('member').setDescription('The member to kick').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for the kick')),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.kick'))) {
            return;
        }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (await PermissionManager.hasPermission(target, 'permission.kick-immune')) {
            await interaction.reply({
                content: 'You cannot kick this member',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.client.users.send(target.id, {
                embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'kick')],
            });
        } catch (error) {
            console.log(error);
        }
        await interaction.reply({
            embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'kick')],
            ephemeral: true,
        });
        await LogUtils.SendEmbed(target.client, 'mod-logs', await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'kick'));

        await PunishmentManager.kick(target, interaction.member, reason);
    },
};
