const { DataTypes } = require('sequelize');
const { database } = require('../../config');

const AutoStatusDB = database.define('autostatus', {
  autoviewStatus: {
    type: DataTypes.STRING,
    defaultValue: 'true',
    allowNull: false,
    validate: { isIn: [['true', 'false']] }
  },
  autoLikeStatus: {
    type: DataTypes.STRING,
    defaultValue: 'false',
    allowNull: false,
    validate: { isIn: [['true', 'false']] }
  },
  autoReplyStatus: {
    type: DataTypes.STRING,
    defaultValue: 'false',
    allowNull: false,
    validate: { isIn: [['true', 'false']] }
  },
  statusReplyText: {
    type: DataTypes.TEXT,
    defaultValue: '✅ Status Viewed By BWM-XMD',
    allowNull: false
  },
  statusLikeEmojis: {
    type: DataTypes.TEXT,
    defaultValue: '💛,❤️,💜,🤍,💙',
    allowNull: false
  }
}, {
  timestamps: true
});

async function initAutoStatusDB() {
  try {
    await AutoStatusDB.sync({ alter: true });
    console.log('AutoStatus table ready');
  } catch (error) {
    console.error('Error initializing AutoStatus table:', error);
    throw error;
  }
}

async function getAutoStatusSettings() {
  try {
    const settings = await AutoStatusDB.findOne();
    if (!settings) await AutoStatusDB.create({});
    const dbSettings = settings || await AutoStatusDB.findOne();
    
    const envView = process.env.AUTO_STATUS_VIEW;
    const envLike = process.env.AUTO_STATUS_LIKE;
    const envReply = process.env.AUTO_STATUS_REPLY;
    
    let autoviewStatus = dbSettings?.autoviewStatus || 'true';
    let autoLikeStatus = dbSettings?.autoLikeStatus || 'false';
    let autoReplyStatus = dbSettings?.autoReplyStatus || 'false';
    
    if (envView !== undefined) {
      autoviewStatus = (envView.toLowerCase() === 'on' || envView.toLowerCase() === 'true') ? 'true' : 'false';
    }
    if (envLike !== undefined) {
      autoLikeStatus = (envLike.toLowerCase() === 'on' || envLike.toLowerCase() === 'true') ? 'true' : 'false';
    }
    if (envReply !== undefined) {
      autoReplyStatus = (envReply.toLowerCase() === 'on' || envReply.toLowerCase() === 'true') ? 'true' : 'false';
    }
    
    const envReplyText = process.env.STATUS_REPLY_MSG;
    const envLikeEmojis = process.env.STATUS_LIKE_EMOJIS;
    
    return {
      autoviewStatus,
      autoLikeStatus,
      autoReplyStatus,
      statusReplyText: envReplyText || dbSettings?.statusReplyText || '✅ Status Viewed By BWM-XMD',
      statusLikeEmojis: envLikeEmojis || dbSettings?.statusLikeEmojis || '💛,❤️,💜,🤍,💙'
    };
  } catch (error) {
    console.error('Error getting auto status settings:', error);
    const envView = process.env.AUTO_STATUS_VIEW;
    const envLike = process.env.AUTO_STATUS_LIKE;
    const envReply = process.env.AUTO_STATUS_REPLY;
    const envReplyText = process.env.STATUS_REPLY_MSG;
    const envLikeEmojis = process.env.STATUS_LIKE_EMOJIS;
    return {
      autoviewStatus: envView ? ((envView.toLowerCase() === 'on' || envView.toLowerCase() === 'true') ? 'true' : 'false') : 'true',
      autoLikeStatus: envLike ? ((envLike.toLowerCase() === 'on' || envLike.toLowerCase() === 'true') ? 'true' : 'false') : 'false',
      autoReplyStatus: envReply ? ((envReply.toLowerCase() === 'on' || envReply.toLowerCase() === 'true') ? 'true' : 'false') : 'false',
      statusReplyText: envReplyText || '✅ Status Viewed By BWM-XMD',
      statusLikeEmojis: envLikeEmojis || '💛,❤️,💜,🤍,💙'
    };
  }
}

async function updateAutoStatusSettings(updates) {
  try {
    let settings = await AutoStatusDB.findOne();
    if (!settings) {
      settings = await AutoStatusDB.create({});
    }
    return await settings.update(updates);
  } catch (error) {
    console.error('Error updating auto status settings:', error);
    return null;
  }
}

module.exports = {
  initAutoStatusDB,
  getAutoStatusSettings,
  updateAutoStatusSettings,
  AutoStatusDB
};
