const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');
const LogUtils = require('../../modules/log_utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member')
        .addUserOption((option) => option.setName('member').setDescription('The member to mute').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for the mute'))
        .addNumberOption((option) => option.setName('length').setDescription('The length of the mute')),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.mute.perm', true, true)) || !(await CommandUtils.EnsurePermissions(interaction, 'commands.mute.temp'))) {
            return;
        }

        const muteRole = await CommandUtils.GetPreference('mute-role');

        if (muteRole == null) {
            await interaction.editReply({
                content: 'Preference `mute-role` has not been set.',
                ephemeral: true,
            });
            return;
        }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const length = interaction.options.getNumber('length') ?? 0;

        if (await PermissionManager.hasPermission(target, 'permission.mute-immune')) {
            await interaction.editReply({
                content: 'You cannot mute this member',
                ephemeral: true,
            });
            return;
        }

        if (length == 0) {
            if (!(await PermissionManager.hasPermission(interaction.member, 'commands.mute.perm'))) {
                await interaction.editReply({
                    content: 'You do not have permission to permanently mute members',
                    ephemeral: true,
                });
                return;
            }
        }

        if (length != 0) {
            if (!(await PermissionManager.hasPermission(interaction.member, 'commands.mute.temp'))) {
                await interaction.editReply({
                    content: 'You do not have permission to temporarily mute members',
                    ephemeral: true,
                });
                return;
            } else {
                const temppermission = await PermissionManager.hasPermissionLike(interaction.member, 'commands.mute.temp.length.');
                if (temppermission != false) {
                    const permissionlength = temppermission.split('commands.mute.temp.length.')[1];
                    if (length > permissionlength) {
                        await interaction.editReply({
                            content: 'You do not have permission to mute members for this long',
                            ephemeral: true,
                        });
                        return;
                    }
                }
            }
        }

        try {
            await interaction.client.users.send(target.id, {
                embeds: [await PunishmentManager.embedBuilder(target, reason, length, interaction.member, 'mute')],
            });
        } catch (error) {
            console.log(error);
        }
        await interaction.editReply({
            embeds: [await PunishmentManager.embedBuilder(target, reason, length, interaction.member, 'mute')],
            ephemeral: true,
        });
        await LogUtils.SendEmbed(target.client, 'mod-logs', await PunishmentManager.embedBuilder(target, reason, length, interaction.member, 'mute'));

        const result = await PunishmentManager.mute(target, reason, length, interaction.member, muteRole);

        if (result == 0) {
            await interaction.editReply({
                content: 'This member is already muted',
                ephemeral: true,
            });
            return;
        }

        if (result == 2) {
            await interaction.editReply({
                content: 'Mute role has not been assigned.',
                ephemeral: true,
            });
            return;
        }
    },
};
