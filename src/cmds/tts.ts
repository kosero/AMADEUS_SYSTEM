import {CommandInteraction, GuildMember, SlashCommandBuilder, VoiceChannel} from "discord.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus
} from "@discordjs/voice";
import {Readable} from 'stream';
import BebisTTS from "../bebis-tts.js";

export const data = new SlashCommandBuilder()
    .setName("tts")
    .setDescription("text to speech")
    .addStringOption(option =>
        option
            .setName("text")
            .setDescription("Söylenecek metin")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    try {
        const member = interaction.member as GuildMember;
        if (!member.voice.channel) {
            return interaction.reply({
                content: "Önce bir ses kanalına girmelisin!",
                ephemeral: true
            });
        }
        const voiceChannel = member.voice.channel as VoiceChannel;

        await interaction.deferReply();

        const text = interaction.options.get("text", true).value as string;

        const result = await BebisTTS.generateSound(text);

        const arrayBuffer = await result.audio.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false,
        });

        connection.configureNetworking();

        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

        const player = createAudioPlayer();

        const stream = Readable.from(audioBuffer);
        const resource = createAudioResource(stream);

        connection.subscribe(player);

        player.play(resource);

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Ses çalma tamamlandı, kanalda bekleniyor...');
        });

        player.on('error', error => {
            console.error('Player hatası:', error);
        });

        connection.on('error', error => {
            console.error('Bağlantı hatası:', error);
        });

        await interaction.editReply(`✅ ${voiceChannel.name} kanalına katıldım ve metni söyledim: "${text}"`);

    } catch (error) {
        console.error('Komut hatası:', error);

        if (interaction.deferred) {
            await interaction.editReply({
                content: "Bir hata oluştu!"
            });
        } else {
            await interaction.reply({
                content: "Bir hata oluştu!",
                ephemeral: true
            });
        }
    }
}
