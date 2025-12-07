import client from "./client.js";
import {VoiceChannel} from "discord.js";
import BebisTTS from "./bebis-tts.js";

client.on("voiceStateUpdate", async (oldState, newState) => {
    const member = newState.member ?? oldState.member;
    if (!member) return;
    if (member.user.bot) return;

    const oldChannel = oldState.channel as VoiceChannel | null;
    const newChannel = newState.channel as VoiceChannel | null;

    try {
        if (!oldChannel && newChannel) {
            const text = `${member.displayName} geldi`;
            await BebisTTS.play(text, newChannel, true);
        } else if (oldChannel && !newChannel) {
            const text = `${member.displayName} gitti`;
            await BebisTTS.play(text, oldChannel, true);
        }
    } catch (error) {
        console.error('[err]:', error);
    }
});
