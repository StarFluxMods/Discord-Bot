const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a member')
        .addUserOption(option => option.setName('member').setDescription('The member to mute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the mute'))
        .addNumberOption(option => option.setName('length').setDescription('The length of the mute')),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.mute.perm') || !await CommandUtils.EnsurePermissions(interaction, 'commands.mute.temp')) { return; }

        const muteRole = await CommandUtils.GetPreference('mute-role');

        if (muteRole == null) {
            await interaction.reply({ content: 'Preference `mute-role` has not been set.', ephemeral: true });
            return;
        }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const length = interaction.options.getNumber('length') ?? 0;

        if (await PermissionManager.hasPermission(target, 'permission.mute-immune')) {
            await interaction.reply({ content: 'You cannot mute this member', ephemeral: true });
            return;
        }

        if (length == 0) {
            if (!await PermissionManager.hasPermission(interaction.member, 'commands.mute.perm')) {
                await interaction.reply({ content: 'You do not have permission to permanently mute members', ephemeral: true });
                return;
            }
        }

        if (length != 0) {
            if (!await PermissionManager.hasPermission(interaction.member, 'commands.mute.temp')) {
                await interaction.reply({ content: 'You do not have permission to temporarily mute members', ephemeral: true });
                return;
            }
            else {
                const temppermission = await PermissionManager.hasPermissionLike(interaction.member, 'commands.mute.temp.length.');
                if (temppermission != false) {
                    const permissionlength = temppermission.split('commands.mute.temp.length.')[1];
                    if (length > permissionlength) {
                        await interaction.reply({ content: 'You do not have permission to mute members for this long', ephemeral: true });
                        return;
                    }
                }
            }
        }

        await interaction.client.users.send(target.id, { embeds: [await PunishmentManager.embedBuilder(target.user, reason, length, interaction.member, 'mute')] });
        await interaction.reply({ embeds: [await PunishmentManager.embedBuilder(target.user, reason, length, interaction.member, 'mute')], ephemeral: true });

        const result = await PunishmentManager.mute(target, reason, length, interaction.member, muteRole);

        if (!result) {
            await interaction.reply({ content: 'This member is already muted', ephemeral: true });
        }

	},
};
