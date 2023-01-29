import { setUserIntros, userIntros } from "../data/user-intros";
import {
	Events,
	BaseInteraction,
	ButtonInteraction,
	ModalSubmitInteraction,
	StringSelectMenuInteraction,
	ModalBuilder,
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	TextInputBuilder,
	TextInputStyle, User, ButtonBuilder, ButtonStyle
} from "discord.js";
import ExtendedClient from "types/ExtendedClient";
import UserIntro from "types/UserIntro";
import { GuildHandler } from "databases/guilds/GuildHandler";
import createIntroEmbed from "../functions/createIntroEmbed";
import { guildHandler } from "../index";

module.exports = {
	// Triggers on any new interaction
	name: Events.InteractionCreate,
	async execute(interaction: BaseInteraction) {
		// CHAT INPUT COMMANDS
		if (interaction.isChatInputCommand()) {

			const command = (interaction.client as ExtendedClient).commands.get(interaction.commandName);
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}

			// ========== BUTTON COMMANDS ==========
		} else if (interaction.isButton()) {
			const customId = (interaction as ButtonInteraction).customId;

			// Branch on button's customId
			if (customId == 'primary') {
				interaction.reply(`${interaction.user.username} clicked the button.`)

			} else if (customId.includes('editintro')) {
				userIntros.forEach((x:UserIntro)=>{
					console.log(`Currently stored Intro: ${x.title}, ${x.description}`);
				});

				// Calculate some stuff
				const userId = customId.substring(customId.indexOf(':') + 1, customId.length);
				let targetIndex = userIntros.findIndex((userIntro) => userIntro.userId == userId);
				let title = 'My Modal'
				let description = 'About me'
				let tags = ['Tag1']
				let colorString: string = "1";

				if(targetIndex >= 0 && targetIndex < userIntros.length){
					title = userIntros[targetIndex].title;
					description = userIntros[targetIndex].description;
					tags = userIntros[targetIndex].tags;
					colorString = userIntros[targetIndex].color ? userIntros[targetIndex].color?.toString()! : "";
				} 

				console.log(`Displayed Intro: ${title}, ${description}, ${tags}, ${colorString}`);

				// Construct a modal
				const modal = new ModalBuilder()
					.setCustomId(`saveintro:${userId}`)
					.setTitle('Edit Introduction');
				const titleActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setCustomId('title')
							.setLabel("Enter the title for your intro:")
							.setStyle(TextInputStyle.Short)
							.setValue(title)
					);
				const descriptionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setCustomId('description')
							.setLabel("Enter your description:")
							.setStyle(TextInputStyle.Paragraph)
							.setValue(description)
					);
				const tagsActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setCustomId('tags')
							.setLabel("Enter your tags (separate tags on newlines)")
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(false)
							.setValue(tags.join("\n"))
					);
				const colorActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setCustomId('color')
							.setLabel("Enter a color (format: 0x000000)")
							.setStyle(TextInputStyle.Short)
							.setRequired(false)
							.setValue(colorString)
					);
				modal.addComponents(titleActionRow, descriptionActionRow, tagsActionRow, colorActionRow);
				interaction.showModal(modal);

			} else {
				console.log(`[WARNING]: No button interaction handler exists for ${customId}`)
			}

			// ========== STRING SELECT MENU COMMANDS ==========
		} else if (interaction.isStringSelectMenu()) {
			const customId = (interaction as StringSelectMenuInteraction).customId;

			// Branch on menu's customId
			if (customId == 'select') {
				const selected = interaction.values[0];
				await interaction.reply(`You selected ${selected}!`)
			} else {
				console.log(`[WARNING]: No string select menu interaction handler exists for ${customId}`)
			}

			// ========== MODAL SUBMIT COMMANDS ==========
		} else if (interaction.isModalSubmit()) {
			const customId = (interaction as ModalSubmitInteraction).customId;

			// Branch on modal's customId
			if (customId == 'mymodal') {
				const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
				const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
				interaction.reply({
					content: `You entered: ${favoriteColor}\n and ${hobbies}`,
					ephemeral: true
				})
				
				
			} else if (customId.includes('saveintro')) {

				// Calculate some stuff
				const userId = customId.substring(customId.indexOf(':') + 1, customId.length);
				let targetIndex = userIntros.findIndex((userIntro) => userIntro.userId == userId);
				if (targetIndex == -1) {
					userIntros.push({
						userId: userId,
						title: `${interaction.user.username}'s Intro`,
						description: "This is your description",
						tags: ["tag1", "tag2", "tag3"]
					})
					targetIndex = userIntros.length - 1;
				}
				const colorNumber = parseInt(interaction.fields.getTextInputValue('color'))

				// Update the user intro
				userIntros[targetIndex] = {
					...userIntros[targetIndex],
					title: interaction.fields.getTextInputValue('title'),
					description: interaction.fields.getTextInputValue('description'),
					tags: interaction.fields.getTextInputValue('tags').split('\n'),
					color: !isNaN(colorNumber) ? colorNumber : undefined
				}

				// Get the user's data
				const user: User = await interaction.client.users.fetch(userIntros[targetIndex].userId)
				// Create button
				const row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`editintro:${userIntros[targetIndex].userId}`)
							.setLabel('Edit')
							.setStyle(ButtonStyle.Primary)
					);

				// Create embed
				const embed = createIntroEmbed(user, targetIndex);
				// Respond

				interaction.reply({
					content: 'Your introduction was saved!',
					components: [row],
					embeds: [embed],
					ephemeral: true
				})

				await guildHandler.storeUserData(userIntros[targetIndex], interaction.guild!);
			} else {
				console.log(`[WARNING]: No modal submit interaction handler exists for ${customId}`)
			}

			// No interaction matches
		} else {
			return;
		}
	},
};

/*function createDBEntry(intro: UserIntro[])
{
	//Create new entry to enter into database
	const friendEntry = new friendSchema({
		
	})
	friendEntry.save();
}*/