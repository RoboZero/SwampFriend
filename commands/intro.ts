import { EmbedBuilder } from '@discordjs/builders';
import { setUserIntros, userIntros } from '../data/user-intros';
import friendSchema from '../databases/introSchema';
import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  User
} from 'discord.js';
import createIntroEmbed from '../functions/createIntroEmbed';
import { guildHandler } from '../index';

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
      targetIndex = userIntros.length - 1;
    }

    //Essentially a static handler 
		setUserIntros(guildHandler.fetchUserData(interaction.guild!));

    const user: User = await interaction.client.users.fetch(userIntros[targetIndex].userId)
    const embed = createIntroEmbed(user, targetIndex);

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