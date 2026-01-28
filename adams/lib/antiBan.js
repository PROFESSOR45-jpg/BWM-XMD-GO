const messageQueue = new Map();
const lastMessageTime = new Map();
const messageCounts = new Map();

const ANTI_BAN_CONFIG = {
    minDelay: 1000,
    maxDelay: 3000,
    messagesPerMinute: 30,
    burstLimit: 5,
    burstWindow: 10000,
    cooldownTime: 60000,
    groupMessageDelay: 2000,
    statusViewDelay: 3000,
    typingDuration: 1500,
};

function getRandomDelay(min = ANTI_BAN_CONFIG.minDelay, max = ANTI_BAN_CONFIG.maxDelay) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkRateLimit(jid) {
    const now = Date.now();
    const key = jid || 'global';
    
    if (!messageCounts.has(key)) {
        messageCounts.set(key, { count: 0, windowStart: now, burstCount: 0, burstStart: now });
    }
    
    const stats = messageCounts.get(key);
    
    if (now - stats.burstStart > ANTI_BAN_CONFIG.burstWindow) {
        stats.burstCount = 0;
        stats.burstStart = now;
    }
    
    if (now - stats.windowStart > 60000) {
        stats.count = 0;
        stats.windowStart = now;
    }
    
    if (stats.burstCount >= ANTI_BAN_CONFIG.burstLimit) {
        return { allowed: false, waitTime: ANTI_BAN_CONFIG.burstWindow - (now - stats.burstStart) };
    }
    
    if (stats.count >= ANTI_BAN_CONFIG.messagesPerMinute) {
        return { allowed: false, waitTime: 60000 - (now - stats.windowStart) };
    }
    
    stats.count++;
    stats.burstCount++;
    return { allowed: true, waitTime: 0 };
}

async function safeSendMessage(client, jid, content, options = {}, botId = 'main') {
    try {
        const rateCheck = checkRateLimit(jid);
        
        if (!rateCheck.allowed) {
            console.log(`[${botId}] ⏳ Rate limit: waiting ${Math.ceil(rateCheck.waitTime / 1000)}s`);
            await sleep(rateCheck.waitTime);
        }
        
        const lastTime = lastMessageTime.get(jid) || 0;
        const timeSince = Date.now() - lastTime;
        const minDelay = jid.endsWith('@g.us') ? ANTI_BAN_CONFIG.groupMessageDelay : ANTI_BAN_CONFIG.minDelay;
        
        if (timeSince < minDelay) {
            await sleep(minDelay - timeSince);
        }
        
        if (content.text && !options.skipTyping) {
            try {
                await client.sendPresenceUpdate('composing', jid);
                await sleep(Math.min(ANTI_BAN_CONFIG.typingDuration, content.text.length * 20));
                await client.sendPresenceUpdate('paused', jid);
            } catch (e) {}
        }
        
        await sleep(getRandomDelay(500, 1500));
        
        const result = await client.sendMessage(jid, content, options);
        lastMessageTime.set(jid, Date.now());
        
        return result;
    } catch (error) {
        if (error.message?.includes('rate') || error.data === 429) {
            console.log(`[${botId}] ⚡ Rate limit hit, cooling down...`);
            await sleep(ANTI_BAN_CONFIG.cooldownTime);
            return safeSendMessage(client, jid, content, options, botId);
        }
        throw error;
    }
}

async function safeReact(client, jid, key, emoji, botId = 'main') {
    try {
        await sleep(getRandomDelay(300, 800));
        return await client.sendMessage(jid, { react: { text: emoji, key } });
    } catch (error) {
        console.log(`[${botId}] React error:`, error.message);
        return null;
    }
}

async function safeBulkSend(client, jids, content, options = {}, botId = 'main') {
    const results = [];
    const shuffledJids = [...jids].sort(() => Math.random() - 0.5);
    
    for (const jid of shuffledJids) {
        try {
            const result = await safeSendMessage(client, jid, content, options, botId);
            results.push({ jid, success: true, result });
        } catch (error) {
            results.push({ jid, success: false, error: error.message });
        }
        await sleep(getRandomDelay(2000, 5000));
    }
    
    return results;
}

function wrapClientWithAntiBan(client, botId = 'main') {
    const originalSendMessage = client.sendMessage.bind(client);
    
    client.safeSend = (jid, content, options) => safeSendMessage(client, jid, content, options, botId);
    client.safeReact = (jid, key, emoji) => safeReact(client, jid, key, emoji, botId);
    client.safeBulkSend = (jids, content, options) => safeBulkSend(client, jids, content, options, botId);
    
    client.sendMessage = async (jid, content, options = {}) => {
        if (options.skipAntiBan) {
            return originalSendMessage(jid, content, options);
        }
        
        if (content && typeof content.text === 'string' && !content.text.trim()) {
            console.log(`[${botId}] ⚠️ Prevented empty message`);
            return null;
        }
        
        const lastTime = lastMessageTime.get(jid) || 0;
        const timeSince = Date.now() - lastTime;
        
        if (timeSince < 500) {
            await sleep(500 - timeSince + getRandomDelay(100, 300));
        }
        
        const result = await originalSendMessage(jid, content, options);
        lastMessageTime.set(jid, Date.now());
        
        return result;
    };
    
    return client;
}

function clearRateLimits() {
    messageCounts.clear();
    lastMessageTime.clear();
}

module.exports = {
    ANTI_BAN_CONFIG,
    getRandomDelay,
    sleep,
    checkRateLimit,
    safeSendMessage,
    safeReact,
    safeBulkSend,
    wrapClientWithAntiBan,
    clearRateLimits,
};
