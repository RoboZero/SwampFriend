import { userIntros } from "../data/user-intros";
import { EmbedBuilder, User } from "discord.js";

/**
 * A function to quickly display the user's introduction in an embed component
 * in Discord
 * @param user The user object associated with the user for this intro
 * @param userIntrosIndex The index of the user's intro in the userIntros data
 * @returns An EmbedBuilder used to create the embed component
 */
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
