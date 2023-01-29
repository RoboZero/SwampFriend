import { EmbedBuilder } from '@discordjs/builders';
import { userIntros } from '../data/user-intros';
import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from 'discord.js';
import friendSchema from 'databases/friendSchema';

module.exports = {
  // Command information
  data: new SlashCommandBuilder()
    .setName('intro')
    .setDescription('Shows you your introduction.'),

  // Command execution
  async execute(interaction: CommandInteraction) {

    let targetIndex = userIntros.findIndex((userIntro) => userIntro.userId == interaction.user.id);
    if (targetIndex == -1) {
      userIntros.push({
        userId: interaction.user.id,
        title: `${interaction.user.username}'s Intro`,
        description: "[none]",
        tags: []
      })
      //createDBEntry(userIntros);
      const friendEntry = new friendSchema({
        userID: interaction.user.id,
        title: `${interaction.user.username}'s Intro`,
        description: "[none]",
        tags: []
      })
      friendEntry.save();
    }
    targetIndex = userIntros.length - 1;
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${userIntros[targetIndex].title}`)
      .setDescription(`${userIntros[targetIndex].description}`);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`editintro:${interaction.user.id}`)
          .setLabel('Edit')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    })
  }
}