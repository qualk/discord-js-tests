const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { performance } = require('perf_hooks');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong, command latency and API latency.')
		.addBooleanOption(option => option
			.setName('ephemeral')
			.setDescription('Whether or not the echo should be ephemeral')
			.setRequired(false)),

	async execute(interaction) {

		const ephemeral = interaction.options.getBoolean('ephemeral') || false;

		const startTime = performance.now();
		await interaction.deferReply({ ephemeral });
		const commandLatency = performance.now() - startTime;
		const { ping: apiLatency } = interaction.client.ws;
		const roundtripLatency = (await interaction.fetchReply()).createdTimestamp - interaction.createdTimestamp;

		const embed = new EmbedBuilder()
			.setTitle('Pong!')
			.setColor('#ea9b26')
			.addFields(
				{ name: 'Command Latency', value: `${commandLatency.toFixed(3)}ms` },
				apiLatency === -1
					? { name: 'API Latency', value: 'Calculating...' }
					: { name: 'API Latency', value: `${apiLatency.toFixed(3)}ms` },
				{ name: 'Websocket Heartbeat', value: `${interaction.client.ws.ping}ms` },
				{ name: 'Roundtrip Latency', value: `${roundtripLatency}ms` },
			);

		await interaction.editReply({ embeds: [embed], ephemeral });
	},
};
