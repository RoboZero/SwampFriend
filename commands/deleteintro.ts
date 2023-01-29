import { userIntros } from '../data/user-intros';
import {
  SlashCommandBuilder,
  CommandInteraction
} from 'discord.js';

module.exports = {
  // Command information
  data: new SlashCommandBuilder()
    .setName('deleteintro')
    .setDescription('Deletes your intro from the system'),

  // Command execution
  async execute(interaction: CommandInteraction) {
    const targetIndex = userIntros.findIndex((userIntro) => userIntro.userId == interaction.user.id);
    if (targetIndex == -1) {
      await interaction.reply({
        content: "Your intro is not in the system",
        ephemeral: true
      })
    } else {
      userIntros.splice(targetIndex, 1);
      await interaction.reply({
        content: "Intro deleted",
        ephemeral: true
      })
    }
  }
}