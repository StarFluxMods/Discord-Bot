const { EmbedBuilder } = require('discord.js');
const CommandUtils = require('./command_utils.js');

module.exports = { CreateEditLog, SendEmbed, SendMessage, CreateDeleteLog, CreateModDeleteLog, CreateJoinLog, CreateLeaveLog };

async function SendEmbed(client, channel, embed) {
    const _channel = await CommandUtils.GetPreference(channel);

    if (_channel == null) {
        console.log('Preference ' + channel + ' has not been set.');
        return false;
    }

    const _channelObj = await client.channels.fetch(_channel);

    if (_channelObj == null) {
        console.log('Channel ' + _channel + ' does not exist.');
        return false;
    }

    await _channelObj.send({ embeds: [embed] });
}

async function SendMessage(client, channel, message) {
    const _channel = await CommandUtils.GetPreference(channel);

    if (_channel == null) {
        console.log('Preference ' + channel + ' has not been set.');
        return false;
    }

    const _channelObj = await client.channels.fetch(_channel);

    if (_channelObj == null) {
        console.log('Channel ' + _channel + ' does not exist.');
        return false;
    }

    await _channelObj.send({ content: message });
}

async function CreateEditLog(oldmessage, newmessage, user) {
    const embed = new EmbedBuilder()
    .setTitle('[EDIT] ' + user.username)
    .setURL(newmessage.url)
    .addFields(
        {
            name: 'Old Message',
            value: oldmessage.content,
            inline: false,
        },
        {
            name: 'New Message',
            value: newmessage.content,
            inline: false,
        },
    )
    .setThumbnail(await user.avatarURL())
    .setColor('#00b0f4')
    .setFooter({
        text: 'Llama',
    })
    .setTimestamp();

    return embed;
}

async function CreateDeleteLog(message, user) {
    const embed = new EmbedBuilder()
    .setTitle('[DELETE] ' + user.username)
    .addFields(
        {
            name: 'Deleted Message',
            value: message.content,
            inline: false,
        },
    )
    .setThumbnail(await user.avatarURL())
    .setColor('#ff0000')
    .setFooter({
        text: 'Llama',
    })
    .setTimestamp();

    return embed;
}

async function CreateModDeleteLog(message, phrase, user) {
    const embed = new EmbedBuilder()
    .setTitle('[DELETE] ' + user.username)
    .addFields(
        {
            name: 'Deleted Message',
            value: message.content,
            inline: false,
        },
        {
            name: 'Blacklisted Reason',
            value: phrase,
            inline: false,
        },
    )
    .setThumbnail(await user.avatarURL())
    .setColor('#ff0000')
    .setFooter({
        text: 'Llama',
    })
    .setTimestamp();

    return embed;
}

async function CreateJoinLog(member) {
    const embed = new EmbedBuilder()
    .setTitle('[JOIN] ' + member.user.username)
    .setThumbnail(await member.user.avatarURL())
    .setColor('#00ff00')
    .setFooter({
        text: 'Llama',
    })
    .setTimestamp();

    return embed;
}

async function CreateLeaveLog(member) {
    const embed = new EmbedBuilder()
    .setTitle('[LEAVE] ' + member.user.username)
    .setThumbnail(await member.user.avatarURL())
    .setColor('#ff0000')
    .setFooter({
        text: 'Llama',
    })
    .setTimestamp();

    return embed;
}