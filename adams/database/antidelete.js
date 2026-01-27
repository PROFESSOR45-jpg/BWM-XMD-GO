const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AntiDeleteDB = database.define('antidelete', {
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    notification: {
        type: DataTypes.STRING,
        defaultValue: '🗑️ *BWM-XMD AntiDelete*',
        allowNull: false
    },
    includeGroupInfo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    sendToOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    includeMedia: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAntiDeleteDB() {
    try {
        await AntiDeleteDB.sync({ alter: true });
        console.log('AntiDelete table ready');
    } catch (error) {
        console.error('Error initializing AntiDelete table:', error);
        throw error;
    }
}

async function getAntiDeleteSettings() {
    try {
        const settings = await AntiDeleteDB.findOne();
        if (!settings) {
            await AntiDeleteDB.create({});
        }
        const dbSettings = settings || await AntiDeleteDB.findOne();
        
        const envStatus = process.env.ANTI_DELETE;
        let status = dbSettings?.status ?? true;
        if (envStatus !== undefined) {
            status = envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true';
        }
        
        return {
            status,
            notification: dbSettings?.notification || '🗑️ *BWM-XMD AntiDelete*',
            includeGroupInfo: dbSettings?.includeGroupInfo ?? true,
            sendToOwner: dbSettings?.sendToOwner ?? true,
            includeMedia: dbSettings?.includeMedia ?? true
        };
    } catch (error) {
        console.error('Error getting anti-delete settings:', error);
        const envStatus = process.env.ANTI_DELETE;
        return { 
            status: envStatus ? (envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true') : true, 
            notification: '🗑️ *BWM-XMD AntiDelete*',
            includeGroupInfo: true,
            sendToOwner: true,
            includeMedia: true
        };
    }
}

async function updateAntiDeleteSettings(updates) {
    try {
        const settings = await getAntiDeleteSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating anti-delete settings:', error);
        return null;
    }
}

module.exports = {
    initAntiDeleteDB,
    getAntiDeleteSettings,
    updateAntiDeleteSettings,
    AntiDeleteDB
};
