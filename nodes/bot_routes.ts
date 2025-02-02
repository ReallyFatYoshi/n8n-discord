import { Client, Guild, Role } from 'discord.js';
import settings from './settings';

export function listRoles(ipc: any, client: Client, data: undefined, socket: any) {
	try {
		if (settings.ready) {
			const guild = client.guilds.cache.first();
			const roles = guild?.roles.cache.map((role) => role);

			ipc.server.emit(socket, 'list:roles', roles);
		}
	} catch (e) {
		console.log(`${e}`);
	}
}

export function listGuilds(ipc: any, client: Client, data: undefined, socket: any) {
	try {
		if (settings.ready) {
			const guilds = client.guilds.cache ?? ([] as any);
			const guildsList = guilds.map((guild: Guild) => ({
				name: guild.name,
				value: guild.id,
			}));

			ipc.server.emit(socket, 'list:guilds', guildsList);
		}
	} catch (e) {
		console.log(`${e}`);
	}
}
