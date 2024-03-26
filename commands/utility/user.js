const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides detailed information about the user.')
		.addBooleanOption(option => option
			.setName('ephemeral')
			.setDescription('Whether or not the echo should be ephemeral')
			.setRequired(false)),

	async execute(interaction) {
		try {
			// Get user and member data
			const { user, member } = interaction;

			const ephemeral = interaction.options.getBoolean('ephemeral') || false; // Get the boolean option, default to false

			// Create an embed
			const embed = new EmbedBuilder()
				.setColor('#ea9b26')
				.setTitle(`User Information: ${user.username}`)
				.setThumbnail(user.displayAvatarURL())
				.addFields(
					{ name: 'Username', value: user.username, inline: true },
					{ name: 'Joined Server', value: member.joinedAt.toLocaleDateString(), inline: true },
					{ name: 'Account Created', value: user.createdAt.toLocaleDateString(), inline: true },
					{ name: 'Status', value: user.presence ? user.presence.status : 'Unknown', inline: true },
					{ name: 'Voice Channel', value: member.voice.channel ? member.voice.channel.name : 'No Voice Channel', inline: true },
					{ name: 'User ID', value: user.id, inline: true },
				)
				.setTimestamp(); // Optional timestamp

			// Reply with the embed
			await interaction.reply({ embeds: [embed], ephemeral });
		} catch (error) {
			console.error('Error executing the user command:', error);
			await interaction.reply('Sorry, there was an error executing the user command.');
		}
	},
};
