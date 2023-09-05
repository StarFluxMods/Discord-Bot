const SQLManager = require('./sql_manager.js');
const CommandUtils = require('./command_utils.js');

module.exports = {
    GetUserLevel: GetUserLevel,
    SetUserLevel: SetUserLevel,
    GetUserXP: GetUserXP,
    SetUserXP: SetUserXP,
    AddUserXP: AddUserXP,
    RemoveUserXP: RemoveUserXP,
    LevelToXP: LevelToXP,
    XPToNextLevel: XPToNextLevel,
    CheckUserLevelChange: CheckUserLevelChange,
    AnnounceLevelUp: AnnounceLevelUp,
    EnsureUser: EnsureUser,
    AwardMemberEXP: AwardMemberEXP,
    GetLevelProgressPercent: GetLevelProgressPercent,
};

async function EnsureUser(Member) {
    if (!Member) {
        return false;
    }
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        await SQLManager.Levels.create({
            Member: Member.id,
            Level: 0,
            EXP: 0,
        });
    }
}

async function AwardMemberEXP(Member, XP, cooldown, BypassCooldown = false) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }

    const time = Math.floor(Date.now() / 1000);
    const lastAward = await User.TimeOfLastAward;

    if (!cooldown) {
        cooldown = 60;
    }
    if (time - lastAward < cooldown && !BypassCooldown) {
        return false;
    }

    await User.update({ EXP: User.EXP + XP, TimeOfLastAward: time });
    await CheckUserLevelChange(Member, true);
    return true;
}

async function AnnounceLevelUp(Member) {
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }

    const ChannelID = await CommandUtils.GetPreference('level-up-channel');
    const Channel = await Member.client.channels.fetch(ChannelID);

    if (Channel) {
        if (User.MuteAnnouncements) {
            Channel.send(`GG ${Member.displayName}, you just advanced to level ${User.Level}!`);
        } else {
            Channel.send(`GG ${Member}, you just advanced to level ${User.Level}!`);
        }
    }
    return true;
}

async function CheckUserLevelChange(Member, Announce = false) {
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }
    const Level = await User.Level;
    const EXP = await User.EXP;
    const NextLevel = await LevelToXP(Level + 1);
    if (EXP >= NextLevel) {
        await User.update({ Level: Level + 1 });
        if (Announce) {
            await AnnounceLevelUp(Member);
        }
        await CheckUserLevelChange(Member, Announce);
    }
    return true;
}

async function GetUserLevel(Member) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return 0;
    }
    return User.Level;
}

async function SetUserLevel(Member, Level) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }
    await User.update({ Level: Level });
    return true;
}

async function GetUserXP(Member) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return 0;
    }
    return User.EXP;
}

async function SetUserXP(Member, XP) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }
    await User.update({ EXP: XP });
    return true;
}

async function AddUserXP(Member, XP) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }
    await User.update({ EXP: User.EXP + XP });
    return true;
}

async function RemoveUserXP(Member, XP) {
    await EnsureUser(Member);
    const User = await SQLManager.Levels.findOne({
        where: { Member: Member.id },
    });
    if (!User) {
        return false;
    }
    await User.update({ EXP: User.EXP - XP });
    return true;
}

async function LevelToXP(Level) {
    return (5 / 6) * Level * (2 * Level * Level + 27 * Level + 91);
}

async function XPToNextLevel(Member) {
    await EnsureUser(Member);
    const Level = await GetUserLevel(Member);
    const XP = await GetUserXP(Member);
    const NextLevel = await LevelToXP(Level + 1);
    return NextLevel - XP;
}

async function GetLevelProgressPercent(Member) {
    await EnsureUser(Member);
    const Level = await GetUserLevel(Member);
    const NextLevel = await LevelToXP(Level + 1);
    const ThisLevel = await LevelToXP(Level);
    const XP = await GetUserXP(Member);
    return Math.floor(((XP - ThisLevel) / (NextLevel - ThisLevel)) * 100);
}
