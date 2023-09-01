const { SlashCommandBuilder } = require('discord.js');
const PunishmentManager = require('../../modules/punishment_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Displays a members history')
        .addUserOption(option => option.setName('member').setDescription('The member to get history of').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.history')) { return; }

        const target = interaction.options.getMember('member');

        const history = await PunishmentManager.getHistory(target);

        if (history.length == 0) {
            await interaction.reply({ content: 'This member has no history', ephemeral: true });
            return;
        }

        const embed = {
            color: 0x0099ff,
            title: `History for ${target.user.username}`,
            description: '',
            fields: [],
        };

        for (const punishment of history) {
            embed.fields.push({
                name: `${punishment.Type} - ${punishment.Reason}`,
                value: `Punished by <@${punishment.Punisher}> <t:${punishment.Date}:R>`,
            });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });

	},
};
