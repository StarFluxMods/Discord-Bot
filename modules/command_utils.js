const PermissionManager = require('./permissions_manager.js');
const SQLManager = require('./sql_manager.js');

module.exports = { EnsurePermissions, GetMember, SetPreference, GetPreference };

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