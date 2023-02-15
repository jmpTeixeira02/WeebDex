import fs from 'node:fs'
import { Client, EmbedBuilder, Events, GatewayIntentBits } from "discord.js"


import config from "../resources/config.mjs"
const token = config.token


import {sleep} from "../util.mjs"
import db from "../data/db_operations.mjs"
import dbTableOptions from "../data/db_table_options.mjs"


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Discord Commands
import commandsInit from './commands.mjs'
import eventsInit from "./events.mjs"
import messageSenderInit from './message-sender.mjs'
const events = eventsInit(db)
const commands = commandsInit(db)
const messageSender = messageSenderInit(client, db)


client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	const manwhaOptions = dbTableOptions.manwha

	db.init(manwhaOptions.table, dbTableOptions.discord.table)

	const looper = async () => {
		const res = await events.webScraping(
			manwhaOptions.table.name, 
			manwhaOptions.entry_options
		)
		for (const result of res){
			await messageSender.sendMessage(result, dbTableOptions.discord.table.name)
		}
		setTimeout(looper, 1000*60*10);
	}
	looper()
});


// Log in to Discord with your client's token
client.login(token);


client.commands = commands

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = interaction.client.commands[interaction.commandName];

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, dbTableOptions);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

