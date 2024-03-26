const fs = require('fs').promises;
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
] });

client.commands = new Collection();

async function loadFiles(dir, loader) {
	const files = await fs.readdir(dir, { withFileTypes: true });
	for (const file of files) {
		const res = path.resolve(dir, file.name);
		if (file.isDirectory()) {
			await loadFiles(res, loader);
		} else if (file.name.endsWith('.js')) {
			try {
				await loader(res);
			} catch (error) {
				console.error(`Error loading file ${res}: ${error}`);
			}
		}
	}
}

async function loadCommands(file) {
	const command = require(file);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		throw new Error(`The command at ${file} is missing a required "data" or "execute" property.`);
	}
}

async function loadEvents(file) {
	const event = require(file);
	if (typeof event.execute !== 'function') {
		throw new Error(`The event at ${file} does not have an execute function.`);
	}
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function main() {
	try {
		await loadFiles(path.resolve(__dirname, 'commands'), loadCommands);
		await loadFiles(path.resolve(__dirname, 'events'), loadEvents);
		await client.login(process.env.token);
	} catch (error) {
		console.error(`Error in main: ${error}`);
	}
}

main();
