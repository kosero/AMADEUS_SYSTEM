import client from './client.js';
import config from './config.js';

client.once('clientReady', () => {
    console.log('[info]: Amadeus System ready!');
});

client.login(config.DISCORD_TOKEN)
