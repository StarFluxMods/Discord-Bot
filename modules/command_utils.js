const PermissionManager = require('./permissions_manager.js');
const SQLManager = require('./sql_manager.js');
const Pushover = require('node-pushover');

module.exports = {
    EnsurePermissions,
    GetMember,
    SetPreference,
    GetPreference,
    GetBotChannels,
    AddBotChannel,
    RemoveBotChannel,
    IsBotChannel,
    AddLinkWhiteList,
    RemoveLinkWhiteList,
    GetLinkWhiteList,
    AddPhraseBlackList,
    RemovePhraseBlackList,
    GetPhraseBlackList,
    GenerateRandomString,
    IsMemberFlagged,
    SecondsToTimeString,
    SendModerationNotification,
};

async function EnsurePermissions(interaction, permission, edit = false, ephemeral = false) {
    if (edit) {
        await interaction.reply({ content: 'Just a minute, I\'m thinking...', ephemeral: ephemeral });
    }
    if (!(await PermissionManager.hasPermission(interaction.member, permission))) {
        if (await PermissionManager.hasPermission(interaction.member, 'permission.view-missing')) {
            if (edit) {
                interaction.editReply({
                    content: `You are require \`${permission}\` to run this command.`,
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: `You are require \`${permission}\` to run this command.`,
                    ephemeral: true,
                });
            }
            return false;
        }

        if (edit) {
            interaction.editReply({
                content: 'You dont have permission to run this command',
                ephemeral: true,
            });
        } else {
            interaction.reply({
                content: 'You dont have permission to run this command',
                ephemeral: true,
            });
        }

        return false;
    }
    return true;
}

async function GetMember(guild, id) {
    let result = null;
    await guild.members
        .fetch(id)
        .then((member) => {
            result = member;
        })
        .catch(() => {
            result = null;
        });

    if (result == null) {
        await guild.bans
            .fetch(id)
            .then((ban) => {
                result = ban;
            })
            .catch(() => {
                result = null;
            });
    }

    return result;
}

async function SetPreference(key, value) {
    const preference = await SQLManager.Preferences.findOne({
        where: { Key: key },
    });
    if (preference) {
        await preference.update({ Value: value });
        return false;
    } else {
        await SQLManager.Preferences.create({
            Key: key,
            Value: value,
        });
        return true;
    }
}

async function GetPreference(key) {
    const preference = await SQLManager.Preferences.findOne({
        where: { Key: key },
    });
    if (preference) {
        return preference.Value;
    } else {
        return null;
    }
}

async function GetBotChannels() {
    const botChannels = await SQLManager.BotChannels.findAll();
    if (botChannels) {
        return botChannels.map((channel) => channel.ChannelID);
    } else {
        return null;
    }
}

async function AddBotChannel(channel) {
    const botChannel = await SQLManager.BotChannels.findOne({
        where: { ChannelID: channel },
    });
    if (botChannel) {
        return false;
    } else {
        await SQLManager.BotChannels.create({ ChannelID: channel });
        return true;
    }
}

async function RemoveBotChannel(channel) {
    const botChannel = await SQLManager.BotChannels.findOne({
        where: { ChannelID: channel },
    });
    if (botChannel) {
        await botChannel.destroy();
        return true;
    } else {
        return false;
    }
}

async function IsBotChannel(channel) {
    const botChannel = await SQLManager.BotChannels.findOne({
        where: { ChannelID: channel },
    });
    if (botChannel) {
        return true;
    } else {
        return false;
    }
}

async function AddLinkWhiteList(link) {
    const whitelist = await SQLManager.LinkWhitelist.findOne({
        where: { Link: link },
    });
    if (whitelist) {
        return false;
    } else {
        await SQLManager.LinkWhitelist.create({ Link: link });
        return true;
    }
}

async function RemoveLinkWhiteList(link) {
    const whitelist = await SQLManager.LinkWhitelist.findOne({
        where: { Link: link },
    });
    if (whitelist) {
        await whitelist.destroy();
        return true;
    } else {
        return false;
    }
}

async function GetLinkWhiteList() {
    const whitelist = await SQLManager.LinkWhitelist.findAll();
    if (whitelist) {
        return whitelist.map((w) => w.Link);
    } else {
        return null;
    }
}

async function AddPhraseBlackList(phrase) {
    const blacklist = await SQLManager.PhraseBlacklist.findOne({
        where: { Phrase: phrase },
    });
    if (blacklist) {
        return false;
    } else {
        await SQLManager.PhraseBlacklist.create({ Phrase: phrase });
        return true;
    }
}

async function RemovePhraseBlackList(phrase) {
    const blacklist = await SQLManager.PhraseBlacklist.findOne({
        where: { Phrase: phrase },
    });
    if (blacklist) {
        await blacklist.destroy();
        return true;
    } else {
        return false;
    }
}

async function GetPhraseBlackList() {
    const blacklist = await SQLManager.PhraseBlacklist.findAll();
    if (blacklist) {
        return blacklist.map((w) => w.Phrase);
    } else {
        return null;
    }
}

async function GenerateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; ++i) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function IsMemberFlagged(member) {
    const flaggedMember = await SQLManager.FlaggedMembers.findOne({
        where: {
            UserID: member.id,
        },
    });

    if (flaggedMember != null) {
        return true;
    } else {
        return false;
    }
}

async function SecondsToTimeString(seconds) {
    let result = '';
    const years = Math.floor(seconds / 31449600);
    if (years > 0) {
        result += `${years} years `;
        seconds -= years * 31449600;
    }
    const weeks = Math.floor(seconds / 604800);
    if (weeks > 0) {
        result += `${weeks} weeks `;
        seconds -= weeks * 604800;
    }
    const days = Math.floor(seconds / 86400);
    if (days > 0) {
        result += `${days} days `;
        seconds -= days * 86400;
    }
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) {
        result += `${hours} hours `;
        seconds -= hours * 3600;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
        result += `${minutes} minutes `;
        seconds -= minutes * 60;
    }
    if (seconds > 0) {
        result += `${seconds} seconds `;
    }
    return result;
}

async function SendModerationNotification(title, content, client = null) {
    const push = new Pushover({ token: await GetPreference('app-token'), user: await GetPreference('user-token') });
    push.send(title, content);

    const embed = {
        title: title,
        description: content,
        color: 0x00ff00,
    };

    if (client != null) {
        const channel = await client.channels.fetch(await GetPreference('moderation-notification-channel'));
        const role = await GetPreference('moderation-notification-role');

        if (!channel) {
            return;
        }

        if (role) {
            channel.send({ content: '<@&' + role + '>', embeds: [embed] });
            return;
        }
        channel.send({ embeds: [embed] });
    }
}