const fs = require('node:fs');

let configDirectory = '/data/config';
let authDirectory = '/data/config/auth.json';

if (fs.existsSync('./.debug')) {
    configDirectory = './config';
    authDirectory = './config/auth.json';
}

if (!fs.existsSync(configDirectory)) {
	fs.mkdirSync(configDirectory);
}

if (!fs.existsSync(authDirectory)) {
    fs.copyFileSync('./config/auth.json.example', authDirectory);
}

const data = fs.readFileSync(authDirectory);
const json = JSON.parse(data);

if (json['token'] === '' || json['clientId'] === '' || json['guildId'] === '') {
	console.log('Please set your bot token, client ID, and guild ID in /data/config/auth.json');
	process.exit(1);
}

module.exports = {
    clientId: json['clientId'],
    guildId: json['guildId'],
    token: json['token'],
};