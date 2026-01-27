const { DataTypes } = require('sequelize');
const { database } = require('../../config'); 

const SettingsDB = database.define('settings', {
    prefix: {
        type: DataTypes.STRING,
        defaultValue: ".",
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        defaultValue: "Ibrahimadams",
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        defaultValue: "./adams/public/bot-image.jpg",
        allowNull: false
    },
    gurl: {
        type: DataTypes.STRING,
        defaultValue: "https://github.com/Bwmxmd254/BWM-XMD-GO",
        allowNull: false
    },
    timezone: {
        type: DataTypes.STRING,
        defaultValue: "Africa/Nairobi",
        allowNull: false
    },
    botname: {
        type: DataTypes.STRING,
        defaultValue: "BWM-XMD",
        allowNull: false
    },
    packname: {
        type: DataTypes.STRING,
        defaultValue: "BWM-XMD",
        allowNull: false
    },
    mode: {
        type: DataTypes.STRING,
        defaultValue: "public",
        allowNull: false
    },
    sessionName: {
        type: DataTypes.STRING,
        defaultValue: "BWM-XMD",
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'bot_settings'
});

async function initSettingsDB() {
    try {
        await SettingsDB.sync({ alter: true });
        console.log('Settings table ready');
    } catch (error) {
        console.error('Error initializing Settings table:', error);
        throw error;
    }
}

async function getSettings() {
    try {
        let settings = await SettingsDB.findOne();
        if (!settings) {
            settings = await SettingsDB.create({});
        }
        
        const dbSettings = settings.toJSON();
        
        return {
            prefix: process.env.PREFIX || dbSettings.prefix,
            author: process.env.AUTHOR || dbSettings.author,
            url: process.env.BOT_URL || dbSettings.url,
            gurl: process.env.GURL || dbSettings.gurl,
            timezone: process.env.TIMEZONE || dbSettings.timezone,
            botname: process.env.BOT_NAME || dbSettings.botname,
            packname: process.env.PACKNAME || dbSettings.packname,
            mode: process.env.MODE || dbSettings.mode,
            sessionName: process.env.SESSION_NAME || dbSettings.sessionName
        };
    } catch (error) {
        console.error('Error getting settings:', error);
        return {
            prefix: process.env.PREFIX || ".",
            author: process.env.AUTHOR || "Ibrahimadams",
            url: process.env.BOT_URL || "./adams/public/bot-image.jpg",
            gurl: process.env.GURL || "https://github.com/Bwmxmd254/BWM-XMD-GO",
            timezone: process.env.TIMEZONE || "Africa/Nairobi",
            botname: process.env.BOT_NAME || "BWM-XMD",
            packname: process.env.PACKNAME || "BWM-XMD",
            mode: process.env.MODE || "public",
            sessionName: process.env.SESSION_NAME || "BWM-XMD"
        };
    }
}

async function updateSettings(updates) {
    try {
        let settings = await SettingsDB.findOne();
        if (!settings) {
            settings = await SettingsDB.create({});
        }
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating settings:', error);
        return null;
    }
}

async function getSetting(key) {
    try {
        const settings = await getSettings();
        return settings[key];
    } catch (error) {
        console.error(`Error getting setting ${key}:`, error);
        return null;
    }
}

module.exports = {
    initSettingsDB,
    getSettings,
    updateSettings,
    getSetting,
    SettingsDB
};
