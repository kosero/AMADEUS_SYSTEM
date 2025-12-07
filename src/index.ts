import client from './client.js';
import config from './config.js';

/*
* FEATURES
* */
import './cmds/deploy-cmds.js';
import './register-system.js';
import './voice.js'

client.once('clientReady', () => {
    console.log('[info]: Amadeus System ready!');
});

client.login(config.DISCORD_TOKEN)
