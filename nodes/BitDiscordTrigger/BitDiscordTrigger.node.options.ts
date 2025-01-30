import { INodeProperties } from 'n8n-workflow';

export const options: INodeProperties[] = [
	{
		displayName: 'Trigger Type',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'Message',
				value: 'message',
				description: 'When a message is sent in the selected channels',
			},
			{
				name: 'Reaction',
				value: 'reaction',
				description: 'When a reaction is added to a message in the selected channels',
			},
			{
				name: 'User Join',
				value: 'user-join',
				description: 'When a user joins the server',
			},
			{
				name: 'User Leave',
				value: 'user-leave',
				description: 'When a user leaves the server',
			}
		],
		default: 'message',
		description:
			'Type of event to listen to. User events must specify a channel to listen to if you want to use a placeholder or the option "send to the trigger channel" in a Discord Send node.',
	}
];
