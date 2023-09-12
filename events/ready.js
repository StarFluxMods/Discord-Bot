const Authentication = require('../modules/ensureauth.js');
const { Events } = require('discord.js');
const SQLManager = require('../modules/sql_manager.js');
const { Op } = require('sequelize');
const PunishmentManager = require('../modules/punishment_manager.js');
const CommandUtils = require('../modules/command_utils.js');

const version = '0.1.7';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        // Initialize the SQLManager
        SQLManager.Preferences.sync();
        SQLManager.Permissions.sync();
        SQLManager.UserPermissions.sync();
        SQLManager.PunishmentHistory.sync();
        SQLManager.Bans.sync();
        SQLManager.Mutes.sync();
        SQLManager.Kicks.sync();
        SQLManager.Warnings.sync();
        SQLManager.InfractionRemoval.sync();
        SQLManager.BotChannels.sync();
        SQLManager.LinkWhitelist.sync();
        SQLManager.PhraseBlacklist.sync();
        SQLManager.Levels.sync();

        ForceStatisticsChannels(client);

        CheckForExpiredBans(client);
        CheckForExpiredMutes(client);
        StatisticChannels(client);

        client.guilds.cache
            .get(Authentication.guildId)
            .members.fetch(Authentication.clientId)
            .then(async (member) => {
                member.setNickname('LLama (Beta) v' + version);
            });
    },
};

async function CheckForExpiredBans(client) {
    setTimeout(() => {
        SQLManager.Bans.findAll({
            where: {
                Active: {
                    [Op.eq]: true,
                },
                Length: {
                    [Op.ne]: 0,
                },
            },
        }).then((res) => {
            res.forEach(async (element) => {
                const now = Math.floor(Date.now() / 1000);
                if (element.Time + element.Length <= now) {
                    const member = await CommandUtils.GetMember(client.guilds.cache.get(Authentication.guildId), element.Member);
                    await PunishmentManager.unban(client.guilds.cache.get(Authentication.guildId), member, client.user, 'Ban Expired');
                }
            });
        });
        CheckForExpiredBans(client);
    }, 2000);
}

async function CheckForExpiredMutes(client) {
    setTimeout(() => {
        SQLManager.Mutes.findAll({
            where: {
                Active: {
                    [Op.eq]: true,
                },
                Length: {
                    [Op.ne]: 0,
                },
            },
        }).then((res) => {
            res.forEach(async (element) => {
                const now = Math.floor(Date.now() / 1000);
                if (element.Time + element.Length <= now) {
                    const member = await CommandUtils.GetMember(client.guilds.cache.get(Authentication.guildId), element.Member);
                    await PunishmentManager.unmute(member, client.user, 'Mute Expired', await CommandUtils.GetPreference('mute-role'));
                }
            });
        });
        CheckForExpiredMutes(client);
    }, 2000);
}

async function StatisticChannels(client) {
    setTimeout(async () => {
        const guild = client.guilds.cache.get(Authentication.guildId);
        const memberCount = guild.memberCount;
        const oldMemberCount = await CommandUtils.GetPreference('old-member-count');
        const lastDifferenceCheck = await CommandUtils.GetPreference('last-difference-check');
        const difference = memberCount - oldMemberCount;

        const memberCountChannel = guild.channels.cache.get(await CommandUtils.GetPreference('member-count-channel'));
        const memberDifference = guild.channels.cache.get(await CommandUtils.GetPreference('member-difference-channel'));

        if (memberDifference) {
            if (Math.floor(Date.now() / 1000) - lastDifferenceCheck >= 86400) {
                memberDifference.setName(`Difference: ${difference}`);
                await CommandUtils.SetPreference('last-difference-check', Math.floor(Date.now() / 1000));
                await CommandUtils.SetPreference('old-member-count', memberCount);
            }
        }

        if (memberCountChannel) {
            memberCountChannel.setName(`Members: ${memberCount}`);
        }
        StatisticChannels(client);
    }, 300000);
}

async function ForceStatisticsChannels(client) {
    const guild = client.guilds.cache.get(Authentication.guildId);
    const memberCount = guild.memberCount;
    const oldMemberCount = await CommandUtils.GetPreference('old-member-count');
    const lastDifferenceCheck = await CommandUtils.GetPreference('last-difference-check');
    const difference = memberCount - oldMemberCount;

    const memberCountChannel = guild.channels.cache.get(await CommandUtils.GetPreference('member-count-channel'));
    const memberDifference = guild.channels.cache.get(await CommandUtils.GetPreference('member-difference-channel'));

    if (memberDifference) {
        if (Math.floor(Date.now() / 1000) - lastDifferenceCheck >= 86400) {
            memberDifference.setName(`Difference: ${difference}`);
            await CommandUtils.SetPreference('last-difference-check', Math.floor(Date.now() / 1000));
            await CommandUtils.SetPreference('old-member-count', memberCount);
        }
    }

    if (memberCountChannel) {
        memberCountChannel.setName(`Members: ${memberCount}`);
    }
}