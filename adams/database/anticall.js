const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AntiCallDB = database.define('anticall', {
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        defaultValue: 'Call me later 🙏',
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('reject', 'block'),
        defaultValue: 'reject',
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAntiCallDB() {
    try {
        await AntiCallDB.sync({ alter: true });
        console.log('AntiCall table ready');
    } catch (error) {
        console.error('Error initializing AntiCall table:', error);
        throw error;
    }
}

async function getAntiCallSettings() {
    try {
        const settings = await AntiCallDB.findOne();
        if (!settings) {
            await AntiCallDB.create({});
        }
        const dbSettings = settings || await AntiCallDB.findOne();
        
        const envStatus = process.env.ANTI_CALL;
        const envAction = process.env.ANTI_CALL_ACTION;
        const envMessage = process.env.ANTI_CALL_MSG;
        
        let status = dbSettings?.status ?? true;
        if (envStatus !== undefined) {
            status = envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true';
        }
        
        let action = dbSettings?.action || 'reject';
        if (envAction !== undefined) {
            const val = envAction.toLowerCase();
            if (val === 'reject' || val === 'block') action = val;
        }
        
        return {
            status,
            message: envMessage || dbSettings?.message || 'Call me later 🙏',
            action
        };
    } catch (error) {
        console.error('Error getting anti-call settings:', error);
        const envStatus = process.env.ANTI_CALL;
        const envAction = process.env.ANTI_CALL_ACTION;
        const envMessage = process.env.ANTI_CALL_MSG;
        return { 
            status: envStatus ? (envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true') : true, 
            message: envMessage || 'Call me later 🙏', 
            action: envAction && ['reject', 'block'].includes(envAction.toLowerCase()) ? envAction.toLowerCase() : 'reject' 
        };
    }
}

async function updateAntiCallSettings(updates) {
    try {
        let settings = await AntiCallDB.findOne();
        if (!settings) {
            settings = await AntiCallDB.create({});
        }
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating anti-call settings:', error);
        return null;
    }
}

module.exports = {
    initAntiCallDB,
    getAntiCallSettings,
    updateAntiCallSettings,
    AntiCallDB
};
