import { readdir } from "fs/promises";
import { join } from "path";

import { Command } from "../interfaces/Command";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Reads the `/commands` directory and dynamically imports the files,
 * returning an array of Command objects.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {Command[]} Array of Command objects.
 */
export const loadCommands = async (bot: ExtendedClient): Promise<Command[]> => {
  try {
    const result: Command[] = [];
    const files = await readdir(join(process.cwd(), "prod", "commands"));
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd(), "prod", "commands", file));
      result.push(mod[name] as Command);
    }
    bot.commands = result;
    return result;
  } catch (err) {
    await errorHandler(bot, "load commands", err);
    return [];
  }
};
