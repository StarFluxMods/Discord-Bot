const SQLManager = require('./sql_manager.js');

module.exports = { addPermission, removePermission, getPermissions, getRoles, hasPermission, getRole, setupMasterPermission, hasPermissionLike };

async function addPermission(role, permission) {
    if (permission === '*') {
        return false;
    }
    const existingPermission = await SQLManager.Permissions.findOne({ where: { RoleID: role, Permission: permission } });
    if (existingPermission) {
        return false;
    }
    await SQLManager.Permissions.create({ RoleID: role, Permission: permission });
    return true;
}

async function removePermission(role, permission) {
    if (permission === '*') {
        return false;
    }
    const existingPermission = await SQLManager.Permissions.findOne({ where: { RoleID: role, Permission: permission } });
    if (!existingPermission) {
        return false;
    }
    await existingPermission.destroy();
    return true;
}

async function getPermissions(role) {
    const permissions = await SQLManager.Permissions.findAll({ where: { RoleID: role } });
    return permissions.map(permission => permission.Permission);
}

async function getRoles(member) {
    const roles = await member.roles.cache.map(role => role.id);
    return roles;
}

async function hasPermission(member, permission) {
    const roles = await getRoles(member);
    const permissions = await Promise.all(roles.map(role => getPermissions(role)));
    const flatPermissions = permissions.flat();
    return flatPermissions.includes(permission) || flatPermissions.includes('*');
}

async function getRole(permission) {
    const permissions = await SQLManager.Permissions.findAll({ where: { Permission: permission } });
    return permissions.map(_permission => _permission.RoleID);
}

async function setupMasterPermission(role) {
    const existingPermission = await SQLManager.Permissions.findOne({ where: { RoleID: role, Permission: '*' } });
    if (!existingPermission) {
        await SQLManager.Permissions.create({ RoleID: role, Permission: '*' });
    }
}

async function hasPermissionLike(member, permission) {
    const roles = await getRoles(member);
    const permissions = await Promise.all(roles.map(role => getPermissions(role)));
    const flatPermissions = permissions.flat();

    flatPermissions.forEach(_permission => {
        if (_permission.includes(permission)) {
            return _permission;
        }
    });
    return false;
}