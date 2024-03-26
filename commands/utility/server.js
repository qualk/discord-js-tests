const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.')
		.addBooleanOption(option => option
			.setName('ephemeral')
			.setDescription('Whether or not the echo should be ephemeral')
			.setRequired(false)),

	async execute(interaction) {
		const ephemeral = interaction.options.getBoolean('ephemeral') || false;

		try {
			const { guild } = interaction;

			if (!guild) {
				throw new Error('Guild is undefined');
			}

			const members = await guild.members.fetch({ withPresences: true });
			const onlineCount = members.filter((member) => member.presence?.status !== 'offline').size;
			const offlineCount = members.filter((member) => member.presence?.status === 'offline').size;

			const embed = new EmbedBuilder()
				.setColor('#ea9b26')
				.setTitle(guild.name ? guild.name : 'Unknown')
				.setThumbnail(guild.iconURL())
				.setDescription(`${guild.memberCount} members (Online: ${onlineCount}, Offline: ${offlineCount})`)
				.addFields(
					{ name: 'Created', value: guild.createdAt ? guild.createdAt.toLocaleDateString() : 'Unknown', inline: true },
					{ name: 'Region', value: guild.region ? guild.region : 'Unknown', inline: true },
				);

			await interaction.reply({ embeds: [embed], ephemeral });
		} catch (error) {
			console.error('Failed to fetch server info: ', error);
			await interaction.reply('Sorry, I was unable to fetch the server info.');
		}
	},
};
