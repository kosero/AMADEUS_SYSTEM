import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import BebisTTS from "../bebis-tts.js";

export const data = new SlashCommandBuilder()
  .setName("tts")
  .setDescription("text to speech")
  .addStringOption((option) =>
    option.setName("text").setDescription("text").setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.member as GuildMember;
  if (!member.voice.channel) {
    return interaction.reply({
      content: "[err]: once you enter the voice channel",
      ephemeral: true,
    });
  }

  const text = interaction.options.getString("text", true);

  await interaction.deferReply();

  try {
    await BebisTTS.play(text, member.voice.channel as VoiceChannel);
    await interaction.editReply(`[ok(voice]: sound is playing`);
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: "[err]: idk" });
  }
}
