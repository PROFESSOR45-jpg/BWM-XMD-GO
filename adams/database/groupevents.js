const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const GroupEventsDB = database.define('groupevents', {
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    welcomeMessage: {
        type: DataTypes.TEXT,
        defaultValue: "Hey @user 👋\nWelcome to *{group}*.\nYou're member #{count}.\nTime: *{time}*\nDescription: {desc}",
        allowNull: false
    },
    goodbyeMessage: {
        type: DataTypes.TEXT,
        defaultValue: "Goodbye @user 😔\nLeft at: *{time}*\nMembers left: {count}",
        allowNull: false
    },
    showPromotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initGroupEventsDB() {
    try {
        await GroupEventsDB.sync({ alter: true });
        console.log('GroupEvents table ready');
    } catch (error) {
        console.error('Error initializing GroupEvents table:', error);
        throw error;
    }
}

async function getGroupEventsSettings() {
    try {
        const settings = await GroupEventsDB.findOne();
        if (!settings) {
            await GroupEventsDB.create({});
        }
        const dbSettings = settings || await GroupEventsDB.findOne();
        
        const envEnabled = process.env.WELCOME_GOODBYE;
        const envWelcome = process.env.WELCOME_MSG;
        const envGoodbye = process.env.GOODBYE_MSG;
        const envPromotions = process.env.SHOW_PROMOTIONS;
        
        let enabled = dbSettings?.enabled ?? false;
        if (envEnabled !== undefined) {
            enabled = envEnabled.toLowerCase() === 'on' || envEnabled.toLowerCase() === 'true';
        }
        
        return {
            enabled,
            welcomeMessage: envWelcome || dbSettings?.welcomeMessage || "Hey @user 👋\nWelcome to *{group}*.\nYou're member #{count}.\nTime: *{time}*\nDescription: {desc}",
            goodbyeMessage: envGoodbye || dbSettings?.goodbyeMessage || "Goodbye @user 😔\nLeft at: *{time}*\nMembers left: {count}",
            showPromotions: envPromotions !== undefined ? (envPromotions.toLowerCase() === 'on' || envPromotions.toLowerCase() === 'true') : (dbSettings?.showPromotions ?? true)
        };
    } catch (error) {
        console.error('Error getting group events settings:', error);
        const envEnabled = process.env.WELCOME_GOODBYE;
        const envWelcome = process.env.WELCOME_MSG;
        const envGoodbye = process.env.GOODBYE_MSG;
        return { 
            enabled: envEnabled ? (envEnabled.toLowerCase() === 'on' || envEnabled.toLowerCase() === 'true') : false,
            welcomeMessage: envWelcome || "Welcome @user to {group}!",
            goodbyeMessage: envGoodbye || "Goodbye @user!",
            showPromotions: true
        };
    }
}

async function updateGroupEventsSettings(updates) {
    try {
        let settings = await GroupEventsDB.findOne();
        if (!settings) {
            settings = await GroupEventsDB.create({});
        }
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating group events settings:', error);
        return null;
    }
}

module.exports = {
    initGroupEventsDB,
    getGroupEventsSettings,
    updateGroupEventsSettings,
    GroupEventsDB
};