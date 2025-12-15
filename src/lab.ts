import { GuildMember, Role } from "discord.js";
import client from "./client.js";
import fs from "fs/promises";
import path from "path";

const GUILD_ID = "1154598232651997214";
const LAB_DATA_PATH = path.join(process.cwd(), "lab-roles.json");

interface LabRoleData {
  userId: string;
  roleName: string;
  roleId: string;
  assignedAt: string;
}

export default class Lab {
  static async labRoleUpdate() {
    try {
      const guild = await client.guilds.fetch(GUILD_ID);
      const members = await guild.members.fetch();
      const roles = guild.roles.cache;

      // check if not member
      const realMembers = members
        .filter((member) => !member.user.bot)
        .sort((a, b) => a.joinedTimestamp! - b.joinedTimestamp!);

      const labRoles = roles
        .filter(
          (role) =>
            role.name.startsWith("LAB") && role.name.match(/^LAB\d{3}$/),
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log(`📊 Toplam üye sayısı: ${realMembers.size}`);
      console.log(`📊 Mevcut LAB rol sayısı: ${labRoles.size}`);

      const labRoleData: LabRoleData[] = [];
      const usedRoles = new Set<string>();

      for (let i = 0; i < realMembers.size; i++) {
        const member = realMembers.at(i)!;
        const expectedRoleName = `LAB${String(i + 1).padStart(3, "0")}`;

        const currentLabRole = member.roles.cache.find((role) =>
          role.name.match(/^LAB\d{3}$/),
        );

        let targetRole = labRoles.find(
          (role) => role.name === expectedRoleName,
        );

        if (!targetRole) {
          console.log(`🆕 ${expectedRoleName} rolü oluşturuluyor...`);
          targetRole = await guild.roles.create({
            name: expectedRoleName,
            reason: "LAB rol sistemi otomatik oluşturma",
          });
        }

        usedRoles.add(targetRole.id);

        if (currentLabRole?.name !== expectedRoleName) {
          if (currentLabRole) {
            console.log(
              `🔄 ${member.user.username} için ${currentLabRole.name} kaldırılıyor...`,
            );
            await member.roles.remove(currentLabRole);
          }

          console.log(
            `✅ ${member.user.username} için ${expectedRoleName} ekleniyor...`,
          );
          await member.roles.add(targetRole);
        } else {
          console.log(
            `✓ ${member.user.username} zaten ${expectedRoleName} rolüne sahip`,
          );
        }

        labRoleData.push({
          userId: member.id,
          roleName: targetRole.name,
          roleId: targetRole.id,
          assignedAt: new Date().toISOString(),
        });
      }

      const unusedLabRoles = labRoles.filter((role) => !usedRoles.has(role.id));

      for (const role of unusedLabRoles.values()) {
        console.log(`🗑️ Kullanılmayan ${role.name} rolü siliniyor...`);
        await role.delete("LAB rol sistemi - kullanılmayan rol");
      }

      await this.saveLabRoleData(labRoleData);

      console.log(`\n✨ LAB rol güncellemesi tamamlandı!`);
      console.log(`📝 ${labRoleData.length} üyeye rol atandı`);
      console.log(`🗑️ ${unusedLabRoles.size} kullanılmayan rol silindi`);

      return labRoleData;
    } catch (error) {
      console.error("❌ LAB rol güncelleme hatası:", error);
      throw error;
    }
  }

  private static async saveLabRoleData(data: LabRoleData[]) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(LAB_DATA_PATH, jsonData, "utf-8");
      console.log(`💾 Rol verileri ${LAB_DATA_PATH} dosyasına kaydedildi`);
    } catch (error) {
      console.error("❌ JSON kaydetme hatası:", error);
      throw error;
    }
  }

  static async loadLabRoleData(): Promise<LabRoleData[]> {
    try {
      const data = await fs.readFile(LAB_DATA_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
}
