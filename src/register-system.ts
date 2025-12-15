import {
  ChannelType,
  GuildMember,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import client from "./client.js";
import config from "./config.js";

class RegisterSystem {
  public member: GuildMember;

  constructor(member: GuildMember) {
    this.member = member;
  }

  async initialize() {
    if (this.member.user.bot) this.loginBot();
    else this.loginUser();
  }

  async loginBot() {
    await this.member.roles.add(config.BOT_ROLE_ID);
  }

  async loginUser() {
    try {
      if (!this.member.guild) {
        console.log("[err]: not found guild");
        return;
      }

      await this.member.roles.add(config.REGISTER_ROLE_ID);

      const channel = await this.member.guild.channels.create({
        name: `${this.member.user.username}`,
        type: ChannelType.GuildText,
        parent: config.REGISTER_CHANNEL_ID,
        permissionOverwrites: [
          {
            id: this.member.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: this.member.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
        ],
      });

      if (!channel) {
        console.log("[err]: not created channel");
        return;
      }

      this.sayHello(channel);
    } catch (err) {
      console.log(`[err]: ${err}`);
    }
  }

  async sayHello(channel: TextChannel) {
    await channel.send(
      `Hos geldin <@${this.member.id}>, sunucuya katildigin icin tesekkurler, diger kanallari gorebilmen icin seninle biraz sohbet etmem gerekiyor, cok bekletmem.`,
    );
  }
}

client.on("guildMemberAdd", async (member) => {
  try {
    const registerSystem = new RegisterSystem(member);
    await registerSystem.initialize();
  } catch (err) {
    console.log(`[err]: ${err}`);
  }
});
