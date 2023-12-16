const { SlashCommandBuilder } = require('discord.js');
const CommandUtils = require('../../modules/command_utils.js');
const SQLManager = require('../../modules/sql_manager.js');
const Jimp = require('jimp');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder().setName('bonk').setDescription('Bonks a user')
    .addUserOption((option) => option.setName('member').setDescription('The member to bonk').setRequired(true)),
    async execute(interaction) {

        if (!(await CommandUtils.EnsurePermissions(interaction, 'commands.bonk', true, true))) {
            return;
        }

        const user = interaction.user.globalName;
        const target = interaction.options.getMember('member').user.globalName ?? interaction.options.getMember('member').user.username;

        const templateFile = './resources/Bonk.png';
        const outputFile = './resources/TempBonk.png';
        const loadedImage = await Jimp.read(templateFile);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

        await loadedImage.print(font, 10, 10, user);
        const x = await Jimp.measureText(font, user) + 10;
        const y = await Jimp.measureTextHeight(font, user) + 10;
        await loadedImage.print(font, 990 - x, (750 - y) + 50, target);
        await loadedImage.writeAsync(outputFile);
        await interaction.editReply('Bonked');
        const result = await interaction.channel.send({ content: 'Bonked <@' + interaction.options.getMember('member').user.id + '>', files: [outputFile] });
        SQLManager.DoNotFlagAsDeletable.create({
            MessageID: result.id,
        });
        await fs.unlinkSync(outputFile);
    },
};
