import client from "./client.js";
import config from "./config.js";

/*
 * FEATURES
 * */
import "./cmds/deploy-cmds.js";
import "./register-system.js";
import "./voice.js";
import Lab from "./lab.js";

client.once("ready", async () => {
  console.log("[info]: Amadeus System ready!");
  await Lab.labRoleUpdate();
});

client.on("guildMemberRemove", async () => {
  await Lab.labRoleUpdate();
});

client.login(config.DISCORD_TOKEN);
