const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const SQLManager = require('../../modules/sql_manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mutelevels')
        .setDescription('Allows you to mute level up messages')
        .addBooleanOption((option) => option.setName('mute').setDescription('Mute or unmute level up messages').setRequired(true)),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.mutelevels', true, true))) {
            return;
        }

        const mute = interaction.options.getBoolean('mute');

        const User = await SQLManager.Levels.findOne({
            where: { Member: interaction.member.id },
        });
        if (!User) {
            await SQLManager.Levels.create({
                Member: interaction.member.id,
                Level: 0,
                EXP: 0,
            });
        }

        await User.update({ MuteAnnouncements: mute });

        if (mute) {
            interaction.editReply({
                content: 'You will no longer receive level up pings',
                ephemeral: true,
            });
        } else {
            interaction.editReply({
                content: 'You will now receive level up pings',
                ephemeral: true,
            });
        }
    },
};
