const SQLManager = require('./sql_manager.js');
const { EmbedBuilder } = require('discord.js');
const CommandUtils = require('./command_utils.js');

module.exports = {
    getHistory,
    embedBuilder,
    ban,
    unban,
    mute,
    unmute,
    kick,
    warn,
    getInfractionByID,
    convertInfraction,
    clearInfraction,
    GenerateUniqueID,
};

async function GenerateUniqueID() {
    const id = await CommandUtils.GenerateRandomString(10);
    const existingInfraction = await SQLManager.PunishmentHistory.findOne({
        where: { InfractionID: id },
    });
    if (existingInfraction) {
        return await GenerateUniqueID();
    }
    return id;
}

async function addPunishment(member, punisher, type, reason, id) {
    punisher = punisher ?? member.client.user;
    await SQLManager.PunishmentHistory.create({
        Member: member.id,
        Punisher: punisher.id,
        Type: type,
        Reason: reason,
        Date: Math.floor(Date.now() / 1000),
        InfractionID: id,
    });
}

async function getHistory(member) {
    // get all punishments sorted by date where Hidden is false
    const punishments = await SQLManager.PunishmentHistory.findAll({
        where: { Member: member.id, Hidden: false },
        order: [['Date', 'DESC']],
    });
    return punishments;
}

async function ban(member, reason, length, punisher) {
    const id = await GenerateUniqueID();
    punisher = punisher ?? member.client.user;
    const existingBan = await SQLManager.Bans.findOne({
        where: { Member: member.id, Active: true },
    });
    if (existingBan) {
        return false;
    }
    await SQLManager.Bans.create({
        Member: member.id,
        Time: Math.floor(Date.now() / 1000),
        Reason: reason,
        Length: length * 60,
        Punisher: punisher.id,
        InfractionID: id,
    });
    await addPunishment(member, punisher, 'ban', reason, id);
    await member.ban({ reason: reason });
    return true;
}

async function unban(guild, member, punisher, reason) {
    punisher = punisher ?? member.client.user;
    const existingBan = await SQLManager.Bans.findOne({
        where: { Member: member.user.id, Active: true },
    });
    if (!existingBan) {
        return false;
    }
    await existingBan.update({
        Active: false,
        Remover: punisher.id,
        RemovalReason: reason,
    });
    await guild.members.unban(member.user.id, reason);
    return true;
}

async function mute(member, reason, length, punisher) {
    const id = await GenerateUniqueID();
    if (length == 0) {
        length = 27 * 24 * 60 * 60 * 1000 + 1;
    } else {
        length = length * 60 * 1000;
    }

    punisher = punisher ?? member.client.user;
    const existingMute = await SQLManager.Mutes.findOne({
        where: { Member: member.id, Active: true },
    });
    if (existingMute) {
        return 0;
    }
    await SQLManager.Mutes.create({
        Member: member.id,
        Time: Math.floor(Date.now() / 1000),
        Reason: reason,
        Length: length * 60,
        Punisher: punisher.id,
        InfractionID: id,
    });
    await addPunishment(member, punisher, 'mute', reason, id);
    await member.timeout(length, reason);
    return 1;
}

async function unmute(member, punisher, reason) {
    punisher = punisher ?? member.client.user;
    const existingMute = await SQLManager.Mutes.findOne({
        where: { Member: member.id, Active: true },
    });
    if (!existingMute) {
        return false;
    }
    await existingMute.update({
        Active: false,
        Remover: punisher.id,
        RemovalReason: reason,
    });
    await member.timeout(null, reason);
    return true;
}

async function kick(member, punisher, reason) {
    const id = await GenerateUniqueID();
    punisher = punisher ?? member.client.user;
    await SQLManager.Kicks.create({
        Member: member.id,
        Time: Math.floor(Date.now() / 1000),
        Reason: reason,
        Punisher: punisher.id,
        InfractionID: id,
    });
    await member.kick(reason);
    await addPunishment(member, punisher, 'kick', reason, id);
    return true;
}

async function warn(member, punisher, reason) {
    const id = await GenerateUniqueID();
    punisher = punisher ?? member.client.user;
    await SQLManager.Warnings.create({
        Member: member.id,
        Time: Math.floor(Date.now() / 1000),
        Reason: reason,
        Punisher: punisher.id,
        InfractionID: id,
    });
    await addPunishment(member, punisher, 'warn', reason, id);
    return true;
}

async function embedBuilder(user, reason, length, punisher, type) {
    const lengthMessage = length == 0 ? 'Permanent' : length + ' minutes';
    punisher = punisher ?? user.client.user;
    if (user.username == undefined) {
        user = user.user;
    }

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
            embed.setTitle('[KICK] ' + user.username);
            // Yellow
            embed.setColor('#ffff00');
            break;
        case 'warn':
            embed.setTitle('[WARN] ' + user.username);
            // Yellow
            embed.setColor('#ffff00');
            break;
    }

    if (length == -1) {
        embed.setDescription('Target : <@' + user.id + '>\nReason : ' + reason + '\nPunisher : <@' + punisher.id + '>');
    } else {
        embed.setDescription('Target : <@' + user.id + '>\nReason : ' + reason + '\nLength : ' + lengthMessage + '\nPunisher : <@' + punisher.id + '>');
    }
    embed.setFooter({
        text: 'Llama',
    });

    embed.setTimestamp();

    return embed;
}

async function getInfractionByID(id) {
    const infraction = await SQLManager.PunishmentHistory.findOne({
        where: { InfractionID: id },
    });
    return infraction;
}

async function convertInfraction(infraction) {
    switch (infraction.Type) {
        case 'ban':
            return await SQLManager.Bans.findOne({
                where: { InfractionID: infraction.InfractionID },
            });
        case 'mute':
            return await SQLManager.Mutes.findOne({
                where: { InfractionID: infraction.InfractionID },
            });
        case 'kick':
            return await SQLManager.Kicks.findOne({
                where: { InfractionID: infraction.InfractionID },
            });
        case 'warn':
            return await SQLManager.Warnings.findOne({
                where: { InfractionID: infraction.InfractionID },
            });

        default:
            return null;
    }
}

async function clearInfraction(id, member, reason) {
    const infraction = await getInfractionByID(id);
    if (!infraction) {
        return false;
    }
    const convertedInfraction = await convertInfraction(infraction);
    if (!convertedInfraction) {
        return false;
    }

    // Update the infraction to Hidden

    switch (infraction.Type) {
        case 'ban':
            await SQLManager.Bans.update({ Hidden: true }, { where: { InfractionID: infraction.InfractionID } });
            break;
        case 'mute':
            await SQLManager.Mutes.update({ Hidden: true }, { where: { InfractionID: infraction.InfractionID } });
            break;
        case 'kick':
            await SQLManager.Kicks.update({ Hidden: true }, { where: { InfractionID: infraction.InfractionID } });
            break;
        case 'warn':
            await SQLManager.Warnings.update({ Hidden: true }, { where: { InfractionID: infraction.InfractionID } });
            break;
    }

    // Update the punishment history to Hidden

    await SQLManager.PunishmentHistory.update({ Hidden: true }, { where: { InfractionID: infraction.InfractionID } });

    // Add a log to the database that the infraction was cleared

    await SQLManager.InfractionRemoval.create({
        InfractionID: infraction.InfractionID,
        Punisher: member.id,
        Reason: reason,
        Time: Math.floor(Date.now() / 1000),
    });

    return true;
}
