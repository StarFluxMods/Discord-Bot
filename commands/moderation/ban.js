const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a member')
        .addUserOption(option => option.setName('member').setDescription('The member to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban'))
        .addNumberOption(option => option.setName('length').setDescription('The length of the ban')),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.ban.perm') || !await CommandUtils.EnsurePermissions(interaction, 'commands.ban.temp')) { return; }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const length = interaction.options.getNumber('length') ?? 0;

        if (await PermissionManager.hasPermission(target, 'permission.ban-immune')) {
            await interaction.reply({ content: 'You cannot ban this member', ephemeral: true });
            return;
        }

        if (length == 0) {
            if (!await PermissionManager.hasPermission(interaction.member, 'commands.ban.perm')) {
                await interaction.reply({ content: 'You do not have permission to permanently ban members', ephemeral: true });
                return;
            }
        }

        if (length != 0) {
            if (!await PermissionManager.hasPermission(interaction.member, 'commands.ban.temp')) {
                await interaction.reply({ content: 'You do not have permission to temporarily ban members', ephemeral: true });
                return;
            }
            else {
                const temppermission = await PermissionManager.hasPermissionLike(interaction.member, 'commands.ban.temp.length.');
                if (temppermission != false) {
                    const permissionlength = temppermission.split('commands.ban.temp.length.')[1];
                    if (length > permissionlength) {
                        await interaction.reply({ content: 'You do not have permission to ban members for this long', ephemeral: true });
                        return;
                    }
                }
            }
        }

        try {
            await interaction.client.users.send(target.id, { embeds: [await PunishmentManager.embedBuilder(target, reason, length, interaction.member, 'ban')] });
        }
        catch (error) {
            console.log(error);
        }

        await interaction.reply({ embeds: [await PunishmentManager.embedBuilder(target, reason, length, interaction.member, 'ban')], ephemeral: true });

        const result = await PunishmentManager.ban(target, reason, length, interaction.member);

        if (!result) {
            await interaction.reply({ content: 'This member is already banned', ephemeral: true });
        }
	},
};
