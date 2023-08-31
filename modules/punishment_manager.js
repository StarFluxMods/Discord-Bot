const SQLManager = require('./sql_manager.js');
const { EmbedBuilder } = require('discord.js');

module.exports = { embedBuilder, ban, unban, mute, unmute, kick };

async function addPunishment(member, punisher, type, reason) {
    await SQLManager.PunishmentHistory.create({ Member: member.id, Punisher: punisher.id, Type: type, Reason: reason, Date: Date.now() });
}

async function ban(member, reason, length, punisher) {
    const existingBan = await SQLManager.Bans.findOne({ where: { Member: member.id, Active: true } });
    if (existingBan) {
        return false;
    }
    await SQLManager.Bans.create({ Member: member.id, Time: Date.now(), Reason: reason, Length: length * 60000, Punisher: punisher.id });
    await addPunishment(member, punisher, 'ban', reason);
    await member.ban({ reason: reason });
    return true;
}

async function unban(guild, member, punisher, reason) {
    const existingBan = await SQLManager.Bans.findOne({ where: { Member: member.id, Active: true } });
    if (!existingBan) {
        return false;
    }
    await existingBan.update({ Active: false, Remover: punisher.id, RemovalReason: reason });
    await guild.members.unban(member.id, reason);
    return true;
}

async function mute(member, reason, length, punisher, role) {
    const existingMute = await SQLManager.Mutes.findOne({ where: { Member: member.id, Active: true } });
    if (existingMute) {
        return false;
    }
    await SQLManager.Mutes.create({ Member: member.id, Time: Date.now(), Reason: reason, Length: length * 60000, Punisher: punisher.id });
    await addPunishment(member, punisher, 'mute', reason);
    await member.roles.add(role, reason);
    return true;
}

async function unmute(member, punisher, reason, role) {
    const existingMute = await SQLManager.Mutes.findOne({ where: { Member: member.id, Active: true } });
    if (!existingMute) {
        return false;
    }
    await existingMute.update({ Active: false, Remover: punisher.id, RemovalReason: reason });
    await member.roles.remove(role, reason);
    return true;
}

async function kick(member, punisher, reason) {
    await SQLManager.Kicks.create({ Member: member.id, Time: Date.now(), Reason: reason, Punisher: punisher.id });
    await member.kick(reason);
    await addPunishment(member, punisher, 'kick', reason);
    return true;
}

async function embedBuilder(user, reason, length, punisher, type) {
    const lengthMessage = length == 0 ? 'Permanent' : length + ' minutes';

    const embed = new EmbedBuilder();
    embed.setThumbnail(user.avatarURL());
    switch (type) {
        case 'ban':
            embed.setTitle('[BAN] ' + user.username);
            // Red
            embed.setColor('#ff0000');
            break;
        case 'unban':
            embed.setTitle('[UNBAN] ' + user.username);
            // Green
            embed.setColor('#00ff00');
            break;
        case 'mute':
            embed.setTitle('[MUTE] ' + user.username);
            // Yellow
            embed.setColor('#ffff00');
            break;
        case 'unmute':
            embed.setTitle('[UNMUTE] ' + user.username);
            // Green
            embed.setColor('#00ff00');
            break;
        case 'kick':
            embed.setTitle('[UNMUTE] ' + user.username);
            // Yellow
            embed.setColor('#ffff00');
            break;
    }

    if (length == -1) {
        embed.setDescription('Target : <@' + user.id + '>\nReason : ' + reason + '\nPunisher : <@' + punisher.id + '>');
    }
    else {
        embed.setDescription('Target : <@' + user.id + '>\nReason : ' + reason + '\nLength : ' + lengthMessage + '\nPunisher : <@' + punisher.id + '>');
    }
    embed.setFooter({
        text: 'Llama',
    });

    embed.setTimestamp();

    return embed;

}