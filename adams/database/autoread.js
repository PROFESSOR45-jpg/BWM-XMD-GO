const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AutoReadDB = database.define('autoread', {
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    chatTypes: {
        type: DataTypes.JSON,
        defaultValue: ['private', 'group'],
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAutoReadDB() {
    try {
        await AutoReadDB.sync({ alter: true });
        console.log('AutoRead table ready');
    } catch (error) {
        console.error('Error initializing AutoRead table:', error);
        throw error;
    }
}

async function getAutoReadSettings() {
    try {
        const settings = await AutoReadDB.findOne();
        if (!settings) {
            await AutoReadDB.create({});
        }
        const dbSettings = settings || await AutoReadDB.findOne();
        
        const envStatus = process.env.AUTO_READ;
        let status = dbSettings?.status ?? false;
        if (envStatus !== undefined) {
            status = envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true';
        }
        
        return {
            status,
            chatTypes: dbSettings?.chatTypes || ['private', 'group']
        };
    } catch (error) {
        console.error('Error getting auto-read settings:', error);
        const envStatus = process.env.AUTO_READ;
        return { 
            status: envStatus ? (envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true') : false, 
            chatTypes: ['private', 'group'] 
        };
    }
}

async function updateAutoReadSettings(updates) {
    try {
        const settings = await getAutoReadSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating auto-read settings:', error);
        return null;
    }
}

module.exports = {
    initAutoReadDB,
    getAutoReadSettings,
    updateAutoReadSettings,
    AutoReadDB
};