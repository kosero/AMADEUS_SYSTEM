import {CommandInteraction, GuildMember, SlashCommandBuilder, TextChannel} from "discord.js";
import config from "../config.js";

export const data = new SlashCommandBuilder().setName("register").setDescription("registers a user").addUserOption(option =>
    option
        .setName('user')
        .setDescription('user to be registered')
        .setRequired(true)
);

export async function execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const registerUser = interaction.options.getMember('user') as GuildMember;

    if (registerUser.user.bot)
        return interaction.reply("user is a bot");

    const channel = interaction.channel as TextChannel;

    if (registerUser.roles.cache.has(config.REGISTER_ROLE_ID)) {
        await registerUser.roles.remove(config.REGISTER_ROLE_ID);
        await registerUser.roles.add(config.LAB_MEM_ROLE_ID);

        await channel?.permissionOverwrites.edit(registerUser, {
            ViewChannel: false,
        });

        return interaction.reply("user registered");
    } else if (registerUser.roles.cache.has(config.LAB_MEM_ROLE_ID))
        return interaction.reply("user is already registered");
}
