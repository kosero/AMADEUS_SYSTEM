import dotenv from "dotenv";

dotenv.config();

const {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    REGISTER_CHANNEL_ID,
    REGISTER_ROLE_ID,
    BOT_ROLE_ID,
    LAB_MEM_ROLE_ID,
} = process.env;

if (!DISCORD_TOKEN ||
    !DISCORD_CLIENT_ID ||
    !REGISTER_CHANNEL_ID ||
    !REGISTER_ROLE_ID ||
    !BOT_ROLE_ID ||
    !LAB_MEM_ROLE_ID) {
    throw new Error("Missing environment variables");
}

const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    REGISTER_CHANNEL_ID,
    REGISTER_ROLE_ID,
    BOT_ROLE_ID,
    LAB_MEM_ROLE_ID,
}

export default config;
