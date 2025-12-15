import { VoiceChannel } from "discord.js";
import { Readable } from "stream";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { SynthesisResult, UniversalEdgeTTS } from "edge-tts-universal";

export default class BebisTTS {
  private static model: string = "tr-TR-EmelNeural";
  private static pitch: string = "+80Hz";
  private static rate: string = "+10%";

  static async generateSound(text: string): Promise<SynthesisResult> {
    const tts = new UniversalEdgeTTS(text, this.model, {
      pitch: this.pitch,
      rate: this.rate,
    });

    return await tts.synthesize();
  }

  static async play(
    text: string,
    voiceChannel: VoiceChannel,
    left: Boolean = false,
  ) {
    const result = await this.generateSound(text);
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
      console.log("[ok(BebisTTS)]: sound played");
      if (left) {
        connection.destroy();
      }
    });

    player.on("error", (error) => console.error("[err]:", error));
    connection.on("error", (error) => console.error("[err]:", error));

    return connection;
  }
}
