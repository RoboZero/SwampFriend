import { userIntros } from '../data/user-intros';
import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  User
} from 'discord.js';

module.exports = {
  // Command information
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription("Grabs a random person's introduction."),

  // Command execution
  async execute(interaction: CommandInteraction) {

    let randomIndex = Math.floor(Math.random() * userIntros.length);
    let i = 0;
    while (userIntros[randomIndex].userId == interaction.user.id) {
      randomIndex = Math.floor(Math.random() * userIntros.length);
      if (i > 99999) {
        return;
      }
      i++;
    }

    const user: User = await interaction.client.users.fetch(userIntros[randomIndex].userId)
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setAuthor({
        name: user.username,
        iconURL: user.avatarURL() || undefined,
      })
      .setTitle(`${userIntros[randomIndex].title}`)
      .setDescription(`${userIntros[randomIndex].description}`);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    })
  }
}