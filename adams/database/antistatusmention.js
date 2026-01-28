const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AntiStatusMentionDB = database.define('antistatusmention', {
    status: {
        type: DataTypes.ENUM('off', 'warn', 'delete', 'remove'),
        defaultValue: 'warn',
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
const statusWarnCounts = new Map();

async function initAntiStatusMentionDB() {
    try {
        await AntiStatusMentionDB.sync({ alter: true });
        console.log('AntiStatusMention table ready');
    } catch (error) {
        console.error('Error initializing AntiStatusMention table:', error);
        throw error;
    }
}

async function getAntiStatusMentionSettings() {
    try {
        const [settings] = await AntiStatusMentionDB.findOrCreate({
            where: {},
            defaults: {}
        });
        
        const envStatus = process.env.ANTI_TAG;
        const envWarnLimit = process.env.WARN_LIMIT;
        
        let status = settings?.status || 'off';
        let warn_limit = settings?.warn_limit || 3;
        
        if (envStatus !== undefined) {
            const val = envStatus.toLowerCase();
            if (val === 'on' || val === 'true' || val === 'warn') status = 'warn';
            else if (val === 'delete') status = 'delete';
            else if (val === 'remove') status = 'remove';
            else status = 'off';
        }
        if (envWarnLimit !== undefined) {
            const limit = parseInt(envWarnLimit);
            if (!isNaN(limit) && limit > 0) warn_limit = limit;
        }
        
        return {
            status,
            action: settings?.action || 'warn',
            warn_limit
        };
    } catch (error) {
        console.error('Error getting anti-status-mention settings:', error);
        const envStatus = process.env.ANTI_TAG;
        const envWarnLimit = process.env.WARN_LIMIT;
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
            warn_limit: envWarnLimit ? parseInt(envWarnLimit) || 3 : 3
        };
    }
}

async function updateAntiStatusMentionSettings(updates) {
    try {
        const [settings] = await AntiStatusMentionDB.findOrCreate({
            where: {},
            defaults: {}
        });
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating anti-status-mention settings:', error);
        return null;
    }
}

function getStatusWarnCount(userJid) {
    return statusWarnCounts.get(userJid) || 0;
}

function incrementStatusWarnCount(userJid) {
    const current = getStatusWarnCount(userJid);
    statusWarnCounts.set(userJid, current + 1);
    return current + 1;
}

function resetStatusWarnCount(userJid) {
    statusWarnCounts.delete(userJid);
}

function clearAllStatusWarns() {
    statusWarnCounts.clear();
}

module.exports = {
    initAntiStatusMentionDB,
    getAntiStatusMentionSettings,
    updateAntiStatusMentionSettings,
    getStatusWarnCount,
    incrementStatusWarnCount,
    resetStatusWarnCount,
    clearAllStatusWarns,
    AntiStatusMentionDB
};
