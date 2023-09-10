const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const PunishmentManager = require('../../modules/punishment_manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepunishment')
        .setDescription('Removes a punishment from a member')
        .addStringOption((option) => option.setName('infractionid').setDescription('The ID of the punishment to remove').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason.').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.removepunishment'))) {
            return;
        }

        const infractionID = interaction.options.getString('infractionid');
        const reason = interaction.options.getString('reason');

        const infraction = await PunishmentManager.getInfractionByID(infractionID);
        if (!infraction) {
            await interaction.reply({
                content: 'Invalid infraction ID',
                ephemeral: true,
            });
            return;
        }

        const result = await PunishmentManager.clearInfraction(infractionID, interaction.user, reason);

        if (result) {
            await interaction.reply({
                content: `Removed punishment ${infraction.Type} from ${infraction.Member} (${infraction.Member})`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: 'Failed to remove punishment',
                ephemeral: true,
            });
        }
    },
};
