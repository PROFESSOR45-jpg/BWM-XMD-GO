const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const PresenceDB = database.define('presence', {
    privateChat: {
        type: DataTypes.STRING,
        defaultValue: 'off',
        allowNull: false,
        validate: {
            isIn: [['off', 'online', 'typing', 'recording']]
        }
    },
    groupChat: {
        type: DataTypes.STRING,
        defaultValue: 'off',
        allowNull: false,
        validate: {
            isIn: [['off', 'online', 'typing', 'recording']]
        }
    }
}, {
    timestamps: true
});

async function initPresenceDB() {
    try {
        await PresenceDB.sync({ alter: true });
        console.log('Presence table ready');
    } catch (error) {
        console.error('Error initializing Presence table:', error);
        throw error;
    }
}

async function getPresenceSettings() {
    try {
        let settings = await PresenceDB.findOne();
        if (!settings) {
            settings = await PresenceDB.create({});
        }
        
        const envPrivate = process.env.PRESENCE_PRIVATE;
        const envGroup = process.env.PRESENCE_GROUP;
        
        let privateChat = settings.privateChat || 'off';
        let groupChat = settings.groupChat || 'off';
        
        if (envPrivate !== undefined) {
            const val = envPrivate.toLowerCase();
            if (['off', 'online', 'typing', 'recording'].includes(val)) {
                privateChat = val;
            }
        }
        if (envGroup !== undefined) {
            const val = envGroup.toLowerCase();
            if (['off', 'online', 'typing', 'recording'].includes(val)) {
                groupChat = val;
            }
        }
        
        return { privateChat, groupChat };
    } catch (error) {
        console.error('Error getting presence settings:', error);
        const envPrivate = process.env.PRESENCE_PRIVATE;
        const envGroup = process.env.PRESENCE_GROUP;
        return { 
            privateChat: envPrivate && ['off', 'online', 'typing', 'recording'].includes(envPrivate.toLowerCase()) ? envPrivate.toLowerCase() : 'off', 
            groupChat: envGroup && ['off', 'online', 'typing', 'recording'].includes(envGroup.toLowerCase()) ? envGroup.toLowerCase() : 'off' 
        };
    }
}

async function updatePresenceSettings(updates) {
    try {
        let settings = await PresenceDB.findOne();
        if (!settings) {
            settings = await PresenceDB.create({});
        }
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating presence settings:', error);
        return null;
    }
}

module.exports = {
    initPresenceDB,
    getPresenceSettings,
    updatePresenceSettings,
    PresenceDB
};