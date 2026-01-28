const fs = require('fs-extra');
const path = require('path');
if (fs.existsSync('config.env')) {
    require('dotenv').config({ path: __dirname + '/config.env' });
}
const session = process.env.SESSION || '';
const XMD_CONFIG = require("./adams/xmd");
const dev = process.env.OWNER_NUMBER || '254710772666';
const { Sequelize } = require('sequelize'); 


const DATABASE_URL = process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL || './database.db';
console.log(`[DATABASE] Using: ${DATABASE_URL.startsWith('postgres') ? 'PostgreSQL' : DATABASE_URL.startsWith('mysql') ? 'MySQL' : 'SQLite'}`); 

// Auto-detect database type from URL
const isPostgres = DATABASE_URL.startsWith('postgres');
const isMysql = DATABASE_URL.startsWith('mysql');
const isSqlite = !isPostgres && !isMysql;

let database;
if (isSqlite) {
    database = new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    });
} else if (isPostgres) {
    database = new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    });
} else if (isMysql) {
    database = new Sequelize(DATABASE_URL, {
        dialect: 'mysql',
        logging: false,
    });
}

module.exports = {  
  database,  
  dev,
  session,
  
  BOT: process.env.BOT_NAME || 'BWM XMD',
  PREFIX: process.env.PREFIX || '.',
  TZ: process.env.TZ || 'Africa/Nairobi',
  
  BOT_URL: process.env.BOT_URL ? process.env.BOT_URL.split(',') : [
    'https://on.bwmxmd.co.ke/veksnu.jpg',
    'https://on.bwmxmd.co.ke/ge01u0.jpg',
    'https://on.bwmxmd.co.ke/ztb02d.jpg'
  ],
  
  MENU_TOP_LEFT: process.env.MENU_TOP_LEFT || "*┌─❖*",
  MENU_BOT_NAME_LINE: process.env.MENU_BOT_NAME_LINE || "*│",
  MENU_BOTTOM_LEFT: process.env.MENU_BOTTOM_LEFT || "*└┬❖*",
  MENU_GREETING_LINE: process.env.MENU_GREETING_LINE || "   *│",
  MENU_DIVIDER: process.env.MENU_DIVIDER || "   *└────────┈❖*",
  MENU_USER_LINE: process.env.MENU_USER_LINE || "> 🕵️",
  MENU_DATE_LINE: process.env.MENU_DATE_LINE || "> 📅",
  MENU_TIME_LINE: process.env.MENU_TIME_LINE || "> ⏰",
  MENU_STATS_LINE: process.env.MENU_STATS_LINE || "> ⭐",
  MENU_BOTTOM_DIVIDER: process.env.MENU_BOTTOM_DIVIDER || "▬▬▬▬▬▬▬▬▬▬",
  
};

const XMD = require("./adams/xmd");
module.exports.NEWSLETTER_JID = XMD.NEWSLETTER_JID;
module.exports.getGlobalContextInfo = () => XMD.getContextInfo();
