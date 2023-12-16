const Sequelize = require('sequelize');
const fs = require('node:fs');

let storage = '/data/config/database.sqlite';

if (fs.existsSync('./.debug')) {
    storage = './config/database.sqlite';
}

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: storage,
});

module.exports = {
    Preferences: sequelize.define('preferences', {
        Key: {
            type: Sequelize.STRING,
        },
        Value: {
            type: Sequelize.STRING,
        },
    }),
    Permissions: sequelize.define('permissions', {
        RoleID: {
            type: Sequelize.STRING,
        },
        Permission: {
            type: Sequelize.STRING,
        },
    }),
    UserPermissions: sequelize.define('individual-permissions', {
        UserID: {
            type: Sequelize.STRING,
        },
        Permission: {
            type: Sequelize.STRING,
        },
    }),
    BotChannels: sequelize.define('bot-channels', {
        ChannelID: {
            type: Sequelize.STRING,
        },
    }),
    FlaggedMembers: sequelize.define('flagged-members', {
        UserID: {
            type: Sequelize.STRING,
        },
    }),
    LinkWhitelist: sequelize.define('link-whitelist', {
        Link: {
            type: Sequelize.STRING,
        },
    }),
    PhraseBlacklist: sequelize.define('phrase-blacklist', {
        Phrase: {
            type: Sequelize.STRING,
        },
    }),
    PunishmentHistory: sequelize.define('punishment-history', {
        InfractionID: {
            type: Sequelize.STRING,
        },
        Hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        Member: {
            type: Sequelize.STRING,
        },
        Punisher: {
            type: Sequelize.STRING,
        },
        Type: {
            type: Sequelize.STRING,
        },
        Reason: {
            type: Sequelize.STRING,
        },
        Date: {
            type: Sequelize.STRING,
        },
    }),
    Bans: sequelize.define('punishment-bans', {
        InfractionID: {
            type: Sequelize.STRING,
        },
        Hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        Member: {
            type: Sequelize.STRING,
        },
        Time: {
            type: Sequelize.NUMBER,
        },
        Reason: {
            type: Sequelize.STRING,
        },
        Length: {
            type: Sequelize.NUMBER,
        },
        Punisher: {
            type: Sequelize.STRING,
        },
        Remover: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        RemovalReason: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        Active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    }),
    Mutes: sequelize.define('punishment-mutes', {
        InfractionID: {
            type: Sequelize.STRING,
        },
        Hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        Member: {
            type: Sequelize.STRING,
        },
        Time: {
            type: Sequelize.NUMBER,
        },
        Reason: {
            type: Sequelize.STRING,
        },
        Length: {
            type: Sequelize.NUMBER,
        },
        Punisher: {
            type: Sequelize.STRING,
        },
        Remover: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        RemovalReason: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        Active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    }),
    Kicks: sequelize.define('punishment-kicks', {
        InfractionID: {
            type: Sequelize.STRING,
        },
        Hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        Member: {
            type: Sequelize.STRING,
        },
        Time: {
            type: Sequelize.NUMBER,
        },
        Reason: {
            type: Sequelize.STRING,
        },
        Punisher: {
            type: Sequelize.STRING,
        },
    }),
    Warnings: sequelize.define('punishment-warnings', {
        InfractionID: {
            type: Sequelize.STRING,
        },
        Hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        Member: {
            type: Sequelize.STRING,
        },
        Time: {
            type: Sequelize.NUMBER,
        },
        Reason: {
            type: Sequelize.STRING,
        },
        Punisher: {
            type: Sequelize.STRING,
        },
    }),
    InfractionRemoval: sequelize.define('punishment-removal', {
        InfractionID: {
            type: Sequelize.STRING,
        },
        Punisher: {
            type: Sequelize.STRING,
        },
        Time: {
            type: Sequelize.NUMBER,
        },
        Reason: {
            type: Sequelize.STRING,
        },
    }),
    Levels: sequelize.define('user-levels', {
        Member: {
            type: Sequelize.STRING,
        },
        MuteAnnouncements: {
            type: Sequelize.BOOLEAN,
        },
        EXP: {
            type: Sequelize.NUMBER,
        },
        Level: {
            type: Sequelize.NUMBER,
        },
        TimeOfLastAward: {
            type: Sequelize.NUMBER,
        },
    }),
    DoNotFlagAsDeletable: sequelize.define('do-not-flag-as-deletable', {
        MessageID: {
            type: Sequelize.STRING,
        },
    }),
};
