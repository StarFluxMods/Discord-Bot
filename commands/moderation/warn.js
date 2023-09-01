const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns a member')
        .addUserOption(option => option.setName('member').setDescription('The member to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning')),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.warn')) { return; }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (await PermissionManager.hasPermission(target, 'permission.warn-immune')) {
            await interaction.reply({ content: 'You cannot warn this member', ephemeral: true });
            return;
        }

        try {
            await interaction.client.users.send(target.id, { embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'warn')] });
        }
        catch (error) {
            console.log(error);
        }

        await interaction.reply({ embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'warn')], ephemeral: true });

        await PunishmentManager.warn(target, interaction.member, reason);

	},
};
