const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AutoBioDB = database.define('autobio', {
    status: {
        type: DataTypes.ENUM('on', 'off'),
        defaultValue: 'on',
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        defaultValue: 'BWM-XMD Always active!',
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAutoBioDB() {
    try {
        await AutoBioDB.sync({ alter: true });
        console.log('AutoBio table ready');
    } catch (error) {
        console.error('Error initializing AutoBio table:', error);
        throw error;
    }
}

async function getAutoBioSettings() {
    try {
        const [settings] = await AutoBioDB.findOrCreate({
            where: {},
            defaults: {}
        });
        
        const envStatus = process.env.AUTO_BIO;
        const envMessage = process.env.AUTO_BIO_MSG;
        
        let status = settings?.status || 'on';
        if (envStatus !== undefined) {
            status = (envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true') ? 'on' : 'off';
        }
        
        return {
            status,
            message: envMessage || settings?.message || 'BWM-XMD Always active!'
        };
    } catch (error) {
        console.error('Error getting AutoBio settings:', error);
        const envStatus = process.env.AUTO_BIO;
        const envMessage = process.env.AUTO_BIO_MSG;
        return { 
            status: envStatus ? ((envStatus.toLowerCase() === 'on' || envStatus.toLowerCase() === 'true') ? 'on' : 'off') : 'off', 
            message: envMessage || 'BWM-XMD Always active!' 
        };
    }
}

async function updateAutoBioSettings(updates) {
    try {
        const settings = await getAutoBioSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating AutoBio settings:', error);
        return null;
    }
}

module.exports = {
    initAutoBioDB,
    getAutoBioSettings,
    updateAutoBioSettings,
    AutoBioDB
};
