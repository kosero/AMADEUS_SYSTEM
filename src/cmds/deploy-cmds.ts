import { REST, Routes } from "discord.js";
import config from "../config.js";
import cmds from "./index.js";
import client from "../client.js";

const cmdsData = Object.values(cmds).map((cmd) => cmd.data);
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCmdsProps = {
  guildId: string;
};

export async function deployCmds({ guildId }: DeployCmdsProps) {
  try {
    console.log("[info]: Started refreshing application (/) cmds.");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: cmdsData,
      },
    );

    console.log("[info]: succesfully reloaded application (/) cmds.");
  } catch (error) {
    console.log("[err]:", error);
  }
}

client.once("clientReady", async () => {
  const guilds = client.guilds.cache;
  console.log(`[info]: Deploying commands to ${guilds.size} guilds...`);

  for (const guild of guilds.values()) {
    await deployCmds({ guildId: guild.id });
  }

  console.log("[info]: All commands deployed!");
});

client.on("guildCreate", async (guild) => {
  await deployCmds({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  if (cmds[commandName as keyof typeof cmds]) {
    cmds[commandName as keyof typeof cmds].execute(interaction);
  }
});
