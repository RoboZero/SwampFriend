import createIntroEmbed from '../functions/createIntroEmbed';
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
        .setName('grab')
        .setDescription("Grabs a specific person's introduction.")
            .addUserOption(option =>
                option.setName('username')
                    .setDescription('Who\'s introduction do you want to see?')
                    .setRequired(true)
            ),

    // Command execution
    async execute(interaction: CommandInteraction) {

        const user = interaction.options.getUser('username');
        const id = user?.id
        if (user != null){
            let targetIndex = userIntros.findIndex((userIntro) => userIntro.userId == id);
            if (targetIndex == -1){
                await interaction.reply({
                    content: "That user doesn't have an introduction yet.",
                    ephemeral: true
                });
            }
            else {
                const user: User = await interaction.client.users.fetch(userIntros[targetIndex].userId)
                const embed = createIntroEmbed(user, targetIndex);

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        }
        else{

            await interaction.reply({
                content: "That user doesn't exist",
                ephemeral: true
            });
        }
    }
}