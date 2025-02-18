// Import the necessary discord.js classes
import { Client, Events, GatewayIntentBits, Collection, Guild } from 'discord.js'
import ExtendedClient from './types/ExtendedClient';
import Command from './types/Command';
import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { GuildHandler } from './databases/guilds/GuildHandler';
require('dotenv').config();

// Create a new client instance
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });
export const guildHandler = new GuildHandler(client);

// ADD ALL THE COMMANDS
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = (fs.readdirSync(commandsPath) as string[]).filter(file => file.endsWith('.ts'));
// For each file...
for (const file of commandFiles) {
  // Get the contents of each file....
  const filePath = path.join(commandsPath, file);
  const command: Command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// ADD ALL THE EVENTS
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
// For each file...
for (const file of eventFiles) {
  // Get the contents of each file...
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  // If the event has the 'once' property set to true...
  if (event.once) {
    // Set the event using .once()
    client.once(event.name, async(...args) => {
      await startMongoDB();
      guildHandler.onClientReady();
      event.execute(...args);
    });
  } else {
    // Set the event using .on()
    client.on(event.name, async(...args) => {
      event.execute(...args, guildHandler);
    });

    client.on(Events.GuildCreate, (guild:Guild) =>{
      guildHandler.onGuildCreate(guild);
    });

    client.on(Events.GuildDelete, (guild:Guild) =>{
      guildHandler.onGuildDelete(guild);
    });
  }
}

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);

async function startMongoDB():Promise<void>
{
	mongoose.set('strictQuery', false);
	await mongoose.connect(process.env.MONGO_SRV!, {
		  keepAlive: true,
	    }, (e) => {
		    console.log(`If null, MongoDB connection was success \n: ${e}`);
	    }
	);
}