import { Client, GatewayIntentBits, GuildBasedChannel, ChannelType } from 'discord.js';
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
		console.log(`Logged in as ${client.user?.tag}`);
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

			// whenever a message is created this listener is called
			const onMessageCreate = (message: any) => {
				// iterate through all nodes and see if we need to trigger some
                // @ts-ignore
				for (const [nodeId, parameters] of Object.entries(settings.triggerNodes) as [string, any]) {
					try {
						// ignore messages of other bots
						if (message.author.bot || message.author.system) return;

						// const pattern = parameters.pattern;

						// // check if executed by the proper role
						// const userRoles = message.member?.roles.cache.map((role: any) => role.id);
						// if (parameters.roleIds.length) {
						// 	const hasRole = parameters.roleIds.some((role: any) => userRoles?.includes(role));
						// 	if (!hasRole) return;
						// }

						// // check if executed by the proper channel
						// if (parameters.channelIds.length) {
						// 	const isInChannel = parameters.channelIds.some((channelId: any) =>
						// 		message.channel.id?.includes(channelId),
						// 	);
						// 	if (!isInChannel) return;
						// }

						// // escape the special chars to properly trigger the message
						// const escapedTriggerValue = String(parameters.value)
						// 	.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
						// 	.replace(/-/g, '\\x2d');

						// const clientId = client.user?.id;
						// const botMention = message.mentions.users.some((user: any) => user.id === clientId);

						// let regStr = `^${escapedTriggerValue}$`;

						// // return if we expect a bot mention, but bot is not mentioned
						// if (pattern === 'botMention' && !botMention) return;
						// else if (pattern === 'start' && message.content) regStr = `^${escapedTriggerValue}`;
						// else if (pattern === 'end') regStr = `${escapedTriggerValue}$`;
						// else if (pattern === 'contain') regStr = `${escapedTriggerValue}`;
						// else if (pattern === 'regex') regStr = `${parameters.value}`;
						// else if (pattern === 'every') regStr = `(.*)`;

						// const reg = new RegExp(regStr, parameters.caseSensitive ? '' : 'i');

						// if ((pattern === 'botMention' && botMention) || reg.test(message.content)) {
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
			// Add new listener for `messageCreate`
			client.on('messageCreate', onMessageCreate);
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
