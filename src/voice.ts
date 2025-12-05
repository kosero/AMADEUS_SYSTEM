import client from "./client.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus
} from "@discordjs/voice";
import {VoiceChannel} from "discord.js";
import {Readable} from 'stream';
import BebisTTS from "./bebis-tts.js";

client.on("voiceStateUpdate", async (oldState, newState) => {
    const member = newState.member;
    if (!member) return;
    if (member.user.bot) return;

    const voiceCh = newState.channel as VoiceChannel;
    if (!voiceCh) return;

    if (!oldState.channel && newState.channel) {
        try {
            const text = `${newState.member?.displayName} geldi`;
            const result = await BebisTTS.generateSound(text);

            const arrayBuffer = await result.audio.arrayBuffer();
            const audioBuffer = Buffer.from(arrayBuffer);

            const connection = joinVoiceChannel({
                channelId: voiceCh.id,
                guildId: voiceCh.guild.id,
                adapterCreator: voiceCh.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false,
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

            const player = createAudioPlayer();
            const stream = Readable.from(audioBuffer);
            const resource = createAudioResource(stream);

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('Audio finished playing');
                connection.destroy();
            });

            player.on('error', error => {
                console.error('[err]:', error);
                connection.destroy();
            });

            connection.on('error', error => {
                console.error('[err]:', error);
            });

        } catch (error) {
            console.error('[err]:', error);
        }
    }
});
