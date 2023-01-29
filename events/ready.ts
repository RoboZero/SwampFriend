import {
	Client,
	Events
} from 'discord.js'

module.exports = {
	// Triggers when the client is ready
	name: Events.ClientReady,
	// Runs only once
	once: true,
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user!.tag}`);
	},
};