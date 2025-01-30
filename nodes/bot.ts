import chalk from 'chalk';
import { Client, GatewayIntentBits, GuildBasedChannel, ChannelType, GuildMember, PartialGuildMember } from 'discord.js';
import ipc from 'node-ipc';
import { ICredentials } from './helper';
import settings from './settings';
import { listGuilds, listRoles } from './bot_routes';

export default function () {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessageTyping,
		],
		allowedMentions: {
			parse: ['roles', 'users', 'everyone'],
		},
	});

	client.once('ready', () => {
		console.log(chalk.gray("[!] ") + chalk.green(`Logged in as ${client.user?.tag}`));
	});

	ipc.config.id = 'bot';
	ipc.config.retry = 1500;
	ipc.config.silent = true;

	// nodes are executed in a child process, the Discord bot is executed in the main process
	// so it's not stopped when a node execution end
	// we use ipc to communicate between the node execution process and the bot
	// ipc is serving in the main process & childs connect to it using the ipc client
	ipc.serve(function () {
		console.log(`ipc bot server started`);

		ipc.server.on('triggerNodeRegistered', (data: any, socket: any) => {
			// set the specific node parameters for a later iteration when we get messages
			settings.triggerNodes[data.nodeId] = data.parameters;

			const onGuildMemberAdd = (member: GuildMember) => {
				ipc.server.emit(socket, 'guildMemberAdd', {
					data: {
						id: member.id,
						tag: member.user.tag,
						username: member.user.username,
						guild: member.guild,
						roles: member.roles.cache.map((role) => role),
						is_bot: member.user.bot,
						joined_at: member.joinedAt,
						left_at: null,
						created_at: member.user.createdAt,
					},
					nodeId: data.nodeId,
				});
			}
			
			const onGuildMemberRemove = (member: GuildMember | PartialGuildMember) => {
				ipc.server.emit(socket, 'guildMemberRemove', {
					data: {
						id: member.id,
						tag: member.user.tag,
						username: member.user.username,
						guild: member.guild,
						roles: member.roles.cache.map((role) => role),
						is_bot: member.user.bot,
						joined_at: member.joinedAt,
						left_at: new Date(Date.now()),
						created_at: member.user.createdAt,
					},
					nodeId: data.nodeId,
				});
			}

			// whenever a message is created this listener is called
			const onMessageCreate = (message: any) => {
				// iterate through all nodes and see if we need to trigger some
				// @ts-ignore
				for (const [nodeId, type] of Object.entries(settings.triggerNodes) as [string, string]) {
					try {
						// ignore messages of other bots
						if (message.author.bot || message.author.system) return;

						// Emit the message data to n8n
						ipc.server.emit(socket, 'messageCreate', {
							message,
							author: message.author,
							nodeId: nodeId,
						});
						// }
					} catch (e) {
						console.log(e);
					}
				}
			};

			// Clear existing listeners for `messageCreate`
			client.removeAllListeners('messageCreate');
			client.removeAllListeners('guildMemberAdd');	
			client.removeAllListeners('guildMemberRemove');
			// Add new listener for `messageCreate`
			client.on('messageCreate', onMessageCreate);
			client.on('guildMemberAdd', onGuildMemberAdd);
			client.on('guildMemberRemove', onGuildMemberRemove);
		});

		ipc.server.on('list:roles', listRoles.bind(null, ipc, client));
		ipc.server.on('list:guilds', listGuilds.bind(null, ipc, client));
		ipc.server.on('list:channels', (data: undefined, socket: any) => {
			if (settings.ready) return;
			try {
				const guilds = Array.from(client.guilds.cache.values());
				const channelsList: Array<{ name: string; value: string }> = [];
				for (const guild of guilds) {
					const guildChannels = guild.channels.cache.filter(
						(channel: GuildBasedChannel) => channel.type === ChannelType.GuildText,
					);
					for (const channel of Array.from(guildChannels.values())) {
						channelsList.push({
							name: channel.name,
							value: channel.id,
						});
					}
				}

				ipc.server.emit(socket, 'list:channels', channelsList);
			} catch (e) {
				console.log(`${e}`);
			}
		});

		ipc.server.on('credentials', (data: ICredentials, socket: any) => {
			try {
				if (
					(!settings.login && !settings.ready) ||
					(settings.ready && (settings.clientId !== data.clientId || settings.token !== data.token))
				) {
					if (data.token && data.clientId) {
						settings.login = true;
						client.destroy();
						client
							.login(data.token)
							.then(() => {
								// set token for rest api aswell
								client.rest.setToken(data.token);

								settings.ready = true;
								settings.login = false;
								settings.clientId = data.clientId;
								settings.token = data.token;
								console.log('Client token2: ', client.isReady());
								ipc.server.emit(socket, 'credentials', 'ready');
							})
							.catch((e) => {
								settings.login = false;
								ipc.server.emit(socket, 'credentials', 'error');
							});
					} else {
						ipc.server.emit(socket, 'credentials', 'missing');
						console.log(`credentials missing`);
					}
				} else if (settings.login) {
					ipc.server.emit(socket, 'credentials', 'login');
					console.log(`credentials login`);
				} else {
					ipc.server.emit(socket, 'credentials', 'already');
				}
			} catch (e) {
				console.log(`${e}`);
			}
		});
	});

	ipc.server.start();
}
