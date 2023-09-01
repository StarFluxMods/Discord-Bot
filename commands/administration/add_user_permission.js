const { SlashCommandBuilder } = require('discord.js');
const PermissionManager = require('../../modules/permissions_manager.js');
const CommandUtils = require('../../modules/command_utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adduserpermission')
		.setDescription('Adds a permission to a user')
        .addUserOption(option => option.setName('user').setDescription('The user to add the permission to').setRequired(true))
        .addStringOption(option => option.setName('permission').setDescription('The permission to add to the user').setRequired(true)),
	async execute(interaction) {
        if (!await CommandUtils.EnsurePermissions(interaction, 'commands.adduserpermission')) { return; }

        const member = interaction.options.getMember('user');
        const permission = interaction.options.getString('permission');
        const success = await PermissionManager.addPermissionToUser(member.id, permission);
        if (success) {
            await interaction.reply({ content: `Added permission \`${permission}\` to user \`${member.user.tag}\``, ephemeral: true });
        }
        else {
            interaction.reply({ content: `Permission \`${permission}\` already exists for user \`${member.user.tag}\``, ephemeral: true });
        }
	},
};
