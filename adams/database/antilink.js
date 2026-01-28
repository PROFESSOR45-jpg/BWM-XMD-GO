const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AntiLinkDB = database.define('antilink', {
    status: {
        type: DataTypes.ENUM('off', 'warn', 'delete', 'remove'),
        defaultValue: 'off',
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('warn', 'delete', 'remove'),
        defaultValue: 'warn',
        allowNull: false
    },
    warn_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        allowNull: false
    }
}, {
    timestamps: true
});

// Store warn counts in memory
const warnCounts = new Map();

async function initAntiLinkDB() {
    try {
        await AntiLinkDB.sync({ alter: true });
        console.log('AntiLink table ready');
    } catch (error) {
        console.error('Error initializing AntiLink table:', error);
        throw error;
    }
}

async function getAntiLinkSettings() {
    try {
        const [settings] = await AntiLinkDB.findOrCreate({
            where: {},
            defaults: {}
        });
        
        const envStatus = process.env.ANTI_LINK;
        let status = settings?.status || 'off';
        if (envStatus !== undefined) {
            const val = envStatus.toLowerCase();
            if (val === 'on' || val === 'true' || val === 'warn') status = 'warn';
            else if (val === 'delete') status = 'delete';
            else if (val === 'remove') status = 'remove';
            else status = 'off';
        }
        
        return {
            status,
            action: settings?.action || 'warn',
            warn_limit: settings?.warn_limit || 3
        };
    } catch (error) {
        console.error('Error getting antilink settings:', error);
        const envStatus = process.env.ANTI_LINK;
        let status = 'off';
        if (envStatus) {
            const val = envStatus.toLowerCase();
            if (val === 'on' || val === 'true' || val === 'warn') status = 'warn';
            else if (val === 'delete') status = 'delete';
            else if (val === 'remove') status = 'remove';
        }
        return { 
            status, 
            action: 'warn', 
            warn_limit: 3
        };
    }
}

async function updateAntiLinkSettings(updates) {
    try {
        const settings = await getAntiLinkSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating antilink settings:', error);
        return null;
    }
}

function getWarnCount(userJid) {
    return warnCounts.get(userJid) || 0;
}

function incrementWarnCount(userJid) {
    const current = getWarnCount(userJid);
    warnCounts.set(userJid, current + 1);
    return current + 1;
}

function resetWarnCount(userJid) {
    warnCounts.delete(userJid);
}

function clearAllWarns() {
    warnCounts.clear();
}

module.exports = {
    initAntiLinkDB,
    getAntiLinkSettings,
    updateAntiLinkSettings,
    getWarnCount,
    incrementWarnCount,
    resetWarnCount,
    clearAllWarns,
    AntiLinkDB
};
