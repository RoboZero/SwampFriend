import { userIntros } from "../data/user-intros";
import { EmbedBuilder, User } from "discord.js";

export default function createIntroEmbed(user: User, userIntrosIndex: number): EmbedBuilder {
  let tagString: string = "";
  userIntros[userIntrosIndex].tags.forEach((tag) => {
    tagString += `\`${tag}\` `
  })
  let color = userIntros[userIntrosIndex].color || 0x0099FF;

  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: user.username,
      iconURL: user.avatarURL() || undefined,
    })
    .setTitle(`${userIntros[userIntrosIndex].title}`)
    .setDescription(
      `${userIntros[userIntrosIndex].description}
      ${tagString != "" ? `Tags: ${tagString}` : ""}`);
}
