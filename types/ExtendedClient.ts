import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction
} from 'discord.js';
import Command from './Command';

/**
 * Class that extends Client<true> by adding the commands property,
 * a Collection<string, Command> initialized to a new Collection
 * used for storing the client's commands.
 */
export default class ExtendedClient extends Client<true> {

  commands: Collection<string, Command> = new Collection();

  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
  }
}
