const PermissionManager = require('./permissions_manager.js');
const SQLManager = require('./sql_manager.js');

module.exports = { EnsurePermissions, GetMember, SetPreference, GetPreference, GetBotChannels, AddBotChannel, RemoveBotChannel, IsBotChannel, AddLinkWhiteList, RemoveLinkWhiteList, GetLinkWhiteList, AddPhraseBlackList, RemovePhraseBlackList, GetPhraseBlackList };

async function EnsurePermissions(interaction, permission) {
    if (!await PermissionManager.hasPermission(interaction.member, permission)) {
        if (await PermissionManager.hasPermission(interaction.member, 'permission.view-missing')) {
            interaction.reply({ content: `You are require \`${permission}\` to run this command.`, ephemeral: true });
        }
        else {
            interaction.reply({ content: 'You don\'t have permission to run this command.', ephemeral: true });
        }
        return false;
    }
    return true;
}

async function GetMember(guild, id) {
    let result = null;
    await guild.members.fetch(id).then(member => {
        result = member;
    }).catch(() => {
        result = null;
    });

    if (result == null) {
        await guild.bans.fetch(id).then(ban => {
            result = ban;
        }).catch(() => {
            result = null;
        });
    }

    return result;
}

async function SetPreference(key, value) {
    const preference = await SQLManager.Preferences.findOne({ where: { Key: key } });
    if (preference) {
        await preference.update({ Value: value });
        return false;
    }
    else {
        await SQLManager.Preferences.create({ Key: key, Value: value });
        return true;
    }
}

async function GetPreference(key) {
    const preference = await SQLManager.Preferences.findOne({ where: { Key: key } });
    if (preference) {
        return preference.Value;
    }
    else {
        return null;
    }
}

async function GetBotChannels() {
    const botChannels = await SQLManager.BotChannels.findAll();
    if (botChannels) {
        return botChannels.map(channel => channel.ChannelID);
    }
    else {
        return null;
    }
}

async function AddBotChannel(channel) {
    const botChannel = await SQLManager.BotChannels.findOne({ where: { ChannelID: channel } });
    if (botChannel) {
        return false;
    }
    else {
        await SQLManager.BotChannels.create({ ChannelID: channel });
        return true;
    }
}

async function RemoveBotChannel(channel) {
    const botChannel = await SQLManager.BotChannels.findOne({ where: { ChannelID: channel } });
    if (botChannel) {
        await botChannel.destroy();
        return true;
    }
    else {
        return false;
    }
}

async function IsBotChannel(channel) {
    const botChannel = await SQLManager.BotChannels.findOne({ where: { ChannelID: channel } });
    if (botChannel) {
        return true;
    }
    else {
        return false;
    }
}

async function AddLinkWhiteList(link) {
    const whitelist = await SQLManager.LinkWhitelist.findOne({ where: { Link: link } });
    if (whitelist) {
        return false;
    }
    else {
        await SQLManager.LinkWhitelist.create({ Link: link });
        return true;
    }
}

async function RemoveLinkWhiteList(link) {
    const whitelist = await SQLManager.LinkWhitelist.findOne({ where: { Link: link } });
    if (whitelist) {
        await whitelist.destroy();
        return true;
    }
    else {
        return false;
    }
}

async function GetLinkWhiteList() {
    const whitelist = await SQLManager.LinkWhitelist.findAll();
    if (whitelist) {
        return whitelist.map(w => w.Link);
    }
    else {
        return null;
    }
}

async function AddPhraseBlackList(phrase) {
    const blacklist = await SQLManager.PhraseBlacklist.findOne({ where: { Phrase: phrase } });
    if (blacklist) {
        return false;
    }
    else {
        await SQLManager.PhraseBlacklist.create({ Phrase: phrase });
        return true;
    }
}

async function RemovePhraseBlackList(phrase) {
    const blacklist = await SQLManager.PhraseBlacklist.findOne({ where: { Phrase: phrase } });
    if (blacklist) {
        await blacklist.destroy();
        return true;
    }
    else {
        return false;
    }
}

async function GetPhraseBlackList() {
    const blacklist = await SQLManager.PhraseBlacklist.findAll();
    if (blacklist) {
        return blacklist.map(w => w.Phrase);
    }
    else {
        return null;
    }
}