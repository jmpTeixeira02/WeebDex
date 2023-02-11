import { REST, Routes } from 'discord.js'
import config from '../resources/config.mjs'

const clientId = config.clientId
const guildId = config.guildId
const token = config.token


import commandsInit from "./commands.mjs"
const commands = commandsInit()

const commandList = Object.values(commands)
const commandListData = commandList.map(command => command.data)

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commandListData.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commandListData },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
