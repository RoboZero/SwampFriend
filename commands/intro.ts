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

    //Essentially a static handler 
		setUserIntros(guildHandler.fetchUserData(interaction.guild!));

    let targetIndex = -1;
    if(userIntros.length > 0){
      targetIndex = userIntros.findIndex((userIntro) => userIntro.userId == interaction.user.id);
    }
    
    if (targetIndex == -1) {
      userIntros.push({
        userId: interaction.user.id,
        title: `${interaction.user.username}'s Intro`,
        description: "This is your description",
        tags: ["tag1", "tag2", "tag3"]
      })
      targetIndex = userIntros.length - 1;
    }

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