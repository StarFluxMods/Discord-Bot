const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklistimport')
		.setDescription('Adds a phrase to the blacklist')
        .addStringOption(option => option.setName('jsonpath').setDescription('The path to the JSON file').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.blacklistimport')) { return; }

        const jsonPath = interaction.options.getString('jsonpath');

        if (!fs.existsSync(jsonPath)) {
            interaction.reply({ content: `Could not find \`${jsonPath}\`.`, ephemeral: true });
            return;
        }

        const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        // add all phrases in the json file to the blacklist
        for (const phrase of json) {
            await CommandUtils.AddPhraseBlackList(phrase);
        }

        interaction.reply({ content: `Added \`${json.length}\` phrases to the phrase blacklist.`, ephemeral: true });
	},
};
