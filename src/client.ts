import {Client} from "discord.js";

const client = new Client({
    intents: ["Guilds","GuildMembers", "GuildMessages", "GuildVoiceStates"]
});

export default client;