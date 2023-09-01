const { SlashCommandBuilder } = require('discord.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a member')
        .addUserOption(option => option.setName('member').setDescription('The member to unmute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the unmute')),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.unmute')) { return; }

        const muteRole = await CommandUtils.GetPreference('mute-role');

        if (muteRole == null) {
            await interaction.reply({ content: 'Preference `mute-role` has not been set.', ephemeral: true });
            return;
        }


        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const result = await PunishmentManager.unmute(target, interaction.member, reason, muteRole);

        if (!result) {
            await interaction.reply({ content: 'This member is not muted', ephemeral: true });
            return;
        }

        await interaction.reply({ embeds: [await PunishmentManager.embedBuilder(target, reason, -1, interaction.member, 'unmute')], ephemeral: true });
	},
};
