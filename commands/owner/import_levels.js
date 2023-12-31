const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const fs = require('node:fs');
const LevelsManager = require('../../modules/levels_manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('importlevels')
        .setDescription('Imports the users.json file from the config folder.'),
    async execute(interaction) {
        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.importlevels', true, true))) {
            return;
        }

        const users = await JSON.parse(fs.readFileSync('/data/config/users.json', 'utf8'));

        for (const [key, value] of Object.entries(users)) {

            const member = await CommandUtils.GetMember(interaction.guild, key);
            if (!member) {
                continue;
            }
            await LevelsManager.SetUserXP(member, value);
            await LevelsManager.CheckUserLevelChange(member);
        }

        interaction.editReply({
            content: 'Imported users.json',
            ephemeral: true,
        });
    },
};
