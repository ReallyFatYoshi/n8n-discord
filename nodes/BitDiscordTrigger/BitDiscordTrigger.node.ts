import type {
    INodeType,
    INodeTypeDescription,
    ITriggerFunctions,
    ITriggerResponse,
    INodePropertyOptions,
} from 'n8n-workflow';
import { options } from './BitDiscordTrigger.node.options';
import bot from '../bot';
import ipc from 'node-ipc';
import {
    connection,
    ICredentials,
    checkWorkflowStatus,
    getChannels as getChannelsHelper,
    getRoles as getRolesHelper,
} from '../helper';
import settings from '../settings';

// we start the bot if we are in the main process
if (!process.send) bot();

export class BitDiscordTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Bit Discord Trigger',
        name: 'bitDiscordTrigger',
        group: ['trigger', 'discord'],
        version: 1,
        description: 'Discord Trigger on message',
        defaults: {
            name: 'Discord Trigger',
        },
        icon: 'file:bit-logo.svg',
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'discordBotTriggerApi',
                required: true,
            },
        ],
        properties: options,
    };

    methods = {
        loadOptions: {
            async getChannels(): Promise<INodePropertyOptions[]> {
                return await getChannelsHelper(this).catch((e) => e);
            },
            async getRoles(): Promise<INodePropertyOptions[]> {
                return await getRolesHelper(this).catch((e) => e);
            },
        },
    };

    async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
        this.getCredentials('discordBotTriggerApi', 0);
        const credentials = (await this.getCredentials('discordBotTriggerApi').catch((e) => e)) as any as ICredentials;

        if (!credentials?.token) {
            console.log("No token given.");
            
            return {};
        }

        await connection(credentials).catch((e) => e);

        ipc.connectTo('bot', () => {
            console.log('Connected to IPC server');

            const parameters: any = {};
            Object.keys(this.getNode().parameters).forEach((key) => {
                parameters[key] = this.getNodeParameter(key, '') as any;
            });

            ipc.of.bot.emit('triggerNodeRegistered', {
                parameters,
                active: this.getWorkflow().active,
                credentials,
                nodeId: this.getNode().id, // Unique to each node
            });

            ipc.of.bot.on('messageCreate', ({ message, author, nodeId }: any) => {
                if(this.getNode().id === nodeId) {
                    this.emit([
                        this.helpers.returnJsonArray({
                            id: message.id,
                            content: message.content,
                            channelId: message.channelId,
                            authorId: author.id,
                            authorName: author.username,
                            timestamp: message.createdTimestamp,
                            listenValue: this.getNodeParameter('value', ''),
                        }),
                    ]);
                }
            });
        });

        ipc.of.bot.on('disconnect', () => {
            console.error('Disconnected from IPC server');
        });

        // Return the cleanup function
        return {
            closeFunction: async () => {
                const credentials = (await this.getCredentials('discordBotTriggerApi').catch((e) => e)) as any as ICredentials;
                const isActive = await checkWorkflowStatus(credentials.baseUrl, credentials.apiKey, String(this.getWorkflow().id));

                // remove the node from being executed
                console.log("removing trigger node");
                
                delete settings.triggerNodes[this.getNode().id];

                // disable the node if the workflow is not activated, but keep it running if it was just the test node
                if (!isActive || this.getActivationMode() !== 'manual') {
                    console.log('Workflow stopped. Disconnecting bot...');
                    ipc.disconnect('bot');
                }
            },
        };
    }
}
