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
    PunishmentHistory: sequelize.define('punishment-history', {
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

};