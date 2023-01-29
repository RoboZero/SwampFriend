
import {
  Awaitable,
  CommandInteraction,
  SlashCommandBuilder
} from 'discord.js'

/**
 * A basic interface for a discord command
 * Mainly used in index.ts
 */
export default interface Command {
  data: SlashCommandBuilder,
  execute: (interaction: CommandInteraction) => Awaitable<void>
}